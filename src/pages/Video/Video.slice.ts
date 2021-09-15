import { storage } from "@config/firebase";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
  uploadBytesResumable,
} from "@firebase/storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";

export interface VideoType {
  name: string;
  url: string;
  updateAt: string;
  createAt: string;
  size: number;
  contentType: string | undefined;
  description: string;
  duration: string;
}

export interface VideoState {
  videos: VideoType[];
  fetchingVideo: boolean;
  uploadingVideo: "none" | "uploading" | "complete";
  uploadProgress: number;
  deletingVideo: "none" | "deleting" | "complete";
}

const initialState: VideoState = {
  videos: [],
  fetchingVideo: false,
  uploadingVideo: "none",
  uploadProgress: 0,
  deletingVideo: "none",
};

export const getVideoAsyncAction = createAsyncThunk(
  "Video/GetVideo",
  async (uid: string) => {
    const videoRef = ref(storage, `${uid}/videos`);

    // Find all the prefixes and items.
    const videos = await listAll(videoRef);

    const urls = await Promise.all(
      videos.items.map(async (itemRef) => {
        const metaData = await getMetadata(itemRef);
        const url = await getDownloadURL(itemRef);
        return {
          name: metaData.name,
          url: url,
          updateAt: metaData.updated,
          createAt: metaData.timeCreated,
          size: metaData.size,
          contentType: metaData.contentType,
          description: metaData.customMetadata?.description,
          duration: metaData.customMetadata?.duration,
        };
      }),
    );

    return urls.sort(
      (a, b) => new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime(),
    );
  },
);

export const addVideoAsyncAction = createAsyncThunk(
  "Video/AddVideo",
  async (
    {
      uid,
      video,
      customName,
      description,
      duration,
    }: {
      uid: string;
      video?: File;
      customName?: string;
      description?: string;
      duration?: number;
    },
    thunkAPI,
  ) => {
    if (video) {
      const videoRef = ref(
        storage,
        `${uid}/videos/${customName ? customName : video.name}`,
      );
      const uploadTask = uploadBytesResumable(videoRef, video, {
        customMetadata: {
          duration: duration ? Math.floor(duration).toString() : "",
          description: description ? description : "",
        },
      });
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          thunkAPI.dispatch(
            setVideoState({
              uploadProgress: Math.floor(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              ),
            }),
          );
        },
        (error) => {
          message.error("[ADD_VIDEO] " + error.message);
          thunkAPI.dispatch(setVideoState({ uploadingVideo: "complete" }));
          thunkAPI.dispatch(setVideoState({ uploadingVideo: "none" }));
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          const metaData = await getMetadata(uploadTask.snapshot.ref);

          thunkAPI.dispatch(setVideoState({ uploadingVideo: "complete" }));
          thunkAPI.dispatch(
            addVideoComplete({
              name: metaData.name,
              url: url,
              updateAt: metaData.updated,
              createAt: metaData.timeCreated,
              size: metaData.size,
              contentType: metaData.contentType,
              description: metaData.customMetadata
                ? metaData.customMetadata.description
                : "",
              duration: metaData.customMetadata
                ? metaData.customMetadata.duration
                : "",
            }),
          );
        },
      );
    }
  },
);

export const deleteVideoAsyncAction = createAsyncThunk(
  "Video/Delete",
  async (
    {
      uid,
      videoName,
    }: {
      uid: string;
      videoName: string | undefined;
    },
    thunkAPI,
  ) => {
    if (videoName !== undefined) {
      const videoRef = ref(storage, `${uid}/videos/${videoName}`);
      await deleteObject(videoRef);
      thunkAPI.dispatch(
        setVideoState({
          deletingVideo: "complete",
        }),
      );
    }

    return videoName;
  },
);

const VideoSlice = createSlice({
  name: "Video",
  initialState,
  reducers: {
    setVideoState: (state, action: PayloadAction<Partial<VideoState>>) => {
      return { ...state, ...action.payload };
    },
    resetVideoState: () => {
      return initialState;
    },
    addVideoComplete: (state, action: PayloadAction<VideoType>) => {
      const duplicateVideoIndex = state.videos.findIndex(
        (video) => video.name === action.payload.name,
      );
      if (duplicateVideoIndex > -1) state.videos.splice(duplicateVideoIndex, 1);
      state.videos.unshift(action.payload);
      state.uploadingVideo = "none";
    },
  },
  extraReducers: {
    // get
    [getVideoAsyncAction.pending.toString()]: (state) => {
      state.fetchingVideo = true;
    },
    [getVideoAsyncAction.fulfilled.toString()]: (
      state,
      action: PayloadAction<VideoType[]>,
    ) => {
      state.videos = action.payload;
      state.fetchingVideo = false;
    },
    [getVideoAsyncAction.rejected.toString()]: (state, action) => {
      message.error("[FETCH_VIDEO] " + action.error.message);
      state.fetchingVideo = false;
    },

    // add
    [addVideoAsyncAction.pending.toString()]: (state) => {
      state.uploadingVideo = "uploading";
      state.uploadProgress = 0;
    },
    [addVideoAsyncAction.fulfilled.toString()]: (state) => {},
    [addVideoAsyncAction.rejected.toString()]: (state, action) => {
      message.error("[ADD_VIDEO] " + action.error.message);
      state.uploadingVideo = "complete";
    },

    //delete
    [deleteVideoAsyncAction.pending.toString()]: (state) => {
      state.deletingVideo = "deleting";
    },
    [deleteVideoAsyncAction.fulfilled.toString()]: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      if (action.payload !== undefined) {
        const deleteVideoIndex = state.videos.findIndex(
          (picture) => picture.name === action.payload,
        );
        if (deleteVideoIndex > -1) state.videos.splice(deleteVideoIndex, 1);
      }
    },
    [deleteVideoAsyncAction.rejected.toString()]: (state, action) => {
      message.error("[DELETE_VIDEO] " + action.error.message);
      state.deletingVideo = "complete";
    },
  },
});

export const { setVideoState, resetVideoState, addVideoComplete } =
  VideoSlice.actions;

export default VideoSlice.reducer;

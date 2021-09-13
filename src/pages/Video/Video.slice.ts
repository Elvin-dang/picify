import { storage } from "@config/firebase";
import { getDownloadURL, getMetadata, listAll, ref } from "@firebase/storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";

export interface VideoType {
  name: string;
  url: string;
  updateAt: string;
  createAt: string;
  size: number;
  contentType: string | undefined;
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
    const imageRef = ref(storage, `${uid}/videos`);

    // Find all the prefixes and items.
    const images = await listAll(imageRef);

    const urls = await Promise.all(
      images.items.map(async (itemRef) => {
        const metaData = await getMetadata(itemRef);
        const url = await getDownloadURL(itemRef);
        return {
          name: metaData.name,
          url: url,
          updateAt: metaData.updated,
          createAt: metaData.timeCreated,
          size: metaData.size,
          contentType: metaData.contentType,
        };
      }),
    );

    return urls.sort(
      (a, b) => new Date(b.updateAt).getTime() - new Date(a.updateAt).getTime(),
    );
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
  },
});

export const { setVideoState, resetVideoState, addVideoComplete } =
  VideoSlice.actions;

export default VideoSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { message } from "antd";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../config/firebase";

interface HomeState {
  pictures: string[];
  fetchingPicture: boolean;
  uploadingPicture: "none" | "uploading" | "complete";
  uploadProgress: number;
}

const initialState: HomeState = {
  pictures: [],
  fetchingPicture: false,
  uploadingPicture: "none",
  uploadProgress: 0,
};

export const getPictureAsyncAction = createAsyncThunk(
  "Home/GetPicture",
  async (uid: string) => {
    const imageRef = ref(storage, uid);

    // Find all the prefixes and items.
    const images = await listAll(imageRef);

    const urls = await Promise.all(
      images.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return url;
      }),
    );

    return urls;
  },
);

export const addPictureAsyncAction = createAsyncThunk(
  "Home/AddPicture",
  async (
    {
      uid,
      image,
      customName,
    }: {
      uid: string;
      image?: File;
      customName?: string;
    },
    thunkAPI,
  ) => {
    if (image) {
      const imageRef = ref(
        storage,
        `${uid}/${customName ? customName : image.name}`,
      );
      const uploadTask = uploadBytesResumable(imageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          thunkAPI.dispatch(
            setHomeState({
              uploadProgress: Math.floor(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              ),
            }),
          );
        },
        (error) => message.error("[ADD_PICTURE] " + error.message),
        () => {
          thunkAPI.dispatch(setHomeState({ uploadingPicture: "complete" }));
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            thunkAPI.dispatch(addPictureComplete(downloadURL));
          });
        },
      );
    }
  },
);

const HomeSlice = createSlice({
  name: "Home",
  initialState,
  reducers: {
    setHomeState: (state, action: PayloadAction<Partial<HomeState>>) => {
      return { ...state, ...action.payload };
    },
    resetHomeState: () => {
      return initialState;
    },
    addPictureComplete: (state, action: PayloadAction<string>) => {
      state.pictures.unshift(action.payload);
      state.uploadingPicture = "none";
    },
  },
  extraReducers: {
    [getPictureAsyncAction.pending.toString()]: (state) => {
      state.fetchingPicture = true;
    },
    [getPictureAsyncAction.fulfilled.toString()]: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      state.pictures = action.payload;
      state.fetchingPicture = false;
    },
    [getPictureAsyncAction.rejected.toString()]: (state, action) => {
      message.error("[FETCH_PICTURE] " + action.error.message);
      state.fetchingPicture = false;
    },

    [addPictureAsyncAction.pending.toString()]: (state) => {
      state.uploadingPicture = "uploading";
      state.uploadProgress = 0;
    },
    [addPictureAsyncAction.fulfilled.toString()]: (state) => {},
    [addPictureAsyncAction.rejected.toString()]: (state, action) => {
      message.error("[ADD_PICTURE] " + action.error.message);
    },
  },
});

export const { setHomeState, resetHomeState, addPictureComplete } =
  HomeSlice.actions;
export default HomeSlice.reducer;

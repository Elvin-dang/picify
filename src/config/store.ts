import { combineReducers, configureStore } from "@reduxjs/toolkit";
import pictureSlice from "../pages/Picture/Picture.slice";
import userSlice from "../shared/slices/user.slice";
import videoSlice from "@pages/Video/Video.slice";

const rootReducer = combineReducers({
  user: userSlice,
  picture: pictureSlice,
  video: videoSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === "development" ? true : false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

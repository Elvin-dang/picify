import { combineReducers, configureStore } from "@reduxjs/toolkit";
import pictureSlice from "../pages/Picture/Picture.slice";
import userSlice from "../shared/slices/user.slice";

const rootReducer = combineReducers({
  user: userSlice,
  picture: pictureSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === "development" ? true : false,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

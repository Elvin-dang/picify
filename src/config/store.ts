import { combineReducers, configureStore } from "@reduxjs/toolkit";
import signInSlice from "../components/SignIn/SignIn.slice";
import SignUpSlice from "../components/SignUp/SignUp.slice";
import userSlice from "../shared/slices/user.slice";

const rootReducer = combineReducers({
  signIn: signInSlice,
  signUp: SignUpSlice,
  user: userSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

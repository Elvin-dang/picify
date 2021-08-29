import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { setUserState } from "../../shared/slices/user.slice";

interface SignInState {
  loading: boolean;
  error: string;
  signInSuccess: boolean;
}

const initialState: SignInState = {
  loading: false,
  error: "",
  signInSuccess: false,
};

export const signInAsyncAction = createAsyncThunk(
  "signIn/signIn",
  async (
    { username, password }: { username: string; password: string },
    thunkAPI,
  ) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      username,
      password,
    );
    const user = userCredential.user;
    const token = await user.getIdToken();
    thunkAPI.dispatch(
      setUserState({
        accessToken: token,
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        uid: user.uid,
      }),
    );
    return;
  },
);

const signInSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    setSignInState: (state, action: PayloadAction<Partial<SignInState>>) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: {
    [signInAsyncAction.pending.toString()]: (state) => {
      state.loading = true;
    },
    [signInAsyncAction.fulfilled.toString()]: (state) => {
      state.loading = false;
      state.signInSuccess = true;
      state.error = "";
    },
    [signInAsyncAction.rejected.toString()]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.signInSuccess = false;
    },
  },
});

export const { setSignInState } = signInSlice.actions;
export default signInSlice.reducer;

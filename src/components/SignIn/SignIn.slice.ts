import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

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
  async ({ username, password }: { username: string; password: string }) => {
    await signInWithEmailAndPassword(auth, username, password);
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
    resetSignInState: () => {
      return initialState;
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

export const { setSignInState, resetSignInState } = signInSlice.actions;
export default signInSlice.reducer;

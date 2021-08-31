import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

interface SignUpState {
  loading: boolean;
  error: string;
  signUpSuccess: boolean;
}

const initialState: SignUpState = {
  loading: false,
  error: "",
  signUpSuccess: false,
};

export const signUpAsyncAction = createAsyncThunk(
  "signUp/signUp",
  async ({ username, password }: { username: string; password: string }) => {
    await createUserWithEmailAndPassword(auth, username, password);
    await auth.signOut();
    return;
  },
);

const signUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    setSignUpState: (state, action: PayloadAction<Partial<SignUpState>>) => {
      return { ...state, ...action.payload };
    },
    resetSignUpState: () => {
      return initialState;
    },
  },
  extraReducers: {
    [signUpAsyncAction.pending.toString()]: (state) => {
      state.loading = true;
    },
    [signUpAsyncAction.fulfilled.toString()]: (state) => {
      state.loading = false;
      state.signUpSuccess = true;
      state.error = "";
    },
    [signUpAsyncAction.rejected.toString()]: (state, action) => {
      state.loading = false;
      state.error = action.error.code;
      state.signUpSuccess = false;
    },
  },
});

export const { setSignUpState, resetSignUpState } = signUpSlice.actions;
export default signUpSlice.reducer;

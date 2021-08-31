import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  accessToken: string;
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  uid: string;
}

const initialState: UserState = {
  accessToken: "",
  displayName: null,
  email: "",
  emailVerified: false,
  photoURL: null,
  uid: "",
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    resetUserState: () => {
      return initialState;
    },
  },
});

export const { setUserState } = UserSlice.actions;

export default UserSlice.reducer;

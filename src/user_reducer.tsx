import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types/user";

interface UserState {
  isLoading: boolean;
  error: string | null;
  userData: User | null;
}

const initialState: UserState = {
  isLoading: false,
  error: null,
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserDataReq(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserDataSuccess(state, action: PayloadAction<User>) {
      state.isLoading = false;
      state.userData = action.payload;
    },
    fetchFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchUserDataReq, fetchUserDataSuccess, fetchFailed } =
  userSlice.actions;
export default userSlice.reducer;

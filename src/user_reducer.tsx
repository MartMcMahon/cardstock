import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types/user";
import { setCardPosition } from "./user";

interface UserState {
  cash: number;
  cardPositions: { [key: string]: number };
  isLoading: boolean;
  error: string | null;
  userData: User | null;
}

const initialState: UserState = {
  cash: 0,
  cardPositions: {},
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
    fetchUserDataSuccess(state, action: PayloadAction<[User]>) {
      console.log("fetchUserDataSuccess", action.payload);
      const user = action.payload[0];
      const cash =
        typeof user.cash === "string" ? parseFloat(user.cash) : user.cash;
      state.cash = cash || 0;
      state.cardPositions = user.cardPositions || {};
      state.userData = user;
      state.isLoading = false;
    },
    fetchFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCardPositionSuccess(
      state,
      action: PayloadAction<{ [key: string]: number }>
    ) {},
  },
});

export const { fetchUserDataReq, fetchUserDataSuccess, fetchFailed } =
  userSlice.actions;
export default userSlice.reducer;

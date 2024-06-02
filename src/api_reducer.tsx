import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Card } from "./types/card";
import { User } from "./types/user";

interface ApiState {
  isLoading: boolean;
  error: string | null;
  card: Card | null;
  user: User | null;
  positions: { [key: string]: number };
  price_history: { [key: number]: number };
  token: string | null;
}

const initialState: ApiState = {
  isLoading: false,
  error: null,
  card: null,
  user: null,
  positions: {},
  price_history: {},
  token: null,
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    fetchCardReq(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchCardSuccess(state, action: PayloadAction<Card>) {
      state.isLoading = false;
      state.card = action.payload;
    },
    fetchUserReq(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserSuccess(state, action: PayloadAction<User>) {
      state.isLoading = false;
      state.user = action.payload;
    },
    fetchPositionsReq(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchPositionsSuccess(
      state,
      action: PayloadAction<{ [key: string]: number }>
    ) {
      state.isLoading = false;
      state.positions = action.payload;
    },
    fetchPriceHistoryReq(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchPriceHistorySuccess(
      state,
      action: PayloadAction<{ [key: string]: number }>
    ) {
      state.isLoading = false;
      state.price_history = action.payload;
    },
    fetchFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});
export const {
  fetchCardReq,
  fetchCardSuccess,
  fetchUserReq,
  fetchUserSuccess,
  fetchPriceHistoryReq,
  fetchPriceHistorySuccess,
  fetchFailed,
} = apiSlice.actions;
export default apiSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScryfallState {
  loading: boolean;
  card: any;
  error: string | null;
}

const initialState: ScryfallState = {
  loading: false,
  card: null,
  error: null,
};

const scryfallSlice = createSlice({
  name: 'scryfall',
  initialState,
  reducers: {
    fetchRandomCard(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRandomCardSuccess(state, action: PayloadAction<any>) {
      state.loading = false;
      state.card = action.payload;
    },
    fetchRandomCardFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchRandomCard, fetchRandomCardSuccess, fetchRandomCardFailed } = scryfallSlice.actions;
export default scryfallSlice.reducer;

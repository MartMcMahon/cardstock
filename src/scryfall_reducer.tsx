import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ScryfallCard from "./types/scryfallCard";

interface ScryfallState {
  loading: boolean;
  card: any;
  error: string | null;
  searchResults: [ScryfallCard] | null;
}

const initialState: ScryfallState = {
  loading: false,
  card: null,
  error: null,
  searchResults: null,
};

const scryfallSlice = createSlice({
  name: "scryfall",
  initialState,
  reducers: {
    fetchRandomCardReq(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRandomCardSuccess(state, action: PayloadAction<ScryfallCard>) {
      console.log("random card success");
      state.loading = false;
      state.card = action.payload;
    },
    fetchIdReq(state) {
      state.loading = true;
      state.error = null;
    },
    fetchIdSuccess(state, action: PayloadAction<ScryfallCard>) {
      state.loading = false;
      state.card = action.payload;
    },
    fetchFailed(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    searchByNameReq(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    searchByNameSuccess(state, action: PayloadAction<[ScryfallCard]>) {
      state.loading = false;
      state.searchResults = action.payload;
    },
    clearSearchResults(state) {
      state.searchResults = null;
    },
  },
});

export const {
  fetchFailed,
  fetchRandomCardReq,
  fetchRandomCardSuccess,
  fetchIdReq,
  fetchIdSuccess,
  searchByNameReq,
  searchByNameSuccess,
  clearSearchResults,
} = scryfallSlice.actions;
export default scryfallSlice.reducer;

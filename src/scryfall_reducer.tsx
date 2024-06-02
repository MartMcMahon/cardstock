import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ScryfallCard from "./types/scryfallCard";

interface ScryfallState {
  isLoading: boolean;
  card: any;
  error: string | null;
  searchResults: [ScryfallCard] | null;
}

const initialState: ScryfallState = {
  isLoading: false,
  card: null,
  error: null,
  searchResults: null,
};

const scryfallSlice = createSlice({
  name: "scryfall",
  initialState,
  reducers: {
    fetchRandomCardReq(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchRandomCardSuccess(state, action: PayloadAction<ScryfallCard>) {
      console.log("random card success");
      state.isLoading = false;
      state.card = action.payload;
    },
    fetchIdReq(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchIdSuccess(state, action: PayloadAction<ScryfallCard>) {
      state.isLoading = false;
      state.card = action.payload;
    },
    fetchFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    searchByNameReq(state, _action: PayloadAction<string>) {
      state.isLoading = true;
      state.error = null;
    },
    searchByNameSuccess(state, action: PayloadAction<[ScryfallCard]>) {
      state.isLoading = false;
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

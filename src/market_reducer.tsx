// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface MarketState {
//   isLoading: boolean;
//   error: string;
//   cardPositions: { [key: string]: number };
//   // selectedCard: Card | null;
// }

// const initialState: MarketState = {
//   isLoading: false,
//   error: "",
//   cardPositions: {},
//   // selectedCard: null,
// };

// const marketSlice = createSlice({
//   name: "market",
//   initialState,
//   reducers: {
//     cardTransactionStart(
//       state,
//       _action: PayloadAction<{ uuid: string; amount: number }>
//     ) {
//       state.isLoading = true;
//     },
//     cardTransactionSuccess(
//       state,
//       _action: PayloadAction<{ uuid: string, amount: number }>
//     ) {
//       state.isLoading = false;
//       // state.cardPositions = action.payload;
//       // state.cardPositions[action.payload.uuid] = action.payload.amount;
//     },
//     cardTransactionFail(state, action: PayloadAction<string>) {
//       state.isLoading = false;
//       state.error = action.payload;
//     },
//   },
// });

// export const {
//   cardTransactionStart,
//   cardTransactionSuccess,
//   cardTransactionFail,
// } = marketSlice.actions;
// export default marketSlice.reducer;

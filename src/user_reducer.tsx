import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, CardPosition } from "./types/user";
import { Tx } from "./types/market";
interface UserState {
  cash: number;
  cardPositions: { [key: string]: CardPosition };
  isLoading: boolean;
  error: string | null;
  userData: User | null;
  txData: Tx[];
}

const initialState: UserState = {
  cash: 0,
  cardPositions: {},
  isLoading: false,
  error: null,
  userData: null,
  txData: [],
};

const calcUserCardPositions = (txData: Tx[]) => {
  const cardPositions: { [key: string]: CardPosition } = {};
  txData.forEach((tx: Tx) => {
    if (tx.uuid in cardPositions) {
      const prevAmount = Number(cardPositions[tx.uuid].amount);
      const prevCost = Number(cardPositions[tx.uuid].cost);
      console.log(
{
        uuid: tx.uuid,
        amount: prevAmount + tx.amount,
        cost: prevCost + tx.cost,
      }
      )
      cardPositions[tx.uuid] = {
        uuid: tx.uuid,
        amount: prevAmount + tx.amount,
        cost: prevCost + tx.cost,
      };
    } else {
      cardPositions[tx.uuid] = tx;
    }
  });
  return cardPositions;
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserDataReq(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchTxDataReq(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserDataSuccess(state, action: PayloadAction<[User]>) {
      console.log("fetchUserDataSuccess", action.payload);
      const user = action.payload[0];
      const cash =
        typeof user.cash === "string" ? parseFloat(user.cash) : user.cash;
      state.cash = cash || 0;
      // state.cardPositions = user.cardPositions || {};
      state.userData = user;
      state.isLoading = false;
    },
    fetchTxDataSuccess(state, action: PayloadAction<Tx[]>) {
      console.log("fetchTxDataSuccess", action.payload);
      state.txData = action.payload;
      console.log('payload', action.payload)
      state.cash = action.payload.reduce((acc, tx) => acc - tx.cost, 1000);
      state.cardPositions = calcUserCardPositions(action.payload);
      state.isLoading = false;
    },
    fetchFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateTxDataSuccess(state, action: PayloadAction<Tx>) {
      state.txData.push(action.payload);
      state.cash -= action.payload.cost;
      state.cardPositions = calcUserCardPositions(state.txData);
      state.isLoading = false;
    },
    txFailed(state, _action: PayloadAction<{ cost: number }>) {
      state.isLoading = false;
      state.error = "Failed to perform user transaction";
    },
    // setCardPosition(
    //   state,
    //   action: PayloadAction<{ uuid: string; pos: CardPosition }>
    // ) {
    // state.cardPositions[action.payload.uuid] = action.payload.pos;
    // state.cardPositions[action.payload.uuid].amount += action.payload.pos.amount;
    // state.cardPositions[action.payload.uuid].cost += action.payload.cost;
    // },
    // initialCardPositions(
    //   state,
    //   action: PayloadAction<{ [key: string]: CardPosition }>
    // ) {
    //   console.log("reducer cardpositions", action.payload);
    // state.cardPositions = action.payload;
    // },
  },
});

export const {
  fetchUserDataReq,
  fetchUserDataSuccess,
  fetchTxDataReq,
  fetchTxDataSuccess,
  fetchFailed,
  updateTxDataSuccess,
  txFailed,
  // cardTransactionStart,
  // cardTransactionSuccess,
  // cardTransactionFail,
  // setCardPosition,
  // initialCardPositions,
} = userSlice.actions;
export default userSlice.reducer;

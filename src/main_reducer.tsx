import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Card } from "./types/card";

const getPrice = (card: Card): number => {
  let res;
  if (card.prices.usd) {
    res = card.prices.usd;
  }
  if (card.prices.usd_foil) {
    res = card.prices.usd_foil;
  }
  if (card.prices.usd_etched) {
    res = card.prices.usd_etched;
  }
  if (card.prices.eur) {
    res = card.prices.eur;
  }
  if (card.prices.eur_foil) {
    res = card.prices.eur_foil;
  }
  if (card.prices.tix) {
    res = card.prices.tix;
  }
  if (typeof res === "number") {
    return res;
  }
  return parseFloat(res || "0");
};

interface MainState {
  authenticated: boolean;
  cash: number;
  cardData: { [key: string]: Card };
  cardPositions: { [key: string]: number };
  networth: number;
  user_id: string;
  simple_price: number;
  selectedCard: Card | null;
}

let cash = parseFloat(localStorage.getItem("cash") || "2000.0");
if (!cash) {
  cash = 2000.0;
  localStorage.setItem("cash", JSON.stringify(cash));
}

let card_data = JSON.parse(localStorage.getItem("card_data") || "{}");
if (!card_data) {
  card_data = {};
  localStorage.setItem("card_data", JSON.stringify(card_data));
}

let cardPositions = JSON.parse(localStorage.getItem("cardPositions") || "{}");
if (!cardPositions) {
  cardPositions = {};
  localStorage.setItem("cardPositions", JSON.stringify(cardPositions));
}

const initialState: MainState = {
  authenticated: true,
  cash,
  cardData: card_data,
  cardPositions,
  networth: cash,
  user_id: "test",
  simple_price: 0,
  selectedCard: null,
};

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    selectCard(state, action: PayloadAction<Card>) {
      state.selectedCard = action.payload;
      state.simple_price = getPrice(action.payload);
    },
    buyCard(
      state,
      action: PayloadAction<{ card: Card; id: string; amount: number }>
    ) {
      const cardPositions = {
        ...state.cardPositions,
        [action.payload.id]:
          (state.cardPositions[action.payload.id] || 0) + action.payload.amount,
      };
      localStorage.setItem("cardPositions", JSON.stringify(cardPositions));
      state.cash -= getPrice(action.payload.card);
      state.cardPositions = cardPositions;
      localStorage.setItem("cash", JSON.stringify(state.cash));
    },
    sellCard(
      state,
      action: PayloadAction<{ card: Card; id: string; amount: number }>
    ) {
      const cardPositions = {
        ...state.cardPositions,
        [action.payload.id]:
          (state.cardPositions[action.payload.id] || 0) - action.payload.amount,
      };
      localStorage.setItem("cardPositions", JSON.stringify(cardPositions));
      state.cash += getPrice(action.payload.card);
      state.cardPositions = cardPositions;
      localStorage.setItem("cash", JSON.stringify(state.cash));
    },
    fillCardData(state, action: PayloadAction<{ [key: string]: Card }>) {
      state.cardData = { ...state.cardData, ...action.payload };
      localStorage.setItem("card_data", JSON.stringify(state.cardData));
    },
  },
});

export const mainActions = mainSlice.actions;
export default mainSlice.reducer;

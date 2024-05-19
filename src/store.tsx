import { configureStore } from "@reduxjs/toolkit";

let cash = parseFloat(localStorage.getItem("cash") || "0.0");
if (!cash) {
  cash = 0.0;
  localStorage.setItem("cash", JSON.stringify(cash));
}

let holdings = JSON.parse(localStorage.getItem("holdings") || "{}");
if (!holdings) {
  holdings = {};
  localStorage.setItem("holdings", JSON.stringify(holdings));
}

const initialState = {
  authenticated: true,
  cash,
  networth: cash,
  user_id: "test",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "selectCard":
      return { ...state, selectedCard: action.card };
    default:
      return state;
  }
};

const store = configureStore({ reducer });
export default store;
export type Store = typeof store;
export type RootState = ReturnType<Store["getState"]>;

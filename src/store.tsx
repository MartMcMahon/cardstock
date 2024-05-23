import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Card } from "./types/card";
import scryfall_reducer from "./scryfall_reducer";

const getPrice = (card: Card) => {
  if (card.prices.usd) {
    return card.prices.usd;
  }
  if (card.prices.usd_foil) {
    return card.prices.usd_foil;
  }
  if (card.prices.usd_etched) {
    return card.prices.usd_etched;
  }
  if (card.prices.eur) {
    return card.prices.eur;
  }
  if (card.prices.eur_foil) {
    return card.prices.eur_foil;
  }
  if (card.prices.tix) {
    return card.prices.tix;
  }
  return 0;
};

let cash = parseFloat(localStorage.getItem("cash") || "2000.0");
if (!cash) {
  cash = 2000.0;
  localStorage.setItem("cash", JSON.stringify(cash));
}

let holdings = JSON.parse(localStorage.getItem("holdings") || "{}");
if (!holdings) {
  holdings = {};
  localStorage.setItem("holdings", JSON.stringify(holdings));
}

const cardPositions: { [key: string]: any } = {};
Object.entries(([cardId, q]: [string, number]) => {
  cardPositions[cardId] = { q };
});

const initialState = {
  authenticated: true,
  cash,
  cardPositions,
  holdings,
  networth: cash,
  user_id: "test",
  simple_price: 0,
  selectedCard: {},
};

const main_reducer = (
  prevState = initialState,
  action: { type: string; card?: Card }
) => {
  switch (action.type) {
    case "selectCard":
      if (!action.card) {
        console.error("No card selected");
        return prevState;
      }
      return {
        ...prevState,
        selectedCard: action.card,
        simple_price: getPrice(action.card),
      };
    case "buyCard": {
      if (!action.card) {
        console.error("No card selected");
        return prevState;
      }
      const holdings = {
        ...prevState.holdings,
        [action.card.id]: (prevState.holdings[action.card.id] || 0) + 1,
      };
      localStorage.setItem("holdings", JSON.stringify(holdings));
      const newState = {
        ...prevState,
        cash: prevState.cash - getPrice(action.card),
        holdings,
      };
      return newState;
    }
    default:
      return prevState;
  }
};

const rootReducer = combineReducers({
  main: main_reducer,
  scryfall: scryfall_reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;
export type Store = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type Dispatch = typeof store.dispatch;

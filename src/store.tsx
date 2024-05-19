import { configureStore } from "@reduxjs/toolkit";

const getPrice = (card) => {
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

const initialState = {
  authenticated: true,
  cash,
  holdings,
  networth: cash,
  user_id: "test",
  simple_price: 0,
};

const reducer = (prevState = initialState, action) => {
  switch (action.type) {
    case "selectCard":
      return {
        ...prevState,
        selectedCard: action.card,
        simple_price: getPrice(action.card),
      };
    case "buyCard": {
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

const store = configureStore({ reducer });
export default store;
export type Store = typeof store;
export type RootState = ReturnType<Store["getState"]>;

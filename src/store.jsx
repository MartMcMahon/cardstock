import { configureStore } from "@reduxjs/toolkit";

let user_id = localStorage.getItem("user_id");
let token = localStorage.getItem("token");

const initialState = {
  user_id,
  user_name: "",
  token,
  selectedCard: false,
  networth: 1000
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    case "selectCard":
      return {...state, selectedCard: action.card };
    case "sendwsMessage":
      return {...state, wsMessage: action.msg};
    case "auth":
      localStorage.setItem("user_id", action.payload.user_id);
      localStorage.setItem("token", action.payload.token);
      return {
        user_id: action.payload.user_id,
        user_name: action.payload.user_name,
        token: action.payload.token,
      };
    case "logout":
      localStorage.removeItem("user_id");
      localStorage.removeItem("token");
      return { user_id: false, user_name: false, token: false };
    default:
      return state;
  }
};

export default configureStore({
  reducer,
});

import { configureStore } from "@reduxjs/toolkit";

// let user_id = localStorage.getItem("user_id");
// let token = localStorage.getItem("token");

const initialState = {
  authenticated: false,
  user_id: "",
  username: "",
  token: "",
  selectedCard: false,
  networth: 0,
  cash: 0,
  wsMessage: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "firebaseRegisterUser":
      console.log("registered user");
      return {
        ...state,
        authenticated: true,
        firebase_user_access_token: action.payload.firebase_user_access_token,
      };
    case "selectCard":
      return { ...state, selectedCard: action.card };
    case "sendwsMessage":
      return { ...state, wsMessage: action.msg };
    case "loginWithCreds":
      return {
        ...state,
        wsMessage: JSON.stringify({
          ...action.payload,
          action: "loginWithCreds",
        }),
      };
    case "loginWithToken":
      return {
        ...state,
        wsMessage: JSON.stringify({
          ...action.payload,
          action: "loginWithToken",
        }),
      };
    case "setAuth":
      // TODO: check incoming data for validity
      localStorage.setItem("user_id", action.payload.user_id);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("token", action.payload.token);
      //   let cash = localStorage.getItem("cash");
      //   if (!cash) {
      //     cash = 1000;
      //     localStorage.setItem("cash", cash);
      //   }
      //   return {
      //     user_id: localStorage.getItem("user_id"),
      //     user_name: localStorage.getItem("user_id"),
      //     token: "fake-token",
      //     cash,
      //   };
      // }
      return {
        ...state,
        user_id: action.payload.user_id,
        username: action.payload.username,
        token: action.payload.token,
        authenticated: true,
      };
    case "registerNewUser":
      return { ...state, wsMessage: action.msg };
    // localStorage.setItem("user_id", action.payload.newUsername);
    // localStorage.setItem("username", action.payload.newUsername);
    // localStorage.setItem("cash", 1000);
    // localStorage.setItem("token", "fake-token");
    // return {
    //   ...state,
    //   authenticated: true,
    //   user_id: action.payload.newUsername,
    //   user_name: action.payload.newUsername,
    //   token: "fake-token",
    // };
    case "logout":
      localStorage.removeItem("user_id");
      localStorage.removeItem("token");
      return { user_id: false, user_name: false, token: false };
    default:
      return state;
  }
};

const registerAction = (actionOb) => {
  return { type: "registerNewUser", msg: JSON.stringify(actionOb) };
};

const store = configureStore({ reducer });
export default store;
export { registerAction };

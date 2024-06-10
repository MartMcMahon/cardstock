import { Dispatch } from "./store";
import {
  fetchFailed,
  fetchPriceHistoryReq,
  fetchPriceHistorySuccess,
} from "./api_reducer";

const create_user = (id: string, email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await fetch("https://localhost:3000/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, email, password }),
      });
      if (!res.ok) {
        throw new Error("Failed to create user");
      }
      const data = await res.json();
      console.log('create_user data', data);
    } catch (err: any) {
      dispatch(fetchFailed(err.message));
    }
  };
}


const login = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await fetch("https://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Failed to login");
      }
      const data = await res.json();
      console.log('login data', data);
    } catch (err: any) {
      dispatch(fetchFailed(err.message));
    }
  };
}

const fetchPriceHistory = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchPriceHistoryReq());
    try {
      const res = await fetch("https://localhost:3000/price_history/" + id);
      console.log('price_history res', res);
      if (!res.ok) {
        throw new Error("Failed to fetch price history");
      }
      const data = await res.json();
      dispatch(fetchPriceHistorySuccess(data));
    } catch (err: any) {
      dispatch(fetchFailed(err.message));
    }
  };
};


export { create_user, login, fetchPriceHistory };

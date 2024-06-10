import { Dispatch } from "./store";
import {
  fetchFailed,
  fetchUserDataReq,
  fetchUserDataSuccess,
} from "./user_reducer";

const createUserData = (uid: string, email: string) => {
  return async (dispatch: Dispatch) => {
    const res = await fetch("http://localhost:3000/user/" + uid, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, email }),
    });
    if (!res.ok) {
      dispatch(fetchFailed("Failed to create user data"));
    }
    const data = await res.json();
    return data;
  };
};

const getUserData = (uid: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchUserDataReq());
    const res = await fetch("http://localhost:3000/user/" + uid);
    if (!res.ok) {
      dispatch(fetchFailed("Failed to fetch user data"));
    }
    const data = await res.json();
    dispatch(fetchUserDataSuccess(data));
    return data;
  };
};

export { createUserData, getUserData };

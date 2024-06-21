import { Dispatch } from "./store";
import {
  fetchFailed,
  fetchUserDataReq,
  fetchTxDataReq,
  fetchUserDataSuccess,
  fetchTxDataSuccess,
  // initialCardPositions,
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
      return;
    }
    const data = await res.json();
    dispatch(fetchUserDataSuccess(data));
    return data;
  };
};

const getUserData = (uid: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchUserDataReq());
    dispatch(fetchTxDataReq());
    const res = await fetch("http://localhost:3000/user/" + uid);
    if (!res.ok) {
      dispatch(fetchFailed("Failed to fetch user data"));
    }
    const data = await res.json();
    dispatch(fetchUserDataSuccess(data));


  // console.log('init data', data);
    // dispatch(initialCardPositions(data[0].card_positions));
    const tx_res = await fetch("http://localhost:3000/tx/" + uid);
    if (!tx_res.ok) {
      dispatch(fetchFailed("Failed to fetch tx data"));
    }
    const tx_data = await tx_res.json();
    console.log('tx data', tx_data);
    dispatch(fetchTxDataSuccess(tx_data));
    return true;
  };
};

// const setCardPosition= (uid: string, uuid: string, amount: number ) => {
//   return async (dispatch: Dispatch) => {
//     const res = await fetch("http://localhost:3000/buy/" + uid, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({uuid, amount }),
//     });
//     if (!res.ok) {
//       dispatch(fetchFailed("Failed to create user data"));
//       return;
//     }
//     const data = await res.json();
//     dispatch(setCardPositionSuccess(data));
//     return data;
//   };
// }

export { createUserData, getUserData, }//setCardPosition };

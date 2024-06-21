import { fetchFailed } from "./api_reducer";
import { Dispatch, RootState } from "./store";
import { fetchUserDataReq, updateTxDataSuccess } from "./user_reducer";

const buy = (uid: string, uuid: string, amount: number) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const _userState = getState().user;
    const mainState = getState().main;
    const cost = amount * mainState.simple_price;

    dispatch(fetchUserDataReq());
    const res = await fetch("http://localhost:3000/buy/" + uuid, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid, amount, cost }),
    });
    if (!res.ok) {
      dispatch(fetchFailed("Failed to perform user transaction"));
      console.log("cardTransaction result", res);
      return;
    }
    const data = await res.json();
    // debugger;
    dispatch(updateTxDataSuccess(data[0]));
    // console.log("buy data", res)
    // const data = { uuid, amount };
    // dispatch(cardTransactionSuccess(data));
    // dispatch(setCardPosition({ uuid, pos: { amount: totalAmount, cost } }));
    return data;
  };
};

export { buy };

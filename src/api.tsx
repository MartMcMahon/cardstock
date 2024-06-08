import { Dispatch } from "./store";
import {
  fetchFailed,
  fetchPriceHistoryReq,
  fetchPriceHistorySuccess,
} from "./api_reducer";

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

export { fetchPriceHistory };

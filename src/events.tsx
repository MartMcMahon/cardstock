import { Dispatch } from "./store";
import {
  fetchFailed,
  fetchPriceHistoryReq,
  fetchPriceHistorySuccess,
} from "./api_reducer";
import { mainActions } from "./main_reducer";

const selectCard = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(mainActions.selectCard(id));
    dispatch(fetchPriceHistory(id));
  };
}

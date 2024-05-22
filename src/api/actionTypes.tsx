export const SCRYFALL_FETCH_ID_REQ = "SCRYFALL_FETCH_ID_REQ";
export const SCRYFALL_FETCH_ID_SUCCESS = "SCRYFALL_FETCH_ID_SUCCESS";
export const SCRYFALL_FETCH_RANDOM_REQ = "SCRYFALL_FETCH_RANDOM_REQ";
export const SCRYFALL_FETCH_RANDOM_SUCCESS = "SCRYFALL_FETCH_RANDOM_SUCCESS";
export const SCRYFALL_FAIL = "SCRYFALL_FAIL";

interface ScryfallFailAction {
  type: typeof SCRYFALL_FAIL;
  payload: string;
}

interface ScryfallFetchIdReqAction {
  type: typeof SCRYFALL_FETCH_ID_REQ;
  id: string;
}

type ScryfallApiCard = object;
interface ScryfallFetchIdSuccessAction {
  type: typeof SCRYFALL_FETCH_ID_SUCCESS;
  payload: ScryfallApiCard;
}

interface ScryfallRandomReqAction {
  type: typeof SCRYFALL_FETCH_RANDOM_REQ;
}

interface ScryfallRandomSuccessAction {
  type: typeof SCRYFALL_FETCH_RANDOM_SUCCESS;
  payload: ScryfallApiCard;
}

export type ScryfallActionTypes =
  | ScryfallFailAction
  | ScryfallFetchIdReqAction
  | ScryfallFetchIdSuccessAction
  | ScryfallRandomReqAction
  | ScryfallRandomSuccessAction;

import { Dispatch } from "../store";
// import {
//   SCRYFALL_FAIL,
//   SCRYFALL_FETCH_ID_REQ,
//   SCRYFALL_FETCH_ID_SUCCESS,
//   SCRYFALL_FETCH_RANDOM_REQ,
//   SCRYFALL_FETCH_RANDOM_SUCCESS,
// } from "./actionTypes";

import scryfall_reducer, {fetchRandomCardReq,fetchRandomCardSuccess} from "../scryfall_reducer";

const scryfall_url = "https://api.scryfall.com/";

const cache = {};
function checkCache(id) {
  if (cache[id]) {
    return cache[id];
  }
  return false;
}

// function getCard() {
//   fetch(scryfall_url + "cards/search?q=" + cardNameInput)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       if (data.object === "list") {
//         const d = data.data;
//         console.log(d);

// // setSelectedCard(d[0]);
// // setPrice(getPrice(d[0]));
// }
// });
// }

const fetchCardById = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: SCRYFALL_FETCH_ID_REQ, id });
    try {
      const res = await fetch(scryfall_url + "cards/" + id);
      if (!res.ok) {
        throw new Error("Failed to fetch card by id");
      }
      const data = await res.json();
      dispatch(scryfall_reducer.actions.fetchCardByIdSuccess(data));
        // { type: SCRYFALL_FETCH_ID_SUCCESS, payload: data });
    } catch (err: any) {
      dispatch({ type: SCRYFALL_FAIL, payload: err.message });
    }
  };
};

// function scryfall_search_by_name(nameSearchInput) {
//   fetch(scryfall_url + "cards/search?q=" + nameSearchInput)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       if (data.object === "list") {
//         const d = data.data;
//         console.log(d);
//         // setSelectedCard(d[0]);
//         // setPrice(getPrice(d[0]));
//       }
//     });
// }

const fetchRandomCard = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchRandomCardReq());
    try {
      const res = await fetch(scryfall_url + "cards/random");
      if (!res.ok) {
        throw new Error("Failed to fetch random card");
      }
      const data = await res.json();
      dispatch(fetchRandomCardSuccess(data));
    } catch (err: any) {
      dispatch({ type: "SCRYFALL_FAIL", payload: err.message });
    }
  };
};

export {fetchCardById, fetchRandomCard };

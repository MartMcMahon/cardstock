import { Dispatch } from "../store";
import {
  SCRYFALL_FAIL,
  SCRYFALL_FETCH_ID_SUCCESS,
  SCRYFALL_FETCH_RANDOM_REQ,
  SCRYFALL_FETCH_RANDOM_SUCCESS,
  ScryfallActionTypes,
} from "./actionTypes";

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

// function scryfall_get_by_id(id: string) {
//   const card = checkCache(id);
//   if (card) {
//     return card;
//   }
//   fetch(scryfall_url + "cards/" + id)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       dispatch({ type: "selectCard", card: data });
//       // setSelectedCard(data);
//       // setPrice(getPrice(data));
//     });
// }

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
  console.log("fetchRandomCard")
  return async (dispatch: Dispatch) => {
    dispatch({ type: SCRYFALL_FETCH_RANDOM_REQ });
  console.log("fetchRandomCard dispatch")
    try {
      const res = await fetch(scryfall_url + "cards/random");
      if (!res.ok) {
        throw new Error("Failed to fetch random card");
      }
      const data = await res.json();
      dispatch({ type: SCRYFALL_FETCH_RANDOM_SUCCESS, payload: data });
    } catch (err: any) {
      dispatch({ type: SCRYFALL_FAIL, payload: err.message });
    }
  };
};

// function randomCard() {
//   fetch(scryfall_url + "cards/random")
//     .then((response) => response.json())
//     .then((data) => {
//       dispatch({ type: "selectCard", card: data });
//       // console.log(data);
//       // setSelectedCard(data);
//       // setPrice(getPrice(data));
//     });
// }

export { fetchRandomCard };

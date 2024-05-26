import { Dispatch } from "./store";
import {
  fetchFailed,
  fetchRandomCardReq,
  fetchRandomCardSuccess,
  fetchIdReq,
  fetchIdSuccess,
  searchByNameReq,
  searchByNameSuccess,
} from "./scryfall_reducer";
import { mainActions } from "./main_reducer";

const scryfall_url = "https://api.scryfall.com/";

// const cache = {};
// function checkCache(id) {
//   if (cache[id]) {
//     return cache[id];
//   }
//   return false;
// j

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
    dispatch(fetchIdReq());
    try {
      const res = await fetch(scryfall_url + "cards/" + id);
      if (!res.ok) {
        throw new Error("Failed to fetch card by id");
      }
      const data = await res.json();
      dispatch(fetchIdSuccess(data));
      dispatch(mainActions.fillCardData({ [id]: data }));
    } catch (err: any) {
      dispatch(fetchFailed(err.message));
    }
  };
};

const searchByName = (name: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(searchByNameReq(name));
    try {
      const res = await fetch(
        scryfall_url + "cards/search?q=" + name //+ "&order=edhrec&dir=desc"
      );
      if (!res.ok) {
        throw new Error("Failed to fetch card by name");
      }
      const data = await res.json();
      dispatch(searchByNameSuccess(data));
      dispatch(mainActions.fillCardData({ [data.id]: data }));
    } catch (err: any) {
      dispatch(fetchFailed(err.message));
    }
  };
};



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
      dispatch(mainActions.fillCardData({ [data.id]: data }));
      dispatch(mainActions.selectCard(data));
    } catch (err: any) {
      dispatch(fetchFailed(err.message));
    }
  };
};

export { fetchCardById, fetchRandomCard, searchByName };

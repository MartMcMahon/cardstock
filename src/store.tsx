import { combineReducers, configureStore } from "@reduxjs/toolkit";
import main_reducer from "./main_reducer";
import scryfall_reducer from "./scryfall_reducer";

const rootReducer = combineReducers({
  main: main_reducer,
  scryfall: scryfall_reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;
export type Store = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type Dispatch = typeof store.dispatch;

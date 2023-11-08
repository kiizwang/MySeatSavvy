import { configureStore } from "@reduxjs/toolkit";
import restaurantsReducer from "./restaurantsSlice.js";

export const store = configureStore({
  reducer: {
    restaurants: restaurantsReducer,
  },
});

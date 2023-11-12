import { configureStore } from "@reduxjs/toolkit";
import restaurantsReducer from "./restaurantsSlice.js";
import tablesReducer from "./tablesSlice.js";

export const store = configureStore({
  reducer: {
    restaurants: restaurantsReducer,
    tables: tablesReducer,
  },
});

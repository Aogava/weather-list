import { configureStore } from "@reduxjs/toolkit";
import configReducer from "./configSlice";
import searchReducer from "./searchSlice";
import cityReducer from "./citiesSlice";

export const store = configureStore({
  reducer: {
    config: configReducer,
    search: searchReducer,
    citiesList: cityReducer,
  },
});

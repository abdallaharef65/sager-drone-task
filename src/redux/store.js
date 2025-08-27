// store.js
import { configureStore } from "@reduxjs/toolkit";
import dronesReducer from "./slices/droneSlice";

export const store = configureStore({
  reducer: {
    drones: dronesReducer,
  },
});

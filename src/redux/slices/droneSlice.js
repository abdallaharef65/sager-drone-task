// dronesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  droneData: [],
  selectedDrone: null,
  redCount: 0,
};

const dronesSlice = createSlice({
  name: "drones",
  initialState,
  reducers: {
    setDroneCount: (state, action) => {
      state.redCount = action.payload;
    },
    setDroneData: (state, action) => {
      state.droneData = action.payload;
    },
    setSelectedDrone: (state, action) => {
      state.selectedDrone = action.payload;
    },
  },
});

export const {
  setDroneData,
  setSelectedDrone,
  setDisplayCount,
  setDroneCount,
} = dronesSlice.actions;
export default dronesSlice.reducer;

// store/dronesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  droneData: [],
  selectedDrone: null,
  displayCount: 20,
};

const dronesSlice = createSlice({
  name: "drones",
  initialState,
  reducers: {
    setDroneData: (state, action) => {
      state.droneData = action.payload;
    },
    setSelectedDrone: (state, action) => {
      state.selectedDrone = action.payload;
    },
    setDisplayCount: (state, action) => {
      state.displayCount = action.payload;
    },
  },
});

export const { setDroneData, setSelectedDrone, setDisplayCount } =
  dronesSlice.actions;
export default dronesSlice.reducer;

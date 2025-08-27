import React from "react";
import { useSelector } from "react-redux";

const DroneDashboard = () => {
  const drones = useSelector((state) => state.drones.droneData);
  if (drones.length == 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white text-xl">
        No drone data available
      </div>
    );
  }
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 h-screen bg-black text-white"></div>
  );
};

export default React.memo(DroneDashboard);

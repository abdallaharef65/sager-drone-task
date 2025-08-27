// DroneDashboard.jsx
import React from "react";
import { useSelector } from "react-redux";

const DroneDashboard = () => {
  const drones = useSelector((state) => state.drones.droneData);
  console.log("drones > > ", drones);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black text-white text-xl">
      No drone data available
    </div>
  );
};

export default React.memo(DroneDashboard);

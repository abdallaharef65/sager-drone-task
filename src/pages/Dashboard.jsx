// Map.jsx
import React from "react";
import { useSelector } from "react-redux";

function Dashboard() {
  const droneData = useSelector((state) => state.drones.droneData);
  console.log("droneData  > > >", droneData);

  return <div className="h-screen w-full bg-black"></div>;
}

export default React.memo(Dashboard);

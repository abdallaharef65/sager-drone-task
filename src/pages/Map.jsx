import React from "react";
import Mapbox from "../components/Mapbox";
import useDroneSocket from "../hooks/useDroneSocket";
import { useSelector } from "react-redux";

function Map() {
  const redDroneCount = useSelector((state) => state.drones.redCount);
  useDroneSocket();
  return (
    <div className="h-screen w-full mt-[72px] relative">
      <Mapbox />
      <div className="absolute bottom-[100px] right-[40px] bg-[#D9D9D9] text-[#3C4248] rounded-lg font-bold min-w-[140px] min-h-[50px] flex items-center justify-center gap-2 text-sm p-2">
        <span className="bg-[#1F2327] text-amber-50 rounded-full text-base font-bold min-h-[25px] min-w-[25px] flex items-center justify-center px-2">
          {redDroneCount}
        </span>
        Red Drone Flying
      </div>
    </div>
  );
}

export default React.memo(Map);

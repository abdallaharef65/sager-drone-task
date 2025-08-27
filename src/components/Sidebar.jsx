// Sidebar.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import DashboardSvg from "../assets/svg/Dashboard.svg?react";
import MapSvg from "../assets/svg/Map.svg?react";
import DroneSidebar from "./DroneSidebar";

const Sidebar = () => {
  const droneData = useSelector((state) => state.drones.droneData);
  const selectedDrone = useSelector((state) => state.drones.selectedDrone);

  const [isExpanded, setIsExpanded] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  const dronesArray = Array.from(droneData.values());

  return (
    <div className="flex h-[878px]">
      {/* Main Sidebar */}
      <div className="bg-black text-white pt-4 flex flex-col items-center transition-all duration-300 w-36 mb-8">
        <div
          className={`pb-2 pt-2 w-full border-l-4 ${
            currentPath == "/dashboard"
              ? "border-red-500 bg-[#272727]"
              : "border-transparent"
          }`}
        >
          <Link
            onClick={() => setIsExpanded(false)}
            className="text-white font-bold flex flex-col justify-center items-center transition-all duration-200"
            to="/dashboard"
          >
            <DashboardSvg
              className={`${
                currentPath == "/dashboard"
                  ? "text-[#FFFFFF]"
                  : "text-[#65717C]"
              }`}
            />
            <div
              className={`text-[15px] ${
                currentPath == "/dashboard"
                  ? "text-[#FFFFFF]"
                  : "text-[#65717C]"
              }`}
            >
              Dashboard
            </div>
          </Link>
        </div>

        <div
          className={`pb-2 pt-2 w-full border-l-4 ${
            currentPath == "/map"
              ? "border-red-500 bg-[#272727]"
              : "border-transparent"
          }`}
        >
          <Link
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white font-bold flex flex-col justify-center items-center transition-all duration-200"
            to="/map"
          >
            <MapSvg
              className={`${
                currentPath == "/map" ? "text-[#FFFFFF]" : "text-[#65717C]"
              }`}
            />
            <div
              className={`text-[15px] ${
                currentPath == "/map" ? "text-[#FFFFFF]" : "text-[#65717C]"
              }`}
            >
              MAP
            </div>
          </Link>
        </div>
      </div>

      {/* Expanded Sidebar */}
      {isExpanded && (
        <DroneSidebar dronesArray={dronesArray} selectedDrone={selectedDrone} />
      )}
    </div>
  );
};

export default React.memo(Sidebar);

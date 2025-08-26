import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDrone, setDisplayCount } from "../redux/slices/droneSlice";
import { Link, useLocation } from "react-router-dom";
import DashboardSvg from "../assets/svg/Dashboard.svg?react";
import MapSvg from "../assets/svg/Map.svg?react";

const Sidebar = () => {
  const droneData = useSelector((state) => state.drones.droneData);
  const selectedDrone = useSelector((state) => state.drones.selectedDrone);
  const displayCount = useSelector((state) => state.drones.displayCount);

  const dispatch = useDispatch();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("drones");

  const location = useLocation();
  const currentPath = location.pathname;
  const listRef = useRef();

  const dronesArray = Array.from(droneData.values());
  const displayedDrones = dronesArray.slice(0, displayCount);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        dispatch(
          setDisplayCount((prev) => Math.min(prev + 20, dronesArray.length))
        );
      }
    }
  };

  const getStatusColor = (registration) => {
    const firstCharAfterDash = registration.split("-")[1][0];
    return firstCharAfterDash == "B";
  };

  return (
    <div className="flex h-[878px]">
      <div
        className={`bg-black text-white  pt-4 flex flex-col items-center transition-all duration-300 w-36 mb-8`}
      >
        <div
          className={`pb-2 pt-2 w-full border-l-4 ${
            currentPath === "/dashboard"
              ? "border-red-500 bg-[#272727]"
              : "border-transparent"
          }`}
        >
          <Link
            className={`text-white font-bold flex flex-col justify-center items-center  transition-all duration-200 ${
              currentPath === "/dashboard"
                ? "border-red-500"
                : "border-transparent"
            }`}
            to="/dashboard"
          >
            <DashboardSvg
              className={` ${
                currentPath === "/dashboard"
                  ? "text-[#FFFFFF]"
                  : "text-[#65717C]"
              }`}
            />
            <div
              className={`text-[15px] ${
                currentPath === "/dashboard"
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
            currentPath === "/map"
              ? "border-red-500 bg-[#272727]"
              : "border-transparent"
          }`}
        >
          <Link
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-white font-bold flex flex-col justify-center items-center transition-all duration-200 `}
            to="/map"
          >
            <MapSvg
              className={` ${
                currentPath === "/map" ? "text-[#FFFFFF]" : "text-[#65717C]"
              }`}
            />
            <div
              className={`text-[15px] ${
                currentPath === "/map" ? "text-[#FFFFFF]" : "text-[#65717C]"
              }`}
            >
              MAP
            </div>
          </Link>
        </div>

        <div className="mt-auto">
          <img
            src="/src/assets/images/profile.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>

      {isExpanded && (
        <div
          className="w-72 bg-[#111111] text-white flex flex-col m-1.5 h-[840px]"
          ref={listRef}
          onScroll={handleScroll}
        >
          <div className="px-4 py-2 border-b border-black">
            <h2 className="text-lg font-bold mb-2">DRONE FLYING</h2>

            <div className="flex space-x-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab("drones")}
                className={`pb-1 ${
                  activeTab === "drones"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Drones
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`pb-1 ${
                  activeTab === "history"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Flights History
              </button>
            </div>
          </div>

          <div className="overflow-y-auto">
            {activeTab === "drones" ? (
              displayedDrones.length === 0 ? (
                <p>No drones found</p>
              ) : (
                <ul>
                  {displayedDrones.map((drone) => {
                    const regNum = drone.properties.registration;
                    return (
                      <li
                        key={regNum}
                        className={`border-b border-black p-3 cursor-pointer flex items-center justify-between ${
                          selectedDrone == regNum
                            ? "bg-[#272727] text-white"
                            : "bg-[#111111] hover:bg-gray-700"
                        }`}
                        onClick={() => dispatch(setSelectedDrone(regNum))}
                      >
                        <div>
                          <h2 className="font-bold mb-2">
                            {drone.properties.Name}
                          </h2>

                          <div className="flex justify-between space-x-8 mb-2">
                            <div>
                              <div className="text-gray-400 text-[11px]">
                                Serial #
                              </div>
                              <div className="text-gray-400 text-[11px] font-semibold">
                                {drone.properties.serial}
                              </div>
                            </div>

                            <div>
                              <div className="text-gray-400 text-[11px]">
                                Registration #
                              </div>
                              <div className="text-gray-400 text-[11px] font-semibold">
                                {drone.properties.registration}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between space-x-8">
                            <div>
                              <div className="text-gray-400 text-[11px]">
                                Pilot
                              </div>
                              <div className="text-gray-400 text-[11px] font-semibold">
                                {drone.properties.pilot}
                              </div>
                            </div>

                            <div>
                              <div className="text-gray-400 text-[11px]">
                                Organization
                              </div>
                              <div className="text-gray-400 text-[11px] font-semibold">
                                {drone.properties.organization}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`w-[18px] h-[18px] rounded-full border-1 border-amber-50 ${
                            getStatusColor(regNum)
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </li>
                    );
                  })}
                </ul>
              )
            ) : (
              <div className="p-4 text-gray-400">
                Flights history content goes here...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

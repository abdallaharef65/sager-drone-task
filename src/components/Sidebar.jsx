import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDrone } from "../redux/slices/droneSlice";
import { Link, useLocation } from "react-router-dom";
import DashboardSvg from "../assets/svg/Dashboard.svg?react";
import MapSvg from "../assets/svg/Map.svg?react";

const Sidebar = () => {
  const droneData = useSelector((state) => state.drones.droneData);
  const selectedDrone = useSelector((state) => state.drones.selectedDrone);

  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("drones");
  const [startIndex, setStartIndex] = useState(0);
  const windowSize = 50;

  const location = useLocation();
  const currentPath = location.pathname;
  const listRef = useRef();

  const dronesArray = Array.from(droneData.values());

  const endIndex = Math.min(startIndex + windowSize, dronesArray.length);
  let displayedDrones = dronesArray.slice(startIndex, endIndex);

  if (
    selectedDrone &&
    !displayedDrones.some((d) => d.properties.registration == selectedDrone)
  ) {
    const selectedFullDrone = dronesArray.find(
      (d) => d.properties.registration == selectedDrone
    );
    if (selectedFullDrone) {
      displayedDrones = [selectedFullDrone, ...displayedDrones];
    }
  }

  let sortedDrones = [...displayedDrones];
  if (selectedDrone) {
    const index = sortedDrones.findIndex(
      (d) => d.properties.registration == selectedDrone
    );
    if (index > 0) {
      const [selectedItem] = sortedDrones.splice(index, 1);
      sortedDrones.unshift(selectedItem);
    }
  }

  const handleScroll = () => {
    if (!listRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (startIndex + windowSize < dronesArray.length) {
        setStartIndex((prev) =>
          Math.min(prev + 30, dronesArray.length - windowSize)
        );
      }
    }

    if (scrollTop <= 10) {
      if (startIndex > 0) {
        setStartIndex((prev) => Math.max(prev - 30, 0));
      }
    }
  };

  const getStatusColor = (registration) => {
    const firstCharAfterDash = registration.split("-")[1][0];
    return firstCharAfterDash == "B";
  };

  const handleShowAbove = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => Math.max(prev - 30, 0));

      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop += 100;
        }
      }, 0);
    }
  };

  const handleShowBelow = () => {
    if (endIndex < dronesArray.length) {
      setStartIndex((prev) =>
        Math.min(prev + 30, dronesArray.length - windowSize)
      );

      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop -= 100;
        }
      }, 0);
    }
  };

  return (
    <div className="flex h-[878px]">
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
            className={`text-white font-bold flex flex-col justify-center items-center transition-all duration-200`}
            to="/dashboard"
          >
            <DashboardSvg
              className={` ${
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
            className={`text-white font-bold flex flex-col justify-center items-center transition-all duration-200`}
            to="/map"
          >
            <MapSvg
              className={` ${
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

        <div className="mt-auto">
          <img
            src="/src/assets/images/profile.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="w-72 bg-[#111111] text-white flex flex-col m-1.5 h-[840px]">
          <div className="px-4 py-2 border-b border-black">
            <h2 className="text-lg font-bold mb-2">DRONE FLYING</h2>
            <div className="flex space-x-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab("drones")}
                className={`pb-1 ${
                  activeTab == "drones"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Drones
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`pb-1 ${
                  activeTab == "history"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Flights History
              </button>
            </div>
          </div>

          <div
            className="overflow-y-auto"
            ref={listRef}
            onScroll={handleScroll}
          >
            {activeTab == "drones" ? (
              sortedDrones.length == 0 ? (
                <p className="p-4">No drones found</p>
              ) : (
                <ul>
                  {startIndex > 0 && (
                    <div
                      onClick={handleShowAbove}
                      className="text-center text-gray-500 p-2 text-sm cursor-pointer hover:text-white hover:bg-gray-700"
                    >
                      ↑ {startIndex} items hidden ↑ (Click to show)
                    </div>
                  )}
                  {sortedDrones.map((drone) => {
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
                  {endIndex < dronesArray.length && (
                    <div
                      onClick={handleShowBelow}
                      className="text-center text-gray-500 p-2 text-sm cursor-pointer hover:text-white hover:bg-gray-700"
                    >
                      ↓ {dronesArray.length - endIndex} items hidden ↓ (Click to
                      show)
                    </div>
                  )}
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

export default React.memo(Sidebar);

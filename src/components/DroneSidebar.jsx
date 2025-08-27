// DroneSidebar.jsx

import React, { useEffect, useRef, useState } from "react";
import DroneItem from "./DroneItem";
import { useSelector } from "react-redux";

const DroneSidebar = () => {
  // selected drone from redux
  const selectedDrone = useSelector((state) => state.drones.selectedDrone);

  // drone data from redux
  const droneData = useSelector((state) => state.drones.droneData);

  // reference for scroll handling
  const listRef = useRef();

  // number of items in side bar
  const windowSize = 50;

  // index for display item
  const [startIndex, setStartIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("drones");

  // end index of display item
  const endIndex = Math.min(startIndex + windowSize, droneData.length);

  // reset scroll to top
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [selectedDrone]);

  // scroll to load more item
  const handleScroll = () => {
    if (!listRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    // when scrolled to bottom, load more items below
    // clientHeight : الارتفاع الظاهر للعنصر
    // scrollHeight : ارتفاع السايد بار
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (startIndex + windowSize < droneData.length) {
        setStartIndex((prev) =>
          Math.min(prev + 30, droneData.length - windowSize)
        );
      }
    }

    // when scrolled to top load previous items
    if (scrollTop <= 10) {
      if (startIndex > 0) {
        setStartIndex((prev) => Math.max(prev - 30, 0));
      }
    }
  };

  // click to show hidden items above
  const handleShowAbove = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => Math.max(prev - 30, 0));
    }
  };

  // click to show hidden items below
  const handleShowBelow = () => {
    if (endIndex < droneData.length) {
      setStartIndex((prev) =>
        Math.min(prev + 30, droneData.length - windowSize)
      );
    }
  };

  //for drone color
  const getStatusColor = (registration) => {
    const firstCharAfterDash = registration.split("-")[1][0];
    return firstCharAfterDash == "B";
  };

  // slice the drone list based on the current window
  let displayedDrones = droneData.slice(startIndex, endIndex);

  // when select the plane from the map
  // if the selected drone is outside the current window add it to the display list
  //some true || false
  if (
    selectedDrone &&
    !displayedDrones.some((d) => d.properties.registration == selectedDrone)
  ) {
    const selectedFullDrone = droneData.find(
      (d) => d.properties.registration == selectedDrone
    );
    if (selectedFullDrone) {
      displayedDrones = [selectedFullDrone, ...displayedDrones];
    }
  }

  // sort drones to keep the select one at the top
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

  return (
    <div className="w-72 bg-[#111111] text-white flex flex-col m-1.5 h-[840px]">
      {/* header and tab buttons */}
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

      <div className="overflow-y-auto" ref={listRef} onScroll={handleScroll}>
        {activeTab == "drones" ? (
          sortedDrones.length == 0 ? (
            <p className="p-4">No drones found</p>
          ) : (
            <ul>
              {/* show hidden items above */}
              {startIndex > 0 && (
                <div
                  onClick={handleShowAbove}
                  className="text-center text-gray-500 p-2 text-sm cursor-pointer hover:text-white hover:bg-gray-700 "
                >
                  {startIndex} items hidden (Click to show)
                </div>
              )}

              {/* drone items */}
              {sortedDrones.map((drone) => (
                <DroneItem
                  key={drone.properties.registration}
                  drone={drone}
                  selectedDrone={selectedDrone}
                  getStatusColor={getStatusColor}
                />
              ))}

              {/* show hidden items below */}
              {endIndex < droneData.length && (
                <div
                  onClick={handleShowBelow}
                  className="text-center text-gray-500 p-2 text-sm cursor-pointer hover:text-white hover:bg-gray-700 "
                >
                  {droneData.length - endIndex} items hidden (Click to show)
                </div>
              )}
            </ul>
          )
        ) : (
          <div className="p-4 text-gray-400">Flights History</div>
        )}
      </div>
    </div>
  );
};

export default React.memo(DroneSidebar);

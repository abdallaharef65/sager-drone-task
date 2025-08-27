// DroneSidebar.jsx
import React, { useEffect, useRef, useState } from "react";
import DroneItem from "./DroneItem";

const DroneSidebar = ({ dronesArray, selectedDrone }) => {
  const listRef = useRef();

  const windowSize = 50;
  const [startIndex, setStartIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("drones");
  const endIndex = Math.min(startIndex + windowSize, dronesArray.length);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [selectedDrone]);

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

  const getStatusColor = (registration) => {
    const firstCharAfterDash = registration.split("-")[1][0];
    return firstCharAfterDash == "B";
  };

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

  return (
    <div className="w-72 bg-[#111111] text-white flex flex-col m-1.5 h-[840px]">
      {/* Header Tabs */}
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

      {/* Content */}
      <div className="overflow-y-auto" ref={listRef} onScroll={handleScroll}>
        {activeTab == "drones" ? (
          sortedDrones.length == 0 ? (
            <p className="p-4">No drones found</p>
          ) : (
            <ul>
              {startIndex > 0 && (
                <div
                  onClick={handleShowAbove}
                  className="text-center text-gray-500 p-2 text-sm cursor-pointer hover:text-white hover:bg-gray-700 "
                >
                  {startIndex} items hidden (Click to show)
                </div>
              )}

              {sortedDrones.map((drone) => (
                <DroneItem
                  key={drone.properties.registration}
                  drone={drone}
                  selectedDrone={selectedDrone}
                  getStatusColor={getStatusColor}
                />
              ))}

              {endIndex < dronesArray.length && (
                <div
                  onClick={handleShowBelow}
                  className="text-center text-gray-500 p-2 text-sm cursor-pointer hover:text-white hover:bg-gray-700 "
                >
                  {dronesArray.length - endIndex} items hidden (Click to show)
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

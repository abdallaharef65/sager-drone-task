// Map.jsx
import React, { useEffect } from "react";
import Mapbox from "../components/Mapbox";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setDroneCount, setDroneData } from "../redux/slices/droneSlice";

function Map() {
  const dispatch = useDispatch();
  const droneData = useSelector((state) => state.drones.droneData);
  const redDroneCount = useSelector((state) => state.drones.redCount);

  const getCurrentTime = (now) => {
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };
  useEffect(() => {
    const socket = io("http://localhost:9013");

    socket.on("message", (data) => {
      const updated = [...droneData];
      data.features.forEach((feature) => {
        const droneId = feature.properties.registration;
        const coordinates = feature.geometry.coordinates;
        const idx = updated.findIndex((d) => d.id == droneId);
        const firstCharFilter = droneId.split("-")[1][0];

        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            color: firstCharFilter == "B" ? "#00d93d" : "#ff0000",
            type: feature.type,
            properties: {
              ...feature.properties,
              appearanceTime: updated[idx].properties.appearanceTime,
            },
            geometry: { ...feature.geometry },
            path: [...updated[idx].path, coordinates],
          };
        } else {
          const appearanceTime = getCurrentTime(new Date());
          updated.push({
            color: firstCharFilter == "B" ? "#00d93d" : "#ff0000",
            id: droneId,
            type: feature.type,
            properties: { ...feature.properties, appearanceTime },
            geometry: { ...feature.geometry },
            path: [coordinates],
          });
        }
      });

      const redCount = updated.reduce(
        (count, d) => (d.color == "#ff0000" ? count + 1 : count),
        0
      );

      dispatch(setDroneCount(redCount));
      dispatch(setDroneData(updated));
    });

    return () => socket.disconnect();
  }, [droneData]);

  return (
    <div className="h-screen w-full mt-[72px] relative">
      <Mapbox />
      <div className="absolute bottom-[100px] right-[40px] bg-[#D9D9D9] text-[#3C4248] rounded-lg font-bold min-w-[140px] min-h-[50px] flex items-center justify-center gap-2 text-sm p-2">
        <span className="bg-[#1F2327] text-amber-50  rounded-full  text-base font-bold min-h-[25px] min-w-[25px] flex items-center justify-center px-2">
          {redDroneCount}
        </span>
        Red Drone Flying
      </div>
    </div>
  );
}

export default React.memo(Map);

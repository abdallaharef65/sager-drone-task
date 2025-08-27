import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setDroneCount, setDroneData } from "../redux/slices/droneSlice";

export default function useDroneSocket() {
  const dispatch = useDispatch();
  const droneData = useSelector((state) => state.drones.droneData);

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
        const idx = updated.findIndex((d) => d.id === droneId);
        const firstCharFilter = droneId.split("-")[1][0];

        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            color: firstCharFilter === "B" ? "#00d93d" : "#ff0000",
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
            color: firstCharFilter === "B" ? "#00d93d" : "#ff0000",
            id: droneId,
            type: feature.type,
            properties: { ...feature.properties, appearanceTime },
            geometry: { ...feature.geometry },
            path: [coordinates],
          });
        }
      });

      const redCount = updated.reduce(
        (count, d) => (d.color === "#ff0000" ? count + 1 : count),
        0
      );

      dispatch(setDroneCount(redCount));
      dispatch(setDroneData(updated));
    });

    return () => socket.disconnect();
  }, [droneData]);
}

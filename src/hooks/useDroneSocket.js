import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setDroneCount, setDroneData } from "../redux/slices/droneSlice";

export default function useDroneSocket() {
  const dispatch = useDispatch();

  // drones from the Redux store
  const droneData = useSelector((state) => state.drones.droneData);

  // Formatted time string in HH:MM:SS format
  const getCurrentTime = (now) => {
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // useEffect to manage websocket connection
  // work after mount and when droneData changes
  useEffect(() => {
    const socket = io("http://localhost:9013"); // must be use env file

    // listen to incoming message from the server
    socket.on("message", (data) => {
      // create a new version instead of modifying the old version directly
      const updated = [...droneData];

      data.features.forEach((feature) => {
        // unique identifier for the drone
        const droneId = feature.properties.registration;

        // coordinates from the geometry
        const coordinates = feature.geometry.coordinates;

        const idx = updated.findIndex((d) => d.id === droneId);

        // for drone color
        const firstCharFilter = droneId.split("-")[1][0];

        // if drone already exists in our data, update its information
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx], // Spread existing properties
            color: firstCharFilter === "B" ? "#00d93d" : "#ff0000", // Set color based on ID
            type: feature.type,
            properties: {
              ...feature.properties,
              appearanceTime: updated[idx].properties.appearanceTime,
            },
            geometry: { ...feature.geometry },
            path: [...updated[idx].path, coordinates], // new coordinates to path array
          };
        } else {
          // new drone, create new record
          const appearanceTime = getCurrentTime(new Date());
          updated.push({
            color: firstCharFilter === "B" ? "#00d93d" : "#ff0000",
            id: droneId,
            type: feature.type,
            properties: {
              ...feature.properties,
              appearanceTime,
            },
            geometry: { ...feature.geometry },
            path: [coordinates], // first coordinates
          });
        }
      });

      //  count of red drones
      const redCount = updated.reduce(
        (count, d) => (d.color === "#ff0000" ? count + 1 : count),
        0
      );

      // update the Redux store
      dispatch(setDroneCount(redCount));
      dispatch(setDroneData(updated));
    });

    return () => socket.disconnect();
  }, [droneData]);
}

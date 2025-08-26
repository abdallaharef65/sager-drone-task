// Map.jsx
import { useEffect } from "react";
import Mapbox from "../components/Mapbox";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setDroneCount, setDroneData } from "../redux/slices/droneSlice";
import DroneSvg from "../assets/svg/DocSvg.svg?react";

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
        const coord = feature.geometry.coordinates;
        const idx = updated.findIndex((d) => d.id === droneId);
        const firstCharAfterDash = droneId.split("-")[1][0];

        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            color: firstCharAfterDash === "B" ? "#00d93d" : "#ff0000",
            type: feature.type,
            properties: {
              ...feature.properties,
              appearanceTime: updated[idx].properties.appearanceTime,
            },
            geometry: { ...feature.geometry },
            path: [...updated[idx].path, coord],
          };
        } else {
          const appearanceTime = getCurrentTime(new Date());
          updated.push({
            color: firstCharAfterDash === "B" ? "#00d93d" : "#ff0000",
            id: droneId,
            type: feature.type,
            properties: { ...feature.properties, appearanceTime },
            geometry: { ...feature.geometry },
            path: [coord],
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
  }, [dispatch, droneData]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        marginTop: "72px",
        position: "relative",
      }}
    >
      <Mapbox />
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          right: "40px",
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "10px 15px",
          borderRadius: "8px",
          fontWeight: "bold",
        }}
      >
        Red Drones: {redDroneCount}
      </div>
    </div>
  );
}

export default Map;

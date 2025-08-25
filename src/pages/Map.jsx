// Map.jsx
import { useEffect } from "react";
import Mapbox from "../components/Mapbox";
import { io } from "socket.io-client";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { setDroneData } from "../redux/slices/droneSlice";

function Map() {
  const dispatch = useDispatch();

  const droneData = useSelector((state) => state.drones.droneData);

  useEffect(() => {
    const socket = io("http://localhost:9013");

    socket.on("message", (data) => {
      dispatch(() => {
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
              properties: { ...feature.properties },
              geometry: { ...feature.geometry },
              path: [...updated[idx].path, coord],
            };
          } else {
            updated.push({
              color: firstCharAfterDash === "B" ? "#00d93d" : "#ff0000",
              id: droneId,
              type: feature.type,
              properties: { ...feature.properties },
              geometry: { ...feature.geometry },
              path: [coord],
            });
          }
        });

        dispatch(setDroneData(updated));
      });
    });

    return () => socket.disconnect();
  }, [dispatch, droneData]);

  return (
    <div style={{ height: "100vh", width: "100%", marginTop: "72px" }}>
      <Mapbox />
    </div>
  );
}

export default Map;

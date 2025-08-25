// App.jsx
import { useEffect, useState } from "react";
import Mapbox from "./components/Mapbox";
import { io } from "socket.io-client";
import Sidebar from "./components/Sidebar";

function App() {
  const [droneData, setDroneData] = useState([]);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    const socket = io("http://localhost:9013");

    socket.on("message", (data) => {
      setDroneData((prevData) => {
        const updated = [...prevData];

        data.features.forEach((feature) => {
          const droneId = feature.properties.registration;
          const coord = feature.geometry.coordinates;

          const idx = updated.findIndex((d) => d.id === droneId);
          const firstCharAfterDash = droneId.split("-")[1][0];

          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              color: firstCharAfterDash == "B" ? "#00d93d" : "#ff0000",
              type: feature.type,
              properties: { ...feature.properties },
              geometry: { ...feature.geometry },
              path: [...updated[idx].path, coord],
            };
          } else {
            updated.push({
              color: firstCharAfterDash == "B" ? "#00d93d" : "#ff0000",
              id: droneId,
              type: feature.type,
              properties: { ...feature.properties },
              geometry: { ...feature.geometry },
              path: [coord],
            });
          }
        });

        return updated;
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Mapbox droneData={droneData} />
      <div className="absolute top-0 left-0 h-full">
        <Sidebar
          droneData={droneData}
          selectedDrone={selectedDrone}
          setSelectedDrone={setSelectedDrone}
          displayCount={displayCount}
          setDisplayCount={setDisplayCount}
        />
      </div>
    </div>
  );
}

export default App;

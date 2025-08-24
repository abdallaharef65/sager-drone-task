import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Mapbox from "./components/Mapbox";
import Sidebar from "./components/Sidebar";

function App() {
  const [droneData, setDroneData] = useState(new Map());
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    const socket = io("http://localhost:9013");

    socket.on("message", (data) => {
      setDroneData((prev) => {
        const updated = new Map(prev);

        data.features.forEach((newFeature) => {
          const reg = newFeature.properties.registration;
          const coord = newFeature.geometry.coordinates;

          if (updated.has(reg)) {
            const existing = updated.get(reg);
            existing.path = [...existing.path, coord];
            existing.type = newFeature.type;
            existing.properties = { ...newFeature.properties };
            existing.geometry = { ...newFeature.geometry };
            updated.set(reg, existing);
          } else {
            const firstCharAfterDash = reg.split("-")[1][0];
            updated.set(reg, {
              id: reg,
              color: firstCharAfterDash == "B" ? "#00d93d" : "#ff0000",
              path: [coord],
              type: newFeature.type,
              properties: { ...newFeature.properties },
              geometry: { ...newFeature.geometry },
            });
          }
        });

        return updated;
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex h-screen bg-black relative">
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

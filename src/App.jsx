// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Map from "./pages/Map";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import { useSelector } from "react-redux";

function App() {
  const droneData = useSelector((state) => state.drones.droneData);
  console.log("droneData  > > >", droneData);
  return (
    <Router>
      <div>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/map" replace />} />
            <Route path="/map" element={<Map />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        <div className="absolute top-0 left-0 h-full">
          <Sidebar />
        </div>
      </div>
    </Router>
  );
}

export default App;

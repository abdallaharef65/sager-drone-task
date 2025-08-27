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
import AppHeader from "./components/AppHeader";

function App() {
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
        <AppHeader />
        <div className="absolute top-[72px] left-0 h-full">
          <Sidebar />
        </div>
      </div>
    </Router>
  );
}

export default React.memo(App);

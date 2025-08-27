// App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Sidebar from "./components/Sidebar";
import AppHeader from "./components/AppHeader";

// lazy load pages
const Map = lazy(() => import("./pages/Map"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/map" replace />} />
          <Route path="/map" element={<Map />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {/* static components*/}
        <AppHeader />
        <div className="absolute top-[72px] left-0 h-full">
          <Sidebar />
        </div>
      </div>
    </Router>
  );
}

export default React.memo(App);

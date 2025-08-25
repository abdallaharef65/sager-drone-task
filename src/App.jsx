// App.jsx
import React from "react";
import Map from "./pages/Map";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <React.Fragment>
      <Map />
      <div className="absolute top-0 left-0 h-full">
        <Sidebar />
      </div>
    </React.Fragment>
  );
}

export default App;

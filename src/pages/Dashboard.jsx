// Map.jsx
import { useSelector } from "react-redux";

function Dashboard() {
  const droneData = useSelector((state) => state.drones.droneData);
  console.log("droneData  > > >", droneData);

  return <div style={{ height: "100vh", width: "100%" }}></div>;
}

export default Dashboard;

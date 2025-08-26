// Map.jsx
import { useSelector } from "react-redux";

function Dashboard() {
  const droneData = useSelector((state) => state.drones.droneData);
  console.log("droneData  > > >", droneData);

  return <div className="h-screen w-full"></div>;
}

export default Dashboard;

// DroneItem.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedDrone } from "../redux/slices/droneSlice";

const DroneItem = ({ drone, selectedDrone, getStatusColor }) => {
  const dispatch = useDispatch();
  const regNum = drone.properties.registration;

  return (
    <li
      key={regNum}
      className={`border-b border-black p-3 cursor-pointer flex items-center justify-between ${
        selectedDrone == regNum
          ? "bg-[#272727] text-white"
          : "bg-[#111111] hover:bg-gray-700"
      }`}
      onClick={() => dispatch(setSelectedDrone(regNum))}
    >
      <div>
        <h2 className="font-bold mb-2">{drone.properties.Name}</h2>

        <div className="flex justify-between space-x-8 mb-2">
          <div>
            <div className="text-gray-400 text-[11px]">Serial #</div>
            <div className="text-gray-400 text-[11px] font-semibold">
              {drone.properties.serial}
            </div>
          </div>

          <div>
            <div className="text-gray-400 text-[11px]">Registration #</div>
            <div className="text-gray-400 text-[11px] font-semibold">
              {drone.properties.registration}
            </div>
          </div>
        </div>

        <div className="flex justify-between space-x-8">
          <div>
            <div className="text-gray-400 text-[11px]">Pilot</div>
            <div className="text-gray-400 text-[11px] font-semibold">
              {drone.properties.pilot}
            </div>
          </div>

          <div>
            <div className="text-gray-400 text-[11px]">Organization</div>
            <div className="text-gray-400 text-[11px] font-semibold">
              {drone.properties.organization}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`w-[18px] h-[18px] rounded-full border-1 border-amber-50 ${
          getStatusColor(regNum) ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
    </li>
  );
};

export default React.memo(DroneItem);

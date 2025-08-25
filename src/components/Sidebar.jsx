import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDrone, setDisplayCount } from "../redux/slices/droneSlice";
import { Link, useLocation } from "react-router-dom";
const MapSvg = () => (
  <svg
    width="26"
    height="27"
    viewBox="0 0 26 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.001 11.1813C13.659 11.1813 14.3023 10.986 14.8494 10.6201C15.3965 10.2542 15.8229 9.73407 16.0748 9.12557C16.3266 8.51708 16.3925 7.84751 16.2641 7.20154C16.1357 6.55556 15.8188 5.9622 15.3535 5.49648C14.8883 5.03076 14.2954 4.7136 13.6501 4.58511C13.0047 4.45661 12.3357 4.52256 11.7278 4.77461C11.1199 5.02665 10.6003 5.45348 10.2347 6.00111C9.86914 6.54874 9.67401 7.19257 9.67401 7.8512C9.67401 8.73439 10.0245 9.58142 10.6485 10.2059C11.2724 10.8304 12.1186 11.1813 13.001 11.1813ZM13.001 5.74025C13.2829 5.72118 13.5656 5.76271 13.8301 5.86205C14.0946 5.9614 14.3348 6.11624 14.5346 6.3162C14.7344 6.51616 14.8891 6.75659 14.9883 7.02135C15.0876 7.28611 15.1291 7.56906 15.11 7.8512C15.11 8.41106 14.8878 8.948 14.4923 9.34388C14.0968 9.73976 13.5603 9.96216 13.001 9.96216C12.4417 9.96216 11.9052 9.73976 11.5097 9.34388C11.1142 8.948 10.892 8.41106 10.892 7.8512C10.8722 7.56866 10.9132 7.28516 11.0121 7.01979C11.111 6.75442 11.2656 6.51335 11.4654 6.31283C11.6653 6.11232 11.9058 5.95702 12.1706 5.85738C12.4355 5.75775 12.7187 5.7161 13.001 5.73524V5.74025Z"
      fill="white"
    />
    <path
      d="M25.979 24.939L23.813 14.096C23.764 13.8502 23.6314 13.6289 23.4378 13.47C23.2441 13.311 23.0014 13.2242 22.751 13.2242H18.539L18.75 12.8908L18.803 12.8078L19.414 11.8439C20.1772 10.6321 20.582 9.22887 20.5817 7.79644C20.5815 6.36401 20.176 4.96092 19.4124 3.74947C18.6487 2.53802 17.5581 1.5677 16.2665 0.95074C14.9749 0.333782 13.5353 0.0953948 12.114 0.263152C10.7965 0.417395 9.54256 0.915087 8.47747 1.70647C7.41239 2.49786 6.57349 3.55522 6.04466 4.77285C5.51583 5.99048 5.31557 7.32572 5.46392 8.6451C5.61227 9.96448 6.10402 11.2218 6.89002 12.2913C7.11802 12.6006 7.33802 12.9099 7.55402 13.2252H3.25402C3.0036 13.2252 2.76092 13.312 2.56729 13.471C2.37366 13.6299 2.24104 13.8512 2.19202 14.097L0.0220239 24.939C-0.0101775 25.0966 -0.00693357 25.2594 0.0315204 25.4156C0.0699744 25.5718 0.142674 25.7174 0.244348 25.842C0.346022 25.9666 0.47412 26.0669 0.619354 26.1358C0.764587 26.2047 0.923314 26.2403 1.08402 26.2402H24.917C25.0777 26.2403 25.2365 26.2047 25.3817 26.1358C25.5269 26.0669 25.655 25.9666 25.7567 25.842C25.8584 25.7174 25.9311 25.5718 25.9695 25.4156C26.008 25.2594 26.0112 25.0966 25.979 24.939ZM7.63902 7.02241C7.83543 5.66587 8.53786 4.43412 9.60496 3.57504C10.6721 2.71596 12.0246 2.2933 13.3905 2.39211C14.7564 2.49092 16.0342 3.10388 16.9668 4.10763C17.8994 5.11137 18.4176 6.43142 18.417 7.80213C18.4191 8.82278 18.1301 9.82283 17.584 10.6848L16.975 11.6447L16.922 11.7278C15.4944 13.8767 14.1851 16.102 13 18.3939C11.7638 15.8078 10.3035 13.3351 8.63602 11.0041C7.79272 9.86011 7.43444 8.42927 7.63902 7.02241ZM2.40602 24.0672L4.13902 15.3932H8.90002C9.70002 16.7454 10.475 18.2028 11.428 20.0975L11.586 20.4128L12.027 21.2956C12.1169 21.4759 12.2552 21.6275 12.4263 21.7334C12.5975 21.8394 12.7948 21.8955 12.996 21.8955C13.1973 21.8955 13.3946 21.8394 13.5657 21.7334C13.7369 21.6275 13.8751 21.4759 13.965 21.2956L14.9 19.4239C15.524 18.1767 16.232 16.9336 17.181 15.3882H21.859L23.6 24.0672H2.40602Z"
      fill="white"
    />
  </svg>
);
const CloseSvg = () => (
  <svg
    width="22"
    height="23"
    viewBox="0 0 22 23"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.782 3.31736C17.2432 1.77864 15.2832 0.731098 13.1497 0.307146C11.0162 -0.116807 8.80503 0.101864 6.79567 0.935517C4.78632 1.76917 3.06899 3.18038 1.86077 4.99076C0.652556 6.80115 0.00769043 8.92943 0.00769043 11.1066C0.00769043 13.2837 0.652556 15.412 1.86077 17.2224C3.06899 19.0328 4.78632 20.444 6.79567 21.2776C8.80503 22.1113 11.0162 22.33 13.1497 21.906C15.2832 21.4821 17.2432 20.4345 18.782 18.8958C20.8429 16.8283 22.0002 14.0271 22.0002 11.1066C22.0002 8.18608 20.8429 5.38482 18.782 3.31736ZM15.539 14.3526C15.7114 14.5251 15.8083 14.7592 15.8083 15.0032C15.8083 15.2472 15.7114 15.4812 15.539 15.6538C15.3666 15.8263 15.1328 15.9233 14.889 15.9233C14.6452 15.9233 14.4114 15.8263 14.239 15.6538L11 12.4028L7.75904 15.6498C7.67368 15.7352 7.57234 15.803 7.46081 15.8492C7.34929 15.8955 7.22975 15.9193 7.10904 15.9193C6.98832 15.9193 6.86879 15.8955 6.75726 15.8492C6.64573 15.803 6.5444 15.7352 6.45904 15.6498C6.37368 15.5643 6.30597 15.4629 6.25977 15.3513C6.21358 15.2397 6.1898 15.12 6.1898 14.9992C6.1898 14.8784 6.21358 14.7587 6.25977 14.6471C6.30597 14.5354 6.37368 14.434 6.45904 14.3486L9.70004 11.1016L6.46204 7.86157C6.28965 7.68902 6.1928 7.45499 6.1928 7.21097C6.1928 6.96694 6.28965 6.73292 6.46204 6.56037C6.63443 6.38781 6.86824 6.29088 7.11204 6.29088C7.35583 6.29088 7.58965 6.38781 7.76204 6.56037L11 9.80837L14.242 6.56337C14.4144 6.39082 14.6482 6.29388 14.892 6.29388C15.1358 6.29388 15.3696 6.39082 15.542 6.56337C15.7144 6.73592 15.8113 6.96995 15.8113 7.21397C15.8113 7.45799 15.7144 7.69202 15.542 7.86457L12.3 11.1016L15.539 14.3526Z"
      fill="black"
    />
  </svg>
);
const DashboardSvg = () => (
  <svg
    width="27"
    height="24"
    viewBox="0 0 27 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.437 0.734511C11.6725 0.732003 9.92489 1.07849 8.29458 1.75406C6.66427 2.42964 5.18338 3.42099 3.937 4.67115C2.68775 5.91788 1.69686 7.39934 1.02123 9.03045C0.345602 10.6616 -0.00144947 12.4102 4.54998e-06 14.176C4.54998e-06 14.176 4.54998e-06 14.184 4.54998e-06 14.188C4.54998e-06 14.192 4.54998e-06 14.196 4.54998e-06 14.199C-0.00231987 17.3193 1.08385 20.3426 3.071 22.7469C3.17601 22.8742 3.30781 22.9767 3.457 23.0472C3.60618 23.1176 3.76906 23.1542 3.934 23.1543H22.934C23.0989 23.1542 23.2618 23.1176 23.411 23.0472C23.5602 22.9767 23.692 22.8742 23.797 22.7469C25.42 20.7799 26.4506 18.3914 26.7685 15.8603C27.0864 13.3291 26.6784 10.7596 25.5923 8.45175C24.5061 6.1439 22.7865 4.19289 20.6342 2.82643C18.4819 1.45996 15.9857 0.734431 13.437 0.734511ZM22.395 20.9072H4.478C3.25073 19.2745 2.49585 17.3354 2.296 15.302H5.6C5.89112 15.2933 6.1674 15.1714 6.37025 14.9622C6.57309 14.753 6.68654 14.473 6.68654 14.1815C6.68654 13.8899 6.57309 13.6099 6.37025 13.4007C6.1674 13.1915 5.89112 13.0696 5.6 13.0609H2.3C2.51711 10.8698 3.37723 8.79207 4.772 7.08939L5.524 7.84209C5.73867 8.02479 6.01425 8.1198 6.29578 8.10815C6.57732 8.09651 6.84413 7.97906 7.043 7.77925C7.24187 7.57944 7.35818 7.31195 7.36875 7.0301C7.37931 6.74826 7.28335 6.47279 7.1 6.25862L6.348 5.50593C8.0491 4.10986 10.1249 3.24894 12.314 3.03164V6.33469C12.3095 6.48466 12.3352 6.63401 12.3894 6.77387C12.4437 6.91374 12.5254 7.04129 12.6298 7.14895C12.7342 7.25662 12.8591 7.34221 12.9972 7.40066C13.1352 7.45911 13.2836 7.48923 13.4335 7.48923C13.5834 7.48923 13.7318 7.45911 13.8698 7.40066C14.0079 7.34221 14.1328 7.25662 14.2372 7.14895C14.3416 7.04129 14.4233 6.91374 14.4776 6.77387C14.5318 6.63401 14.5575 6.48466 14.553 6.33469V3.03164C16.7421 3.249 18.8179 4.10991 20.519 5.50593L19.767 6.25862C19.6572 6.36131 19.5691 6.48507 19.5081 6.62253C19.447 6.76 19.4142 6.90835 19.4117 7.05876C19.4091 7.20917 19.4368 7.35856 19.4932 7.49802C19.5495 7.63749 19.6333 7.76418 19.7396 7.87055C19.8458 7.97693 19.9724 8.0608 20.1117 8.11718C20.2511 8.17356 20.4003 8.2013 20.5506 8.19874C20.7009 8.19617 20.8491 8.16336 20.9864 8.10226C21.1238 8.04116 21.2474 7.95302 21.35 7.84309L22.102 7.09039C23.4967 8.7931 24.3568 10.8708 24.574 13.0619H21.274C20.9829 13.0706 20.7066 13.1925 20.5038 13.4017C20.3009 13.6109 20.1875 13.8909 20.1875 14.1825C20.1875 14.474 20.3009 14.754 20.5038 14.9632C20.7066 15.1724 20.9829 15.2943 21.274 15.303H24.574C24.3745 17.3358 23.6204 19.2746 22.394 20.9072H22.395Z"
      fill="#65717C"
    />
    <path
      d="M16.795 10.0842L10.462 13.2551L13.629 16.424L16.795 10.0842Z"
      fill="#65717C"
    />
    <path
      d="M16.79 17.5451H10.072C9.92215 17.5406 9.77295 17.5662 9.63321 17.6205C9.49347 17.6748 9.36605 17.7567 9.25848 17.8611C9.15092 17.9656 9.0654 18.0907 9.007 18.2289C8.94861 18.3671 8.91852 18.5156 8.91852 18.6656C8.91852 18.8156 8.94861 18.9642 9.007 19.1023C9.0654 19.2405 9.15092 19.3656 9.25848 19.4701C9.36605 19.5746 9.49347 19.6564 9.63321 19.7107C9.77295 19.765 9.92215 19.7906 10.072 19.7861H16.79C17.0811 19.7774 17.3574 19.6555 17.5602 19.4464C17.7631 19.2372 17.8765 18.9571 17.8765 18.6656C17.8765 18.3741 17.7631 18.094 17.5602 17.8848C17.3574 17.6757 17.0811 17.5538 16.79 17.5451Z"
      fill="#65717C"
    />
  </svg>
);

const Sidebar = () => {
  const droneData = useSelector((state) => state.drones.droneData);
  const selectedDrone = useSelector((state) => state.drones.selectedDrone);
  const displayCount = useSelector((state) => state.drones.displayCount);

  const dispatch = useDispatch();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("drones");

  const location = useLocation();
  const currentPath = location.pathname;
  const listRef = useRef();

  const dronesArray = Array.from(droneData.values());
  const displayedDrones = dronesArray.slice(0, displayCount);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        dispatch(
          setDisplayCount((prev) => Math.min(prev + 20, dronesArray.length))
        );
      }
    }
  };

  const getStatusColor = (registration) => {
    const firstCharAfterDash = registration.split("-")[1][0];
    return firstCharAfterDash == "B";
  };

  return (
    <div className="flex h-full">
      <div
        className={`bg-black text-white pe-4 pt-4 flex flex-col items-center transition-all duration-300 w-36 mb-8`}
      >
        <div
          className={`pb-2 pt-2 w-full border-l-4 ${
            currentPath === "/dashboard"
              ? "border-red-500 bg-[#272727]"
              : "border-transparent"
          }`}
        >
          <Link
            className={`text-white font-bold flex flex-col justify-center items-center  transition-all duration-200 ${
              currentPath === "/dashboard"
                ? "border-red-500"
                : "border-transparent"
            }`}
            to="/dashboard"
          >
            <DashboardSvg />
            <div>Dashboard</div>
          </Link>
        </div>

        <div
          className={`pb-2 pt-2 w-full border-l-4 ${
            currentPath === "/map"
              ? "border-red-500 bg-[#272727]"
              : "border-transparent"
          }`}
        >
          <Link
            onClick={() => setIsExpanded(!isExpanded)}
            className={`text-white font-bold flex flex-col justify-center items-center transition-all duration-200 `}
            to="/map"
          >
            <MapSvg />
            <div>MAP</div>
          </Link>
        </div>

        <div className="mt-auto">
          <img
            src="/src/assets/images/profile.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>

      {isExpanded && (
        <div
          className="w-72 bg-[#111111] text-white flex flex-col m-1.5"
          ref={listRef}
          onScroll={handleScroll}
        >
          <div className="px-4 py-2 border-b border-black">
            <h2 className="text-lg font-bold mb-2">DRONE FLYING</h2>

            <div className="flex space-x-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab("drones")}
                className={`pb-1 ${
                  activeTab === "drones"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Drones
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`pb-1 ${
                  activeTab === "history"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Flights History
              </button>
            </div>
          </div>

          <div className="overflow-y-auto">
            {activeTab === "drones" ? (
              displayedDrones.length === 0 ? (
                <p>No drones found</p>
              ) : (
                <ul>
                  {displayedDrones.map((drone) => {
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
                          <h2 className="font-bold mb-2">
                            {drone.properties.Name}
                          </h2>

                          <div className="flex justify-between space-x-8 mb-2">
                            <div>
                              <div className="text-gray-400 text-[11px]">
                                Serial #
                              </div>
                              <div className="text-gray-400 text-[11px] font-semibold">
                                {drone.properties.serial}
                              </div>
                            </div>

                            <div>
                              <div className="text-gray-400 text-[11px]">
                                Registration #
                              </div>
                              <div className="text-gray-400 text-[11px] font-semibold">
                                {drone.properties.registration}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between space-x-8">
                            <div>
                              <div className="text-gray-400 text-[11px]">
                                Pilot
                              </div>
                              <div className="text-gray-400 text-[11px] font-semibold">
                                {drone.properties.pilot}
                              </div>
                            </div>

                            <div>
                              <div className="text-gray-400 text-[11px]">
                                Organization
                              </div>
                              <div className="text-gray-400 text-[11px] font-semibold">
                                {drone.properties.organization}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`w-[18px] h-[18px] rounded-full border-1 border-amber-50 ${
                            getStatusColor(regNum)
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </li>
                    );
                  })}
                </ul>
              )
            ) : (
              <div className="p-4 text-gray-400">
                Flights history content goes here...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

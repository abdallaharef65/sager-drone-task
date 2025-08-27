import React from "react";
import MapSvg from "../assets/svg/Sager.svg?react";
const AppHeader = () => {
  return (
    <header className="h-[72px] w-full bg-black fixed top-0 left-0 z-[1000] flex items-center px-4 text-white font-bold">
      <MapSvg />
    </header>
  );
};

export default React.memo(AppHeader);

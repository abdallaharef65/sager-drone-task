import React from "react";
// import PageSvg from "../assets/svg/PageSvg.svg";
import { ReactComponent as PageSvg } from "../assets/svg/PageSvg.svg";
import UserSvg from "../assets/svg/UserSvg.svg";
import DocSvg from "../assets/svg/DocSvg.svg";
export function Navbar() {
  const NAV_MENU = [
    {
      name: "Page",
      // icon: RectangleStackIcon,
    },
    {
      name: "Account",
      // icon: UserCircleIcon,
    },
    {
      name: "Docs",
      // icon: CommandLineIcon,
      href: "https://www.material-tailwind.com/docs/react/installation",
    },
  ];
  return (
    <div>
      <div className="hidden md:block bg-red-400 h-[64px] mt-10 rounded-lg mx-3 px-2">
        <div className="flex justify-between items-center bg-amber-300 px-15 h-full">
          <div>Logo</div>
          <div className="flex space-x-5">
            <div>
              <a>
                <PageSvg className="w-10 h-10 text-blue-500" />
                Page
              </a>
            </div>
            <div>
              <a>
                <img src={UserSvg} alt="Account Icon" />
                Account
              </a>
            </div>
            <div>
              <a>
                <img src={DocSvg} alt="Docs Icon" />
                Docs
              </a>
            </div>
          </div>
          <div className="flex space-x-5">
            <div>Login</div>
            <div>Block</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

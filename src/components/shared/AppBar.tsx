import React from "react";
import { ModeToggle } from "./ThemeToggle";

type Props = {};

const AppBar = (props: Props) => {
  return (
    <div className="container pt-8 mx-auto flex justify-between items-center">
      <div className="text-white text-4xl font-bold">OMEGA 3 Dashboard</div>
      <div className="flex items-center justify-around gap-8">
        <ModeToggle />
        <ul className="flex space-x-4">
          {["Overview", "Stores", "Products", "Orders"].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="group text-base relative text-primary-foreground hover:text-chart-3 transition-colors duration-300"
              >
                {item}
                <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AppBar;

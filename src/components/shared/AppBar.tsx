import React from "react";
import { ModeToggle } from "./ThemeToggle";
import Link from "next/link";

type Props = {};

const AppBar = (props: Props) => {
  // Define navigation items with their paths
  const navItems = [
    { name: "Overview", path: "/" },
    { name: "Stores", path: "/stores" },
    { name: "Products", path: "/products" },
    { name: "Orders", path: "/orders" },
  ];

  return (
    <div className="container pt-8 mx-auto flex justify-between items-center">
      <Link
        href="/"
        className="text-white text-4xl font-bold hover:opacity-80 transition-opacity"
      >
        OMEGA 3 Dashboard
      </Link>
      <div className="flex items-center justify-around gap-8">
        <ModeToggle />
        <ul className="flex space-x-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className="group text-base relative text-primary-foreground hover:text-chart-3 transition-colors duration-300"
              >
                {item.name}
                <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AppBar;

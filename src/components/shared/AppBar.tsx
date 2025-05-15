import React from "react";
import { ModeToggle } from "./ThemeToggle";
import Link from "next/link";

type Props = {};

const AppBar = (props: Props) => {
  // Define navigation items with their paths
  const navItems = [
    { name: "Overview", path: "/" },
    { name: "Analytics", path: "/analytics" },
    { name: "Customers", path: "/customers" },
    { name: "Orders", path: "/orders" },
  ];

  return (
    <div className=" flex justify-between items-center bg-accent/50 p-6 shadow-sm">
      <ModeToggle />
    </div>
  );
};

export default AppBar;

import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

import "./MainLayout.css";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="fitpulse-layout">

      <Sidebar sidebarOpen={sidebarOpen} />

      <div
        className={`fitpulse-main ${
          sidebarOpen
            ? "main-sidebar-open"
            : "main-sidebar-collapsed"
        }`}
      >

        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="fitpulse-page">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default MainLayout;
import React from "react";
import { NavLink } from "react-router-dom";

import menuItems from "../../config/menuConfig";

import "./Sidebar.css";

const Sidebar = ({ sidebarOpen }) => {

const userData = JSON.parse(localStorage.getItem("user"))
console.log(userData,"jsjlfjs")

  const visibleMenus = menuItems.filter((menu) =>
    menu.roles.includes(userData?.role)
  );

  return (
    <aside
      className={`fitpulse-sidebar ${
        sidebarOpen
          ? "sidebar-open"
          : "sidebar-collapsed"
      }`}
    >

      {/* Logo */}

      <div className="fitpulse-logo-area">

        <div className="fitpulse-logo">
          FP
        </div>

        {sidebarOpen && (
          <div className="fitpulse-logo-content">
            <h5>FitPulse Pro</h5>
            <span>Gym Management</span>
          </div>
        )}

      </div>


      {/* Menu */}

      <div className="fitpulse-menu">

        {visibleMenus.map((menu) => (

          <NavLink
            key={menu.id}
            to={menu.path}
            className={({ isActive }) =>
              `fitpulse-menu-item ${
                isActive ? "active" : ""
              }`
            }
            title={!sidebarOpen ? menu.name : ""}
          >

            <i className={`bi ${menu.icon}`}></i>

            {sidebarOpen && (
              <span>{menu.name}</span>
            )}

          </NavLink>

        ))}

      </div>


      {/* Bottom */}

      <div className="fitpulse-sidebar-bottom">

        <button
          type="button"
          className="fitpulse-menu-item"
        >
          <i className="bi bi-person-circle"></i>

          {sidebarOpen && (
            <span>Profile</span>
          )}
        </button>


        <button
          type="button"
          className="fitpulse-menu-item"
        >
          <i className="bi bi-box-arrow-right"></i>

          {sidebarOpen && (
            <span>Logout</span>
          )}
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;
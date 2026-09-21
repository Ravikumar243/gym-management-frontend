import React from "react";
import "./Navbar.css";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {

  return (
    <header className="fitpulse-navbar">

      <div className="d-flex align-items-center gap-3">

        <button
          type="button"
          className="fitpulse-hamburger"
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
        >
          <i className="bi bi-list"></i>
        </button>

        <div className="fitpulse-search">

          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search gyms, members, reports..."
          />

        </div>

      </div>


      <div className="d-flex align-items-center gap-3">

        <button
          type="button"
          className="fitpulse-navbar-icon"
        >
          <i className="bi bi-bell"></i>
        </button>

        <button
          type="button"
          className="fitpulse-navbar-icon"
        >
          <i className="bi bi-question-circle"></i>
        </button>


        <div className="fitpulse-user">

          <div className="fitpulse-avatar">
            A
          </div>

          <div className="fitpulse-user-info">

            <strong>Admin</strong>

            <small>
              Super Admin
            </small>

          </div>

          <i className="bi bi-chevron-down"></i>

        </div>

      </div>

    </header>
  );
};

export default Navbar;
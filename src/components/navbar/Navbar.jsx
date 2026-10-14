import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Remove your authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // If you are using sessionStorage also
    sessionStorage.clear();

    // Redirect to login
    window.location.href = "/";
  };

  return (
    <header className="fitpulse-navbar">

      {/* LEFT */}
      <div className="d-flex align-items-center gap-3">

        <button
          type="button"
          className="fitpulse-hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
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

      {/* RIGHT */}
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

        {/* PROFILE */}
        <div
          className="fitpulse-user-wrapper"
          ref={profileRef}
        >

          <button
            type="button"
            className="fitpulse-user"
            onClick={() => setProfileOpen(!profileOpen)}
          >

            <div className="fitpulse-avatar">
              A
            </div>

            <div className="fitpulse-user-info">

              <strong>Admin</strong>

              <small>
                Super Admin
              </small>

            </div>

            <i
              className={`bi ${
                profileOpen
                  ? "bi-chevron-up"
                  : "bi-chevron-down"
              }`}
            ></i>

          </button>

          {/* DROPDOWN */}
          {profileOpen && (
            <div className="fitpulse-profile-dropdown">

              <div className="fitpulse-dropdown-user">

                <div className="fitpulse-avatar">
                  A
                </div>

                <div>
                  <strong>Admin</strong>
                  <small>Super Admin</small>
                </div>

              </div>

              <div className="fitpulse-dropdown-divider"></div>

              <button
                type="button"
                className="fitpulse-logout-btn"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Navbar;
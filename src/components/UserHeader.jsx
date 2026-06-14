import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useSelector, useDispatch } from "react-redux";
import { CLEAR_USER } from "../redux/user/action.js";


function UserHeader({ sidebarCollapsed }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userDetails);
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 70 : 220;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverEndpoint}/auth/logout`, {
        withCredentials: true,
      });

      dispatch({ type: CLEAR_USER });
      document.cookie =
        "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav
      className={`position-fixed d-flex align-items-center user-header-nav ${scrolled ? "scrolled" : ""}`}
      style={{
        top: "0",
        left: `${sidebarWidth}px`,
        width: `calc(100% - ${sidebarWidth}px)`,
        height: "56px",
        background: "transparent",
        border: "none",
        boxShadow: "none",
        paddingLeft: "24px",
        paddingRight: "24px",
        transition: "left 0.25s, width 0.25s, background-color 0.25s, border-color 0.25s, box-shadow 0.25s",
        zIndex: 1030,
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center px-0">

        {/* Search Input */}
        <div className="position-relative" style={{ width: "320px" }}>
          <i
            className="bi bi-search position-absolute"
            style={{
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#A1A1AA",
              fontSize: "14px"
            }}
          />
          <input
            type="text"
            className="form-control text-white"
            placeholder="Search transactions..."
            style={{
              paddingLeft: "42px",
              paddingRight: "16px",
              height: "40px",
              borderRadius: "20px",
              border: "1px solid #39393B",
              background: "#1B1B1D",
              fontSize: "14px"
            }}
          />
        </div>

        {/* User Actions */}
        <div className="d-flex align-items-center gap-3">
          

          {/* User Menu */}
          <div className="dropdown">
            <button
              className="btn border-0 d-flex align-items-center gap-2 px-3"
              type="button"
              data-bs-toggle="dropdown"
              style={{
                height: "38px",
                borderRadius: "19px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid #39393B",
                color: "#FFFFFF",
                boxShadow: "none"
              }}
            >
              {/* Username */}
              <span className="fw-semibold text-white animate-fade-in" style={{ fontSize: "14px" }}>
                {user?.username || "User"}
              </span>

              {/* Avatar Icon */}
              <div
                className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center"
                style={{
                  width: "26px",
                  height: "26px",
                  background: "#9D5CFF",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerText = user?.username?.[0]?.toUpperCase() || "U";
                    }}
                  />
                ) : (
                  user?.username?.[0]?.toUpperCase() || "U"
                )}
              </div>
            </button>

            {/* Dropdown */}
            <ul
              className="dropdown-menu dropdown-menu-end mt-2 border-0 shadow"
              style={{
                borderRadius: "12px",
                padding: "6px",
                backgroundColor: "#1B1B1D",
                border: "1px solid #39393B"
              }}
            >
              <li>
                <div className="px-3 py-2 text-white-50" style={{ fontSize: "12px" }}>
                  Signed in as <strong className="text-white">{user?.username || "User"}</strong>
                </div>
              </li>
              <li><hr className="dropdown-divider bg-secondary" style={{ opacity: 0.2 }} /></li>

              <li>
                <Link className="dropdown-item rounded-3" to="/profile">
                  Profile
                </Link>
              </li>

              <li>
                <Link className="dropdown-item rounded-3" to="/manage-users">
                  Manage Users
                </Link>
              </li>

              <li>
                <Link className="dropdown-item rounded-3" to="/manage-payments">
                  Payments
                </Link>
              </li>

              <li>
                <Link className="dropdown-item rounded-3" to="/manage-subscriptions">
                  Subscriptions
                </Link>
              </li>

              <li><hr className="dropdown-divider bg-secondary" style={{ opacity: 0.2 }} /></li>

              <li>
                <button
                  className="dropdown-item rounded-3 text-danger"
                  type="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </nav>
  );

}

export default UserHeader;

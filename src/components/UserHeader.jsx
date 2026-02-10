import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useSelector, useDispatch } from "react-redux";
import { CLEAR_USER } from "../redux/user/action.js";

function UserHeader({ sidebarCollapsed }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userDetails);
  const navigate = useNavigate();

  const sidebarWidth = sidebarCollapsed ? 70 : 220;

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
    className="position-fixed top-0 d-flex align-items-center"
    style={{
      left: sidebarWidth,
      width: `calc(100% - ${sidebarWidth}px)`,
      height: "57px",
      background: "#FFFFFF",
      borderBottom: "1px solid #E6E7EC",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      transition: "left 0.25s, width 0.25s",
      zIndex: 1030,
    }}
  >
    <div className="container-fluid d-flex justify-content-between align-items-center px-3">

      {/* Page Title */}
      <span
        className="fw-semibold"
        style={{
          color: "#2B2D42",
          borderBottom: "2px solid #FFF6D6",
          paddingBottom: "2px"
        }}
      >
        {window.location.pathname.split("/")[1]?.charAt(0).toUpperCase() +
          window.location.pathname.split("/")[1].slice(1) ||
          "Dashboard"}
      </span>

      {/* User Menu */}
      <div className="dropdown">

        <button
          className="btn d-flex align-items-center gap-2 rounded-pill px-3"
          type="button"
          data-bs-toggle="dropdown"
          style={{
            background: "#F3F4F8",
            color: "#2B2D42",
            border: "none",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e)=>{
            e.currentTarget.style.background="#F1EFFF";
            e.currentTarget.style.color="#7C6CF2";
          }}
          onMouseLeave={(e)=>{
            e.currentTarget.style.background="#F3F4F8";
            e.currentTarget.style.color="#2B2D42";
          }}
        >

          {/* Avatar */}
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
            style={{
              width: "28px",
              height: "28px",
              fontSize: "13px",
              background: "#7C6CF2",
              color: "#F1EFFF"
              
            }}
          >
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>

          <span className="fw-medium">
            {user?.username || "User"}
          </span>

        </button>

        {/* Dropdown */}
        <ul
          className="dropdown-menu dropdown-menu-end mt-2 border-0 shadow-sm"
          style={{
            borderRadius: "12px",
            padding: "6px"
          }}
        >

          <li>
            <Link
              className="dropdown-item rounded-3"
              to="/profile"
            >
              Profile
            </Link>
          </li>

          <li>
            <Link
              className="dropdown-item rounded-3"
              to="/manage-users"
            >
              Manage Users
            </Link>
          </li>

          <li>
            <Link 
            className="dropdown-item rounded-3"
            to="/manage-payments"
            >
              Payments
            </Link>
          </li>

          <li><hr className="dropdown-divider" /></li>

          <li>
            <button
              className="dropdown-item rounded-3"
              type="button"
              style={{ color: "#EF4444" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>

        </ul>

      </div>
    </div>
  </nav>
);

}

export default UserHeader;

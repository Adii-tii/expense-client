import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useSelector, useDispatch } from "react-redux";
import { CLEAR_USER } from "../redux/user/action.js";

function UserHeader({ sidebarCollapsed }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userDetails);
  const navigate = useNavigate();

  const sidebarWidth = sidebarCollapsed ? 60 : 200;

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
      className="navbar bg-white border-bottom position-fixed top-0"
      style={{
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
        height: "62px",
        transition: "left 0.25s, width 0.25s",
        zIndex: 1030,
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center px-3">
        <span className="fw-medium">Dashboard</span>

        <div className="dropdown">
          <button
            className="btn btn-light border d-flex align-items-center gap-2"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div
              className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
              style={{ width: "28px", height: "28px", fontSize: "13px" }}
            >
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="fw-medium">
              {user?.username || "User"}
            </span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end mt-2">
            <li>
              <Link className="dropdown-item" to="/profile">
                Profile
              </Link>
            </li>
            <li>
              <button
                className="dropdown-item text-danger"
                type="button"
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

import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.userDetails);

  const width = collapsed ? "70px" : "220px";

  const menuItems = [
    ["dashboard", "bi-grid", "Dashboard"],
    ["expenses", "bi-receipt", "Expenses"],
    ["groups", "bi-people", "Groups"],
    ["balances", "bi-wallet2", "Balances"],
    ["transactions", "bi-cash", "Transactions"]
  ];

  const active = location.pathname.split("/")[1] || "dashboard";

  return (
    <div
      className="position-fixed top-0 start-0 d-flex flex-column"
      style={{
        width,
        height: "100vh",
        background: "#FFFFFF",
        borderRight: "1px solid #E6E7EC",
        transition: "width 0.25s",
        zIndex: 1000
      }}
    >

      {/* ===== HEADER ===== */}
      <div className="px-3 py-2  border-bottom d-flex align-items-center justify-content-between" style={{height: "55px" }}>
        {!collapsed && (
          <span className="fw-semibold" style={{ color: "#2B2D42"}}>
            Expense
          </span>
        )}

        <div
          onClick={() => setCollapsed(!collapsed)}
          className="d-flex align-items-center justify-content-center"
          style={{
            width: "34px",
            borderRadius: "50%",
            cursor: "pointer",
            color: "#5F6368"
          }}
        >
          <i className={`bi ${collapsed ? "bi-list" : "bi-layout-sidebar"}`} />
        </div>
      </div>

      {/* ===== MENU ===== */}
      <ul className="nav flex-column mt-3 flex-grow-1 px-2">
        {menuItems.map(([key, icon, label]) => {
          const isActive = active === key;

          return (
            <li key={key} className="nav-item mb-1">
              <button
                className="w-100 d-flex align-items-center border-0 bg-transparent position-relative"
                style={{
                  padding: "8px",
                  borderRadius: collapsed ? "999px" : "12px",
                  background: isActive ? "#F1EFFF" : "transparent",
                  transition: "all 0.2s ease"
                }}
                onClick={() => navigate(`/${key}`)}
              >

                {!collapsed && isActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: "-6px",
                      height: "60%",
                      width: "4px",
                      borderRadius: "4px",
                      background: "#7C6CF2"
                    }}
                  />
                )}

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "999px",
                    background: collapsed && isActive ? "#F1EFFF" : "transparent",
                    color: isActive ? "#7C6CF2" : "#353839"
                  }}
                >
                  <i className={`bi ${icon}`} />
                </div>

                {!collapsed && (
                  <span
                    className="ms-2 fw-medium"
                    style={{ color: isActive ? "#7C6CF2" : "#2B2D42" }}
                  >
                    {label}
                  </span>
                )}
              </button>
            </li>
          );
        })}

        <hr className="my-3" />

        {/* ===== SETTINGS ===== */}
        <li className="nav-item">
          <button
            className="w-100 d-flex align-items-center border-0 bg-transparent"
            style={{
              padding: "8px",
              borderRadius: collapsed ? "999px" : "12px",
              background: active === "settings" ? "#F1EFFF" : "transparent"
            }}
            onClick={() => navigate("/settings")}
          >
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "999px",
                background:
                  collapsed && active === "settings" ? "#F1EFFF" : "transparent",
                color: active === "settings" ? "#7C6CF2" : "#353839"
              }}
            >
              <i className="bi bi-gear" />
            </div>

            {!collapsed && (
              <span className="ms-2 fw-medium">Settings</span>
            )}
          </button>
        </li>
      </ul>

      {/* ===== ACCOUNT ===== */}
      <div className="border-top px-3 py-3 d-flex align-items-center">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
          style={{
            width: "38px",
            height: "38px",
            background: "#F1EFFF",
            color: "#7C6CF2"
          }}
        >
          {user.username?.[0]?.toUpperCase() || "U"}
        </div>

        {!collapsed && (
          <span className="ms-2 fw-medium">{user.username}</span>
        )}
      </div>
    </div>
  );
}

export default Sidebar;

import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ collapsed, setCollapsed, isMobile, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.userDetails);

  const width = isMobile ? "220px" : (collapsed ? "70px" : "220px");
  const left = isMobile ? (mobileOpen ? "0px" : "-220px") : "0px";

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
      className="position-fixed d-flex flex-column"
      style={{
        top: "0",
        left,
        bottom: "0",
        width,
        height: "100vh",
        background: "#131315",
        border: "none",
        borderRight: "1px solid #1E1E20",
        boxShadow: "none",
        transition: "width 0.25s, left 0.25s",
        zIndex: 1040
      }}
    >

      {/* ===== HEADER ===== */}
      <div className="px-3 py-2 d-flex align-items-center justify-content-between" style={{ height: "55px", borderBottom: "1px solid #1E1E20" }}>
        {(!collapsed || isMobile) && (
          <span className="fw-bold" style={{ color: "#FFFFFF", fontSize: "16px", letterSpacing: "-0.3px" }}>
            Expense
          </span>
        )}

        <div
          onClick={() => isMobile ? setMobileOpen(false) : setCollapsed(!collapsed)}
          className="d-flex align-items-center justify-content-center"
          style={{
            width: "32px", height: "32px",
            borderRadius: "8px",
            cursor: "pointer",
            color: "#4A4A52",
            transition: "color 0.15s, background 0.15s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#4A4A52";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <i className={`bi ${isMobile ? "bi-x" : (collapsed ? "bi-list" : "bi-layout-sidebar")}`} style={{ fontSize: isMobile ? "22px" : "16px" }} />
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
                  padding: collapsed ? "10px" : "10px 12px",
                  borderRadius: "10px",
                  background: isActive ? "rgba(157, 92, 255, 0.10)" : "transparent",
                  color: isActive ? "#9D5CFF" : "#5A5A62",
                  transition: "all 0.15s ease",
                  gap: "12px",
                  justifyContent: collapsed ? "center" : "flex-start"
                }}
                onClick={() => {
                  navigate(`/${key}`);
                  if (isMobile) setMobileOpen(false);
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    e.currentTarget.style.color = "#A1A1AA";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#5A5A62";
                  }
                }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div style={{
                    position: "absolute",
                    left: "-8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "20px",
                    borderRadius: "0 2px 2px 0",
                    background: "#9D5CFF"
                  }} />
                )}

                <i className={`bi ${icon}`} style={{ fontSize: "17px" }} />

                {!collapsed && (
                  <span
                    className="fw-medium"
                    style={{ fontSize: "14px" }}
                  >
                    {label}
                  </span>
                )}
              </button>
            </li>
          );
        })}

        <hr className="my-3" style={{ borderColor: "#1E1E20", opacity: 1 }} />

        {/* ===== SETTINGS ===== */}
        <li className="nav-item">
          <button
            className="w-100 d-flex align-items-center border-0 bg-transparent position-relative"
            style={{
              padding: collapsed ? "10px" : "10px 12px",
              borderRadius: "10px",
              background: active === "settings" ? "rgba(157, 92, 255, 0.10)" : "transparent",
              color: active === "settings" ? "#9D5CFF" : "#5A5A62",
              transition: "all 0.15s ease",
              gap: "12px",
              justifyContent: collapsed ? "center" : "flex-start"
            }}
            onClick={() => {
              navigate("/settings");
              if (isMobile) setMobileOpen(false);
            }}
            onMouseEnter={(e) => {
              if (active !== "settings") {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                e.currentTarget.style.color = "#A1A1AA";
              }
            }}
            onMouseLeave={(e) => {
              if (active !== "settings") {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#5A5A62";
              }
            }}
          >
            {active === "settings" && (
              <div style={{
                position: "absolute", left: "-8px", top: "50%",
                transform: "translateY(-50%)", width: "3px", height: "20px",
                borderRadius: "0 2px 2px 0", background: "#9D5CFF"
              }} />
            )}

            <i className="bi bi-gear" style={{ fontSize: "17px" }} />

            {!collapsed && (
              <span className="fw-medium" style={{ fontSize: "14px" }}>
                Settings
              </span>
            )}
          </button>
        </li>
      </ul>

      {/* ===== ACCOUNT ===== */}
      <div className="px-3 py-3 d-flex align-items-center" style={{ borderTop: "1px solid #1E1E20", gap: "10px" }}>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
          style={{
            width: "34px",
            height: "34px",
            background: "rgba(157, 92, 255, 0.12)",
            color: "#9D5CFF",
            fontSize: "13px",
            flexShrink: 0
          }}
        >
          {user.username?.[0]?.toUpperCase() || "U"}
        </div>

        {!collapsed && (
          <span className="fw-medium" style={{ color: "#FFFFFF", fontSize: "14px" }}>{user.username}</span>
        )}
      </div>
    </div>
  );
}

export default Sidebar;

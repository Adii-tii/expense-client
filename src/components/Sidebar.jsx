import { useState } from "react";

function Sidebar({ collapsed, setCollapsed }) {
  const [active, setActive] = useState("dashboard");

  const width = collapsed ? "60px" : "200px";

  const navItem = (key) =>
    `
    w-100 d-flex align-items-center
    ${collapsed ? "justify-content-center" : ""}
    px-3 py-2 text-dark border-0 bg-transparent
    ${active === key ? "bg-light border-start border-3 border-dark fw-medium" : ""}
    `;

  return (
    <div
      className="bg-white border-end position-fixed top-0 start-0 d-flex flex-column"
      style={{ width, height: "100vh", transition: "width 0.25s" }}
    >
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom">
        {!collapsed && <span className="fw-semibold">Expense</span>}
        <button
          className="btn btn-sm btn-outline-dark p-1"
          onClick={() => setCollapsed(!collapsed)}
        >
          <i className="bi bi-list"></i>
        </button>
      </div>

      {/* Menu */}
      <ul className="nav flex-column mt-2 flex-grow-1">
        {[
          ["dashboard", "bi-grid", "Dashboard"],
          ["expenses", "bi-receipt", "Expenses"],
          ["groups", "bi-people", "Groups"],
          ["balances", "bi-wallet2", "Balances"],
          ["activity", "bi-clock-history", "Activity"],
        ].map(([key, icon, label]) => (
          <li className="nav-item" key={key}>
            <button
              className={navItem(key)}
              onClick={() => setActive(key)}
            >
              <i className={`bi ${icon} ${collapsed ? "" : "me-3"}`}></i>
              {!collapsed && <span>{label}</span>}
            </button>
          </li>
        ))}

        <hr className="my-3" />

        <li className="nav-item">
          <button
            className={navItem("settings")}
            onClick={() => setActive("settings")}
          >
            <i className={`bi bi-gear ${collapsed ? "" : "me-3"}`}></i>
            {!collapsed && <span>Settings</span>}
          </button>
        </li>
      </ul>

      {/* Account Section */}
      <div className="border-top">
        <button
          className={`
            w-100 d-flex align-items-center
            ${collapsed ? "justify-content-center" : "justify-content-between"}
            px-3 py-3 border-0 bg-transparent
            ${active === "account" ? "bg-light border-start border-3 border-dark" : ""}
          `}
          onClick={() => setActive("account")}
        >
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px", fontSize: "13px" }}
            >
              U
            </div>
            {!collapsed && <span className="ms-3 fw-medium">User Name</span>}
          </div>
          {!collapsed && <i className="bi bi-chevron-down"></i>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

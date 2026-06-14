import { useState } from "react";
import Sidebar from "./Sidebar";
import UserHeader from "./UserHeader";

function UserLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 70 : 220;

  return (
    <div className="min-vh-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <UserHeader sidebarCollapsed={sidebarCollapsed} />

      {/* Main content */}
      <main
        style={{
          marginLeft: `${sidebarWidth}px`,
          paddingTop: "72px", // topbar height (56px) + gap (16px) = 72px
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "24px",
          transition: "margin-left 0.25s",
        }}
        className="min-vh-100"
      >
        {children}
      </main>
    </div>
  );
}

export default UserLayout;

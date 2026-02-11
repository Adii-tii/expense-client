import { useState } from "react";
import Sidebar from "./Sidebar";
import UserHeader from "./userHeader";

function UserLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  
  const sidebarWidth = sidebarCollapsed ? 45 : 195;
  const headerHeight = 33; // Height of the header in pixels

  return (
    <div className="bg-light">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <UserHeader sidebarCollapsed={sidebarCollapsed} />

      {/* Main content */}
      <main
        style={{
          marginLeft: sidebarWidth,
          marginTop: headerHeight,
          transition: "margin-left 0.25s",
        }}
        className="bg-light min-vh-100 p-4"
      >
        {children}
      </main>
    </div>
  );
}

export default UserLayout;

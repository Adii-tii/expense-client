import { useState } from "react";
import Sidebar from "./Sidebar";
import UserHeader from "./userHeader";

function UserLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  
  const sidebarWidth = sidebarCollapsed ? 60 : 200;
  const headerHeight = 56;

  return (
    <>
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <UserHeader sidebarCollapsed={sidebarCollapsed} />

      {/* Main content */}
      <main
        style={{
          marginLeft: sidebarWidth,
          paddingTop: headerHeight,
          transition: "margin-left 0.25s",
        }}
        className="bg-light min-vh-100 p-4"
      >
        {children}
      </main>
    </>
  );
}

export default UserLayout;

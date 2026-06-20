import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import UserHeader from "./UserHeader";

function UserLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = isMobile ? 0 : (sidebarCollapsed ? 70 : 220);

  return (
    <div className="min-vh-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <UserHeader
        sidebarCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Mobile Backdrop Overlay */}
      {isMobile && mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(2px)",
            zIndex: 1035, // sits between Header (1030) and Sidebar (1040)
            transition: "opacity 0.25s ease"
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        style={{
          marginLeft: `${sidebarWidth}px`,
          paddingTop: "72px",
          paddingLeft: isMobile ? "16px" : "24px",
          paddingRight: isMobile ? "16px" : "24px",
          paddingBottom: "24px",
          transition: "margin-left 0.25s, padding 0.25s",
        }}
        className="min-vh-100"
      >
        {children}
      </main>
    </div>
  );
}

export default UserLayout;

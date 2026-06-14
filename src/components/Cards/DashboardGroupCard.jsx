import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function DashboardGroupCard({ group }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.userDetails);

  if (!group) return null;

  const members = group.memberEmail || [];
  const membersCount = members.length;
  const visibleMembers = members.slice(0, 3);
  const extraMembers = Math.max(membersCount - 3, 0);

  // Dynamic Icon & Background selection based on Group Name keywords
  const getGroupStyle = (name) => {
    const lowercaseName = name.toLowerCase();
    
    if (
      lowercaseName.includes("trip") ||
      lowercaseName.includes("travel") ||
      lowercaseName.includes("vacation") ||
      lowercaseName.includes("flight") ||
      lowercaseName.includes("europe") ||
      lowercaseName.includes("road")
    ) {
      return {
        icon: "bi-airplane",
        bg: "linear-gradient(135deg, rgba(142, 84, 255, 0.10), rgba(40, 13, 95, 0.18))",
        accent: "#9D5CFF"
      };
    }
    if (
      lowercaseName.includes("apartment") ||
      lowercaseName.includes("flat") ||
      lowercaseName.includes("home") ||
      lowercaseName.includes("house") ||
      lowercaseName.includes("room") ||
      lowercaseName.includes("rent") ||
      lowercaseName.includes("4b")
    ) {
      return {
        icon: "bi-building",
        bg: "linear-gradient(135deg, rgba(255, 208, 47, 0.10), rgba(77, 58, 0, 0.18))",
        accent: "#FFD700"
      };
    }
    if (
      lowercaseName.includes("food") ||
      lowercaseName.includes("cafe") ||
      lowercaseName.includes("dinner") ||
      lowercaseName.includes("lunch") ||
      lowercaseName.includes("drink") ||
      lowercaseName.includes("restaurant") ||
      lowercaseName.includes("grocery")
    ) {
      return {
        icon: "bi-cup-hot",
        bg: "linear-gradient(135deg, rgba(245, 158, 11, 0.10), rgba(180, 83, 9, 0.18))",
        accent: "#F59E0B"
      };
    }
    if (
      lowercaseName.includes("shopping") ||
      lowercaseName.includes("gift") ||
      lowercaseName.includes("clothes") ||
      lowercaseName.includes("buy")
    ) {
      return {
        icon: "bi-bag",
        bg: "linear-gradient(135deg, rgba(236, 72, 153, 0.10), rgba(79, 70, 229, 0.18))",
        accent: "#EC4899"
      };
    }
    if (
      lowercaseName.includes("bill") ||
      lowercaseName.includes("utility") ||
      lowercaseName.includes("wifi") ||
      lowercaseName.includes("internet") ||
      lowercaseName.includes("power")
    ) {
      return {
        icon: "bi-receipt",
        bg: "linear-gradient(135deg, rgba(99, 102, 241, 0.10), rgba(17, 32, 42, 0.18))",
        accent: "#6366F1"
      };
    }
    // Default style
    return {
      icon: "bi-wallet2",
      bg: "linear-gradient(135deg, rgba(161, 161, 170, 0.08), rgba(26, 32, 44, 0.18))",
      accent: "#A1A1AA"
    };
  };

  const style = getGroupStyle(group.name);

  // Compute the current user's debt status
  const userBalance = group.balances?.find((b) => b.userEmail === user?.email);
  const net = userBalance ? Number(userBalance.netBalance) : 0;
  
  let balanceText = "Settled";
  if (net > 0) {
    balanceText = `You are owed ₹${net.toFixed(0)}`;
  } else if (net < 0) {
    balanceText = `You owe ₹${Math.abs(net).toFixed(0)}`;
  }

  return (
    <div
      onClick={() => navigate(`/groups/${group._id}`, { state: { group } })}
      className="d-flex flex-column rounded-4 overflow-hidden"
      style={{
        background: "#1B1B1D",
        border: "1px solid #28282B",
        cursor: "pointer",
        height: "250px"
      }}
    >
      {/* Complete Header Banner */}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          height: "110px",
          background: group.thumbnail ? `url(${group.thumbnail})` : style.bg,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative"
        }}
      >
        {/* Overlay to ensure contrast/glassmorphic dark effect if thumbnail is present */}
        {group.thumbnail && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.45)"
            }}
          />
        )}

        {/* Group Icon (Airplane / House / Tag) */}
        {!group.thumbnail && (
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "56px",
              height: "56px",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(4px)"
            }}
          >
            <i className={`bi ${style.icon}`} style={{ fontSize: "26px", color: style.accent }} />
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-3 d-flex flex-column justify-content-between flex-grow-1">
        <div>
          {/* Title */}
          <h5 className="fw-bold text-white mb-1" style={{ fontSize: "18px", letterSpacing: "-0.3px" }}>
            {group.name}
          </h5>

          {/* Subtitle details: Members count & Debt Status */}
          <div className="text-muted small fw-medium">
            {membersCount} {membersCount === 1 ? "Member" : "Members"} • {balanceText}
          </div>
        </div>

        {/* Member Avatars */}
        <div className="d-flex align-items-center mt-3">
          {visibleMembers.map((email, idx) => (
            <div
              key={idx}
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "28px",
                height: "28px",
                fontSize: "10px",
                marginLeft: idx === 0 ? 0 : "-8px",
                background: "rgba(157, 92, 255, 0.15)",
                color: "#9D5CFF",
                border: "2px solid #1B1B1D"
              }}
            >
              {email[0].toUpperCase()}
            </div>
          ))}
          {extraMembers > 0 && (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: "28px",
                height: "28px",
                fontSize: "10px",
                marginLeft: "-8px",
                background: "#39393B",
                color: "#A1A1AA",
                border: "2px solid #1B1B1D"
              }}
            >
              +{extraMembers}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardGroupCard;

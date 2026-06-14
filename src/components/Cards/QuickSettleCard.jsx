import React from "react";

function QuickSettleCard({ debt, onSettle }) {
  if (!debt) return null;

  /* ===== THEME ===== */
  const PRIMARY = "#9D5CFF";
  const PRIMARY_SOFT = "rgba(157, 92, 255, 0.15)";
  const TEXT_MAIN = "#FFFFFF";
  const TEXT_MUTED = "#A1A1AA";
  const RED = "#EF4444";

  const getInitial = (email) => email?.[0]?.toUpperCase() || "?";

  return (
    <div
      style={{
        background: "#1B1B1D",
        border: "1px solid #28282B",
        borderRadius: "16px",
        padding: "10px 16px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        transition: "all 0.2s ease",
        cursor: "default"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.background = "#242427";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.background = "#1B1B1D";
      }}
    >
      <div className="d-flex align-items-center justify-content-between w-100">
        {/* LEFT SIDE: AVATAR AND TEXT */}
        <div className="d-flex align-items-center gap-3">
          {/* AVATAR */}
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: PRIMARY_SOFT,
              color: PRIMARY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "15px"
            }}
          >
            {getInitial(debt.to)}
          </div>

          {/* TEXT BLOCK */}
          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: TEXT_MAIN
              }}
            >
              You owe {debt.to.split("@")[0]}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: TEXT_MUTED,
                marginTop: "0px"
              }}
            >
              {debt.groupName}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: AMOUNT AND BUTTON */}
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              fontSize: "14px",
              fontWeight: 800,
              color: RED
            }}
          >
            ₹{Number(debt.amount || 0).toFixed(2)}
          </div>

          <button
            className="btn d-flex align-items-center justify-content-center fw-bold"
            style={{
              height: "28px",
              borderRadius: "14px",
              background: "#FFD700",
              color: "#131315",
              border: "none",
              padding: "0 12px",
              fontSize: "12px",
              transition: "all 0.2s ease"
            }}
            onClick={() => onSettle?.(debt)}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "none";
            }}
          >
            Settle
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickSettleCard;

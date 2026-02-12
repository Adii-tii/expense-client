    import React from "react";

    function QuickSettleCard({ debt, onSettle }) {

    if (!debt) return null;

    /* ===== THEME ===== */

    const PRIMARY = "#7C6CF2";
    const PRIMARY_SOFT = "#F1EFFF";
    const TEXT_MAIN = "#111827";
    const TEXT_MUTED = "#6B7280";
    const BORDER = "#E5E7EB";
    const RED = "#DC2626";

    const getInitial = (email) =>
        email?.[0]?.toUpperCase() || "?";

    return (
        <div
        style={{
            background: "#FFFFFF",
            border: `1px solid ${BORDER}`,
            borderRadius: "16px",
            padding: "14px 16px"
        }}
        >

        <div className="d-flex justify-content-between align-items-center">

            {/* LEFT SIDE */}
            <div className="d-flex align-items-center gap-3">

            {/* AVATAR */}
            <div
                style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: PRIMARY_SOFT,
                color: PRIMARY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700
                }}
            >
                {getInitial(debt.to)}
            </div>

            {/* TEXT BLOCK */}
            <div>

                {/* GROUP NAME */}
                <div
                style={{
                    fontSize: "13px",
                    color: TEXT_MUTED
                }}
                >
                {debt.groupName}
                </div>

                {/* DEBT TEXT */}
                <div
                style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: TEXT_MAIN
                }}
                >
                You owe {debt.to}
                </div>

            </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="text-end">

            <div
                style={{
                fontSize: "15px",
                fontWeight: 600,
                color: RED
                }}
            >
                ₹{Number(debt.amount || 0).toFixed(2)}
            </div>

            <button
                className="btn btn-sm mt-1"
                style={{
                background: PRIMARY,
                color: "white",
                borderRadius: "999px",
                padding: "4px 14px"
                }}
                onClick={() => onSettle?.(debt)}
            >
                Settle
            </button>

            </div>

        </div>

        </div>
    );
    }

    export default QuickSettleCard;

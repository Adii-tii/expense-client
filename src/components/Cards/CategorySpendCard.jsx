import React, { useState } from "react";

/* ===== CATEGORY ICON MAP ===== */

const CATEGORY_ICONS = {
    Food: "bi-cup-hot",
    Travel: "bi-airplane",
    Shopping: "bi-bag",
    Bills: "bi-receipt",
    Entertainment: "bi-film",
    Health: "bi-heart-pulse",
    Other: "bi-three-dots"
};

/* Optional accent colors per category */
const CATEGORY_COLORS = {
    Food: "#FFD700",          // Vibrant Gold Yellow
    Travel: "#9D5CFF",        // Brand Purple
    Shopping: "#DFD6FF",      // Soft Lavender/Violet
    Bills: "#7C6CF2",         // Deep Indigo Purple
    Entertainment: "#FFB300", // Warm Amber Yellow
    Health: "#C084FC",        // Medium Orchid Purple
    Other: "#FDE047"          // Light Bright Yellow
};

function CategorySpendCard({ categoryData, onClick }) {

    const [hover, setHover] = useState(false);

    if (!categoryData) return null;

    const PRIMARY = "#9D5CFF";
    const PRIMARY_SOFT = "rgba(157, 92, 255, 0.15)";
    const TEXT_MAIN = "#FFFFFF";
    const TEXT_MUTED = "#A1A1AA";
    const BORDER = "#28282B";

    const { category, totalAmount, expenses } = categoryData;

    const icon = CATEGORY_ICONS[category] || "bi-tag";
    const accent = CATEGORY_COLORS[category] || PRIMARY;

    return (
        <div
            onClick={() => onClick?.(categoryData)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                background: "#1B1B1D",
                border: `1px solid ${BORDER}`,
                borderBottomRightRadius: "15px",
                borderTopRightRadius: "15px",
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.18s ease",
                transform: hover ? "translateY(-3px)" : "translateY(0px)",
                boxShadow: "none",
                position: "relative",
                overflow: "hidden"
            }}
        >

            {/* Accent Strip */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    background: accent
                }}
            />

            <div className="d-flex justify-content-between align-items-center">

                {/* LEFT SIDE */}
                <div className="d-flex align-items-center gap-3">

                    {/* ICON */}
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: PRIMARY_SOFT,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "0.2s"
                        }}
                    >
                        <i
                            className={`bi ${icon}`}
                            style={{
                                fontSize: "19px",
                                color: accent
                            }}
                        />
                    </div>

                    {/* TEXT */}
                    <div>

                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: 700,
                                color: TEXT_MAIN
                            }}
                        >
                            {category}
                        </div>

                        <div
                            style={{
                                fontSize: "12px",
                                color: TEXT_MUTED
                            }}
                        >
                            {(expenses?.length || 0)} expense
                            {(expenses?.length || 0) !== 1 && "s"}
                        </div>

                    </div>

                </div>

                {/* AMOUNT */}
                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: TEXT_MAIN,
                        letterSpacing: "0.3px"
                    }}
                >
                    ₹{Number(totalAmount || 0).toFixed(2)}
                </div>

            </div>

        </div>
    );
}

export default CategorySpendCard;

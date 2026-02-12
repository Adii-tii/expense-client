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
    Food: "#F59E0B",
    Travel: "#0EA5E9",
    Shopping: "#EC4899",
    Bills: "#6366F1",
    Entertainment: "#8B5CF6",
    Health: "#EF4444",
    Other: "#6B7280"
};

function CategorySpendCard({ categoryData, onClick }) {

    const [hover, setHover] = useState(false);

    if (!categoryData) return null;

    const PRIMARY = "#7C6CF2";
    const PRIMARY_SOFT = "#F1EFFF";
    const TEXT_MAIN = "#111827";
    const TEXT_MUTED = "#6B7280";
    const BORDER = "#E5E7EB";

    const { category, totalAmount, expenses } = categoryData;

    const icon = CATEGORY_ICONS[category] || "bi-tag";
    const accent = CATEGORY_COLORS[category] || PRIMARY;

    return (
        <div
            onClick={() => onClick?.(categoryData)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                border: `1px solid ${BORDER}`,
                borderBottomRightRadius: "15px",
                borderTopRightRadius: "15px",
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.18s ease",
                transform: hover ? "translateY(-3px)" : "translateY(0px)",
                boxShadow: hover
                    ? "0 6px 18px rgba(0,0,0,0.08)"
                    : "0 2px 6px rgba(0,0,0,0.04)",
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

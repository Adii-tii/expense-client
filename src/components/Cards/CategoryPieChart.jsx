import React, { useState, useRef } from "react";

const CATEGORY_COLORS = {
  Food: "#FFD700",          // Vibrant Gold Yellow
  Travel: "#9D5CFF",        // Brand Purple
  Shopping: "#DFD6FF",      // Soft Lavender/Violet
  Bills: "#7C6CF2",         // Deep Indigo Purple
  Entertainment: "#FFB300", // Warm Amber Yellow
  Health: "#C084FC",        // Medium Orchid Purple
  Other: "#FDE047"          // Light Bright Yellow
};

const CATEGORY_ICONS = {
  Food: "bi-cup-hot",
  Travel: "bi-airplane",
  Shopping: "bi-bag",
  Bills: "bi-receipt",
  Entertainment: "bi-film",
  Health: "bi-heart-pulse",
  Other: "bi-three-dots"
};

function CategoryPieChart({ categories }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    category: "",
    amount: 0,
    percent: 0,
    color: ""
  });

  if (!categories || categories.length === 0) {
    return (
      <div className="text-muted text-center py-5">
        Start by creating an expense
      </div>
    );
  }

  const totalAmountSum = categories.reduce((sum, cat) => sum + Number(cat.totalAmount || 0), 0);

  function getCoordinatesForPercent(percent) {
    const angle = (2 * Math.PI * percent) - (Math.PI / 2);
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return [x, y];
  }

  let cumulativePercent = 0;

  const slices = categories.map((cat) => {
    const amount = Number(cat.totalAmount || 0);
    const percent = amount / (totalAmountSum || 1);
    const startPercent = cumulativePercent;
    const endPercent = cumulativePercent + percent;
    cumulativePercent = endPercent;

    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);

    const largeArcFlag = percent > 0.5 ? 1 : 0;

    const r = 100;
    const startXScaled = startX * r;
    const startYScaled = startY * r;
    const endXScaled = endX * r;
    const endYScaled = endY * r;

    const pathData = [
      `M 0 0`,
      `L ${startXScaled} ${startYScaled}`,
      `A ${r} ${r} 0 ${largeArcFlag} 1 ${endXScaled} ${endYScaled}`,
      `Z`
    ].join(' ');

    return {
      pathData,
      category: cat.category,
      amount,
      percent: percent * 100,
      color: CATEGORY_COLORS[cat.category] || "#9D5CFF"
    };
  });

  return (
    <div
      ref={containerRef}
      className="d-flex flex-column align-items-center gap-3 py-2 position-relative"
    >
      
      {/* SVG Donut Chart */}
      <div className="position-relative" style={{ width: "260px", height: "260px" }}>
        <svg
          viewBox="-110 -110 220 220"
          style={{ width: "100%", height: "100%" }}
        >
          {slices.map((slice, idx) => {
            const isSingle = slice.percent >= 99.9;
            const isHovered = hoveredSlice === slice.category;

            const handleMouseEnter = () => {
              setHoveredSlice(slice.category);
            };

            const handleMouseMove = (e) => {
              if (!containerRef.current) return;
              const rect = containerRef.current.getBoundingClientRect();
              setTooltip({
                visible: true,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                category: slice.category,
                amount: slice.amount,
                percent: slice.percent,
                color: slice.color
              });
            };

            const handleMouseLeave = () => {
              setHoveredSlice(null);
              setTooltip((prev) => ({ ...prev, visible: false }));
            };

            return isSingle ? (
              <circle
                key={idx}
                cx="0"
                cy="0"
                r="100"
                fill={slice.color}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transition: "opacity 0.2s ease",
                  opacity: isHovered ? 1 : 0.9,
                  cursor: "pointer"
                }}
              />
            ) : (
              <path
                key={idx}
                d={slice.pathData}
                fill={slice.color}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transition: "opacity 0.2s ease",
                  opacity: isHovered ? 1 : 0.9,
                  cursor: "pointer"
                }}
              />
            );
          })}
          {/* Inner cutout for donut chart */}
          <circle cx="0" cy="0" r="65" fill="#1B1B1D" />
        </svg>

        {/* Center Text inside Donut */}
        <div
          className="position-absolute d-flex flex-column align-items-center justify-content-center text-center"
          style={{
            inset: 0,
            pointerEvents: "none"
          }}
        >
          <span className="text-muted small fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
            {hoveredSlice ? hoveredSlice.toUpperCase() : "TOTAL SPENT"}
          </span>
          <span className="fw-bold text-white mt-1" style={{ fontSize: hoveredSlice ? "15px" : "18px" }}>
            ₹
            {hoveredSlice
              ? slices.find((s) => s.category === hoveredSlice)?.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })
              : totalAmountSum.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>



      {/* Floating Tooltip */}
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            left: `${tooltip.x + 12}px`,
            top: `${tooltip.y + 12}px`,
            backgroundColor: "rgba(27, 27, 29, 0.95)",
            border: `1px solid rgba(157, 92, 255, 0.35)`,
            borderRadius: "8px",
            padding: "8px 12px",
            color: "#FFFFFF",
            fontSize: "12px",
            pointerEvents: "none",
            zIndex: 1000,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            transition: "left 0.05s ease, top 0.05s ease"
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-1">
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: tooltip.color,
                display: "inline-block"
              }}
            />
            <span className="fw-bold">{tooltip.category}</span>
          </div>
          <div>
            <span className="text-white-50">Amount: </span>
            <span className="fw-semibold">₹{tooltip.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
          </div>
          <div>
            <span className="text-white-50">Percent: </span>
            <span className="fw-semibold text-white">{tooltip.percent.toFixed(1)}%</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default CategoryPieChart;

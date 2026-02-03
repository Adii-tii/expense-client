import { useState } from "react";

function SpendingTrends() {
  const data = [
    { category: "Food", amount: 9200 },
    { category: "Travel", amount: 14500 },
    { category: "Rent", amount: 22000 },
    { category: "Shopping", amount: 6700 },
    { category: "Utilities", amount: 4300 },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const maxAmount = Math.max(...data.map(d => d.amount));

  // Predefined clustered positions (clean & intentional)
  const positions = [
    { x: 250, y: 140 }, // center (largest)
    { x: 150, y: 120 },
    { x: 350, y: 120 },
    { x: 180, y: 220 },
    { x: 320, y: 220 },
  ];

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header bg-white border-bottom">
        <span className="fw-medium">Spending Trends</span>
      </div>

      {/* Body */}
      <div className="card-body">
        <svg viewBox="0 0 500 300" width="100%" height="300">
          {data.map((item, index) => {
            const radius = (item.amount / maxAmount) * 55 + 18;
            const { x, y } = positions[index];
            const isHovered = hoveredIndex === index;

            return (
              <g
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Bubble */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? radius * 1.08 : radius}
                  fill="#f8f9fa"
                  stroke="#212529"
                  strokeWidth={isHovered ? 2 : 1}
                  style={{ transition: "all 0.2s ease" }}
                />

                {/* Tooltip on hover */}
                {isHovered && (
                  <>
                    <rect
                      x={x - 55}
                      y={y - radius - 38}
                      width="110"
                      height="28"
                      rx="6"
                      fill="#212529"
                    />
                    <text
                      x={x}
                      y={y - radius - 20}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#ffffff"
                      fontWeight="500"
                    >
                      {item.category} • ₹{item.amount}
                    </text>
                  </>
                )}

                {/* Amount (always visible) */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="#212529"
                  fontWeight="500"
                >
                  ₹{item.amount}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default SpendingTrends;

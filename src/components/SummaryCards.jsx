import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function SummaryCards({ onSettle }) {
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalOwe: 0,
    totalOwed: 0,
    totalSpendings: 0
  });

  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `${serverEndpoint}/dashboard/summary`,
        { withCredentials: true }
      );
      setSummary(res.data);
    } catch (err) {
      console.error("Summary fetch failed", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const fmt = (v) =>
    `₹${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="row g-3">

      {/* ── YOU OWE ── */}
      <div className="col-xl-4 col-md-4 col-sm-12">
        <div
          className="h-100 rounded-4 overflow-hidden position-relative"
          style={{
            background: "linear-gradient(145deg, #FFD02F 0%, #FFC107 100%)",
            padding: "24px",
            minHeight: "140px",
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: "absolute", top: "-30px", right: "-30px",
            width: "120px", height: "120px", borderRadius: "50%",
            background: "rgba(0,0,0,0.04)"
          }} />
          <div style={{
            position: "absolute", bottom: "-20px", right: "40px",
            width: "80px", height: "80px", borderRadius: "50%",
            background: "rgba(0,0,0,0.03)"
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Icon badge + label */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{
                width: "32px", height: "32px", borderRadius: "10px",
                background: "rgba(0,0,0,0.10)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <i className="bi bi-arrow-up-right" style={{ fontSize: "15px", color: "#3A2900" }} />
              </div>
              <span style={{
                fontSize: "12px", fontWeight: 700, color: "#5C4400",
                letterSpacing: "0.5px", textTransform: "uppercase"
              }}>
                You Owe
              </span>
            </div>

            {/* Amount */}
            <div style={{
              fontSize: "34px", fontWeight: 900, color: "#3A2900",
              letterSpacing: "-1px", lineHeight: 1
            }}>
              {fmt(summary.totalOwe)}
            </div>

            {/* Settle button */}
            <button
              onClick={onSettle}
              style={{
                marginTop: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(0, 0, 0, 0.10)",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                color: "#3A2900",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                transition: "background 0.15s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.18)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.10)"}
            >
              <i className="bi bi-wallet2" style={{ fontSize: "14px" }} />
              Settle Up
            </button>
          </div>
        </div>
      </div>

      {/* ── YOU ARE OWED ── */}
      <div className="col-xl-4 col-md-4 col-sm-12">
        <div
          className="h-100 rounded-4 overflow-hidden position-relative"
          style={{
            background: "linear-gradient(145deg, #9D5CFF 0%, #8E54FF 100%)",
            padding: "24px",
            minHeight: "140px",
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: "absolute", top: "-30px", right: "-30px",
            width: "120px", height: "120px", borderRadius: "50%",
            background: "rgba(255,255,255,0.06)"
          }} />
          <div style={{
            position: "absolute", bottom: "-20px", right: "40px",
            width: "80px", height: "80px", borderRadius: "50%",
            background: "rgba(255,255,255,0.04)"
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Icon badge + label */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{
                width: "32px", height: "32px", borderRadius: "10px",
                background: "rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <i className="bi bi-arrow-down-left" style={{ fontSize: "15px", color: "#FFFFFF" }} />
              </div>
              <span style={{
                fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.5px", textTransform: "uppercase"
              }}>
                You Are Owed
              </span>
            </div>

            {/* Amount */}
            <div style={{
              fontSize: "34px", fontWeight: 900, color: "#FFFFFF",
              letterSpacing: "-1px", lineHeight: 1
            }}>
              {fmt(Math.max(summary.totalOwed, 0))}
            </div>

            {/* Subtext */}
            <div style={{
              marginTop: "16px", fontSize: "12px", fontWeight: 600,
              color: "rgba(255,255,255,0.50)"
            }}>
              Outstanding dues to collect
            </div>
          </div>
        </div>
      </div>

      {/* ── TOTAL SPENDINGS ── */}
      <div className="col-xl-4 col-md-4 col-sm-12">
        <div
          className="h-100 rounded-4 overflow-hidden position-relative"
          style={{
            background: "#1B1B1D",
            border: "1px solid #28282B",
            padding: "24px",
            minHeight: "140px",
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: "absolute", top: "-30px", right: "-30px",
            width: "120px", height: "120px", borderRadius: "50%",
            background: "rgba(157, 92, 255, 0.04)"
          }} />
          <div style={{
            position: "absolute", bottom: "-20px", right: "40px",
            width: "80px", height: "80px", borderRadius: "50%",
            background: "rgba(157, 92, 255, 0.03)"
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Icon badge + label */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{
                width: "32px", height: "32px", borderRadius: "10px",
                background: "rgba(157, 92, 255, 0.12)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <i className="bi bi-graph-up-arrow" style={{ fontSize: "15px", color: "#9D5CFF" }} />
              </div>
              <span style={{
                fontSize: "12px", fontWeight: 700, color: "#6B6B72",
                letterSpacing: "0.5px", textTransform: "uppercase"
              }}>
                Total Spendings
              </span>
            </div>

            {/* Amount */}
            <div style={{
              fontSize: "34px", fontWeight: 900, color: "#FFFFFF",
              letterSpacing: "-1px", lineHeight: 1
            }}>
              {fmt(summary.totalSpendings)}
            </div>

            {/* Subtext */}
            <div style={{
              marginTop: "16px", fontSize: "12px", fontWeight: 600,
              color: "#4A4A52"
            }}>
              Aggregated across all groups
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default SummaryCards;

import React from "react";

function GroupSummaryCards({ myBalance = 0, userOwes = 0, userIsOwed = 0, onSettle, balances = [], memberEmails = [], totalSpent = 0 }) {

  const formatMoney = (value) => `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const visibleMembers = memberEmails.slice(0, 3);
  const extraMembers = Math.max(memberEmails.length - 3, 0);

  return (
    <div className="row g-3 px-0 mt-3">

      {/* CARD 1: TOTAL SPENT (Purple background) */}
      <div className="col-xl-4 col-md-6 col-sm-12">
        <div
          className="rounded-4 position-relative overflow-hidden purple-card"
          style={{
            background: "#8E54FF",
            cursor: "default",
            padding: "18px 22px",
            minHeight: "120px",
            borderRadius: "20px"
          }}
        >
          {/* Background SVG Receipt icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            fill="rgba(40, 13, 95, 0.08)"
            className="bi bi-receipt"
            viewBox="0 0 16 16"
            style={{
              position: "absolute",
              right: "-5px",
              bottom: "-10px",
              pointerEvents: "none"
            }}
          >
            <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v13h-1V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.51-.51L2 2.118V15H1V2a.5.5 0 0 1 .059-.237l.5-1a.5.5 0 0 1 .361-.257zM5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z" />
          </svg>

          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#280D5F",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase"
              }}
            >
              TOTAL SPENT
            </div>

            <div
              className="fw-bold mt-1"
              style={{
                fontSize: "32px",
                color: "#280D5F",
                fontWeight: "900",
                letterSpacing: "-0.8px",
                lineHeight: "1.1"
              }}
            >
              {formatMoney(totalSpent)}
            </div>

            <div
              className="d-flex align-items-center"
              style={{
                fontSize: "12px",
                color: "#4B2896",
                marginTop: "6px",
                fontWeight: 600
              }}
            >
              <i className="bi bi-arrow-up-right me-1" style={{ fontSize: "13px", fontWeight: "bold" }}></i>
              <span>12% from last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: YOU ARE OWED (Dark background) */}
      <div className="col-xl-4 col-md-6 col-sm-12">
        <div
          className="position-relative overflow-hidden themed-dark-card"
          style={{
            background: "#1B1B1D",
            border: "1px solid #28282B",
            padding: "18px 22px",
            minHeight: "120px",
            borderRadius: "20px"
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#8A8A93",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase"
              }}
            >
              YOU ARE OWED
            </div>

            <div
              className="fw-bold mt-1"
              style={{
                fontSize: "32px",
                color: "#DFD6FF",
                fontWeight: "900",
                letterSpacing: "-0.8px",
                lineHeight: "1.1"
              }}
            >
              {formatMoney(Math.max(userIsOwed, 0))}
            </div>

            {/* Avatars at the bottom left */}
            <div className="d-flex align-items-center mt-2">
              {visibleMembers.map((email, idx) => (
                <div
                  key={idx}
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                  style={{
                    width: "24px",
                    height: "24px",
                    fontSize: "9px",
                    marginLeft: idx === 0 ? 0 : "-5px",
                    background: "#9D5CFF",
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
                    width: "24px",
                    height: "24px",
                    fontSize: "9px",
                    marginLeft: "-5px",
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
      </div>

      {/* CARD 3: PENDING SETTLE-UPS (Yellow background) */}
      <div className="col-xl-4 col-md-6 col-sm-12">
        <div
          className="position-relative overflow-hidden yellow-card"
          style={{
            background: "#FFD02F",
            cursor: balances.length > 0 ? "pointer" : "default",
            padding: "18px 22px",
            minHeight: "120px",
            borderRadius: "20px"
          }}
          onClick={() => {
            if (balances.length > 0) {
              onSettle?.();
            }
          }}
        >
          {/* Background SVG Warning Exclamation icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            fill="rgba(77, 58, 0, 0.08)"
            className="bi fill-current"
            viewBox="0 0 24 24"
            style={{
              position: "absolute",
              right: "-5px",
              bottom: "-10px",
              pointerEvents: "none"
            }}
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>

          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#4D3A00",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase"
              }}
            >
              PENDING SETTLE-UPS
            </div>

            <div
              className="fw-bold mt-1"
              style={{
                fontSize: "32px",
                color: "#1E1600",
                fontWeight: "900",
                letterSpacing: "-0.8px",
                lineHeight: "1.1"
              }}
            >
              {balances.length}
            </div>

            <div
              className="d-flex align-items-center"
              style={{
                fontSize: "12px",
                color: "#4D3A00",
                marginTop: "10px",
                fontWeight: 600
              }}
            >
              {balances.length > 0 ? (
                <>
                  <span>Review Requests</span>
                  <i className="bi bi-arrow-right ms-1" style={{ fontSize: "11px" }}></i>
                </>
              ) : (
                "All Settled"
              )}
            </div>

          </div>
        </div>
      </div>

      <style>
        {`
        .themed-dark-card {
          transition: border-color 0.2s ease;
        }
        .themed-dark-card:hover {
          border-color: #9D5CFF !important;
        }
        .purple-card {
          transition: filter 0.2s ease;
        }
        .purple-card:hover {
          filter: brightness(1.04);
        }
        .yellow-card {
          transition: filter 0.2s ease;
        }
        .yellow-card:hover {
          filter: brightness(1.04);
        }
        `}
      </style>

    </div>
  );
}

export default GroupSummaryCards;

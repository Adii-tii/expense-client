import React from "react";

function GroupSummaryCards({ myBalance = 0, userOwes = 0, userIsOwed = 0, onSettle }) {

  const PRIMARY = "#7C6CF2";
  const TEXT_MAIN = "#2B2D42";
  const TEXT_MUTED = "#9CA3AF";

  const formatMoney = (value) => `₹${Number(value).toFixed(2)}`;

  const cards = [
    {
      title: "Overall Balance",
      value:
        myBalance === 0
          ? "Settled"
          : formatMoney(Math.abs(myBalance)),

      subtitle:
        myBalance > 0
          ? "You will receive money"
          : myBalance < 0
          ? "You need to pay money"
          : "All expenses cleared",

      icon: "bi-wallet2",
      showButton: false
    },

    {
      title: "You owe",
      value: formatMoney(Math.max(userOwes, 0)),

      subtitle:
        userOwes > 0
          ? "Pending payments"
          : "Nothing to pay",

      icon: "bi-arrow-down-left-circle",

      showButton: userOwes > 0.01   // prevents float glitches
    },

    {
      title: "You are owed",
      value: formatMoney(Math.max(userIsOwed, 0)),

      subtitle:
        userIsOwed > 0
          ? "Pending collections"
          : "Nothing pending",

      icon: "bi-arrow-up-right-circle",
      showButton: false
    }
  ];

  return (
    <div className="row g-3 px-5 mt-3">

      {cards.map((card, index) => (

        <div className="col-xl-4 col-md-6 col-sm-12" key={index}>

          <div
            className="border rounded-4 h-100 p-4 minimal-card"
            style={{
              background: "white",
              borderColor: "#F1F1F4",
              transition: "0.2s ease"
            }}
          >

            <div className="d-flex justify-content-between align-items-start">

              <div>

                <div
                  style={{
                    fontSize: "12px",
                    color: TEXT_MUTED,
                    fontWeight: 500
                  }}
                >
                  {card.title}
                </div>

                <div
                  className="fw-semibold mt-1"
                  style={{
                    fontSize: "26px",
                    color: TEXT_MAIN
                  }}
                >
                  {card.value}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: TEXT_MUTED,
                    marginTop: "4px"
                  }}
                >
                  {card.subtitle}
                </div>

              </div>

              <div style={{ color: PRIMARY, opacity: 0.7 }}>
                <i className={`bi ${card.icon}`} style={{ fontSize: "20px" }} />
              </div>

            </div>

            {card.showButton && (
              <div className="mt-3">
                <button
                  className="btn w-100 rounded-pill purple-btn"
                  style={{
                    background: PRIMARY,
                    color: "white",
                    fontWeight: 600,
                    fontSize: "13px"
                  }}
                  onClick={onSettle}
                >
                  Settle Up
                </button>
              </div>
            )}

          </div>

        </div>

      ))}

      <style>
        {`
        .minimal-card:hover {
          border-color: #E6E6EF;
          transform: translateY(-2px);
        }

        .purple-btn:hover {
          filter: brightness(1.08);
        }
        `}
      </style>

    </div>
  );
}

export default GroupSummaryCards;

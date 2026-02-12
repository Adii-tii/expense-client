import { useSelector } from "react-redux";

function ExpenseCard({ expense, onClick }) {

  const user = useSelector((state) => state.userDetails);
  if (!user) return null;

  /* ===== THEME ===== */

  const PRIMARY = "#7C6CF2";
  const PRIMARY_SOFT = "#F1EFFF";
  const TEXT_MAIN = "#111827";
  const TEXT_MUTED = "#6B7280";
  const BORDER = "#E5E7EB";
  const BG_WHITE = "#FFFFFF";

  const GREEN = "#16A34A";
  const RED = "#DC2626";

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

  const categoryIcon =
    CATEGORY_ICONS[expense.category] || "bi-tag";

  /* ===== DATA ===== */

  const splits = expense?.splits || [];
  const paidBy = expense?.paidBy || [];

  const mySplit = splits.find(s => s.email === user.email);

  const myShare = Number(mySplit?.share || 0);
  const myRemaining = Number(mySplit?.remaining ?? myShare);

  const currentPaid =
    Number(paidBy.find(p => p.email === user.email)?.amount || 0);

  const balance = currentPaid - myShare;

  /* ===== STATUS ===== */

  let type = "settled";
  let displayAmount = 0;
  let color = TEXT_MUTED;

  if (balance > 0) {
    type = "lent";
    displayAmount = balance;
    color = GREEN;
  } else if (myRemaining > 0) {
    type = "borrowed";
    displayAmount = myRemaining;
    color = RED;
  }

  /* ===== PARTICIPANTS ===== */

  const participants = [...new Map(
    [...splits, ...paidBy].map(p => [p.email, p])
  ).values()];

  const getInitial = (email) =>
    email?.[0]?.toUpperCase() || "?";

  /* ===== DATE ===== */

  const dateObj = new Date(expense.createdAt);

  const day = dateObj.toLocaleDateString("en-IN", { day: "2-digit" });
  const month = dateObj.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
  const time = dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  /* ===== UI ===== */

  return (
    <div className="d-flex gap-3">

      {/* DATE COLUMN */}
      <div
        style={{
          width: "70px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            fontSize: "50px",
            fontWeight: 900,
            color: PRIMARY,
            lineHeight: "45px"
          }}
        >
          {day}
        </div>

        <div
          style={{
            fontSize: "16px",
            color: TEXT_MUTED,
            letterSpacing: "1.2px",
            fontWeight: 700
          }}
        >
          {month}
        </div>
      </div>

      {/* CARD */}
      <div
        onClick={() => onClick?.(expense)}
        style={{
          flex: 1,
          display: "flex",
          background: BG_WHITE,
          borderRadius: "14px",
          border: `1px solid ${BORDER}`,
          overflow: "hidden",
          cursor: "pointer"
        }}
      >

        {/* ICON PANEL */}
        <div
          style={{
            width: "90px",
            background: PRIMARY_SOFT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <i
            className={`bi ${categoryIcon}`}
            style={{ fontSize: "50px", color: PRIMARY }}
          />
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, padding: "12px 14px" }}>

          <div className="d-flex justify-content-between align-items-start">

            {/* LEFT SIDE */}
            <div style={{ flex: 1 }}>

              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: TEXT_MAIN
                }}
              >
                {expense.title}
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: TEXT_MUTED,
                  marginTop: "2px"
                }}
              >
                {expense.category}
              </div>

              <div
                style={{
                  fontSize: "11px",
                  color: TEXT_MUTED
                }}
              >
                {time}
              </div>

              {expense.notes && (
                <div
                  style={{
                    fontSize: "11px",
                    color: TEXT_MUTED,
                    marginTop: "5px"
                  }}
                >
                  {expense.notes}
                </div>
              )}

            </div>

            {/* RIGHT FINANCIAL BLOCK */}
            <div style={{ textAlign: "right", minWidth: "95px" }}>

              {type !== "settled" ? (
                <>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: color
                    }}
                  >
                    {type}
                  </div>

                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 900,
                      color: color
                    }}
                  >
                    ₹{displayAmount.toFixed(2)}
                  </div>
                </>
              ) : (
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: TEXT_MUTED
                  }}
                >
                  Settled
                </div>
              )}

            </div>

          </div>

          {/* FOOTER */}
          <div className="d-flex justify-content-between align-items-center mt-2">

            {/* PARTICIPANTS */}
            <div className="d-flex">
              {participants.slice(0, 4).map((p, i) => (
                <div
                  key={p.email}
                  title={p.email}
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: PRIMARY_SOFT,
                    color: PRIMARY,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    marginLeft: i ? "-6px" : 0,
                    border: "2px solid white"
                  }}
                >
                  {getInitial(p.email)}
                </div>
              ))}
            </div>

            {/* SPLIT TYPE BADGE */}
            <span
              style={{
                fontSize: "10px",
                padding: "3px 9px",
                borderRadius: "999px",
                background: PRIMARY_SOFT,
                color: PRIMARY,
                fontWeight: 600
              }}
            >
              {expense.splitType}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ExpenseCard;

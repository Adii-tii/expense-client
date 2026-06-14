import { useSelector } from "react-redux";

function ExpenseCard({ expense, onClick }) {

  const user = useSelector((state) => state.userDetails);
  if (!user) return null;

  /* ===== THEME ===== */

  const PRIMARY = "#9D5CFF";
  const PRIMARY_SOFT = "rgba(157, 92, 255, 0.15)";
  const TEXT_MAIN = "#FFFFFF";
  const TEXT_MUTED = "#A1A1AA";
  const BORDER = "#28282B";
  const BG_WHITE = "#1B1B1D";

  const GREEN = "#10B981";

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
    color = TEXT_MAIN;
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
          width: "56px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            fontSize: "32px",
            fontWeight: 900,
            color: TEXT_MUTED,
            lineHeight: "30px"
          }}
        >
          {day}
        </div>

        <div
          style={{
            fontSize: "11px",
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
          border: "none",
          overflow: "hidden",
          cursor: "pointer"
        }}
      >

        {/* ICON PANEL */}
        <div
          style={{
            width: "60px",
            background: PRIMARY_SOFT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <i
            className={`bi ${categoryIcon}`}
            style={{ fontSize: "28px", color: PRIMARY }}
          />
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, padding: "8px 12px" }}>

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
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: color
                  }}
                >
                  ₹{displayAmount.toFixed(2)}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
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
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: PRIMARY_SOFT,
                    color: PRIMARY,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8px",
                    marginLeft: i ? "-5px" : 0,
                    border: "2.5px solid #1B1B1D"
                  }}
                >
                  {getInitial(p.email)}
                </div>
              ))}
            </div>



          </div>

        </div>

      </div>

    </div>
  );
}

export default ExpenseCard;

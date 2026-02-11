import { useSelector } from "react-redux";

function ExpenseCard({ expense, onClick }) {

  const user = useSelector((state) => state.userDetails);

  const PRIMARY = "#7C6CF2";
  const PRIMARY_SOFT = "#F1EFFF";
  const TEXT_MAIN = "#2B2D42";
  const TEXT_MUTED = "#6B7280";
  const BORDER = "#E6E7EC";
  const BG_WHITE = "#FFFFFF";
  const YELLOW_ACCENT = "#F4C430";

  const splits = expense.splits || [];
  const paidBy = expense.paidBy || [];

  const currentShare =
    splits.find(s => s.email === user.email)?.share || 0;

  const currentPaid =
    paidBy.find(p => p.email === user.email)?.amount || 0;

  const balance = currentPaid - currentShare;

  const getStatusLabel = () => {
    if (expense.isSettled) return "Settled";
    if (balance > 0) return `You receive ₹${balance}`;
    if (balance < 0) return `You owe ₹${Math.abs(balance)}`;
    return "No dues";
  };

  const participants = [...splits, ...paidBy]
    .filter(p => p?.email)
    .reduce((acc, curr) => {
      if (!acc.find(a => a.email === curr.email)) acc.push(curr);
      return acc;
    }, []);

  const getInitial = (email) =>
    email?.[0]?.toUpperCase() || "?";

  const dateObj = new Date(expense.createdAt);

  const day = dateObj.toLocaleDateString("en-IN", { day: "2-digit" });
  const month = dateObj.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
  const time = dateObj.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="d-flex">

      {/* DATE PANEL */}
      <div
        style={{
          width: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          color: PRIMARY
        }}
      >
        <div style={{ fontSize: "26px", lineHeight: "24px" }}>
          {day}
        </div>
        <div style={{ fontSize: "13px", letterSpacing: "1px" }}>
          {month}
        </div>
      </div>

      {/* CARD */}
      <div
        onClick={() => onClick(expense)}
        style={{
          flex: 1,
          display: "flex",
          background: BG_WHITE,
          borderRadius: "18px",
          border: `1px solid ${BORDER}`,
          cursor: "pointer",
          overflow: "hidden",
          transition: "0.2s"
        }}
      >

        {/* ICON PANEL */}
        <div
          style={{
            width: "70px",
            background: PRIMARY_SOFT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <i className="bi bi-receipt" style={{ fontSize: "26px", color: PRIMARY }} />
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, padding: "12px 14px" }}>

          <div className="d-flex justify-content-between align-items-start">

            <div>
              <div style={{ fontWeight: 600, fontSize: "15px", color: TEXT_MAIN }}>
                {expense.title}
              </div>

              <div style={{ fontSize: "12px", color: TEXT_MUTED }}>
                {time}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>
                ₹{expense.amount}
              </div>

              <div style={{ fontSize: "11px", fontWeight: 600, color: PRIMARY }}>
                {getStatusLabel()}
              </div>
            </div>

          </div>

          {expense.notes && (
            <div style={{ fontSize: "12px", color: TEXT_MUTED, marginTop: "6px" }}>
              {expense.notes}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "10px" }}>

            <div className="d-flex align-items-center">
              {participants.slice(0, 4).map((p, i) => (
                <div
                  key={p.email}
                  title={p.email}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: PRIMARY_SOFT,
                    color: PRIMARY,
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: i ? "-6px" : 0,
                    border: "2px solid white"
                  }}
                >
                  {getInitial(p.email)}
                </div>
              ))}
            </div>

            <span
              style={{
                fontSize: "11px",
                background: "#FFF7D6",
                color: YELLOW_ACCENT,
                padding: "3px 9px",
                borderRadius: "999px",
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

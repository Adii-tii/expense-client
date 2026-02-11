import { useSelector } from "react-redux";

function ExpenseDetailsModal({ expense, isOpen, onClose, onSettleExpense }) {

  const user = useSelector(state => state.userDetails);

  if (!isOpen || !expense) return null;

  /* ===== THEME ===== */

  const PRIMARY = "#7C6CF2";
  const PRIMARY_SOFT = "#F1EFFF";
  const TEXT_MUTED = "#6B7280";
  const BORDER = "#E6E7EC";
  const BG_WHITE = "#FFFFFF";

  /* ===== HELPERS ===== */

  const money = (val) => Number(val || 0).toFixed(2);

  /* ===== SAFE DATA ===== */

  const splits = expense.splits || [];
  const paidBy = expense.paidBy || [];

  const createdBy =
    expense.createdByEmail ||
    expense.createdBy?.email ||
    "Unknown";

  const myShare =
    splits.find(s => s.email === user.email)?.share || 0;

  const myPaid =
    paidBy.find(p => p.email === user.email)?.amount || 0;

  const myBalance = myPaid - myShare;

  /* ===== STATUS TEXT ===== */

  const getStatusText = () => {
    if (myBalance > 0) return `You will receive ₹${money(myBalance)}`;
    if (myBalance < 0) return `You owe ₹${money(Math.abs(myBalance))}`;
    return "No dues";
  };

  /* ===== UI ===== */

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 1050
        }}
      />

      {/* MODAL */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "520px",
          background: BG_WHITE,
          borderRadius: "20px",
          border: `1px solid ${BORDER}`,
          boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
          zIndex: 1060
        }}
      >

        {/* ===== HEADER ===== */}

        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <div className="d-flex justify-content-between">

            <div>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>
                {expense.title}
              </div>

              <div style={{ fontSize: "12px", color: TEXT_MUTED }}>
                {new Date(expense.createdAt).toLocaleString()}
              </div>

              {/* CREATED BY */}
              <div style={{ fontSize: "12px", color: TEXT_MUTED }}>
                Created by{" "}
                <span style={{ fontWeight: 600 }}>
                  {createdBy === user.email ? "You" : createdBy}
                </span>
              </div>

            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "22px", fontWeight: 700 }}>
                ₹{money(expense.amount)}
              </div>

              <div style={{ fontSize: "12px", fontWeight: 600, color: PRIMARY }}>
                {getStatusText()}
              </div>
            </div>

          </div>
        </div>

        {/* ===== PAID BY ===== */}

        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontWeight: 600, marginBottom: "10px" }}>
            Paid by
          </div>

          {paidBy.map(p => (
            <div key={p.email} className="d-flex justify-content-between mb-2">
              <span>{p.email === user.email ? "You" : p.email}</span>
              <span>₹{money(p.amount)}</span>
            </div>
          ))}
        </div>

        {/* ===== SPLITS ===== */}

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ fontWeight: 600, marginBottom: "10px" }}>
            Split details
          </div>

          {splits.map(s => (
            <div key={s.email} className="d-flex justify-content-between mb-2">
              <span>{s.email === user.email ? "You" : s.email}</span>
              <span>₹{money(s.share)}</span>
            </div>
          ))}
        </div>

        {/* ===== NOTES ===== */}

        {expense.notes && (
          <div style={{ padding: "14px 20px", borderTop: `1px solid ${BORDER}` }}>
            {expense.notes}
          </div>
        )}

        {/* ===== FOOTER ===== */}

        <div
          className="d-flex justify-content-between align-items-center"
          style={{ padding: "14px 20px" }}
        >

          {/* Settle Button appears ONLY if user owes */}
          {myBalance < 0 && (
            <button
              className="btn text-white rounded-pill px-4"
              style={{ background: PRIMARY }}
              onClick={() => onSettleExpense?.(expense)}
            >
              Settle this expense
            </button>
          )}

          <button
            className="btn"
            style={{
              background: PRIMARY_SOFT,
              color: PRIMARY,
              borderRadius: "999px"
            }}
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>
    </>
  );
}

export default ExpenseDetailsModal;

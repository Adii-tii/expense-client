import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/appConfig";
import { useSelector } from "react-redux";

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

function SettleUpModal({ isOpen, setIsOpen, group, balances, refreshExpenses }) {
  const user = useSelector((state) => state.userDetails);
  const [membersState, setMembersState] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const members = useMemo(() => {
    return (balances || [])
      .filter((m) => m.email !== user?.email && m.amount > 0)
      .map((m) => ({ email: m.email, max: round2(m.amount) }));
  }, [balances, user?.email]);

  useEffect(() => {
    if (isOpen) {
      setMembersState(members.map((m) => ({ ...m, amount: round2(m.max), selected: true, inputRaw: String(round2(m.max)) })));
      setNote("");
    }
  }, [isOpen, members]);

  if (!isOpen) return null;

  const toggleMember = (email) =>
    setMembersState((prev) =>
      prev.map((m) => (m.email === email ? { ...m, selected: !m.selected } : m))
    );

  const handleFocus = (email) => {
    setMembersState((prev) =>
      prev.map((m) => (m.email === email ? { ...m, inputRaw: "" } : m))
    );
  };

  const handleAmountChange = (email, value) => {
    setMembersState((prev) =>
      prev.map((m) => {
        if (m.email !== email) return m;
        const raw = value.replace(/[^0-9.]/g, "");
        let num = parseFloat(raw);
        if (isNaN(num)) num = 0;
        return { ...m, inputRaw: raw, amount: round2(Math.min(num, m.max)) };
      })
    );
  };

  const handleBlur = (email) => {
    setMembersState((prev) =>
      prev.map((m) => {
        if (m.email !== email) return m;
        const num = parseFloat(m.inputRaw);
        const clamped = isNaN(num) ? 0 : round2(Math.min(num, m.max));
        return { ...m, amount: clamped, inputRaw: String(clamped) };
      })
    );
  };

  const totalPaying = round2(
    membersState.filter((m) => m.selected).reduce((s, m) => s + Number(m.amount || 0), 0)
  );

  const handleSubmit = async () => {
    const settlements = membersState.filter((m) => m.selected && m.amount > 0);
    if (!settlements.length) return;
    setLoading(true);
    try {
      await Promise.all(
        settlements.map((m) =>
          axios.post(
            `${serverEndpoint}/groups/${group._id}/settlements`,
            { fromUserEmail: user.email, toUserEmail: m.email, amount: round2(m.amount), currency: "INR", note },
            { withCredentials: true }
          )
        )
      );
      setIsOpen(false);
      refreshExpenses();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)", zIndex: 1050 }}
    >
      <style>{`
        .settle-check {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1.5px solid #39393B;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.15s, background 0.15s;
        }
        .settle-check.checked {
          border-color: #9D5CFF;
          background: #9D5CFF;
        }
        .settle-amount-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid #2C2C2E;
          border-radius: 0;
          color: #FFD700;
          font-weight: 700;
          font-size: 20px;
          width: 100px;
          text-align: right;
          padding: 0 0 3px 0;
          outline: none;
          -moz-appearance: textfield;
          transition: border-color 0.15s;
        }
        .settle-amount-input:focus {
          border-bottom-color: #9D5CFF;
        }
        .settle-amount-input::-webkit-inner-spin-button,
        .settle-amount-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
        .settle-amount-input:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .settle-note-input {
          width: 100%;
          background: #131315;
          border: 1px solid #28282B;
          border-radius: 8px;
          color: #FFFFFF;
          font-size: 13px;
          padding: 8px 12px;
          outline: none;
        }
        .settle-note-input::placeholder { color: #4A4A52; }
        .settle-note-input:focus { border-color: #39393B; }
      `}</style>

      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "420px" }}>
        <div
          className="modal-content border-0"
          style={{
            background: "#1B1B1D",
            borderRadius: "16px",
            border: "1px solid #28282B",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)"
          }}
        >
          {/* Header */}
          <div className="modal-header border-0 px-4 pt-4 pb-3">
            <div>
              <h5 className="mb-1 fw-semibold" style={{ color: "#FFFFFF", fontSize: "16px" }}>
                Settle Up
              </h5>
              <small style={{ color: "#A1A1AA" }}>Record payments to members you owe</small>
            </div>
            <button
              className="btn-close btn-close-white"
              style={{ fontSize: "12px", boxShadow: "none", opacity: 0.5 }}
              onClick={() => setIsOpen(false)}
            />
          </div>

          {/* Body */}
          <div className="modal-body px-4 py-0">
            {membersState.length === 0 ? (
              <div className="text-center py-4">
                <div
                  style={{
                    width: "52px", height: "52px", borderRadius: "50%",
                    background: "rgba(157, 92, 255, 0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 12px", color: "#9D5CFF"
                  }}
                >
                  <i className="bi bi-check2-circle" style={{ fontSize: "24px" }} />
                </div>
                <div style={{ fontWeight: 600, color: "#FFFFFF", fontSize: "14px", marginBottom: "4px" }}>
                  All settled up
                </div>
                <div style={{ fontSize: "13px", color: "#A1A1AA" }}>
                  You don't owe anyone in this group.
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2 pb-3">

                {/* Member rows */}
                {membersState.map((member) => {
                  const initial = member.email?.[0]?.toUpperCase() || "?";
                  const name = member.email.split("@")[0];
                  const displayName = name.charAt(0).toUpperCase() + name.slice(1);

                  return (
                    <div
                      key={member.email}
                      style={{
                        background: "#131315",
                        borderRadius: "10px",
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        className={`settle-check ${member.selected ? "checked" : ""}`}
                        onClick={() => toggleMember(member.email)}
                      >
                        {member.selected && (
                          <i className="bi bi-check" style={{ fontSize: "11px", color: "#FFFFFF", lineHeight: 1 }} />
                        )}
                      </div>

                      {/* Avatar */}
                      <div
                        style={{
                          width: "34px", height: "34px", borderRadius: "50%",
                          background: "rgba(157, 92, 255, 0.12)",
                          color: "#9D5CFF",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: "13px", flexShrink: 0
                        }}
                      >
                        {initial}
                      </div>

                      {/* Name + owe label */}
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: "#FFFFFF", fontSize: "14px" }}>
                          {displayName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#A1A1AA" }}>
                          Owe ₹{member.max.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      {/* Amount input */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }} onClick={(e) => e.stopPropagation()}>
                        <span style={{ fontSize: "13px", color: "#6B6B72", fontWeight: 500 }}>₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={member.max}
                          className="settle-amount-input"
                          disabled={!member.selected}
                          value={member.inputRaw ?? member.amount}
                          onFocus={() => handleFocus(member.email)}
                          onChange={(e) => handleAmountChange(member.email, e.target.value)}
                          onBlur={() => handleBlur(member.email)}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Note */}
                <div style={{ marginTop: "4px" }}>
                  <div className={`mat-field ${note ? "has-value" : ""}`} style={{ marginBottom: 0 }}>
                    <input
                      placeholder="e.g. Paid via UPI"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <label>Note (optional)</label>
                  </div>
                </div>

                {/* Total */}
                <div
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#131315", borderRadius: "10px", padding: "10px 14px",
                    marginTop: "2px"
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#A1A1AA" }}>Total</span>
                  <span style={{ fontSize: "20px", fontWeight: 800, color: "#FFD700", letterSpacing: "-0.3px" }}>
                    ₹{totalPaying.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {membersState.length > 0 && (
            <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  flex: 1, padding: "10px",
                  borderRadius: "10px",
                  background: "#222224",
                  border: "none",
                  color: "#A1A1AA",
                  fontWeight: 600, fontSize: "14px", cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || totalPaying === 0}
                style={{
                  flex: 2, padding: "10px",
                  borderRadius: "10px",
                  background: totalPaying === 0 ? "#222224" : "#FFD700",
                  border: "none",
                  color: totalPaying === 0 ? "#4A4A52" : "#131315",
                  fontWeight: 700, fontSize: "14px",
                  cursor: totalPaying === 0 ? "not-allowed" : "pointer",
                  transition: "opacity 0.15s"
                }}
                onMouseEnter={(e) => { if (totalPaying > 0) e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" style={{ width: "13px", height: "13px", borderWidth: "2px" }} />
                    Processing…
                  </span>
                ) : "Confirm Payment"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettleUpModal;

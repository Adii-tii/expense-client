import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/appConfig";
import { useSelector } from "react-redux";

const PRIMARY = "#7C6CF2";
const PRIMARY_SOFT = "#F1EFFF";
const TEXT_MAIN = "#2B2D42";
const TEXT_MUTED = "#6B7280";
const BORDER = "#ECECF2";
const BG_CARD = "#FAFAFC";

/* ===== SAFE ROUNDING ===== */
const round2 = (num) =>
  Math.round((Number(num) + Number.EPSILON) * 100) / 100;

function SettleUpModal({
  isOpen,
  setIsOpen,
  group,
  balances,
  refreshExpenses,
}) {

  const user = useSelector((state) => state.userDetails);

  const [membersState, setMembersState] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===== BUILD MEMBERS ===== */

  const members = useMemo(() => {
    return (balances || [])
      .filter(m => m.email !== user?.email && m.amount > 0)
      .map(m => ({
        email: m.email,
        max: round2(m.amount)
      }));
  }, [balances, user?.email]);

  /* ===== AUTO SELECT ===== */

  useEffect(() => {
    if (isOpen) {
      setMembersState(
        members.map(m => ({
          ...m,
          amount: round2(m.max),
          selected: true
        }))
      );
    }
  }, [isOpen, members]);

  if (!isOpen) return null;

  /* ===== HELPERS ===== */

  const toggleMember = (email) => {
    setMembersState(prev =>
      prev.map(m =>
        m.email === email
          ? { ...m, selected: !m.selected }
          : m
      )
    );
  };

  const updateAmount = (email, value) => {

    let num = Number(value);
    if (isNaN(num)) num = 0;

    setMembersState(prev =>
      prev.map(m =>
        m.email === email
          ? { ...m, amount: round2(Math.min(num, m.max)) }
          : m
      )
    );
  };

  const totalPaying = round2(
    membersState
      .filter(m => m.selected)
      .reduce((sum, m) => sum + Number(m.amount || 0), 0)
  );

  const getInitial = (email) =>
    email?.[0]?.toUpperCase() || "?";

  /* ===== SUBMIT ===== */

  const handleSubmit = async () => {

    const settlements = membersState.filter(
      m => m.selected && m.amount > 0
    );

    if (!settlements.length) return;

    setLoading(true);

    try {

      await Promise.all(
        settlements.map(m =>
          axios.post(
            `${serverEndpoint}/groups/${group._id}/settlements`,
            {
              fromUserEmail: user.email,
              toUserEmail: m.email,
              amount: round2(m.amount),
              currency: "INR",
              note
            },
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

  /* ===== UI ===== */

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0 rounded-4"
          style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.2)" }}
        >

          {/* HEADER */}
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="fw-semibold mb-1">Settle Balances</h5>
              <small style={{ color: TEXT_MUTED }}>
                Select members and adjust payment if needed
              </small>
            </div>

            <button className="btn-close" onClick={() => setIsOpen(false)} />
          </div>

          {/* BODY */}
          <div className="modal-body">

            <div className="d-flex flex-column gap-3">

              {membersState.map(member => (

                <div
                  key={member.email}
                  onClick={() => toggleMember(member.email)}
                  style={{
                    borderRadius: "16px",
                    border: `1px solid ${member.selected ? PRIMARY : BORDER}`,
                    background: member.selected ? PRIMARY_SOFT : BG_CARD,
                    padding: "14px",
                    cursor: "pointer",
                    transition: "0.2s"
                  }}
                >

                  <div className="d-flex justify-content-between align-items-center">

                    {/* LEFT */}
                    <div className="d-flex align-items-center gap-3">

                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          background: PRIMARY,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 600
                        }}
                      >
                        {getInitial(member.email)}
                      </div>

                      <div>
                        <div style={{ fontWeight: 600, color: TEXT_MAIN }}>
                          {member.email}
                        </div>

                        <small style={{ color: TEXT_MUTED }}>
                          Owes you ₹{member.max.toFixed(2)}
                        </small>
                      </div>

                    </div>

                    {/* AMOUNT */}
                    <div style={{ width: "140px" }}>

                      <input
                        type="number"
                        step="0.01"
                        className="form-control text-end"
                        disabled={!member.selected}
                        value={member.amount.toFixed(2)}
                        max={member.max}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateAmount(member.email, e.target.value)
                        }
                      />

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* NOTE */}
            <div className="mt-4">
              <label className="form-label fw-medium">
                Note (optional)
              </label>

              <input
                className="form-control"
                placeholder="Add payment note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* SUMMARY */}
            <div
              className="mt-4 rounded-4 p-3"
              style={{
                background: PRIMARY_SOFT,
                border: `1px solid ${PRIMARY}`
              }}
            >
              <div style={{ fontSize: "14px", color: TEXT_MUTED }}>
                Total Payment
              </div>

              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: PRIMARY
                }}
              >
                ₹{totalPaying.toFixed(2)}
              </div>
            </div>

          </div>

          {/* FOOTER */}
          <div className="modal-footer border-0">

            <button className="btn" onClick={() => setIsOpen(false)}>
              Cancel
            </button>

            <button
              className="btn text-white px-4 rounded-pill"
              style={{ background: PRIMARY }}
              disabled={loading || totalPaying === 0}
              onClick={handleSubmit}
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default SettleUpModal;

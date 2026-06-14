import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/appConfig";

const round2 = (num) =>
  Math.round((Number(num || 0) + Number.EPSILON) * 100) / 100;

const isClose = (a, b) => Math.abs(a - b) < 0.01;

const CATEGORIES = [
  { name: "Food", icon: "bi-cup-hot" },
  { name: "Travel", icon: "bi-airplane" },
  { name: "Shopping", icon: "bi-bag" },
  { name: "Bills", icon: "bi-receipt" },
  { name: "Entertainment", icon: "bi-film" },
  { name: "Health", icon: "bi-heart-pulse" },
  { name: "Other", icon: "bi-three-dots" }
];

const STEPS = ["Details", "Paid By", "Split", "Preview"];

function AddExpense({ setIsOpen, isOpen, group, refreshExpenses }) {

  const groupMembers = group?.memberEmail || [];

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");

  const [participants, setParticipants] = useState([]);
  const [payments, setPayments] = useState({});
  const [splits, setSplits] = useState({});
  const [splitType, setSplitType] = useState("equal");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ── RESET ── */
  const reset = () => {
    setStep(1); setTitle(""); setAmount(""); setCategory("Food");
    setCustomCategory(""); setParticipants([]); setPayments({});
    setSplits({}); setSplitType("equal"); setError("");
  };

  /* ── INIT ── */
  useEffect(() => {
    if (!isOpen) return;
    setParticipants(groupMembers);
    const pay = {}, split = {};
    groupMembers.forEach(e => { pay[e] = 0; split[e] = 0; });
    setPayments(pay);
    setSplits(split);
  }, [isOpen, groupMembers]);

  /* ── SYNC ── */
  useEffect(() => {
    setPayments(prev => {
      const next = {};
      participants.forEach(p => next[p] = prev[p] || 0);
      return next;
    });
    setSplits(prev => {
      const next = {};
      participants.forEach(p => next[p] = prev[p] || 0);
      return next;
    });
  }, [participants]);

  /* ── DERIVED ── */
  const numAmount = round2(amount);
  const finalCategory = category === "Other" && customCategory.trim() ? customCategory.trim() : category;

  const equalShare = useMemo(() => {
    if (!participants.length || !numAmount) return 0;
    return round2(numAmount / participants.length);
  }, [participants, numAmount]);

  useEffect(() => {
    if (splitType !== "equal") return;
    setSplits(() => {
      const updated = {};
      participants.forEach(p => { updated[p] = equalShare; });
      return updated;
    });
  }, [equalShare, splitType, participants]);

  const totalPaid = round2(Object.values(payments).reduce((a, b) => a + Number(b || 0), 0));
  const totalSplit = round2(Object.values(splits).reduce((a, b) => a + Number(b || 0), 0));

  /* ── VALIDATE ── */
  const validateStep = (target) => {
    if (target === 2) {
      if (!title.trim()) return "Expense title required";
      if (!numAmount || numAmount <= 0) return "Enter valid amount";
      if (category === "Other" && !customCategory.trim()) return "Enter custom category";
    }
    if (target === 3) {
      if (!participants.length) return "Select at least one participant";
      if (!isClose(totalPaid, numAmount)) return `Paid total (₹${totalPaid.toFixed(2)}) must equal ₹${numAmount.toFixed(2)}`;
    }
    if (target === 4) {
      if (splitType === "unequal" && !isClose(totalSplit, numAmount))
        return `Split total (₹${totalSplit.toFixed(2)}) must equal ₹${numAmount.toFixed(2)}`;
    }
    return null;
  };

  /* ── SUBMIT ── */
  const handleSubmit = async () => {

    setLoading(true);
    try {
      await axios.post(
        `${serverEndpoint}/groups/${group._id}/expenses`,
        {
          title, category: finalCategory, currency, amount: numAmount, splitType,
          paidBy: participants.map(email => ({ email, amount: round2(payments[email]) })),
          splits: participants.map(email => ({ email, share: round2(splits[email]), remaining: round2(splits[email]) }))
        },
        { withCredentials: true }
      );
      reset(); setIsOpen(false); refreshExpenses();
    } catch { setError("Failed to create expense"); }
    finally { setLoading(false); }
  };

  const handleNext = () => {
    const err = validateStep(step + 1);
    if (err) return setError(err);
    setError(""); setStep(s => s + 1);
  };

  const toggleParticipant = (email) => {
    setParticipants(prev =>
      prev.includes(email) ? prev.filter(p => p !== email) : [...prev, email]
    );
  };

  const getName = (email) => {
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "480px" }}>
        <div
          className="modal-content border-0"
          style={{ background: "#18181A", borderRadius: "20px", border: "1px solid #222224", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}
        >

          {/* ── HEADER ── */}
          <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid #1E1E20" }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="mb-0 fw-bold" style={{ color: "#FFFFFF", fontSize: "18px" }}>Add Expense</h5>
              <button
                onClick={() => { reset(); setIsOpen(false); }}
                style={{ background: "#222224", border: "none", color: "#6B6B72", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "16px" }}
              >
                <i className="bi bi-x" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="d-flex gap-2">
              {STEPS.map((label, i) => {
                const stepNum = i + 1;
                const isActive = step === stepNum;
                const isDone = step > stepNum;
                return (
                  <div key={label} style={{ flex: 1 }}>
                    <div style={{
                      height: "3px", borderRadius: "2px", marginBottom: "6px",
                      background: isDone ? "#9D5CFF" : isActive ? "#9D5CFF" : "#2C2C2E",
                      opacity: isActive ? 1 : isDone ? 0.5 : 0.3,
                      transition: "all 0.2s"
                    }} />
                    <span style={{ fontSize: "11px", fontWeight: 600, color: isActive ? "#9D5CFF" : "#4A4A52" }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="px-4 py-4" style={{ minHeight: "260px" }}>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.10)", color: "#EF4444", fontSize: "13px", padding: "8px 12px", borderRadius: "8px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            {/* ───── STEP 1: Details ───── */}
            {step === 1 && (
              <>
                <div className={`mat-field ${title ? "has-value" : ""}`}>
                  <input type="text" placeholder="Expense title" value={title} onChange={e => setTitle(e.target.value)} />
                  <label>What's this expense for?</label>
                </div>

                <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", marginBottom: "28px" }}>
                  <div className={`mat-field flex-grow-1 ${amount ? "has-value" : ""}`} style={{ marginBottom: 0 }}>
                    <input type="number" step="0.01" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
                    <label>Amount</label>
                  </div>
                  <div className={`mat-field ${currency ? "has-value" : ""}`} style={{ width: "80px", marginBottom: 0 }}>
                    <select value={currency} onChange={e => setCurrency(e.target.value)}>
                      <option>INR</option>
                      <option>USD</option>
                    </select>
                    <label>Currency</label>
                  </div>
                </div>

                {/* Category chips */}
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#4A4A52", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Category
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => {
                    const active = category === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setCategory(cat.name)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "5px",
                          padding: "6px 14px", borderRadius: "20px", border: "none",
                          background: active ? "rgba(157,92,255,0.15)" : "#1E1E20",
                          color: active ? "#9D5CFF" : "#6B6B72",
                          fontSize: "13px", fontWeight: 600, cursor: "pointer",
                          transition: "all 0.15s"
                        }}
                      >
                        <i className={`bi ${cat.icon}`} style={{ fontSize: "13px" }} />
                        {cat.name}
                      </button>
                    );
                  })}
                </div>

                {category === "Other" && (
                  <div className={`mat-field ${customCategory ? "has-value" : ""}`} style={{ marginTop: "16px" }}>
                    <input placeholder="Custom category" value={customCategory} onChange={e => setCustomCategory(e.target.value)} />
                    <label>Custom category</label>
                  </div>
                )}
              </>
            )}

            {/* ───── STEP 2: Participants + Paid By ───── */}
            {step === 2 && (
              <>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#4A4A52", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Who's involved? — tap to toggle
                </div>

                <div className="d-flex flex-column gap-1" style={{ marginBottom: "16px" }}>
                  {groupMembers.map(email => {
                    const included = participants.includes(email);
                    return (
                      <div
                        key={email}
                        style={{
                          display: "flex", alignItems: "center", gap: "12px",
                          padding: "10px 14px", borderRadius: "12px",
                          background: included ? "#1E1E20" : "transparent",
                          transition: "background 0.15s", cursor: "pointer"
                        }}
                        onClick={() => toggleParticipant(email)}
                      >
                        {/* Checkbox */}
                        <div style={{
                          width: "18px", height: "18px", borderRadius: "5px",
                          border: included ? "none" : "1.5px solid #39393B",
                          background: included ? "#9D5CFF" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, transition: "all 0.15s"
                        }}>
                          {included && <i className="bi bi-check" style={{ fontSize: "12px", color: "#FFFFFF", lineHeight: 1 }} />}
                        </div>

                        {/* Avatar */}
                        <div style={{
                          width: "30px", height: "30px", borderRadius: "50%",
                          background: "rgba(157,92,255,0.12)", color: "#9D5CFF",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: "12px", flexShrink: 0
                        }}>
                          {email[0].toUpperCase()}
                        </div>

                        {/* Name */}
                        <div className="flex-grow-1" style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>
                          {getName(email)}
                        </div>

                        {/* Paid amount input */}
                        {included && (
                          <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }} onClick={e => e.stopPropagation()}>
                            <span style={{ fontSize: "12px", color: "#6B6B72" }}>₹</span>
                            <input
                              type="number" step="0.01" placeholder="0"
                              value={payments[email] || ""}
                              onChange={e => setPayments(prev => ({ ...prev, [email]: e.target.value }))}
                              style={{
                                background: "transparent", border: "none",
                                borderBottom: "1px solid #2C2C2E", color: "#FFD700",
                                fontWeight: 700, fontSize: "16px", width: "80px",
                                textAlign: "right", outline: "none", padding: "0 0 2px 0",
                                MozAppearance: "textfield"
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Total paid indicator */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", borderRadius: "10px", background: "#1E1E20"
                }}>
                  <span style={{ fontSize: "13px", color: "#6B6B72" }}>Paid total</span>
                  <span style={{
                    fontSize: "15px", fontWeight: 700,
                    color: isClose(totalPaid, numAmount) ? "#10B981" : "#EF4444"
                  }}>
                    ₹{totalPaid.toFixed(2)} <span style={{ color: "#4A4A52", fontWeight: 400 }}>/ ₹{numAmount.toFixed(2)}</span>
                  </span>
                </div>
              </>
            )}

            {/* ───── STEP 3: Split ───── */}
            {step === 3 && (
              <>
                <div className="d-flex gap-2 mb-4">
                  {["equal", "unequal"].map(type => (
                    <button
                      key={type}
                      onClick={() => setSplitType(type)}
                      style={{
                        flex: 1, padding: "10px",
                        borderRadius: "12px", border: "none",
                        background: splitType === type ? "rgba(157,92,255,0.12)" : "#1E1E20",
                        color: splitType === type ? "#9D5CFF" : "#6B6B72",
                        fontWeight: 600, fontSize: "14px", cursor: "pointer",
                        transition: "all 0.15s"
                      }}
                    >
                      {type === "equal" ? "Split Equally" : "Custom Split"}
                    </button>
                  ))}
                </div>

                {splitType === "equal" ? (
                  <div style={{ textAlign: "center", padding: "32px 0" }}>
                    <div style={{ fontSize: "13px", color: "#6B6B72", marginBottom: "6px" }}>Each person pays</div>
                    <div style={{ fontSize: "36px", fontWeight: 900, color: "#FFD700", letterSpacing: "-1px" }}>
                      ₹{equalShare.toFixed(2)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#4A4A52", marginTop: "4px" }}>
                      Split between {participants.length} {participants.length === 1 ? "person" : "people"}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="d-flex flex-column gap-1">
                      {participants.map(email => (
                        <div
                          key={email}
                          style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "10px 14px", borderRadius: "12px", background: "#1E1E20"
                          }}
                        >
                          <div style={{
                            width: "30px", height: "30px", borderRadius: "50%",
                            background: "rgba(157,92,255,0.12)", color: "#9D5CFF",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: "12px", flexShrink: 0
                          }}>
                            {email[0].toUpperCase()}
                          </div>
                          <div className="flex-grow-1" style={{ fontSize: "14px", fontWeight: 500, color: "#FFFFFF" }}>
                            {getName(email)}
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                            <span style={{ fontSize: "12px", color: "#6B6B72" }}>₹</span>
                            <input
                              type="number" step="0.01" placeholder="0"
                              value={splits[email] || ""}
                              onChange={e => setSplits(prev => ({ ...prev, [email]: e.target.value }))}
                              style={{
                                background: "transparent", border: "none",
                                borderBottom: "1px solid #2C2C2E", color: "#FFD700",
                                fontWeight: 700, fontSize: "16px", width: "80px",
                                textAlign: "right", outline: "none", padding: "0 0 2px 0",
                                MozAppearance: "textfield"
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 14px", borderRadius: "10px", background: "#1E1E20", marginTop: "8px"
                    }}>
                      <span style={{ fontSize: "13px", color: "#6B6B72" }}>Split total</span>
                      <span style={{
                        fontSize: "15px", fontWeight: 700,
                        color: isClose(totalSplit, numAmount) ? "#10B981" : "#EF4444"
                      }}>
                        ₹{totalSplit.toFixed(2)} <span style={{ color: "#4A4A52", fontWeight: 400 }}>/ ₹{numAmount.toFixed(2)}</span>
                      </span>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ───── STEP 4: Preview ───── */}
            {step === 4 && (
              <>
                {/* Title + Amount hero */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "13px", color: "#4A4A52", marginBottom: "4px" }}>{finalCategory}</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>{title}</div>
                  <div style={{ fontSize: "32px", fontWeight: 900, color: "#FFD700", letterSpacing: "-1px" }}>
                    ₹{numAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#4A4A52", marginLeft: "4px" }}>{currency}</span>
                  </div>
                </div>

                {/* Paid by section */}
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#4A4A52", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                    Paid by
                  </div>
                  <div className="d-flex flex-column gap-1">
                    {participants.filter(e => round2(payments[e]) > 0).map(email => (
                      <div key={email} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 12px", borderRadius: "10px", background: "#1E1E20"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "26px", height: "26px", borderRadius: "50%",
                            background: "rgba(157,92,255,0.12)", color: "#9D5CFF",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: "11px"
                          }}>
                            {email[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize: "13px", color: "#FFFFFF", fontWeight: 500 }}>{getName(email)}</span>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>
                          ₹{round2(payments[email]).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Split section */}
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#4A4A52", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                    Split ({splitType})
                  </div>
                  <div className="d-flex flex-column gap-1">
                    {participants.map(email => (
                      <div key={email} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 12px", borderRadius: "10px", background: "#1E1E20"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "26px", height: "26px", borderRadius: "50%",
                            background: "rgba(157,92,255,0.12)", color: "#9D5CFF",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: "11px"
                          }}>
                            {email[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize: "13px", color: "#FFFFFF", fontWeight: 500 }}>{getName(email)}</span>
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#FFD700" }}>
                          ₹{round2(splits[email]).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>

          {/* ── FOOTER ── */}
          <div className="px-4 pb-4 pt-2 d-flex gap-2">
            <button
              onClick={() => step === 1 ? (reset(), setIsOpen(false)) : setStep(step - 1)}
              style={{
                flex: 1, padding: "12px", borderRadius: "12px",
                background: "#222224", border: "none",
                color: "#6B6B72", fontWeight: 600, fontSize: "14px", cursor: "pointer"
              }}
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              disabled={loading}
              onClick={() => step < 4 ? handleNext() : handleSubmit()}
              style={{
                flex: 2, padding: "12px", borderRadius: "12px",
                background: step === 4 ? "#FFD700" : "#FFD700", border: "none",
                color: "#131315", fontWeight: 700, fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.15s"
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = loading ? "0.7" : "1"; }}
            >
              {loading ? "Saving..." : step === 4 ? "Add Expense" : step === 3 ? "Preview" : "Next"}
            </button>
          </div>

          {/* Hide number spinners */}
          <style>{`
            input[type=number]::-webkit-inner-spin-button,
            input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
            input[type=number] { -moz-appearance: textfield; }
          `}</style>

        </div>
      </div>
    </div>
  );
}

export default AddExpense;

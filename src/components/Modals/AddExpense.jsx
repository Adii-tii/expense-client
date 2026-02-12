import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverEndpoint } from "../../config/appConfig";

const PRIMARY = "#7C6CF2";
const PRIMARY_SOFT = "#F1EFFF";
const TEXT_MUTED = "#6B7280";

const round2 = (num) =>
  Math.round((Number(num || 0) + Number.EPSILON) * 100) / 100;

const isClose = (a, b) => Math.abs(a - b) < 0.01;

const EXPENSE_CATEGORIES = [
  { name: "Food", icon: "bi-cup-hot" },
  { name: "Travel", icon: "bi-airplane" },
  { name: "Shopping", icon: "bi-bag" },
  { name: "Bills", icon: "bi-receipt" },
  { name: "Entertainment", icon: "bi-film" },
  { name: "Health", icon: "bi-heart-pulse" },
  { name: "Other", icon: "bi-three-dots" }
];

function AddExpense({ setIsOpen, isOpen, group, refreshExpenses }) {

  const user = useSelector((s) => s.userDetails);
  const currentUserEmail = user?.email;

  const groupMembers = group?.memberEmail || [];

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [splitType, setSplitType] = useState("equal");

  const [category, setCategory] = useState("Other");
  const [customCategory, setCustomCategory] = useState("");

  const [participants, setParticipants] = useState([]);
  const [payers, setPayers] = useState([]);
  const [payments, setPayments] = useState({});
  const [splits, setSplits] = useState({});

  const [showAddDropdown, setShowAddDropdown] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const numAmount = round2(amount);

  /* ---------- RESET ---------- */

  const reset = () => {
    setStep(1);
    setTitle("");
    setAmount("");
    setParticipants([]);
    setPayers([]);
    setPayments({});
    setSplits({});
    setCategory("Other");
    setCustomCategory("");
    setError("");
  };

  /* ---------- INIT ---------- */

  useEffect(() => {
    if (!isOpen) return;

    setParticipants(groupMembers);

    const splitInit = {};
    groupMembers.forEach(e => splitInit[e] = 0);
    setSplits(splitInit);

  }, [isOpen, groupMembers]);

  /* ---------- INIT PAYERS (STEP 2) ---------- */

  useEffect(() => {
    if (!currentUserEmail) return;

    setPayers([currentUserEmail]);

    setPayments({
      [currentUserEmail]: numAmount
    });

  }, [step]);

  /* ---------- MAIN USER AUTO BALANCE ---------- */

  useEffect(() => {

    if (!payers.includes(currentUserEmail)) return;

    const othersTotal = Object.entries(payments)
      .filter(([email]) => email !== currentUserEmail)
      .reduce((a, [, v]) => a + Number(v || 0), 0);

    setPayments(prev => ({
      ...prev,
      [currentUserEmail]: round2(numAmount - othersTotal)
    }));

  }, [payments, numAmount]);

  /* ---------- DERIVED ---------- */

  const finalCategory =
    category === "Other" && customCategory.trim()
      ? customCategory.trim()
      : category;

  const equalShare = useMemo(() => {
    if (!participants.length || !numAmount) return 0;
    return round2(numAmount / participants.length);
  }, [participants, numAmount]);

  useEffect(() => {
    if (splitType !== "equal") return;

    const next = {};
    participants.forEach(p => next[p] = equalShare);
    setSplits(next);

  }, [equalShare, splitType, participants]);

  const totalPaid = round2(
    Object.values(payments).reduce((a, b) => a + Number(b || 0), 0)
  );

  /* ---------- ADD / REMOVE PAYERS ---------- */

  const addPayer = (email) => {
    setPayers(prev => [...prev, email]);

    setPayments(prev => ({
      ...prev,
      [email]: ""
    }));

    setShowAddDropdown(false);
  };

  const removePayer = (email) => {
    setPayers(prev => prev.filter(p => p !== email));

    setPayments(prev => {
      const copy = { ...prev };
      delete copy[email];
      return copy;
    });
  };

  /* ---------- VALIDATION ---------- */

  const validateStep = (target) => {

    if (target === 2) {
      if (!title.trim()) return "Expense title required";
      if (!numAmount || numAmount <= 0) return "Enter valid amount";
      if (!participants.length) return "Select participants";

      if (category === "Other" && !customCategory.trim())
        return "Enter custom category";
    }

    if (target === 3) {
      if (!isClose(totalPaid, numAmount))
        return "Paid amount mismatch";
    }

    return null;
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async () => {

    if (splitType === "unequal") {

      const totalSplit = Object.values(splits)
        .reduce((a, b) => a + Number(b || 0), 0);

      if (!isClose(totalSplit, numAmount))
        return setError("Split mismatch");
    }

    setLoading(true);

    try {

      const payload = {
        title,
        category: finalCategory,
        currency,
        amount: numAmount,
        splitType,
        paidBy: payers.map(email => ({
          email,
          amount: round2(payments[email])
        })),
        splits: participants.map(email => ({
          email,
          share: round2(splits[email]),
          remaining: round2(splits[email])
        }))
      };

      await axios.post(
        `${serverEndpoint}/groups/${group._id}/expenses`,
        payload,
        { withCredentials: true }
      );

      reset();
      setIsOpen(false);
      refreshExpenses();

    } catch {
      setError("Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const err = validateStep(step + 1);
    if (err) return setError(err);
    setError("");
    setStep(p => p + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg">

          <div className="modal-header border-0">
            <div>
              <h5 className="fw-semibold mb-1">Add Expense</h5>
              <small style={{ color: TEXT_MUTED }}>Step {step} of 3</small>
            </div>

            <button
              className="btn-close"
              onClick={() => { reset(); setIsOpen(false); }}
            />
          </div>

          <div className="modal-body">

            {error && <div className="alert alert-danger">{error}</div>}

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <input
                  className="form-control mb-3"
                  placeholder="Expense title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="row g-2 mb-3">
                  <div className="col-8">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Amount"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="col-4">
                    <select
                      className="form-select"
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                    >
                      <option>INR</option>
                      <option>USD</option>
                    </select>
                  </div>
                </div>

                <h6 className="mb-2 fw-semibold">Category</h6>

                <div className="row g-2 mb-2">
                  {EXPENSE_CATEGORIES.map(cat => {

                    const active = category === cat.name;

                    return (
                      <div key={cat.name} className="col-3">
                        <div
                          className="p-2 rounded-3 text-center"
                          style={{
                            cursor: "pointer",
                            border: `1px solid ${active ? PRIMARY : "#E5E7EB"}`,
                            background: active ? "#F1EFFF" : "white"
                          }}
                          onClick={() => setCategory(cat.name)}
                        >
                          <i className={`bi ${cat.icon}`} />
                          <div style={{ fontSize: "12px" }}>{cat.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {category === "Other" && (
                  <input
                    className="form-control mb-3"
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                )}

                <h6>Participants</h6>

                <div className="d-flex flex-wrap gap-2">
                  {groupMembers.map(email => (
                    <button
                      key={email}
                      className="btn rounded-pill px-3"
                      style={{
                        background: participants.includes(email)
                          ? PRIMARY
                          : "#F3F4F6",
                        color: participants.includes(email)
                          ? "white"
                          : "#111827"
                      }}
                      onClick={() =>
                        setParticipants(prev =>
                          prev.includes(email)
                            ? prev.filter(p => p !== email)
                            : [...prev, email]
                        )
                      }
                    >
                      {email}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                {payers.map(email => (
                  <div key={email} className="d-flex align-items-center mb-2">

                    <div style={{ flex: 1 }}>{email}</div>

                    <input
                      type="number"
                      className="form-control text-end"
                      style={{ width: 150 }}
                      value={payments[email] ?? ""}
                      onChange={(e) =>
                        setPayments(prev => ({
                          ...prev,
                          [email]: e.target.value
                        }))
                      }
                    />

                    {email !== currentUserEmail && (
                      <button
                        className="btn btn-sm ms-2"
                        onClick={() => removePayer(email)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <div
                  className="p-3 text-center rounded-3 mt-3"
                  style={{
                    border: `2px dashed ${PRIMARY}`,
                    background: PRIMARY_SOFT,
                    cursor: "pointer"
                  }}
                  onClick={() => setShowAddDropdown(v => !v)}
                >
                  + Add payer
                </div>

                {showAddDropdown && (
                  <select
                    className="form-select mt-2"
                    onChange={(e) => addPayer(e.target.value)}
                  >
                    <option>Select participant</option>

                    {participants
                      .filter(p => !payers.includes(p))
                      .map(p => (
                        <option key={p}>{p}</option>
                      ))}
                  </select>
                )}

                <div className="text-end mt-2 fw-semibold">
                  Total Paid ₹{totalPaid.toFixed(2)}
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <div className="mb-3">
                  {["equal", "unequal"].map(type => (
                    <button
                      key={type}
                      className="btn me-2 rounded-pill"
                      style={{
                        background: splitType === type ? PRIMARY : "#F3F4F6",
                        color: splitType === type ? "white" : "#111827"
                      }}
                      onClick={() => setSplitType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {splitType === "equal" && (
                  <div>Each pays ₹{equalShare.toFixed(2)}</div>
                )}

                {splitType === "unequal" && (
                  participants.map(email => (
                    <div key={email} className="d-flex mb-2">

                      <div style={{ flex: 1 }}>{email}</div>

                      <input
                        type="number"
                        className="form-control text-end"
                        style={{ width: 150 }}
                        value={splits[email] ?? ""}
                        onChange={(e) =>
                          setSplits(prev => ({
                            ...prev,
                            [email]: e.target.value
                          }))
                        }
                      />
                    </div>
                  ))
                )}
              </>
            )}

          </div>

          <div className="modal-footer border-0">

            <button
              className="btn"
              onClick={() =>
                step === 1 ? (reset(), setIsOpen(false)) : setStep(step - 1)
              }
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              className="btn text-white"
              style={{ background: PRIMARY }}
              disabled={loading}
              onClick={() => step < 3 ? handleNext() : handleSubmit()}
            >
              {loading ? "Saving..." : step === 3 ? "Add Expense" : "Next"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AddExpense;

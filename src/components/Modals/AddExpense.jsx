import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/appConfig";
import { useSelector } from "react-redux";

const PRIMARY = "#7C6CF2";
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

  const groupMembers = group?.memberEmail || [];

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [splitType, setSplitType] = useState("equal");

  const [category, setCategory] = useState("Other");
  const [customCategory, setCustomCategory] = useState("");

  const [participants, setParticipants] = useState([]);
  const [payments, setPayments] = useState({});
  const [splits, setSplits] = useState({});

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------- RESET ---------- */

  const reset = () => {
    setStep(1);
    setTitle("");
    setAmount("");
    setParticipants([]);
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

    const pay = {};
    const split = {};

    groupMembers.forEach(e => {
      pay[e] = 0;
      split[e] = 0;
    });

    setPayments(pay);
    setSplits(split);

  }, [isOpen, groupMembers]);

  /* ---------- DERIVED ---------- */

  const numAmount = round2(amount);

  const finalCategory =
    category === "Other" && customCategory.trim()
      ? customCategory.trim()
      : category;

  const equalShare = useMemo(() => {
    if (!participants.length || !numAmount) return 0;
    return round2(numAmount / participants.length);
  }, [participants, numAmount]);

  const totalPaid = round2(
    Object.values(payments).reduce((a, b) => a + Number(b || 0), 0)
  );

  const totalSplit = round2(
    Object.values(splits).reduce((a, b) => a + Number(b || 0), 0)
  );

  /* ---------- VALIDATION ---------- */

  const validate = () => {

    if (!title.trim()) return "Expense title required";
    if (!numAmount || numAmount <= 0) return "Enter valid amount";
    if (!participants.length) return "Select participants";

    if (category === "Other" && !customCategory.trim())
      return "Enter custom category";

    if (!isClose(totalPaid, numAmount))
      return "Paid amount must match total";

    if (splitType === "unequal" && !isClose(totalSplit, numAmount))
      return "Split must match total";

    return null;
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async () => {

    const err = validate();
    if (err) return setError(err);

    setLoading(true);

    try {

      const payload = {
        title,
        category: finalCategory,
        currency,
        amount: numAmount,
        splitType,
        paidBy: participants.map(email => ({
          email,
          amount: round2(payments[email])
        })),
        splits: participants.map(email => ({
          email,
          share: splitType === "equal"
            ? equalShare
            : round2(splits[email]),
          remaining: splitType === "equal"
            ? equalShare
            : round2(splits[email])
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
                      step="0.01"
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

                {/* CATEGORY */}
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
                          <i
                            className={`bi ${cat.icon}`}
                            style={{
                              fontSize: "18px",
                              color: active ? PRIMARY : TEXT_MUTED
                            }}
                          />
                          <div style={{ fontSize: "12px" }}>{cat.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CUSTOM CATEGORY INPUT */}
                {category === "Other" && (
                  <input
                    className="form-control mb-3"
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                )}

                {/* PARTICIPANTS */}
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
            )
          }

            {/* STEP 2 */}
            {step === 2 && (
              <>
                {participants.map(email => (
                  <div key={email} className="row mb-2">
                    <div className="col-6">{email}</div>
                    <div className="col-6">
                      <input
                        type="number"
                        step="0.01"
                        className="form-control text-end"
                        value={payments[email] || ""}
                        onChange={(e) =>
                          setPayments(prev => ({
                            ...prev,
                            [email]: e.target.value
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}
                <small>Total Paid ₹{totalPaid.toFixed(2)}</small>
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
                  <>
                    {participants.map(email => (
                      <div key={email} className="row mb-2">
                        <div className="col-6">{email}</div>
                        <div className="col-6">
                          <input
                            type="number"
                            step="0.01"
                            className="form-control text-end"
                            value={splits[email] || ""}
                            onChange={(e) =>
                              setSplits(prev => ({
                                ...prev,
                                [email]: e.target.value
                              }))
                            }
                          />
                        </div>
                      </div>
                    ))}
                    <small>Total Split ₹{totalSplit.toFixed(2)}</small>
                  </>
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
              onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
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

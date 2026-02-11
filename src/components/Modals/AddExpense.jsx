import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/appConfig";
import { useSelector } from "react-redux";

const PRIMARY = "#7C6CF2";
const BORDER = "#E5E7EB";
const TEXT_MUTED = "#6B7280";

/* ===== ROUNDING ===== */
const round2 = (num) =>
  Math.round((Number(num) + Number.EPSILON) * 100) / 100;

function AddExpense({ setIsOpen, isOpen, group, refreshExpenses }) {

  const user = useSelector(state => state.userDetails);
  const groupMembers = group?.memberEmail || [];

  /* ---------------- STATE ---------------- */

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [splitType, setSplitType] = useState("equal");

  const [participants, setParticipants] = useState([]);
  const [payments, setPayments] = useState({});
  const [splits, setSplits] = useState({});

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- RESET ---------------- */

  const reset = () => {
    setStep(1);
    setTitle("");
    setAmount("");
    setParticipants([]);
    setPayments({});
    setSplits({});
    setError("");
  };

  /* ---------------- INIT ---------------- */

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


  /* ---------------- DERIVED ---------------- */

  const equalShare = useMemo(() => {

    if (!participants.length || !amount) return 0;
    return round2(Number(amount) / participants.length);

  }, [participants, amount]);

  const totalPaid = round2(
    Object.values(payments).reduce((a, b) => a + Number(b || 0), 0)
  );

  const totalSplit = round2(
    Object.values(splits).reduce((a, b) => a + Number(b || 0), 0)
  );

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {

    if (!title.trim()) return "Expense title is required";
    if (!amount || amount <= 0) return "Enter valid amount";
    if (!participants.length) return "Select at least one participant";

    if (totalPaid !== Number(amount))
      return "Paid amount must equal total expense";

    if (splitType === "unequal" && totalSplit !== Number(amount))
      return "Split amount must equal total expense";

    return null;
  };

  /* ---------------- TOGGLE PARTICIPANTS ---------------- */

  const toggleParticipant = (email) => {

    if (participants.includes(email)) {

      setParticipants(prev => prev.filter(p => p !== email));

    } else {

      setParticipants(prev => [...prev, email]);

    }
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {

    const err = validate();
    if (err) return setError(err);

    setLoading(true);

    try {

      const payload = {
        title,
        currency,
        amount: round2(amount),
        splitType,
        paidBy: participants.map(email => ({
          email,
          amount: round2(payments[email] || 0)
        })),
        splits: participants.map(email => ({
          email,
          share: splitType === "equal"
            ? equalShare
            : round2(splits[email] || 0),
          remaining: splitType === "equal"
            ? equalShare
            : round2(splits[email] || 0)
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

  /* ---------------- UI ---------------- */

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg">

          {/* HEADER */}
          <div className="modal-header border-0">
            <div>
              <h5 className="fw-semibold mb-1">Add Expense</h5>
              <small style={{ color: TEXT_MUTED }}>Step {step} of 3</small>
            </div>

            <button className="btn-close" onClick={() => { reset(); setIsOpen(false); }} />
          </div>

          <div className="modal-body">

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            {/* ===== STEP 1 ===== */}
            {step === 1 && (
              <>
                <h6 className="mb-3 fw-semibold">Expense Details</h6>

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

                <h6 className="mb-2 fw-semibold">Participants</h6>

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
                      onClick={() => toggleParticipant(email)}
                    >
                      {email}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ===== STEP 2 ===== */}
            {step === 2 && (
              <>
                <h6 className="mb-3 fw-semibold">Who Paid?</h6>

                {participants.map(email => (
                  <div key={email} className="row align-items-center mb-2">
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
                            [email]: round2(e.target.value)
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}

                <small>Total Paid ₹{totalPaid.toFixed(2)}</small>
              </>
            )}

            {/* ===== STEP 3 ===== */}
            {step === 3 && (
              <>
                <h6 className="mb-3 fw-semibold">Split Method</h6>

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
                  <div>
                    Each pays ₹{equalShare.toFixed(2)}
                  </div>
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
                                [email]: round2(e.target.value)
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

          {/* FOOTER */}
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

import { useState, useEffect } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/appConfig";
import { useSelector } from "react-redux";

function AddExpense({ setIsOpen, isOpen, group, refreshExpenses }) {

  const user = useSelector((state) => state.userDetails);
  const groupMembers = group?.memberEmail || [];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    currency: "INR",
    amount: "",
    splitType: "equal"
  });

  const [participants, setParticipants] = useState([]);
  const [payments, setPayments] = useState({});
  const [splits, setSplits] = useState({});


  useEffect(() => {

    if (!groupMembers.length) return;

    setParticipants(groupMembers);

    const pay = {};
    const split = {};

    groupMembers.forEach(email => {
      pay[email] = email === user.email ? 0 : 0;
      split[email] = 0;
    });

    setPayments(pay);
    setSplits(split);

  }, [groupMembers]);

  if (!isOpen) return null;


  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? Number(value) || "" : value
    }));
  };

  const toggleParticipant = (email) => {

    let updated;

    if (participants.includes(email)) {
      updated = participants.filter(p => p !== email);
    } else {
      updated = [...participants, email];
    }

    setParticipants(updated);

    setPayments(prev => {
      const copy = { ...prev };
      updated.includes(email) ? copy[email] = 0 : delete copy[email];
      return copy;
    });

    setSplits(prev => {
      const copy = { ...prev };
      updated.includes(email) ? copy[email] = 0 : delete copy[email];
      return copy;
    });
  };


  const addPaidBy = () => {

    const remaining = groupMembers.find(
      m => !Object.keys(payments).includes(m)
    );

    if (!remaining) return;

    setPayments(prev => ({
      ...prev,
      [remaining]: 0
    }));
  };

  const removePaidBy = (email) => {
    setPayments(prev => {
      const copy = { ...prev };
      delete copy[email];
      return copy;
    });
  };


  const totalPaid = Object.values(payments).reduce((a, b) => a + b, 0);

  const equalShare =
    participants.length && formData.amount
      ? Number(formData.amount) / participants.length
      : 0;

  const totalSplit = Object.values(splits).reduce((a, b) => a + b, 0);

  const paidMismatch =
    formData.amount && totalPaid !== Number(formData.amount);


  const validate = () => {

    if (!formData.title.trim()) return "Title required";
    if (!formData.amount || formData.amount <= 0) return "Valid amount required";
    if (!participants.length) return "Select participants";

    if (paidMismatch) return "Paid total must match amount";

    if (formData.splitType !== "equal" && totalSplit !== Number(formData.amount)) {
      return "Split total must match amount";
    }

    return null;
  };


  const handleSubmit = async () => {

    const err = validate();
    if (err) return setError(err);

    setLoading(true);

    try {

      const preparedSplits = participants.map(email => ({
        email,
        share: formData.splitType === "equal"
          ? equalShare
          : splits[email],
        remaining: formData.splitType === "equal"
          ? equalShare
          : splits[email]
      }));

      const payload = {
        title: formData.title,
        currency: formData.currency,
        amount: Number(formData.amount),
        splitType: formData.splitType,
        splits: preparedSplits,
        paidBy: Object.entries(payments).map(([email, amount]) => ({
          email,
          amount
        }))
      };

      await axios.post(
        `${serverEndpoint}/groups/${group._id}/expenses`,
        payload,
        { withCredentials: true }
      );

      setIsOpen(false);
      setFormData({
        title: "",
        currency: "INR",
        amount: "",
        splitType: "equal"
      });
      setStep(1)
      refreshExpenses();

    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.35)" }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div
          className="modal-content rounded-4"
          style={{
            border: "1px solid #ECECF2",
            boxShadow: "0 30px 60px rgba(0,0,0,0.2)"
          }}
        >

          {/* HEADER */}
          <div className="modal-header border-0">
            <div>
              <h5 className="fw-semibold mb-0">Add Expense</h5>
              <small className="text-muted">
                Step {step} of 3
              </small>
            </div>
            <button className="btn-close" onClick={() => setIsOpen(false)} />
          </div>

          {/* BODY */}
          <div className="modal-body">

            {error && <div className="alert alert-danger">{error}</div>}

            {step === 1 && (
              <>
                <h6 className="fw-semibold mb-3">Expense Details</h6>

                <input
                  className="form-control mb-3"
                  placeholder="Expense title"
                  value={formData.title}
                  onChange={e => handleChange("title", e.target.value)}
                />

                <div className="d-flex gap-2 mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={e => handleChange("amount", e.target.value)}
                  />
                  <select
                    className="form-select"
                    value={formData.currency}
                    onChange={e => handleChange("currency", e.target.value)}
                  >
                    <option>INR</option>
                    <option>USD</option>
                  </select>
                </div>

                <h6 className="fw-semibold mb-2">Participants</h6>

                <div className="d-flex flex-wrap gap-2">
                  {groupMembers.map(email => (
                    <button
                      key={email}
                      className="btn rounded-pill px-3"
                      style={{
                        background: participants.includes(email)
                          ? "#7C6CF2"
                          : "#F3F4F8",
                        color: participants.includes(email)
                          ? "white"
                          : "#2B2D42"
                      }}
                      onClick={() => toggleParticipant(email)}
                    >
                      {email}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h6 className="fw-semibold mb-3">Who Paid?</h6>

                {Object.keys(payments).map(email => (
                  <div key={email} className="d-flex align-items-center gap-2 mb-2">

                    <span style={{ width: "40%" }}>{email}</span>

                    <input
                      type="number"
                      className="form-control"
                      value={payments[email]}
                      onChange={e =>
                        setPayments(p => ({
                          ...p,
                          [email]: Number(e.target.value)
                        }))
                      }
                    />

                    <button
                      className="btn btn-sm text-danger"
                      onClick={() => removePaidBy(email)}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  className="btn w-100 mt-2"
                  style={{
                    border: "2px dashed #7C6CF2",
                    color: "#7C6CF2"
                  }}
                  onClick={addPaidBy}
                >
                  + Add another payer
                </button>

                {paidMismatch && (
                  <div className="alert alert-danger mt-3 py-2">
                    Paid total must equal expense amount
                  </div>
                )}

                <small>Total paid: ₹{totalPaid}</small>
              </>
            )}

            {step === 3 && (
              <>
                <h6 className="fw-semibold mb-3">Split Type</h6>

                {["equal", "unequal", "share"].map(type => (
                  <button
                    key={type}
                    className="btn rounded-pill me-2"
                    style={{
                      background:
                        formData.splitType === type
                          ? "#7C6CF2"
                          : "#F3F4F8",
                      color:
                        formData.splitType === type
                          ? "white"
                          : "#2B2D42"
                    }}
                    onClick={() => handleChange("splitType", type)}
                  >
                    {type}
                  </button>
                ))}

                <button
                  className="btn border rounded-pill ms-2"
                  onClick={() => handleChange("splitType", "custom")}
                >
                  Custom
                </button>

                {formData.splitType === "equal" && (
                  <div className="mt-3">
                    Each owes ₹{equalShare.toFixed(2)}
                  </div>
                )}
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="modal-footer border-0">

            <button
              className="btn"
              disabled={loading}
              onClick={() =>
                step === 1 ? setIsOpen(false) : setStep(step - 1)
              }
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              className="btn text-white"
              style={{ background: "#7C6CF2" }}
              disabled={loading || (step === 2 && paidMismatch)}
              onClick={() =>
                step < 3 ? setStep(step + 1) : handleSubmit()
              }
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

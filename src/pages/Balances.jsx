import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useNavigate } from "react-router-dom";

function Balances() {

  const navigate = useNavigate();

  const [debts, setDebts] = useState([]);
  const [credits, setCredits] = useState([]);

  const [loadingDebts, setLoadingDebts] = useState(true);
  const [loadingCredits, setLoadingCredits] = useState(true);

  /* ===== FETCH DEBTS ===== */

  const fetchDebts = async () => {
    try {

      const res = await axios.get(
        `${serverEndpoint}/dashboard/quick-settle`,
        { withCredentials: true }
      );

      setDebts(res.data.debts || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDebts(false);
    }
  };

  /* ===== FETCH CREDITS ===== */

  const fetchCredits = async () => {
    try {

      const res = await axios.get(
        `${serverEndpoint}/dashboard/quick-receive`,
        { withCredentials: true }
      );

      setCredits(res.data.credits || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCredits(false);
    }
  };

  useEffect(() => {
    fetchDebts();
    fetchCredits();
  }, []);

  /* ===== UI HELPERS ===== */

  const DebtCard = ({ item }) => (
    <div
      className="d-flex justify-content-between align-items-center p-3 rounded-4"
      style={{
        border: "1px solid #ECECF2",
        background: "#FFFFFF"
      }}
    >

      <div>
        <div style={{ fontWeight: 600 }}>
          {item.to}
        </div>

        <small style={{ color: "#6B7280" }}>
          {item.groupName}
        </small>
      </div>

      <div className="text-end">

        <div style={{
          color: "#DC2626",
          fontWeight: 700,
          fontSize: "18px"
        }}>
          ₹{item.amount.toFixed(2)}
        </div>

        <button
          className="btn btn-sm mt-1"
          style={{
            background: "#7C6CF2",
            color: "white",
            borderRadius: "999px",
            padding: "3px 14px",
            fontWeight: 600
          }}
          onClick={() =>
            navigate(`/groups/${item.groupId}`, {
              state: {
                openSettle: true,
                creditor: item.to
              }
            })
          }
        >
          Settle
        </button>

      </div>

    </div>
  );

  const CreditCard = ({ item }) => (
    <div
      className="d-flex justify-content-between align-items-center p-3 rounded-4"
      style={{
        border: "1px solid #ECECF2",
        background: "#FFFFFF"
      }}
    >

      <div>
        <div style={{ fontWeight: 600 }}>
          {item.from}
        </div>

        <small style={{ color: "#6B7280" }}>
          {item.groupName}
        </small>
      </div>

      <div style={{
        color: "#16A34A",
        fontWeight: 700,
        fontSize: "18px"
      }}>
        ₹{item.amount.toFixed(2)}
      </div>

    </div>
  );

  /* ===== RENDER ===== */

  return (
    <div className="container-fluid bg-light p-4">

      <h4 className="fw-semibold mb-4">
        Balances
      </h4>

      <div className="row g-4">

        {/* ===== YOU OWE ===== */}
        <div className="col-lg-6">

          <div
            className="bg-white p-4 rounded-4 shadow-sm h-100"
            style={{ border: "1px solid #ECECF2" }}
          >

            <h6 className="fw-semibold mb-3">
              You Owe
            </h6>

            <div className="d-flex flex-column gap-3">

              {loadingDebts &&
                [...Array(4)].map((_, i) => (
                  <div key={i}
                    className="rounded-4"
                    style={{
                      height: "70px",
                      background: "#F3F4F6"
                    }}
                  />
                ))}

              {!loadingDebts && debts.length === 0 && (
                <div className="text-muted text-center py-3">
                  No debts 🎉
                </div>
              )}

              {debts.map(d => (
                <DebtCard key={`${d.groupId}-${d.to}`} item={d} />
              ))}

            </div>

          </div>

        </div>

        {/* ===== YOU ARE OWED ===== */}
        <div className="col-lg-6">

          <div
            className="bg-white p-4 rounded-4 shadow-sm h-100"
            style={{ border: "1px solid #ECECF2" }}
          >

            <h6 className="fw-semibold mb-3">
              You Are Owed
            </h6>

            <div className="d-flex flex-column gap-3">

              {loadingCredits &&
                [...Array(4)].map((_, i) => (
                  <div key={i}
                    className="rounded-4"
                    style={{
                      height: "70px",
                      background: "#F3F4F6"
                    }}
                  />
                ))}

              {!loadingCredits && credits.length === 0 && (
                <div className="text-muted text-center py-3">
                  Nobody owes you
                </div>
              )}

              {credits.map(c => (
                <CreditCard key={`${c.groupId}-${c.from}`} item={c} />
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Balances;

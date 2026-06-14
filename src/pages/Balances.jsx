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

  const PRIMARY = "#9D5CFF";
  const PRIMARY_SOFT = "rgba(157, 92, 255, 0.15)";
  const TEXT_MAIN = "#FFFFFF";
  const TEXT_MUTED = "#A1A1AA";
  const GREEN = "#10B981";
  const YELLOW = "#FFD02F";
  const BG_CARD = "#1B1B1D";

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

  const getInitial = (nameOrEmail) =>
    nameOrEmail?.[0]?.toUpperCase() || "?";

  const DebtCard = ({ item }) => (
    <div
      className="d-flex justify-content-between align-items-center p-3 rounded-4"
      style={{
        border: "none",
        background: BG_CARD,
        transition: "transform 0.2s ease, background 0.2s ease",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        {/* Avatar */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
          style={{
            width: "38px",
            height: "38px",
            fontSize: "14px",
            background: "rgba(255, 208, 47, 0.15)",
            color: YELLOW,
          }}
        >
          {getInitial(item.to)}
        </div>

        <div>
          <div style={{ fontWeight: 600, color: TEXT_MAIN, fontSize: "14px" }}>
            {item.to}
          </div>
          <div style={{ color: TEXT_MUTED, fontSize: "12px", marginTop: "1px" }}>
            {item.groupName}
          </div>
        </div>
      </div>

      <div className="text-end">
        <div style={{
          color: YELLOW,
          fontWeight: 500,
          fontSize: "16px"
        }}>
          ₹{item.amount.toFixed(2)}
        </div>

        <button
          className="btn btn-sm mt-2"
          style={{
            background: YELLOW,
            color: "#131315",
            borderRadius: "999px",
            padding: "3px 14px",
            fontSize: "11px",
            fontWeight: 600,
            border: "none",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "none";
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
          Settle Up
        </button>
      </div>
    </div>
  );

  const CreditCard = ({ item }) => (
    <div
      className="d-flex justify-content-between align-items-center p-3 rounded-4"
      style={{
        border: "none",
        background: BG_CARD,
        transition: "transform 0.2s ease, background 0.2s ease",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        {/* Avatar */}
        <div
          className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
          style={{
            width: "38px",
            height: "38px",
            fontSize: "14px",
            background: PRIMARY_SOFT,
            color: PRIMARY,
          }}
        >
          {getInitial(item.from)}
        </div>

        <div>
          <div style={{ fontWeight: 600, color: TEXT_MAIN, fontSize: "14px" }}>
            {item.from}
          </div>
          <div style={{ color: TEXT_MUTED, fontSize: "12px", marginTop: "1px" }}>
            {item.groupName}
          </div>
        </div>
      </div>

      <div style={{
        color: GREEN,
        fontWeight: 500,
        fontSize: "16px"
      }}>
        ₹{item.amount.toFixed(2)}
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-0">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="fw-semibold mb-0" style={{ letterSpacing: "-0.5px" }}>
          Balances
        </h4>
      </div>

      <div className="row g-4">
        {/* ===== YOU OWE ===== */}
        <div className="col-lg-6">
          <div
            className="p-4 rounded-4"
            style={{
              background: "#161618",
              height: "100%",
              minHeight: "400px"
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="fw-semibold text-white mb-0">
                You Owe
              </h6>
              {!loadingDebts && debts.length > 0 && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 9px",
                    borderRadius: "999px",
                    background: "rgba(255, 208, 47, 0.15)",
                    color: YELLOW,
                  }}
                >
                  {debts.length} {debts.length === 1 ? "debt" : "debts"}
                </span>
              )}
            </div>

            <div className="d-flex flex-column gap-3">
              {loadingDebts &&
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-4 placeholder-wave"
                    style={{
                      height: "70px",
                      background: "#1B1B1D"
                    }}
                  />
                ))}

              {!loadingDebts && debts.length === 0 && (
                <div className="text-center py-5">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: "56px",
                      height: "56px",
                      background: "rgba(16, 185, 129, 0.12)",
                      color: GREEN,
                    }}
                  >
                    <i className="bi bi-emoji-smile" style={{ fontSize: "24px" }} />
                  </div>
                  <div className="text-white fw-medium" style={{ fontSize: "14px" }}>
                    All settled up!
                  </div>
                  <p className="text-muted small mt-1 mb-0">
                    You don't owe any money.
                  </p>
                </div>
              )}

              {!loadingDebts && debts.map(d => (
                <DebtCard key={`${d.groupId}-${d.to}`} item={d} />
              ))}
            </div>
          </div>
        </div>

        {/* ===== YOU ARE OWED ===== */}
        <div className="col-lg-6">
          <div
            className="p-4 rounded-4"
            style={{
              background: "#161618",
              height: "100%",
              minHeight: "400px"
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="fw-semibold text-white mb-0">
                You Are Owed
              </h6>
              {!loadingCredits && credits.length > 0 && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 9px",
                    borderRadius: "999px",
                    background: PRIMARY_SOFT,
                    color: PRIMARY,
                  }}
                >
                  {credits.length} {credits.length === 1 ? "credit" : "credits"}
                </span>
              )}
            </div>

            <div className="d-flex flex-column gap-3">
              {loadingCredits &&
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-4 placeholder-wave"
                    style={{
                      height: "70px",
                      background: "#1B1B1D"
                    }}
                  />
                ))}

              {!loadingCredits && credits.length === 0 && (
                <div className="text-center py-5">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: "56px",
                      height: "56px",
                      background: "rgba(161, 161, 170, 0.12)",
                      color: TEXT_MUTED,
                    }}
                  >
                    <i className="bi bi-wallet2" style={{ fontSize: "24px" }} />
                  </div>
                  <div className="text-white fw-medium" style={{ fontSize: "14px" }}>
                    No pending credits
                  </div>
                  <p className="text-muted small mt-1 mb-0">
                    Nobody owes you money right now.
                  </p>
                </div>
              )}

              {!loadingCredits && credits.map(c => (
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

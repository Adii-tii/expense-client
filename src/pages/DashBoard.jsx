import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useNavigate } from "react-router-dom";

import SummaryCards from "../components/SummaryCards";
import GroupCard from "../components/GroupCard";
import CategorySpendCard from "../components/Cards/CategorySpendCard";
import QuickSettleCard from "../components/Cards/QuickSettleCard";

function Dashboard() {

  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [debts, setDebts] = useState([]);

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingDebts, setLoadingDebts] = useState(true);

  /* ================= FETCH DATA ================= */

  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        `${serverEndpoint}/groups/my-groups?limit=5`,
        { withCredentials: true }
      );
      setGroups(res.data.groups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${serverEndpoint}/dashboard/grouped-by-category`,
        { withCredentials: true }
      );
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

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

  useEffect(() => {
    fetchGroups();
    fetchCategories();
    fetchDebts();
  }, []);

  const visibleDebts = debts.slice(0, 6);

  /* ================= SECTION WRAPPER ================= */

  const SectionWrapper = ({ title, onViewAll, children }) => (
    <div className="bg-white p-4 rounded-4 shadow-sm"
      style={{ border: "1px solid #ECECF2" }}>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0">{title}</h6>

        {onViewAll && (
          <span
            style={{
              fontSize: "13px",
              color: "#7C6CF2",
              fontWeight: 600,
              cursor: "pointer"
            }}
            onClick={onViewAll}
          >
            View All
          </span>
        )}
      </div>

      {children}
    </div>
  );

  return (
    <div className="container-fluid bg-light ps-5">

      {/* SUMMARY */}
      <div className="row g-3 mb-4 mt-3 pt-4">
        <SummaryCards />
      </div>

      {/* MAIN DASHBOARD ROW */}
      <div className="row g-3 mb-4">

        {/* ===== GROUPS MAIN GRID ===== */}
        <div className="col-lg-8">

          <div
            className="bg-white p-4 rounded-4 border-0"
            style={{ border: "1px solid #ECECF2" }}
          >

            <div className="d-flex justify-content-between mb-3">
              <h6 className="fw-semibold">Your Groups</h6>

              <span
                style={{ color: "#7C6CF2", cursor: "pointer", fontWeight: 600 }}
                onClick={() => navigate("/groups")}
              >
                View All
              </span>
            </div>

            <div className="row g-4">

              {loadingGroups &&
                [...Array(6)].map((_, i) => (
                  <div key={i} className="col-xl-4 col-md-6">
                    <div
                      className="rounded-4"
                      style={{
                        height: "160px",
                        background: "#F3F4F6",
                        animation: "pulse 1.5s infinite"
                      }}
                    />
                  </div>
                ))}

              {groups.map(group => (
                <div key={group._id} className="col-xl-4 col-md-6">
                  <GroupCard group={group} />
                </div>
              ))}

              {!loadingGroups && (
                <div className="col-xl-4 col-md-6">

                  <div
                    className="d-flex align-items-center justify-content-center rounded-4"
                    style={{
                      height: "290px",
                      border: "2px dashed #7C6CF2",
                      color: "#7C6CF2",
                      cursor: "pointer"
                    }}
                    onClick={() => navigate("/groups")}
                  >
                    + Create New Group
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* ===== QUICK SETTLE SIDE COLUMN ===== */}
        <div className="col-lg-4">

          <div
            className="bg-white p-4 rounded-4 border-0 h-100"
            style={{ border: "1px solid #ECECF2" }}
          >
            <div className="d-flex justify-content-between mb-3">
              <h6 className="fw-semibold">Quick Settle</h6>

              <span
                style={{ color: "#7C6CF2", cursor: "pointer", fontWeight: 600 }}
                onClick={() => navigate("/balances")}
              >
                View All
              </span>
            </div>

            <div className="d-flex flex-column gap-3">

              {loadingDebts &&
                [...Array(3)].map((_, i) => (
                  <div key={i}
                    className="rounded-4"
                    style={{
                      height: "70px",
                      background: "#F3F4F6",
                      animation: "pulse 1.5s infinite"
                    }}
                  />
                ))}

              {!loadingDebts && debts.length === 0 && (
                <div className="text-center text-muted py-3">
                  You're all settled.
                </div>
              )}

              {debts.slice(0, 5).map(debt => (
                <QuickSettleCard
                  key={`${debt.groupId}-${debt.to}`}
                  debt={debt}
                  onSettle={(d) =>
                    navigate(`/groups/${d.groupId}`, {
                      state: { openSettle: true, creditor: d.to }
                    })
                  }
                />
              ))}

            </div>
          </div>
        </div>

        

      </div>

      {/* ===== CATEGORY SPENDING ===== */}
      <div className="row g-3">

        <div className="col-12">

          <div
            className="bg-white p-4 rounded-4 border-0"
            style={{ border: "1px solid #ECECF2" }}
          >

            <h6 className="fw-semibold mb-3">Spending by Category</h6>

            <div className="row g-3">

              {loadingCategories &&
                [...Array(4)].map((_, i) => (
                  <div key={i} className="col-xl-3 col-md-6">
                    <div
                      className="rounded-4"
                      style={{
                        height: "90px",
                        background: "#F3F4F6",
                        animation: "pulse 1.5s infinite"
                      }}
                    />
                  </div>
                ))}


              {categories.map(cat => (
                <div key={cat.category} className="col-xl-3 col-md-6">
                  <CategorySpendCard categoryData={cat} />
                </div>
              ))}

              {!loadingCategories && categories.length==0 && (
                <div className="text-muted text-center">
                  Start with creating an expense
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );


}

export default Dashboard;

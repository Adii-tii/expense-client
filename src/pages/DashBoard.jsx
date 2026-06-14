import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useNavigate } from "react-router-dom";

import SummaryCards from "../components/SummaryCards";
import DashboardGroupCard from "../components/Cards/DashboardGroupCard";
import CategoryPieChart from "../components/Cards/CategoryPieChart";
import RecentActivitiesCard from "../components/Cards/RecentActivitiesCard";

function Dashboard() {

  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  /* ================= FETCH DATA ================= */

  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        `${serverEndpoint}/groups/my-groups?limit=3`,
        { withCredentials: true }
      );
      setGroups((res.data.groups || []).slice(0, 3));
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

  useEffect(() => {
    fetchGroups();
    fetchCategories();
  }, []);



  /* ================= SECTION WRAPPER ================= */

  const SectionWrapper = ({ title, onViewAll, children }) => (
    <div className="bg-white p-4 rounded-4 shadow-sm"
      style={{ border: "none" }}>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0">{title}</h6>

        {onViewAll && (
          <span
            style={{
              fontSize: "13px",
              color: "#9D5CFF",
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
    <div className="container-fluid px-0">

      {/* SUMMARY */}
      <div className="row g-3 mb-4 mt-0 pt-0">
        <SummaryCards />
      </div>

      {/* MAIN DASHBOARD ROW */}
      <div className="row g-3 mb-4">

        {/* ===== GROUPS MAIN GRID ===== */}
        <div className="col-lg-8">

          <div
            className="bg-white p-4 rounded-4 border-0 h-100"
            style={{ border: "none" }}
          >

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold mb-0">Your Groups</h6>

              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-sm d-flex align-items-center gap-2"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    color: "#A1A1AA",
                    border: "1px solid #39393B",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    fontWeight: 600,
                    fontSize: "12px",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => navigate("/groups", { state: { openCreate: true } })}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(157, 92, 255, 0.1)";
                    e.currentTarget.style.color = "#9D5CFF";
                    e.currentTarget.style.borderColor = "rgba(157, 92, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.color = "#A1A1AA";
                    e.currentTarget.style.borderColor = "#39393B";
                  }}
                >
                  <i className="bi bi-plus-lg"></i> Create Group
                </button>
                <span
                  style={{ color: "#9D5CFF", cursor: "pointer", fontWeight: 600, fontSize: "14px" }}
                  onClick={() => navigate("/groups")}
                >
                  View All
                </span>
              </div>
            </div>

            <div className="row g-4">

              {loadingGroups &&
                [...Array(3)].map((_, i) => (
                  <div key={i} className="col-xl-4 col-md-6">
                    <div
                      className="rounded-4"
                      style={{
                        height: "250px",
                        background: "#1B1B1D",
                        animation: "pulse 1.5s infinite"
                      }}
                    />
                  </div>
                ))}

              {groups.map(group => (
                <div key={group._id} className="col-xl-4 col-md-6">
                  <DashboardGroupCard group={group} />
                </div>
              ))}

              {!loadingGroups && groups.length === 0 && (
                <div className="col-12 text-center text-muted py-5">
                  No groups created yet. Click "Create Group" above to start!
                </div>
              )}

            </div>

          </div>

        </div>

        {/* ===== CATEGORY PIE CHART SIDE COLUMN ===== */}
        <div className="col-lg-4">

          <div
            className="bg-white p-4 rounded-4 border-0 h-100 d-flex flex-column"
            style={{ border: "none" }}
          >
            <h6 className="fw-semibold mb-3">Spending by Category</h6>

            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
              {loadingCategories ? (
                <div
                  className="spinner-border"
                  role="status"
                  style={{ color: "#9D5CFF" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <CategoryPieChart categories={categories} />
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ===== BOTTOM SECTION ===== */}
      <div className="row g-3 mb-4">

        {/* ===== RECENT ACTIVITIES ===== */}
        <div className="col-12">
          <RecentActivitiesCard />
        </div>

      </div>

    </div>
  );


}

export default Dashboard;

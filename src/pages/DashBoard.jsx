import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useNavigate } from "react-router-dom";
import SummaryCards from "../components/SummaryCards";
import GroupCard from "../components/GroupCard";

function Dashboard() {

  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  /* ================= FETCH GROUPS ================= */

  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        `${serverEndpoint}/groups/my-groups?limit=3`,
        { withCredentials: true }
      );

      setGroups(res.data.groups || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="container-fluid bg-light ps-5">

      <div className="row g-3 mb-4 mt-3 pt-4">
        <SummaryCards />
      </div>

      <div className="row g-3">

        <div className="col-12 d-flex flex-column gap-3">

          <div
            className="bg-white p-4 rounded-4 shadow-sm"
            style={{ border: "1px solid #ECECF2" }}
          >

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h6 className="fw-semibold mb-0">Your Groups</h6>

              <span
                style={{
                  fontSize: "13px",
                  color: "#7C6CF2",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
                onClick={() => navigate("/groups")}
              >
                View All
              </span>

            </div>

            <div className="row g-4">

              {loadingGroups &&
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-12"
                  >
                    <div
                      className="rounded-4"
                      style={{
                        height: "130px",
                        background: "#F3F4F6",
                        animation: "pulse 1.5s infinite"
                      }}
                    />
                  </div>
                ))}

              {!loadingGroups && groups.length === 0 && (
                <div className="text-center text-muted py-4">
                  No groups yet. Create your first group!
                </div>
              )}

              {groups.map((group) => (
                <div
                  key={group._id}
                  className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-12"
                >
                  <GroupCard group={group} />
                </div>
              ))}

              {!loadingGroups && (
                <div className="col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-12">

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

      </div>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>

    </div>
  );
}

export default Dashboard;

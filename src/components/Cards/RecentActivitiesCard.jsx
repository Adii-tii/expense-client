import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/appConfig";
import { BeatLoader } from "react-spinners";

function RecentActivitiesCard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${serverEndpoint}/dashboard/recent-activities`, {
        withCredentials: true
      });
      setActivities(res.data.activities || []);
    } catch (err) {
      console.error("Failed to fetch recent activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const formatActivityDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `Today, ${formattedHours}:${minutes} ${ampm}`;
    } else if (diffDays === 2) {
      return "Yesterday";
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className="p-4 rounded-4 border-0 h-100"
      style={{ border: "1px solid #28282B", background: "#1B1B1D" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0">Recent Activities</h6>
      </div>

      <div className="d-flex flex-column gap-3">
        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <BeatLoader color="#9D5CFF" size={10} />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted py-4" style={{ fontSize: "14px" }}>
            No recent activities found.
          </div>
        ) : (
          activities.map((activity) => {
            const isExpense = activity.type === "expense";
            return (
              <div
                key={activity._id}
                className="d-flex align-items-center justify-content-between p-2 rounded-3"
                style={{
                  transition: "background 0.2s ease",
                  borderBottom: "1px solid #262629"
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: "36px",
                      height: "36px",
                      background: isExpense ? "rgba(157, 92, 255, 0.15)" : "rgba(16, 185, 129, 0.15)",
                      color: isExpense ? "#9D5CFF" : "#10B981"
                    }}
                  >
                    <i className={`bi ${isExpense ? "bi-receipt" : "bi-check2-circle"}`} style={{ fontSize: "16px" }}></i>
                  </div>

                  <div>
                    <div className="fw-medium" style={{ fontSize: "14px" }}>
                      {isExpense ? (
                        <span>
                          <strong style={{ fontWeight: 600 }}>{activity.createdByName}</strong> added "{activity.description}"
                        </span>
                      ) : (
                        <span>
                          <strong style={{ fontWeight: 600 }}>{activity.fromName}</strong> paid <strong style={{ fontWeight: 600 }}>{activity.toName}</strong>
                        </span>
                      )}
                    </div>
                    <div className="text-muted d-flex align-items-center gap-2" style={{ fontSize: "12px" }}>
                      <span>{activity.groupName}</span>
                      <span>•</span>
                      <span>{formatActivityDate(activity.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div
                  className="fw-semibold text-end"
                  style={{
                    fontSize: "15px",
                    color: isExpense ? "#FFFFFF" : "#10B981"
                  }}
                >
                  {isExpense ? `₹${activity.amount.toFixed(2)}` : `+₹${activity.amount.toFixed(2)}`}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default RecentActivitiesCard;

import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function SummaryCards() {

  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalOwe: 0,
    totalOwed: 0,
    totalSpendings: 0
  });

  const fetchSummary = async () => {
    try {

      const res = await axios.get(
        `${serverEndpoint}/dashboard/summary`,
        { withCredentials: true }
      );

      setSummary(res.data);

    } catch (err) {
      console.error("Summary fetch failed", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const cards = [
    {
      title: "Total Balance",
      value: `₹${summary.totalBalance.toFixed(2)}`,
      icon: "bi-wallet2",
    },
    {
      title: "You Owe",
      value: `₹${summary.totalOwe.toFixed(2)}`,
      icon: "bi-arrow-up-right",
    },
    {
      title: "You Are Owed",
      value: `₹${summary.totalOwed.toFixed(2)}`,
      icon: "bi-arrow-down-left",
    },
    {
      title: "Total Spendings",
      value: `₹${summary.totalSpendings.toFixed(2)}`,
      icon: "bi-calendar3",
    },
  ];

  return (
    <div className="row g-3">
      {cards.map((card, index) => (
        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12" key={index}>
          <div className="card border h-100 p-2 rounded-4 border-0">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">
                  {card.title}
                </div>
                <div className="fw-semibold fs-5">
                  {card.value}
                </div>
              </div>

              <div
                className="d-flex align-items-center justify-content-center border rounded-circle"
                style={{ width: "40px", height: "40px" }}
              >
                <i className={`bi ${card.icon}`}></i>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;

import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import TransactionCard from "../components/Cards/TransactionCard";

function Transactions() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchTransactions = async () => {

    try {

      const res = await axios.get(
        `${serverEndpoint}/settlements/user/`,
        { withCredentials: true }
      );

      setTransactions(res.data.settlements || []);

    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);


  const groupByDate = (items) => {

    const grouped = {};

    items.forEach(item => {

      const date = new Date(item.createdAt);
      const today = new Date();

      const diff = Math.floor(
        (today - date) / (1000 * 60 * 60 * 24)
      );

      let label = date.toDateString();

      if (diff === 0) label = "Today";
      else if (diff === 1) label = "Yesterday";

      grouped[label] ??= [];
      grouped[label].push(item);

    });

    return grouped;
  };

  const groupedTransactions = groupByDate(transactions);


  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-secondary" />
      </div>
    );
  }


  if (!transactions.length) {
    return (
      <div className="container py-5 text-center">
        <h5>No transactions yet</h5>
        <p className="text-muted">
          Your settlements will appear here.
        </p>
      </div>
    );
  }


  return (
    <div className="container-fluid px-0">

    

      <div style={{ paddingLeft: "10px" }}>

        {Object.entries(groupedTransactions).map(([date, items]) => (

          <div key={date} className="mb-4">

            <div
              style={{
                fontSize: "12px",
                fontWeight: 400,
                color: "#9CA3AF",
                marginBottom: "12px"
              }}
            >
              {date}
            </div>

            <div className="d-flex flex-column gap-2">

              {items.map(tx => (
                <TransactionCard
                  key={tx._id}
                  settlement={tx}
                />
              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Transactions;

function TransactionsDue() {
  const transactions = [
    {
      name: "Alex",
      amount: "₹1,200",
      status: "Due today",
    },
    {
      name: "Office Lunch Group",
      amount: "₹850",
      status: "Overdue",
    },
    {
      name: "Riya",
      amount: "₹2,300",
      status: "Due tomorrow",
    },
  ];

  return (
    <div className="card h-100">
      {/* Header */}
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <span className="fw-medium">Transactions Due</span>
        <button className="btn btn-sm btn-outline-dark">
          View all
        </button>
      </div>

      {/* Body */}
      <div className="card-body p-0">
        {transactions.length === 0 ? (
          <div className="text-center text-muted py-4">
            No pending transactions
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {transactions.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="fw-medium">
                    {item.name}
                  </div>
                  <div className="text-muted small">
                    {item.status}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="fw-semibold">
                    {item.amount}
                  </span>
                  <button className="btn btn-sm btn-dark">
                    Pay
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TransactionsDue;

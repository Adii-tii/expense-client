function RecentExpenses() {
  const expenses = [
    {
      title: "Dinner at Cafe",
      group: "Goa Trip",
      date: "Today",
      amount: "₹1,200",
    },
    {
      title: "Groceries",
      group: "Flat Expenses",
      date: "Yesterday",
      amount: "₹850",
    },
    {
      title: "Movie Tickets",
      group: "Office Lunch",
      date: "2 days ago",
      amount: "₹450",
    },
    {
      title: "Fuel",
      group: "Personal",
      date: "3 days ago",
      amount: "₹2,000",
    },
  ];

  return (
    <div className="card h-100">
      {/* Header */}
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <span className="fw-medium">Recent Expenses</span>
        <button className="btn btn-sm btn-outline-dark">
          View all
        </button>
      </div>

      {/* Body */}
      <div className="card-body p-0">
        {expenses.length === 0 ? (
          <div className="text-center text-muted py-4">
            No recent expenses
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {expenses.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="fw-medium">
                    {item.title}
                  </div>
                  <div className="text-muted small">
                    {item.group} • {item.date}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className="fw-semibold">
                    {item.amount}
                  </span>
                  <button className="btn btn-sm btn-light border">
                    Details
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

export default RecentExpenses;

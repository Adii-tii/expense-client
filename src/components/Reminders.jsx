function Reminders() {
  const reminders = [
    {
      title: "Pay electricity bill",
      date: "Due today",
    },
    {
      title: "Settle trip expenses with Alex",
      date: "Due tomorrow",
    },
    {
      title: "Internet recharge",
      date: "In 3 days",
    },
  ];

  return (
    <div className="card h-100">
      {/* Header */}
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <span className="fw-medium">Reminders</span>
        <button className="btn btn-sm btn-outline-dark">
          View all
        </button>
      </div>

      {/* Body */}
      <div className="card-body p-0">
        {reminders.length === 0 ? (
          <div className="text-center text-muted py-4">
            No upcoming reminders
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {reminders.map((item, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="fw-medium">
                    {item.title}
                  </div>
                  <div className="text-muted small">
                    {item.date}
                  </div>
                </div>

                <button className="btn btn-sm btn-light border">
                  Mark done
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Reminders;

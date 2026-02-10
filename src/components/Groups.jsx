function Groups() {
  const groups = [
    {
      name: "Goa Trip",
      members: ["A", "R", "S", "K", "M", "P", "Q", "Y", "U"],
      balance: "₹3,450 pending",
      activity: "2 expenses added",
    },
    {
      name: "Office Lunch",
      members: ["J", "D", "N", "T"],
      balance: "₹820 to settle",
      activity: "Yesterday",
    },
    {
      name: "Flat Expenses",
      members: ["R", "A", "S", "V", "K"],
      balance: "All settled",
      activity: "Last week",
    },
    {
      name: "Gym Membership",
      members: ["A", "K", "R"],
      balance: "₹1,200 pending",
      activity: "Today",
    },
    {
      name: "Birthday Party",
      members: ["S", "M", "P", "D", "T"],
      balance: "₹2,050 to collect",
      activity: "3 days ago",
    },
  ];

  const MAX_VISIBLE_GROUPS = 5;
  const MAX_VISIBLE_MEMBERS = 4;

  return (
    <div className="card p-2 border-0 rounded-4">
      {/* Header */}
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <span className="fw-medium">Groups</span>
        <button
          className="btn rounded-pill px-4"
          style={{
            background: "#7C6CF2",
            color: "white",
            transition: "0.2s",
            height: "38px"
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#6A5AE0")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "#7C6CF2")
          }>
          View All
        </button>
      </div>

      {/* Body */}
      <div className="card-body p-0">
        {groups.slice(0, MAX_VISIBLE_GROUPS).map((group, index, arr) => {
          const visibleMembers = group.members.slice(0, MAX_VISIBLE_MEMBERS);
          const extraCount = group.members.length - MAX_VISIBLE_MEMBERS;
          const isLast = index === arr.length - 1;

          return (
            <div
              key={index}
              className={`d-flex align-items-center justify-content-between px-3 py-2 ${!isLast ? "border-bottom" : ""
                }`}
              style={{ cursor: "pointer" }}
            >
              {/* Left */}
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle border d-flex align-items-center justify-content-center fw-medium"
                  style={{ width: "36px", height: "36px", fontSize: "14px", background: "#F1EFFF", color: "#7C6CF2" }}
                >
                  {group.name[0]}
                </div>

                <div>
                  <div className="fw-medium">{group.name}</div>
                  <div className="text-muted small">
                    {group.balance} • {group.activity}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="d-flex align-items-center">
                {visibleMembers.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-circle border d-flex align-items-center justify-content-center"
                    style={{
                      width: "28px",
                      height: "28px",
                      fontSize: "11px",
                      marginLeft: i === 0 ? 0 : "-6px",
                      background: "#FFF6D6",
                      color: "#8A6B00",
                      border: "1px solid #F4C430"
                    }}
                  >
                    {m}
                  </div>
                ))}

                {extraCount > 0 && (
                  <div
                    className="rounded-circle bg-light text-white d-flex align-items-center justify-content-center"
                    style={{
                      width: "28px",
                      height: "28px",
                      fontSize: "11px",
                      marginLeft: "-6px",
                      background: "#FFF6D6",
                      color: "#8A6B00",
                      border: "1px solid #F4C430"
                    }}
                  >
                    +{extraCount}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Groups;

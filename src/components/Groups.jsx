function Groups() {
  const groups = [
    {
      name: "Goa Trip",
      members: ["A", "R", "S", "K", "M", "P", "Q", "Y" ,"U"],
    },
    {
      name: "Office Lunch",
      members: ["J", "D", "N", "T"],
    },
    {
      name: "Flat Expenses",
      members: ["R", "A", "S", "V", "K"],
    },
  ];

  const MAX_VISIBLE = 4;

  return (
    <div className="card h-100">
      {/* Header */}
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <span className="fw-medium">Groups</span>
        <button className="btn btn-sm btn-outline-dark">
          View all
        </button>
      </div>

      {/* Body */}
      <div className="card-body">
        {groups.map((group, index) => {
          const visibleMembers = group.members.slice(0, MAX_VISIBLE);
          const extraCount = group.members.length - MAX_VISIBLE;

          return (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              <span className="fw-medium">
                {group.name}
              </span>

              {/* Avatars */}
              <div className="d-flex align-items-center">
                {visibleMembers.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      fontSize: "12px",
                      marginLeft: i === 0 ? 0 : "-8px",
                    }}
                  >
                    {m}
                  </div>
                ))}

                {extraCount > 0 && (
                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                    style={{
                      width: "32px",
                      height: "32px",
                      fontSize: "12px",
                      marginLeft: "-8px",
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

import { Link } from "react-router-dom";

function GroupTopBar({ group, onEdit, onDelete, handleAddExpense, toggleMembers, onSettle, onToggleChat, isChatActive }) {
  const groupName = group?.name || "Group";

  return (
    <div className="d-flex justify-content-between align-items-center mb-4 px-0" style={{ background: "transparent" }}>

      {/* Left side: Breadcrumbs and Title */}
      <div className="d-flex flex-column align-items-start">


        {/* Title & Badge */}
        <div className="d-flex align-items-center gap-3">
          <h4 className="fw-semibold mb-0 text-white" style={{ color: "#FFFFFF" }}>
            {groupName}
          </h4>
        </div>

        {group?.description && (
          <small className="mt-1" style={{ color: "#A1A1AA" }}>
            {group.description}
          </small>
        )}
      </div>

      {/* Right side: Action CTA Buttons */}
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn d-flex align-items-center justify-content-center fw-bold"
          onClick={onSettle}
          style={{
            height: "40px",
            borderRadius: "20px",
            background: "#9D5CFF",
            color: "#FFFFFF",
            border: "none",
            padding: "0 24px",
            fontSize: "14px",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#AB73FF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#9D5CFF";
          }}
        >
          Settle Up
        </button>

        {/* Chat Toggle Button */}
        <button
          className="btn d-flex align-items-center justify-content-center border-0"
          onClick={onToggleChat}
          style={{
            width: "40px",
            height: "40px",
            background: isChatActive ? "#9D5CFF" : "#1B1B1D",
            color: "#FFFFFF",
            border: isChatActive ? "1px solid #9D5CFF" : "1px solid #39393B",
            borderRadius: "10px",
            transition: "all 0.2s ease",
            boxShadow: "none"
          }}
          title="Toggle Group Chat"
        >
          <i className="bi bi-chat-left-text" style={{ fontSize: "16px" }}></i>
        </button>

        <div className="dropdown">
          <button
            className="btn d-flex align-items-center justify-content-center border-0"
            data-bs-toggle="dropdown"
            style={{
              width: "40px",
              height: "40px",
              background: "#1B1B1D",
              color: "#FFFFFF",
              border: "1px solid #39393B",
              borderRadius: "10px"
            }}
          >
            <i className="bi bi-three-dots-vertical" style={{ fontSize: "18px" }}></i>
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0" style={{ backgroundColor: "#1B1B1D", border: "1px solid #39393B" }}>
            <li>
              <button className="dropdown-item" onClick={handleAddExpense}>
                <i className="bi bi-plus-lg me-2"></i> Add Expense
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={toggleMembers}>
                <i className="bi bi-people me-2"></i> Group Members
              </button>
            </li>
            <li><hr className="dropdown-divider bg-secondary" style={{ opacity: 0.2 }} /></li>
            <li>
              <button className="dropdown-item" onClick={onEdit}>
                <i className="bi bi-pencil me-2"></i> Edit Group
              </button>
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={onDelete}>
                <i className="bi bi-trash me-2"></i> Delete Group
              </button>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}

export default GroupTopBar;

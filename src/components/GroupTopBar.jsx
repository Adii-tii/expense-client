import { useState } from "react";

function GroupTopBar({ group, onEdit, onDelete, handleAddExpense, toggleMembers }) {

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-center px-4 mt-5"
        style={{
          height: "60px",
          background: "#FFFFFF",
          borderBottom: "1px solid #ECECF2"
        }}
      >

        {/* LEFT */}
        <div className="d-flex align-items-center gap-3">

          {/* Search */}
          <div className="position-relative">
            <i
              className="bi bi-search position-absolute"
              style={{
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9CA3AF"
              }}
            />

            <input
              className="form-control"
              placeholder="Search expenses..."
              style={{
                paddingLeft: "34px",
                width: "240px",
                borderRadius: "999px",
                border: "1px solid #E6E7EC",
                background: "#FAFAFC"
              }}
            />
          </div>

          {/* Add Expense */}
          <button
            className="btn rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "36px",
              height: "36px",
              background: "#7C6CF2",
              color: "white",
              border: "none"
            }}
            onClick={handleAddExpense}
          >
            <i className="bi bi-plus-lg"></i>
          </button>

        </div>


        {/* RIGHT */}
        <div className="d-flex align-items-center gap-3">

          {/* Members Button */}
          <button
            className="btn border-0"
            onClick={toggleMembers}
            style={{
              color: "#7C6CF2",
              fontSize: "20px"
            }}
          >
            <i className="bi bi-people"></i>
          </button>

          {/* Menu */}
          <div className="dropdown">

            <button
              className="btn border-0"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
              <li>
                <button className="dropdown-item" onClick={onEdit}>
                  Edit Group
                </button>
              </li>

              <li>
                <button className="dropdown-item text-danger" onClick={onDelete}>
                  Delete Group
                </button>
              </li>
            </ul>

          </div>

        </div>
      </div>
    </>
  );
}

export default GroupTopBar;

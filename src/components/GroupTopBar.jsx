import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function GroupTopBar({ group, onEdit, onDelete, handleAddExpense}) {

  const [showMembers, setShowMembers] = useState(false);

  const handleAddMember = async() => {
    try{
      const res = await axios.patch(`${serverEndpoint}/group/${group._id}`);

    } catch(error){
      console.log(error);
    }
  }
  return (
    <>
      {/* ===== TOP CONTROL BAR ===== */}
      <div
        className="d-flex justify-content-between align-items-center px-4 mt-5"
        style={{
          height: "60px",
          background: "#FFFFFF",
          borderBottom: "1px solid #ECECF2"
        }}
      >

        {/* LEFT SIDE */}
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


        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-3">

          {/* Members Button */}
          <button
            className="btn border-0"
            onClick={() => setShowMembers(true)}
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


      {/* ===== BACKDROP OVERLAY ===== */}
      {showMembers && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(0,0,0,0.25)",
            zIndex: 1040
          }}
          onClick={() => setShowMembers(false)}
        />
      )}


      {/* ===== RIGHT MEMBER DRAWER ===== */}
      <div
        className="position-fixed top-0 end-0 h-100"
        style={{
          width: "320px",
          background: "#FFFFFF",
          borderLeft: "1px solid #ECECF2",
          zIndex: 1050,
          transform: showMembers ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.25s ease"
        }}
      >

        {/* Drawer Header */}
        <div
          className="d-flex justify-content-between align-items-center px-4 py-3"
          style={{ borderBottom: "1px solid #ECECF2" }}
        >
          <span className="fw-semibold" style={{ color: "#2B2D42" }}>
            Members
          </span>

          <button
            className="btn btn-sm"
            onClick={() => setShowMembers(false)}
          >
            ✕
          </button>
        </div>


        {/* Add Member Button */}
        <div className="px-4 py-3">
          <button
            className="btn w-100 rounded-pill"
            style={{
              background: "#F1EFFF",
              color: "#7C6CF2",
              border: "none"
            }}
            onClick={handleAddMember}
          >
            <i className="bi bi-person-plus me-2"></i>
            Add Member
          </button>
        </div>


        {/* Member List */}
        <div
          className="px-4"
          style={{ overflowY: "auto", height: "calc(100% - 120px)" }}
        >
          {group.memberEmail.map((member, index) => (
            <div
              key={index}
              className="d-flex align-items-center mb-3"
            >

              {/* Avatar */}
              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "38px",
                  height: "38px",
                  background: "#F1EFFF",
                  color: "#7C6CF2",
                  fontWeight: "600"
                }}
              >
                {member[0].toUpperCase()}
              </div>

              <div style={{ fontSize: "14px", color: "#374151" }}>
                {member}
              </div>

            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default GroupTopBar;

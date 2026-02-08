import axios from "axios";
import { useState } from "react";
import { serverEndpoint } from "../config/appConfig";
import { useNavigate } from "react-router-dom";
import GroupDetails from "../pages/GroupDetails";

function GroupCard({ isOpen,
  setIsOpen,
  group,
  refreshGroups,
  setMode,
  mode,
  currentGroup,
  setCurrentGroup,
  layout }) {
  const [showMembers, setShowMembers] = useState(false);
  const navigate = useNavigate();
  const MAX_VISIBLE_MEMBERS = 4;

  const visibleMembers = group.memberEmail.slice(0, MAX_VISIBLE_MEMBERS);
  const extraMembers = group.memberEmail.length - MAX_VISIBLE_MEMBERS;


  const handleDeleteGroup = async () => {
    if (!group?._id) return;

    const groupId = group._id;
    try {
      const res = await axios.delete(`${serverEndpoint}/group/${groupId}/delete`, { withCredentials: true });
      if (res.status === 200) {
        console.log("deleted group successfully!")
        refreshGroups()
      }
    } catch (error) {
      console.log("Could not delete the group");
      console.log(error);
    }
  }

  const handleEditGroup = async () => {
    const groupId = group._id;

    setMode("edit");
    setIsOpen("true");
  }

  const handleRedirection = () => {
    navigate(`/groups/${group._id}`, { state: { group } });
  };

  if (layout === "list") {
  return (
    <div
      className="d-flex align-items-center px-4 py-3 border-bottom"
      style={{
        cursor: "pointer",
        transition: "background 0.2s ease"
      }}
      onClick={handleRedirection}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#F9F8FF";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >

      {/* NAME COLUMN */}
      <div style={{ flex: 2 }}>

        <div className="fw-semibold" style={{ color: "#2B2D42" }}>
          {group.name}
        </div>

        <small style={{ color: "#6B7280" }}>
          {group.description || "No description"}
        </small>

      </div>


      {/* MEMBERS COUNT COLUMN */}
      <div
        style={{
          flex: 1,
          color: "#7C6CF2",
          fontWeight: "500"
        }}
      >
        {group.memberEmail.length} members
      </div>


      {/* PARTICIPANTS COLUMN */}
      <div style={{ flex: 1 }}>
        <div className="d-flex align-items-center">

          {visibleMembers.map((member, i) => (
            <div
              key={i}
              className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
              style={{
                width: "28px",
                height: "28px",
                fontSize: "11px",
                marginLeft: i === 0 ? 0 : "-6px",
                background: "#F1EFFF",
                color: "#7C6CF2",
                border: "2px solid white"
              }}
            >
              {member[0].toUpperCase()}
            </div>
          ))}

          {extraMembers > 0 && (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
              style={{
                width: "28px",
                height: "28px",
                fontSize: "11px",
                marginLeft: "-6px",
                background: "#FFF6D6",
                color: "#8A6B00",
                border: "2px solid white"
              }}
            >
              +{extraMembers}
            </div>
          )}

        </div>
      </div>


      {/* ACTION COLUMN */}
      <div style={{ width: "40px" }}>
        <div className="dropdown">

          <i
            className="bi bi-three-dots-vertical"
            data-bs-toggle="dropdown"
            onClick={(e) => e.stopPropagation()}
            style={{ cursor: "pointer" }}
          />

          <ul className="dropdown-menu shadow-sm border-0">
            <li>
              <button
                className="dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditGroup();
                }}
              >
                Edit
              </button>
            </li>

            <li>
              <button
                className="dropdown-item text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGroup();
                }}
              >
                Delete
              </button>
            </li>
          </ul>

        </div>
      </div>

    </div>
  );
}





  return (
    <div
      className="card border-0 border-white h-100 rounded-4 overflow-hidden"
      style={{
        background: "#FFFFFF",
        boxShadow: "0 2px 2px rgba(0,0,0,0.06)",
        transition: "all 0.25s ease"

      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 5px 5px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 2px rgba(0,0,0,0.06)";
      }}

      onClick={handleRedirection}
    >

      {/* Thumbnail */}
      <div
        className="position-relative"
        style={{
          height: "140px",
          backgroundImage: `url(${group.thumbnail || "https://i.pinimg.com/1200x/59/af/ea/59afeaf0ae313151172536ca557afe01.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >

        {/* Purple Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to top, rgba(124,108,242,0.3), rgba(0,0,0,0.2))"
          }}
        />

        {/* Title + Menu */}
        <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white">

          <div className="d-flex justify-content-between align-items-center">

            <h5 className="fw-semibold mb-0">
              {group.name}
            </h5>

            <div className="dropdown">
              <i
                className="bi bi-three-dots-vertical text-white"
                data-bs-toggle="dropdown"
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => e.target.style.color = "#F4C430"}
                onMouseLeave={(e) => e.target.style.color = "#FFFFFF"}
              />

              <ul className="dropdown-menu shadow-sm border-0">
                <li>
                  <button className="dropdown-item" onClick={handleEditGroup}>
                    Edit
                  </button>
                </li>

                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleDeleteGroup}
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* Content */}
      <div className="card-body">

        {group.description && (
          <p style={{ color: "#6B7280" }} className="small">
            {group.description}
          </p>
        )}

        {/* Members */}
        <div className="d-flex align-items-center my-3">

          {visibleMembers.map((member, i) => (
            <div
              key={i}
              className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
              style={{
                width: "32px",
                height: "32px",
                fontSize: "12px",
                marginLeft: i === 0 ? 0 : "-8px",
                background: "#F1EFFF",
                color: "#7C6CF2"
              }}
            >
              {member[0].toUpperCase()}
            </div>
          ))}

          {extraMembers > 0 && (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
              style={{
                width: "32px",
                height: "32px",
                fontSize: "12px",
                marginLeft: "-8px",
                background: "#FFF6D6",
                color: "#8A6B00",
              }}
            >
              +{extraMembers}
            </div>
          )}

        </div>

        {/* Button */}
        <button
          className="btn btn-sm w-100 rounded-pill"
          style={{
            background: "#F3F4F8",
            color: "#2B2D42",
            transition: "all 0.2s"
          }}
          onClick={() => setShowMembers(!showMembers)}
          onMouseEnter={(e) => {
            e.target.style.background = "#F1EFFF";
            e.target.style.color = "#7C6CF2";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#F3F4F8";
            e.target.style.color = "#2B2D42";
          }}
        >
          {showMembers ? "Hide Members" : "View Members"}
        </button>

      </div>

      {/* Expand Section */}
      {showMembers && (
        <div
          className="p-3"
          style={{
            borderTop: "1px solid #E6E7EC",
            background: "#FAFAFC"
          }}
        >

          <h6
            className="fw-semibold mb-2"
            style={{
              color: "#7C6CF2",
              borderBottom: "2px solid #FFF6D6",
              display: "inline-block",
              paddingBottom: "3px"
            }}
          >
            Members
          </h6>

          <ul className="list-group list-group-flush small">
            {group.memberEmail.map((member, index) => (
              <li
                key={index}
                className="list-group-item px-0 border-0"
                style={{ color: "#6B7280" }}
              >
                {member}
              </li>
            ))}
          </ul>

        </div>
      )}



    </div>
  );



}


export default GroupCard;

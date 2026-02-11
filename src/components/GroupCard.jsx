import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useNavigate } from "react-router-dom";

function GroupCard({
  group,
  refreshGroups,
  setMode,
  setIsOpen,
  setCurrentGroup,
  layout
}) {

  const navigate = useNavigate();
  const MAX_VISIBLE_MEMBERS = 4;

  const members = group.memberEmail || [];
  const visibleMembers = members.slice(0, MAX_VISIBLE_MEMBERS);
  const extraMembers = Math.max(members.length - MAX_VISIBLE_MEMBERS, 0);

  /* ================= HANDLERS ================= */

  const handleRedirection = () => {
    navigate(`/groups/${group._id}`, { state: { group } });
  };

  const handleDeleteGroup = async (e) => {
    e.stopPropagation();
    try {
      await axios.delete(
        `${serverEndpoint}/groups/${group._id}/delete`,
        { withCredentials: true }
      );
      refreshGroups();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditGroup = (e) => {
    e.stopPropagation();
    setMode("edit");
    setCurrentGroup(group);
    setIsOpen(true);
  };

  /* ================= AVATAR ================= */

  const Avatar = ({ email, index }) => (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
      style={{
        width: layout === "list" ? "28px" : "32px",
        height: layout === "list" ? "28px" : "32px",
        fontSize: layout === "list" ? "11px" : "12px",
        marginLeft: index === 0 ? 0 : "-8px",
        background: "#F1EFFF",
        color: "#7C6CF2",
        border: "2px solid white"
      }}
    >
      {email?.[0]?.toUpperCase()}
    </div>
  );

  /* ================= LIST VIEW ================= */

  if (layout === "list") {
    return (
      <div
        className="d-flex align-items-center px-4 py-3 border-bottom"
        style={{ cursor: "pointer", transition: "background 0.2s" }}
        onClick={handleRedirection}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#F9F8FF")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >

        <div style={{ flex: 2 }}>
          <div className="fw-semibold">{group.name}</div>
          <small style={{ color: "#6B7280" }}>
            {group.description || "No description"}
          </small>
        </div>

        <div style={{ flex: 1, color: "#7C6CF2", fontWeight: 500 }}>
          {members.length} members
        </div>

        <div style={{ flex: 1 }} className="d-flex align-items-center">
          {visibleMembers.map((m, i) => (
            <Avatar key={i} email={m} index={i} />
          ))}
          {extraMembers > 0 && (
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
              style={{
                width: "28px",
                height: "28px",
                fontSize: "11px",
                marginLeft: "-8px",
                background: "#FFF6D6",
                color: "#8A6B00",
                border: "2px solid white"
              }}
            >
              +{extraMembers}
            </div>
          )}
        </div>

        <div style={{ width: "40px" }}>
          <div className="dropdown">
            <i
              className="bi bi-three-dots-vertical"
              data-bs-toggle="dropdown"
              onClick={(e) => e.stopPropagation()}
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
    );
  }

  /* ================= GRID CARD ================= */

  return (
    <div
      className="card border-0 rounded-4 overflow-hidden h-100"
      style={{
        background: "#FFFFFF",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        transition: "all 0.25s ease",
        cursor: "pointer"
      }}
      onClick={handleRedirection}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
      }}
    >

      {/* THUMBNAIL */}
      <div
        className="position-relative"
        style={{
          height: "140px",
          backgroundImage: `url(${group.thumbnail || "https://i.pinimg.com/1200x/59/af/ea/59afeaf0ae313151172536ca557afe01.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(to top, rgba(124,108,242,0.35), rgba(0,0,0,0.2))"
          }}
        />

        <div className="position-absolute bottom-0 start-0 w-100 p-3 text-white">
          <div className="d-flex justify-content-between align-items-center">

            <h5 className="fw-semibold mb-0">{group.name}</h5>

            <div className="dropdown">
              <i
                className="bi bi-three-dots-vertical"
                data-bs-toggle="dropdown"
                onClick={(e) => e.stopPropagation()}
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

      {/* BODY */}
      <div className="card-body d-flex flex-column justify-content-between">

        {group.description && (
          <p className="small mb-3" style={{ color: "#6B7280" }}>
            {group.description}
          </p>
        )}

        {/* MEMBERS SNAPSHOT */}
        <div className="d-flex align-items-center justify-content-between mt-auto">

          <div className="d-flex align-items-center">
            {visibleMembers.map((m, i) => (
              <Avatar key={i} email={m} index={i} />
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
                  color: "#8A6B00"
                }}
              >
                +{extraMembers}
              </div>
            )}
          </div>

          <small style={{ color: "#6B7280" }}>
            {members.length} members
          </small>

        </div>

      </div>

    </div>
  );
}

export default GroupCard;

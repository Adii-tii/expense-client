import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import GroupCard from "../components/GroupCard";
import Button from "react-bootstrap/Button";
import CreateGroupModal from "../components/Modals/CreateGroupModal";
import { usePermission } from "../rbac/userPermissions";
import Can from "../components/Can";
import GroupDetails from "./GroupDetails";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState("grid");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [currentGroup, setCurrentGroup] = useState(null);

  const permissions = usePermission();

  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        `${serverEndpoint}/group/my-groups`,
        { withCredentials: true }
      );

      setGroups(res.data.groups || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const handleCreate = () => { //craete group
    setMode("create");
    setCurrentGroup(null);
    setIsModalOpen(true);
  };


  useEffect(() => {
    fetchGroups();
  }, []);


  return (
    <div className="container-fluid py-4 bg-light"> 

      <div className="d-flex justify-content-between align-items-center mb-4 mt-4 px-2">

        <div>
          <h4 className="fw-semibold mb-1" style={{ color: "#2B2D42" }}>
            Your Groups
          </h4>

          <small style={{ color: "#6B7280" }}>
            Manage and track shared expenses
          </small>
        </div>

        <div className="d-flex align-items-center gap-4">

          {/* LAYOUT TOGGLE */}
          <div
            className="d-flex p-1"
            style={{
              background: "#F3F4F8",
              borderRadius: "999px"
            }}
          >

            {/* LIST BUTTON */}
            <button
              onClick={() => setLayout("list")}
              className="border-0 d-flex align-items-center justify-content-center"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "999px",
                background: layout === "list" ? "#FFFFFF" : "transparent",
                color: layout === "list" ? "#7C6CF2" : "#6B7280",
                boxShadow:
                  layout === "list" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <i className="bi bi-list fs-5"></i>
            </button>


            {/* GRID BUTTON */}
            <button
              onClick={() => setLayout("grid")}
              className="border-0 d-flex align-items-center justify-content-center"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "999px",
                background: layout === "grid" ? "#FFFFFF" : "transparent",
                color: layout === "grid" ? "#7C6CF2" : "#6B7280",
                boxShadow:
                  layout === "grid" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s ease"
              }}
            >
              <i className="bi bi-grid fs-6"></i>
            </button>

          </div>


          {/* CREATE BUTTON */}
          <Can requiredPermission={"canCreateGroups"}>
            <button
              className="btn rounded-pill px-4"
              style={{
                background: "#7C6CF2",
                color: "white",
                transition: "0.2s",
                height: "44px"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#6A5AE0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#7C6CF2")
              }
              onClick={handleCreate}
            >
              <i className="bi bi-plus me-2"></i>
              Create Group
            </button>
          </Can>

        </div>

      </div>


      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <BeatLoader color="#2A9D8F" />
        </div>

      ) : groups.length === 0 ? (

        /* EMPTY STATE */
        <div className="card border-0 shadow-sm text-center py-5">
          <h5 className="fw-semibold mb-2">No Groups Yet</h5>

          <p className="text-muted mb-4">
            Create a group and start splitting expenses with friends.
          </p>

          <Button variant="dark" onClick={handleCreate}>
            Create Your First Group
          </Button>
        </div>

      ) : layout === "grid" ? (

        /* GRID VIEW */
        <div className="row g-4">
          {groups.map((group) => (
            <div
              key={group._id}
              className="col-xl-3 col-lg-4 col-md-6 col-12"
            >
              <GroupCard
                group={group}
                refreshGroups={fetchGroups}
                setMode={setMode}
                setIsOpen={setIsModalOpen}
                setCurrentGroup={setCurrentGroup}
                layout={layout}
              />
            </div>
          ))}
        </div>

      ) : (

        /* LIST VIEW */
        <div
          className="bg-white rounded-4 border overflow-hidden"
          style={{ borderColor: "#E6E7EC" }}
        >

          {/* LIST HEADER */}
          <div
            className="d-flex justify-content-between px-4 py-2 small fw-semibold"
            style={{
              background: "#FAFAFC",
              color: "#6B7280",
              borderBottom: "1px solid #E6E7EC"
            }}
          >
            <div>Group</div>
            <div style={{ minWidth: "120px" }}>Members</div>
            <div style={{ width: "40px" }}></div>
          </div>

          {groups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              refreshGroups={fetchGroups}
              setMode={setMode}
              setIsOpen={setIsModalOpen}
              setCurrentGroup={setCurrentGroup}
              layout={layout}
            />
          ))}

        </div>
      )}


      <CreateGroupModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        refreshGroups={fetchGroups}
        mode={mode}
        setMode={setMode}
        currentGroup={currentGroup}
      />

    </div>
  );
}

export default Groups;

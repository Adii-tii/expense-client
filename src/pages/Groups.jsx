import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/Modals/CreateGroupModal";
import Can from "../components/Can";

function Groups() {
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);

  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState("grid");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("create");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [groupCount, setGroupCount] = useState(0);
  const [limit, setLimit] = useState(8);
  const [sortBy, setSortBy] = useState("newest");


  const fetchGroups = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${serverEndpoint}/groups/my-groups?limit=${limit}&page=${page}&sortBy=${sortBy}`,
        { withCredentials: true }
      );

      setGroups(res.data.groups || []);
      setGroupCount(res.data.groupCount || 0);
      setTotalPages(res?.data?.pagination?.totalPages || 1);
      setCurrentPage(res?.data?.pagination?.currentPage || 1);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups(currentPage);
  }, [currentPage, sortBy, limit]);

  const handleCreate = () => {
    setMode("create");
    setCurrentGroup(null);
    setIsModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleLimitChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      setLimit(value);
      setCurrentPage(1);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa"
        }}
      >
        <BeatLoader color="black" size={15} />
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light px-5 py-5">

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 mt-4 px-2">

        <div>
          <h4 className="fw-semibold mb-1" style={{ color: "#2B2D42" }}>
            Your Groups
          </h4>
          <small style={{ color: "#6B7280" }}>
            Manage and track shared expenses
          </small>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2 justify-content-md-end">

          <div
            className="d-flex p-1"
            style={{
              background: "#F3F4F8",
              borderRadius: "999px"
            }}
          >
            {["list", "grid"].map((type) => (
              <button
                key={type}
                onClick={() => setLayout(type)}
                className="border-0 d-flex align-items-center justify-content-center"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "999px",
                  background: layout === type ? "#FFFFFF" : "transparent",
                  color: layout === type ? "#7C6CF2" : "#6B7280",
                  boxShadow:
                    layout === type ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                <i className={`bi bi-${type === "grid" ? "grid" : "list"}`} />
              </button>
            ))}
          </div>

          <div
            style={{
              background: "#F3F4F8",
              borderRadius: "999px",
              padding: "4px 12px"
            }}
          >
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                color: "#2B2D42",
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="atoz">A → Z</option>
              <option value="ztoa">Z → A</option>
            </select>
          </div>

          <Can requiredPermission={"canCreateGroups"}>
            <button
              className="btn rounded-pill px-3 px-md-4"
              style={{
                background: "#7C6CF2",
                color: "white",
                height: "44px",
                whiteSpace: "nowrap"
              }}
              onClick={handleCreate}
            >
              <i className="bi bi-plus me-2"></i>
              <span className="d-none d-sm-inline">Create Group</span>
            </button>
          </Can>

        </div>
      </div>


      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <BeatLoader color="#7C6CF2" />
        </div>

      ) : groups.length === 0 ? (

        <div className="card border-0 shadow-sm text-center py-5">
          <h5 className="fw-semibold mb-2">No Groups Yet</h5>
          <p className="text-muted mb-4">
            Create a group and start splitting expenses.
          </p>
          <button className="btn btn-dark" onClick={handleCreate}>
            Create Your First Group
          </button>
        </div>

      ) : layout === "grid" ? (

        <div className="row g-4">
          {groups.map((group) => (
            <div key={group._id} className="col-xl-3 col-lg-4 col-md-6 col-12">
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

        <div className="bg-white rounded-4 border overflow-hidden">
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

      {totalPages > 1 && (
        <div className="mt-5 d-flex justify-content-center align-items-center gap-4">

          {/* Page Buttons */}
          <div className="d-flex gap-2">

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const active = page === currentPage;

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    minWidth: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    border: "none",
                    background: active ? "#7C6CF2" : "#F3F4F8",
                    color: active ? "#FFFFFF" : "#2B2D42",
                    fontWeight: 600,
                    transition: "0.2s"
                  }}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <div
            style={{
              background: "#F3F4F8",
              borderRadius: "999px",
              padding: "4px 14px",
              fontWeight: 500
            }}
          >
            Show
            <input
              value={limit}
              onChange={handleLimitChange}
              style={{
                width: "40px",
                margin: "0 8px",
                border: "none",
                background: "transparent",
                textAlign: "center",
                outline: "none"
              }}
            />
            of {groupCount}
          </div>

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

import { useState, useEffect } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function MembersDrawer({ group, isOpen, setIsOpen }) {

  const [adding, setAdding] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState(group.memberEmail || []);

  /* ================= ADD MEMBER ================= */

  const handleAddMember = async () => {

    if (!email.trim()) return;

    try {

      setLoading(true);
      const groupId = group._id;

      const res = await axios.patch(
        `${serverEndpoint}/groups/${groupId}/add-members`,
        {
          newMembers: [email]
        },
        { withCredentials: true }
      );

      if (res.status === 200) {

        setMembers(prev => [...prev, email]);
        setEmail("");
        setAdding(false);
      }

    } catch (err) {
      console.log(err);
      alert("Failed to add member");

    } finally {
      setLoading(false);
    }

    
  };

  useEffect(() =>{
        setMembers(group.memberEmail || []);
    }, [group])

  /* ================= UI ================= */

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 rounded-4"
          style={{
            background: "#1B1B1D",
            boxShadow: "none",
            border: "1px solid #39393B"
          }}
        >
          {/* HEADER */}
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="fw-semibold mb-1" style={{ color: "#FFFFFF" }}>Group Members</h5>
              <small style={{ color: "#A1A1AA" }}>
                Add members or view group participants
              </small>
            </div>
            <button className="btn-close" onClick={() => setIsOpen(false)} />
          </div>

          {/* BODY */}
          <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
            
            {/* ADD MEMBER BUTTON */}
            <div className="mb-4">
              {!adding && (
                <button
                  className="btn w-100 rounded-pill"
                  style={{
                    border: "2px dashed #9D5CFF",
                    color: "#9D5CFF",
                    background: "transparent",
                    fontWeight: 600
                  }}
                  onClick={() => setAdding(true)}
                >
                  + Add Member
                </button>
              )}

              {/* ADD MEMBER FORM */}
              {adding && (
                <div className="mt-2">
                  <input
                    className="form-control mb-2"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm text-white"
                      style={{ background: "#9D5CFF" }}
                      onClick={handleAddMember}
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add"}
                    </button>

                    <button
                      className="btn btn-sm"
                      style={{ color: "#FFFFFF" }}
                      onClick={() => {
                        setAdding(false);
                        setEmail("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* MEMBER LIST */}
            <div>
              {members.map((member, index) => (
                <div key={index} className="d-flex align-items-center mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "38px",
                      height: "38px",
                      background: "rgba(157, 92, 255, 0.15)",
                      color: "#9D5CFF",
                      fontWeight: "600"
                    }}
                  >
                    {member[0].toUpperCase()}
                  </div>

                  <div style={{ fontSize: "14px", color: "#FFFFFF" }}>
                    {member}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* FOOTER */}
          <div className="modal-footer border-0">
            <button className="btn px-4 rounded-pill" style={{ background: "#FFD700", color: "#131315", fontWeight: 600 }} onClick={() => setIsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MembersDrawer;

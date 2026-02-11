import { useState, useEffect } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

function MembersDrawer({ group, isOpen }) {

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

  return (
    <div
      style={{
        width: isOpen ? "300px" : "0px",
        transition: "0.25s ease",
        overflow: "hidden",
        borderLeft: isOpen ? "1px solid #ECECF2" : "none",
        background: "#FFFFFF"
      }}
    >

      {/* HEADER */}
      <div className="px-4 py-3 fw-semibold"
        style={{ borderBottom: "1px solid #ECECF2" }}
      >
        Members
      </div>

      {/* ADD MEMBER BUTTON */}
      <div className="px-4 py-3">

        {!adding && (
          <button
            className="btn w-100 rounded-pill"
            style={{
              border: "2px dashed #7C6CF2",
              color: "#7C6CF2",
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
                style={{ background: "#7C6CF2" }}
                onClick={handleAddMember}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add"}
              </button>

              <button
                className="btn btn-sm"
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
      <div
        className="px-4"
        style={{ overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}
      >

        {members.map((member, index) => (

          <div key={index} className="d-flex align-items-center mb-3">

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

            <div style={{ fontSize: "14px" }}>
              {member}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MembersDrawer;

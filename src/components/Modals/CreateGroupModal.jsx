import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverEndpoint } from "../../config/appConfig";
import SuccessAlert from "../Alerts/SuccessAlert";

function CreateGroupModal({
  isOpen,
  setIsOpen,
  refreshGroups,
  setMode,
  mode,
  currentGroup
}) {
  console.log(currentGroup);
  const userDetails = useSelector((state) => state.userDetails);

  const [errors, setErrors] = useState({});
  const [isGroupCreated, setIsGroupCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenSuccessAlert, setIsOpenSuccessAlert] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    adminEmail: userDetails.email,
    memberEmail: [userDetails.email],
    category: [],
    thumbnail: ""
  });

  const [tempEmail, setTempEmail] = useState("");

  useEffect(() => {
    if (mode === "edit" && currentGroup) {
      setFormData({
        name: currentGroup.name || "",
        description: currentGroup.description || "",
        adminEmail: currentGroup.adminEmail || userDetails.email,
        memberEmail: currentGroup.memberEmail || [],
        category: currentGroup.category || [],
        thumbnail: currentGroup.thumbnail || ""
      });
    }

    if (mode === "create") {
      setFormData({
        name: "",
        description: "",
        adminEmail: userDetails.email,
        memberEmail: [userDetails.email],
        category: [],
        thumbnail: ""
      });
    }
  }, [mode, currentGroup, userDetails.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMembers = () => {
    if (tempEmail && !formData.memberEmail.includes(tempEmail)) {
      setFormData((prev) => ({
        ...prev,
        memberEmail: [...prev.memberEmail, tempEmail]
      }));
      setTempEmail("");
    }
  };

  const handleRemoveMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      memberEmail: prev.memberEmail.filter((_, i) => i !== index)
    }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setErrors({});
    setTempEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "create") {
        const body = {
          adminEmail: formData.adminEmail,
          name: formData.name,
          description: formData.description,
          memberEmail: formData.memberEmail,
          createdBy: userDetails.id,
          thumbnail: formData.thumbnail
        };

        const res = await axios.post(
          `${serverEndpoint}/groups/create`,
          body,
          { withCredentials: true }
        );

        if (res.status === 201) {
          setIsGroupCreated(true);
          setIsOpenSuccessAlert(true);
          refreshGroups();
          closeModal();
        }
      } else if (mode === "edit") {
        const body = {
          adminEmail: formData.adminEmail,
          name: formData.name,
          description: formData.description,
          thumbnail: formData.thumbnail
        };

        const groupId = currentGroup._id;

        const res = await axios.patch(
          `${serverEndpoint}/groups/${groupId}`,
          body,
          { withCredentials: true }
        );

        if (res.status === 201) {
          setIsGroupCreated(true);
          setIsOpenSuccessAlert(true);
          refreshGroups();
          closeModal();
        }
      }
    } catch (error) {
      if (error.response) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Something went wrong" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const emails = formData.memberEmail;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0 rounded-4"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 18px 40px rgba(0,0,0,0.15)"
          }}
        >
          {/* HEADER */}
          <div
            className="px-4 pt-4 pb-3 border-bottom"
            style={{ borderColor: "#E6E7EC" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-semibold" style={{ color: "#2B2D42" }}>
                {mode === "create" ? "Create group" : "Edit group"}
              </h5>

              <button className="btn-close" onClick={closeModal} />
            </div>
          </div>

          {/* BODY */}
          <div className="px-4 py-4">
            {errors.general && (
              <div className="alert alert-danger">{errors.general}</div>
            )}

            {/* Group Name */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control border-0 border-bottom rounded-0"
                name="name"
                placeholder="Group name"
                value={formData.name}
                onChange={handleChange}
                style={{ borderBottom: "2px solid #E6E7EC" }}
                onFocus={(e) =>
                  (e.target.style.borderBottom = "2px solid #7C6CF2")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottom = "2px solid #E6E7EC")
                }
              />
              <label>Group name</label>
            </div>

            {/* Thumbnail */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control border-0 border-bottom rounded-0"
                name="thumbnail"
                placeholder="Thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                style={{ borderBottom: "2px solid #E6E7EC" }}
                onFocus={(e) =>
                  (e.target.style.borderBottom = "2px solid #7C6CF2")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottom = "2px solid #E6E7EC")
                }
              />
              <label>Thumbnail Link</label>
            </div>

            {/* Description */}
            <div className="form-floating mb-4">
              <textarea
                className="form-control border-0 border-bottom rounded-0"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                style={{
                  height: "90px",
                  borderBottom: "2px solid #E6E7EC"
                }}
                onFocus={(e) =>
                  (e.target.style.borderBottom = "2px solid #7C6CF2")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottom = "2px solid #E6E7EC")
                }
              />
              <label>Description</label>
            </div>

            {/* Participants */}
            <div className="mb-2 fw-medium small" style={{ color: "#2B2D42" }}>
              Participants
            </div>

            <div className="d-flex gap-2 mb-3">
              <input
                type="email"
                className="form-control rounded-pill"
                placeholder="Add email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
              />

              <button
                className="btn rounded-pill px-3"
                style={{ background: "#FFF6D6", color: "#8A6B00" }}
                onClick={handleAddMembers}
              >
                Add
              </button>
            </div>

            {/* Member Chips */}
            <div className="d-flex flex-wrap gap-2">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center rounded-pill px-3 py-1"
                  style={{ background: "#F1EFFF", color: "#7C6CF2" }}
                >
                  <span className="small">{email}</span>

                  {mode === "create" && (
                    <button
                      className="btn btn-sm ms-2 p-0 border-0"
                      onClick={() => handleRemoveMember(index)}
                    >
                      <i
                        className="bi bi-x-lg small"
                        style={{ color: "#7C6CF2" }}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-4 pb-4 d-flex justify-content-end gap-2">
            <button
              className="btn rounded-pill px-4"
              style={{ background: "#F3F4F8", color: "#2B2D42" }}
              onClick={closeModal}
            >
              Cancel
            </button>

            {isLoading ? (
              <button
                className="btn rounded-pill px-4"
                style={{ background: "#7C6CF2", color: "white" }}
                disabled
              >
                <span className="spinner-border spinner-border-sm"></span>
              </button>
            ) : (
              <button
                className="btn rounded-pill px-4"
                style={{ background: "#7C6CF2", color: "white" }}
                onClick={handleSubmit}
              >
                {mode === "create" ? "Create" : "Update"}
              </button>
            )}
          </div>
        </div>
      </div>

      <SuccessAlert
        isOpenAlert={isOpenSuccessAlert}
        setIsOpenAlert={setIsOpenSuccessAlert}
      />
    </div>
  );
}

export default CreateGroupModal;

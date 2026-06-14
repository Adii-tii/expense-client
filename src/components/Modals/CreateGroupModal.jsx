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
  const userDetails = useSelector((state) => state.userDetails);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenSuccessAlert, setIsOpenSuccessAlert] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    adminEmail: userDetails.email,
    memberEmail: [userDetails.email],
    category: [],
    thumbnail: ""
  });

  const [tempEmail, setTempEmail] = useState("");

  /* ================= INIT ================= */
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
      setThumbnailFile(null);
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
      setThumbnailFile(null);
    }
  }, [mode, currentGroup, userDetails.email]);

  /* ================= THUMBNAIL UPLOAD ================= */
  const handleThumbnailUpload = async (file) => {
    if (!file) return;

    try {
      // preview immediately
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, thumbnail: preview }));
      setThumbnailFile(file);

      // if editing existing group → upload instantly
      if (mode === "edit" && currentGroup?._id) {
        const form = new FormData();
        form.append("image", file);

        const res = await axios.post(
          `${serverEndpoint}/groups/${currentGroup._id}/thumbnail`,
          form,
          { withCredentials: true }
        );

        setFormData(prev => ({
          ...prev,
          thumbnail: res.data.thumbnail
        }));
      }

    } catch (err) {
      console.error("Thumbnail upload failed", err);
    }
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMembers = () => {
    if (tempEmail && !formData.memberEmail.includes(tempEmail)) {
      setFormData(prev => ({
        ...prev,
        memberEmail: [...prev.memberEmail, tempEmail]
      }));
      setTempEmail("");
    }
  };

  const handleRemoveMember = (index) => {
    setFormData(prev => ({
      ...prev,
      memberEmail: prev.memberEmail.filter((_, i) => i !== index)
    }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setErrors({});
    setTempEmail("");
    setThumbnailFile(null);
  };

  /* ================= SUBMIT ================= */
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
          thumbnail: "" // start with empty thumbnail
        };

        const res = await axios.post(
          `${serverEndpoint}/groups/create`,
          body,
          { withCredentials: true }
        );

        if (res.status === 201) {
          const createdGroup = res.data.group;
          if (thumbnailFile && createdGroup?._id) {
            const form = new FormData();
            form.append("image", thumbnailFile);
            try {
              await axios.post(
                `${serverEndpoint}/groups/${createdGroup._id}/thumbnail`,
                form,
                { withCredentials: true }
              );
            } catch (uploadErr) {
              console.error("Failed to upload group thumbnail", uploadErr);
            }
          }
          setIsOpenSuccessAlert(true);
          refreshGroups();
          closeModal();
        }
      }

      if (mode === "edit") {
        const body = {
          adminEmail: formData.adminEmail,
          name: formData.name,
          description: formData.description,
          thumbnail: formData.thumbnail
        };

        const res = await axios.patch(
          `${serverEndpoint}/groups/${currentGroup._id}`,
          body,
          { withCredentials: true }
        );

        if (res.status === 201 || res.status === 200) {
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
            background: "#1B1B1D",
            boxShadow: "none",
            border: "1px solid #39393B"
          }}
        >
          {/* hidden file input */}
          <input
            id="coverUpload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) =>
              handleThumbnailUpload(e.target.files[0])
            }
          />

          {/* COVER HEADER (ALWAYS SHOWN) */}
          <div
            onClick={() =>
              document.getElementById("coverUpload").click()
            }
            style={{
              height: 160,
              backgroundImage: formData.thumbnail
                ? `url(${formData.thumbnail})`
                : "linear-gradient(135deg,#9D5CFF,#9D5CFF)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              position: "relative",
              cursor: "pointer"
            }}
          >
            {/* overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.25)",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16
              }}
            />

            {/* title */}
            <div
              style={{
                position: "absolute",
                bottom: 14,
                left: 18,
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "white",
                fontWeight: 600,
                fontSize: 16
              }}
            >
              <span>
                {mode === "create" ? "Create group" : "Edit group"}
              </span>
              <i className="bi bi-pencil-square" />
            </div>

            {/* change hint */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 18,
                background: "rgba(0,0,0,0.45)",
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 12,
                color: "white"
              }}
            >
              {formData.thumbnail
                ? "Change cover"
                : "Add cover"}
            </div>

            {/* close */}
            <button
              className="btn-close btn-close-white"
              style={{ position: "absolute", top: 12, right: 12 }}
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            />
          </div>

          {/* BODY */}
          <div className="px-4 py-4">
            {errors.general && (
              <div className="alert alert-danger">
                {errors.general}
              </div>
            )}

            {/* NAME */}
            <div className={`mat-field ${formData.name ? "has-value" : ""}`}>
              <input
                type="text"
                name="name"
                placeholder="Group name"
                value={formData.name}
                onChange={handleChange}
              />
              <label>Group name</label>
            </div>

            {/* DESCRIPTION */}
            <div className={`mat-field ${formData.description ? "has-value" : ""}`}>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              />
              <label>Description</label>
            </div>

            {/* PARTICIPANTS */}
            <div className="mb-2 fw-medium small" style={{ color: "#A1A1AA" }}>
              Participants
            </div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginBottom: "12px" }}>
              <div className={`mat-field flex-grow-1 mb-0 ${tempEmail ? "has-value" : ""}`} style={{ marginBottom: 0 }}>
                <input
                  type="email"
                  placeholder="Member email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddMembers()}
                />
                <label>Member email</label>
              </div>
              <button
                style={{
                  background: "none", border: "none", color: "#9D5CFF",
                  fontWeight: 600, fontSize: "13px", cursor: "pointer",
                  paddingBottom: "8px", whiteSpace: "nowrap"
                }}
                onClick={handleAddMembers}
              >
                + Add
              </button>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center rounded-pill px-3 py-1"
                  style={{ background: "rgba(157, 92, 255, 0.15)", color: "#9D5CFF" }}
                >
                  <span className="small">{email}</span>

                  {mode === "create" && (
                    <button
                      className="btn btn-sm ms-2 p-0 border-0 text-white-50"
                      onClick={() => handleRemoveMember(index)}
                    >
                      <i className="bi bi-x-lg small" />
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
              style={{ background: "#39393B", color: "#FFFFFF" }}
              onClick={closeModal}
            >
              Cancel
            </button>

            {isLoading ? (
              <button
                className="btn rounded-pill px-4"
                style={{ background: "#FFD700", color: "#131315" }}
                disabled
              >
                <span className="spinner-border spinner-border-sm"></span>
              </button>
            ) : (
              <button
                className="btn rounded-pill px-4"
                style={{ background: "#FFD700", color: "#131315" }}
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

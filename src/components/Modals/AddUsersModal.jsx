import { useState, useEffect } from "react";
import { serverEndpoint } from "../../config/appConfig";
import axios from "axios";

function AddUsersModal({ users, setUsers, isOpen, setIsOpen, setMode, mode, editUser }) {
    const [actionLoading, setActionLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);


    const [formData, setFormData] = useState({
        userId: "",
        username: "",
        email: "",
        role: "Select",
    });


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let isValid = true;
        let newErrors = {};

        if (formData.username.length === 0) {
            isValid = false;
            newErrors.username = "Name is required";
        }

        if (formData.email.length === 0) {
            isValid = false;
            newErrors.email = "Email is required";
        }

        if (formData.role === "Select") {
            isValid = false;
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setActionLoading(true);

        try {
            if(mode==="create"){
                const response = await axios.post(
                `${serverEndpoint}/user/`,
                {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role,
                },
                { withCredentials: true }
            );

            setUsers([...users, response.data.user]);
            setMessage("User added!");

            setFormData({
                username: "",
                email: "",
                role: "Select",
            });
            }
            else{
                const response = await axios.patch(
                `${serverEndpoint}/user/`,
                {
                    userId: formData.userId,
                    username: formData.username,
                    role: formData.role,
                },
                { withCredentials: true }
            );

            setUsers([...users, response.data.user]);
            setMessage("Changes made successfully!");

            setFormData({
                username: "",
                email: "",
                role: "Select",
            });
            }
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to add user, please try again" });
        } finally {
            setActionLoading(false);
        }
    };
    useEffect(() => {
        if (mode === "edit" && editUser) {
            setFormData({
                userId: editUser._id,
                username: editUser.username,
                email: editUser.email,
                role: editUser.role,
            });
        }
    }, [mode, editUser]);

    if (!isOpen) return;

    


    return (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">

      <div
        className="modal-content border-0 rounded-4"
        style={{
          background: "#FFFFFF",
          boxShadow: "0 18px 40px rgba(0,0,0,0.15)"
        }}
      >

        {/* HEADER */}
        <div
          className="modal-header border-bottom"
          style={{ borderColor: "#E6E7EC" }}
        >
          <h5
            className="modal-title fw-semibold"
            style={{ color: "#2B2D42" }}
          >
            {mode === "create" ? "Add Member" : "Edit Details"}
          </h5>

          <button
            className="btn-close"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {/* BODY */}
        <div className="modal-body px-4 py-3">

          <form onSubmit={handleSubmit}>

            {/* Username */}
            <div className="mb-3">
              <label className="form-label fw-medium" style={{ color: "#2B2D42" }}>
                Username
              </label>

              <input
                type="text"
                name="username"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                value={formData.username}
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  border: "1px solid #E6E7EC"
                }}
                onFocus={(e)=> e.target.style.border="1px solid #7C6CF2"}
                onBlur={(e)=> e.target.style.border="1px solid #E6E7EC"}
              />

              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-medium" style={{ color: "#2B2D42" }}>
                Email
              </label>

              <input
                type="text"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                value={formData.email}
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  border: "1px solid #E6E7EC"
                }}
                onFocus={(e)=> e.target.style.border="1px solid #7C6CF2"}
                onBlur={(e)=> e.target.style.border="1px solid #E6E7EC"}
              />

              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Role */}
            <div className="mb-4">
              <label className="form-label fw-medium" style={{ color: "#2B2D42" }}>
                Role
              </label>

              <select
                name="role"
                className={`form-select ${errors.role ? "is-invalid" : ""}`}
                value={formData.role}
                onChange={handleChange}
                style={{
                  borderRadius: "10px",
                  border: "1px solid #E6E7EC"
                }}
                onFocus={(e)=> e.target.style.border="1px solid #7C6CF2"}
                onBlur={(e)=> e.target.style.border="1px solid #E6E7EC"}
              >
                <option value="Select">Select</option>
                <option value="manager">Manager</option>
                <option value="viewer">Viewer</option>
              </select>

              {errors.role && (
                <div className="invalid-feedback">{errors.role}</div>
              )}
            </div>

            {/* FOOTER BUTTON */}
            <div className="d-grid">

              <button
                className="btn rounded-pill py-2"
                style={{
                  background: "#7C6CF2",
                  color: "white",
                  transition: "0.2s"
                }}
                onMouseEnter={(e)=> e.target.style.background="#6A5AE0"}
                onMouseLeave={(e)=> e.target.style.background="#7C6CF2"}
              >
                {actionLoading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  mode === "create" ? "Add Member" : "Save Changes"
                )}
              </button>

            </div>

          </form>

        </div>

      </div>
    </div>
  </div>
);

}

export default AddUsersModal;
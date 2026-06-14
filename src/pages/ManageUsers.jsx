import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import Button from "react-bootstrap/esm/Button";
import Can from "../components/Can";
import AddUsersModal from "../components/Modals/AddUsersModal";


function ManageUsers() {
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [users, setUsers] = useState([]);
    const [mode, setMode] = useState("create")
    const [editUser, setEditUser] = useState();

    const handleEdit = (user) => {
        setMode("edit");
        setIsOpen(true);
        setEditUser(user);

    }

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/user/`, {
                withCredentials: true,
            });

            setUsers(response.data.users || []);
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to fetch users, please try again" });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="container p-5">
                <h4>Loading users...</h4>
            </div>
        );
    }

    return (
  <div className="container-fluid px-0">

    {/* Header */}
    <div className="d-flex justify-content-between align-items-center mb-4 mt-0 px-0">

      <div>
        <h4 className="fw-semibold" style={{ color: "#FFFFFF" }}>
          Manage Users
        </h4>
        <small style={{ color: "#A1A1AA" }}>
          Manage and track shared expenses
        </small>
      </div>

      <Can requiredPermission={"canCreateUsers"}>
        <button
          className="btn rounded-pill px-4"
          style={{
            background: "#FFD700",
            color: "#131315",
            fontWeight: 600,
            transition: "0.2s"
          }}
          onMouseEnter={(e)=> e.target.style.filter="brightness(1.1)"}
          onMouseLeave={(e)=> e.target.style.filter="none"}
          onClick={() => setIsOpen(true)}
        >
          <i className="bi bi-plus me-2"></i>
          Add Member
        </button>
      </Can>

    </div>

    {/* Errors */}
    {errors.message && (
      <div className="alert alert-danger">{errors.message}</div>
    )}

    {message && (
      <div className="alert alert-success">{message}</div>
    )}

    {/* Table Card */}
    <div
      className="card border-0 rounded-4"
      style={{
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
      }}
    >

      <div className="table-responsive">

        <table className="table align-middle mb-0">

          <thead style={{ background: "#131315" }}>
            <tr>
              <th className="text-center">Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-5" style={{ color: "#A1A1AA" }}>
                  No users found. Start by adding one!
                </td>
              </tr>
            )}

            {users.map((user) => (
              <tr
                key={user._id}
                style={{
                  transition: "0.2s"
                }}
                onMouseEnter={(e)=> e.currentTarget.style.background="rgba(255, 255, 255, 0.04)"}
                onMouseLeave={(e)=> e.currentTarget.style.background="transparent"}
              >

                {/* Name with Avatar */}
                <td className="text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2">

                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                      style={{
                        width: "34px",
                        height: "34px",
                        background: "rgba(157, 92, 255, 0.15)",
                        color: "#9D5CFF"
                      }}
                    >
                      {user.username?.[0]?.toUpperCase()}
                    </div>

                    <span style={{ color: "#FFFFFF" }}>
                      {user.username}
                    </span>

                  </div>
                </td>

                <td className="text-center" style={{ color: "#A1A1AA" }}>
                  {user.email}
                </td>

                {/* Role Badge */}
                <td className="text-center">
                  <span
                    className="px-3 py-1 rounded-pill fw-medium"
                    style={{
                      background: "rgba(255, 215, 0, 0.15)",
                      color: "#FFD700",
                      fontSize: "12px"
                    }}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Actions */}
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-3">

                    <button
                      className="btn rounded-pill px-3"
                      style={{
                        background: "rgba(157, 92, 255, 0.15)",
                        color: "#9D5CFF"
                      }}
                      onClick={() => handleEdit(user)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Edit
                    </button>

                    <button
                      className="btn rounded-pill px-3"
                      style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        color: "#EF4444"
                      }}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))}

          </tbody>
        </table>

      </div>

    </div>

    <AddUsersModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      setMode={setMode}
      mode={mode}
      editUser={editUser}
    />

  </div>
);
}

export default ManageUsers;

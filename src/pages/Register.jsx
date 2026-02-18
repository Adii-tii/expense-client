import axios from "axios";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig.js";

function Register({ refreshAuth }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = "username is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      console.log(formData)
      const res = await axios.post(
        `${serverEndpoint}/auth/register`,
        formData, { withCredentials: true }
      );

      console.log(res);

      setMessage(`Successfully registered as ${formData.username}`);
      setErrors({});
      await refreshAuth();
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Network error. Please try again." });
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white p-4 shadow-sm" style={{ width: "480px" }}>
        <form onSubmit={handleFormSubmit}>
          <div className="text-center mb-4">
            <h3>Create your free account</h3>
          </div>

          {errors.general && (
            <div className="text-danger text-center mb-3">
              {errors.general}
            </div>
          )}

          <div>
            <label className="form-label"></label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
            {errors.username && (
              <div className="text-danger small mt-1">
                {errors.username}
              </div>
            )}
          </div>

          <div>
            <label className="form-label"></label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <div className="text-danger small mt-1">
                {errors.email}
              </div>
            )}
          </div>

          <div className="mb-8">
            <label className="form-label"></label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            {errors.password && (
              <div className="text-danger small mt-1">
                {errors.password}
              </div>
            )}
          </div>

          <Button type="submit" variant="dark" className="w-100 btn border-0 rounded-pill px-3 text-white mt-4" style={{
            background: "#7C6CF2",
          }}>
            Register
          </Button>

          {message && (
            <div className="text-success text-center mt-3">
              {message}
            </div>
          )}
        </form>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 text-muted">or</span>
          <hr className="flex-grow-1" />
        </div>

        <Button
          type="button"
          variant="light"
          className="w-100 border border-secondary"
        >
          Sign up with Google
        </Button>

        <div className="mt-3 text-center">
          Already have an account?{" "}
          <a className="text-primary" href="/login">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;

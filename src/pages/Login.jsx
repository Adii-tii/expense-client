import { useState } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""});

  const [errors, setErrors] = useState({});
  const [message, setMessages] = useState({});
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let newErrors = {};
    let isValid = true;

    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (formData.password.trim() === "") {
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
        console.log(formData);
        const res = await axios.post("http://localhost:5001/auth/login", formData);
        console.log("Login successful:", res.data);
        setMessages({login: "Successfully logged in!"});
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
        <div className="bg-white p-4"
        style={{ width: "480px" }}>
      <form onSubmit={handleFormSubmit}>
        <div className="text-center mb-4">
          <h3>Sign in to Expense</h3>
        </div>

        {errors.general &&   (
          <div className="text-danger text-center mb-3">
            {errors.general}
          </div>
        )}

        <div>
          <label className="form-label"></label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && (
            <div className="text-danger small mt-1">{errors.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label"></label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && (
            <div className="text-danger small mt-1">{errors.password}</div>
          )}
        </div>

        <Button type="submit" variant="success" className="w-100">
          Log in
        </Button>
        {message.login && (
            <div className="text-success small mt-1 text-center">{message.login}</div>
        )}
      </form>

      <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 text-muted">or</span>
          <hr className="flex-grow-1" />
        </div>


      <div className="d-flex flex-column gap-2  mt-3">
          <Button
            type="button"
            variant="light"
            className="w-100 border border-secondary"
          >
            Continue with Google
          </Button>

          <div className="mt-3 text-center">
          Don't have an account?{" "}
          <a className="text-primary" href="/register">
            Register
          </a>
        </div>

        </div>
        </div>
      
    </div>
  );
}

export default Login;

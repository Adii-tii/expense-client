  import { useState } from "react";
  import Button from "react-bootstrap/Button";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { GoogleOAuthProvider, GoogleLogin }  from "@react-oauth/google"
  import { serverEndpoint } from "../config/appConfig.js";
   

  function Login({refreshAuth }) {  
    const navigate = useNavigate();
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

    const hasPassword = async () => {

      const res = await axios.post(`${serverEndpoint}/auth/valid-login`, {email: formData.email});
      return res.data.hasPassword; //if true user has a password
    }

    const validate = async() => {
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

      if(isValid){
        const userHasPassword = await hasPassword();

        if(!userHasPassword){
          newErrors.general = "Please log in using Google SSO";
          isValid = false;
        }
      }

     if (!isValid) {
      setErrors(newErrors);
      }
    return isValid;
    };

    const handleFormSubmit = async (event) => {
      event.preventDefault();

      console.log("here");
      const isValid = await validate();

      if (!isValid) return;
      console.log("passed validation")

      try {
          const body = {
            email: formData.email,
            password: formData.password
          }

          const res = await axios.post(`${serverEndpoint}/auth/login`, body, {withCredentials:true});
          console.log("Login successful:", res);
          setMessages({login: "Successfully logged in!"});
          await refreshAuth();
          navigate('/dashboard');

      } catch (error) {
        if (error.response) {
          setErrors({ general: error.response.data.message});
        } else {
          setErrors({ general: "Network error. Please try again." });
        }
      } finally{
        console.log(isValid);
      }
    };

    const handleGoogleSuccess = async (authResponse) => {
      console.log(JSON.stringify(authResponse));

      const idToken = authResponse.credential;
      const res = await axios.post(`${serverEndpoint}/auth/google-auth`,{idToken}, {withCredentials:true});
      console.log("Login successful:", res);
      setMessages({login: "Successfully logged in!"});
      await refreshAuth(); 
      console.log("about to navigate");
      navigate('/dashboard');
    };

    const handleGoogleFailure = (error) => {
      console.log(error);
    }

    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="bg-white p-4 shadow-sm"
          style={{ width: "480px" }}>
        <form onSubmit={handleFormSubmit}>
          <div className="text-center mb-4">
            <h3>Welcome back!</h3>
            <p>Log in to expense</p>
          </div>

          {errors.general &&   (
            <div className="text-danger text-center mb-3">
              {errors.general}
            </div>
          )}

          <div>
            <label className="form-label small fw-bold">Email</label>
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

          <div className="mb-3 mt-3">
            <div className="d-flex justify-content-between align-items-center">
              <label className="form-label small fw-bold">Password</label>

              <a
                href="/reset-password"
                className="small text-primary text-decoration-none"
              >
                Forgot password?
              </a>
            </div>
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
            <div className="row justify-content-center">
            <div>
              <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <GoogleLogin onSuccess = {handleGoogleSuccess} onError= {handleGoogleFailure}/>
              </GoogleOAuthProvider>
              
            </div>
          </div>

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

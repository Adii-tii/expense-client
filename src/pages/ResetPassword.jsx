import { useState } from "react";
  import Button from "react-bootstrap/Button";

function ResetPassword(){
    const [errors, setErrors] = useState();
    const handleFormSubmit = () => {

    }

    return(
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="bg-white p-4"
            style={{ width: "480px" }}>
            <form onSubmit={handleFormSubmit}>
            <div className="text-center mb-4">
                <h3>Change your password</h3>
                <p>Log in to expense</p>
            </div>

            <div>
                <label className="form-label small fw-bold">Token</label>
                <input
                type="text"
                className="form-control"
                placeholder="Enter your email"
                />
            </div>

            <div className="mt-4">
                <label className="form-label small fw-bold">New Password</label>
                <input
                type="text"
                className="form-control"
                placeholder="Enter your email"
                />
            </div>

            <div className="mt-4 mb-5">
                <label className="form-label small fw-bold">Confirm New Password</label>
                <input
                type="text"
                className="form-control"
                placeholder="Enter your email"
                />
            </div>

            <Button type="submit" variant="success" className="w-100">
                Change Password
            </Button>

            </form>
            </div>
          </div>
    )
}

export default ResetPassword;
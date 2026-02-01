import { useState } from "react";
  import Button from "react-bootstrap/Button";

function ResetPassword(){
    const [errors, setErrors] = useState();
    const [formData, setFormData] = useState({
        token:'',
        email:'',
        password:''
    })
    const handleFormSubmit = () => {

    }

    return(
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="bg-white p-4"
            style={{ width: "480px" }}>
            <form onSubmit={handleFormSubmit}>
            <div className="text-center mb-10">
                <h3>Change your password</h3>
            </div>

            <div className="form-inline">
                <div>
                    <label className="form-label small fw-bold">Code</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Enter the code "
                    />
                </div>
                <button type="submit" class="btn btn-primary mb-2">Confirm identity</button>
            </div>

            <div className="mt-3">
                <label className="form-label small fw-bold">Email</label>
                <input
                type="text"
                className="form-control"
                placeholder="Enter registered email"
                />
            </div>

            <div className="mt-3 mb-5">
                <label className="form-label small fw-bold">New Password</label>
                <input
                type="text"
                className="form-control"
                placeholder="Enter new password"
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
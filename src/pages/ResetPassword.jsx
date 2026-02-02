import {useState } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword(){
    const [errors, setErrors] = useState();
    const navigate = useNavigate();
    const [message, setMessages] = useState();
    const [codeSent, setCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [formData, setFormData] = useState({
        code:'',
        email:'',
        newPassword:''
    })

    const [isDisabled, setIsDisabled] = useState(true);

    const handleGenerateCode = async() => {
        if (!formData.email) {
        setErrors({ email: "Email is required" });
        return;
    }
        try{
            const res = await axios.post("http://localhost:5001/auth/generate-code", {email: formData.email});
            console.log(res);
            setCodeSent(true);
        } catch (error){
            console.log(error);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors(prev => ({
            ...prev,
            [name]: null,
            general: null,
        }));

    }

    const handleVerifyCode = async() => {
        try{
            const {code, email} = formData;
            const res = await axios.post("http://localhost:5001/auth/verify-code", {code, email});

            if(res.data.success){
                console.log("code has been verified");
                setIsVerified(true);
                setIsDisabled(false);
            }

            if(res.data.success === false){
                console.log("invalid code");
                setErrors({code: "Invalid code entered. Try again."})
            }
        } catch (error){
            console.log(error);
        }
    }

    const handleFormSubmit = async () => {
        event.preventDefault();
        const {email, newPassword} = formData;
        try{
            const res = await axios.post("http://localhost:5001/auth/reset-password", {email, newPassword});
            console.log(res);

            if(res.status === 200){
                setMessages({general: "Password reset successful. You can now log in with your new password."});
            }

            navigate('/login');
        } catch (error) {
            console.log(error);

            setErrors({
                general: error.response?.data?.message 
                    || "Could not reset password. Try again later."
        });
    }
    }

    return(
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div
                className="bg-white p-4 rounded shadow-sm"
                style={{ width: "480px" }}
            >
                <form onSubmit={handleFormSubmit}>
                <div className="text-center mb-4">
                    <h4 className="fw-bold">Change your password</h4>
                    <p className="text-muted small mb-0">
                    Verify your identity to continue
                    </p>

                    {errors?.general && (
                    <div className="text-danger text-center mb-3">
                        {errors.general}
                    </div>
                    )}
                    
                    {message?.general && (
                    <div className="text-success text-center mb-3">
                        {message.general}
                    </div>
                    )}
                </div>


                {/* Email */}
                <div className="d-flex align-items-end gap-2 mb-3">
                    <div className="grow">
                        <label className="form-label small fw-bold">Email</label>
                        <input
                        type="email"
                        className="form-control"
                        placeholder="Enter registered email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        />
                    </div>
                    {codeSent ? (
                        <Button
                        type="button"
                        className="btn btn-success"
                        style={{ height: "38px" }}
                        disabled>Code Sent</Button>) :
                        (<Button
                        type="button"
                        className="btn btn-primary"
                        style={{ height: "38px" }}
                        onClick={handleGenerateCode}
                        >
                        Send Code
                        </Button>)}
                </div>
                {errors?.email && (
                    <div className="text-danger small mb-3">
                    {errors.email}
                    </div>
                )}

                {/* Code + Button */}
                <div className="d-flex align-items-end gap-2 mb-3">
                    <div className="flex-grow-1">
                    <label className="form-label small fw-bold">Code</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter the code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange} 
                    />
                    </div>

                    {isVerified ? (
                        <Button
                        type="button"
                        className="btn btn-success"
                        style={{ height: "38px" }}
                        disabled>
                        Verified
                        </Button>) :
                        
                        (<Button
                        type="button"
                        className="btn btn-primary"
                        style={{ height: "38px" }}
                        onClick={handleVerifyCode}
                        >
                        Verify Code
                        </Button>)}
                </div>
                {errors?.code && (
                    <div className="text-danger small mb-3">
                    {errors.code}
                    </div>
                )}

                {/* New Password */}
                <div className="mb-4">
                    <label className="form-label small fw-bold">New Password</label>
                    <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    disabled={isDisabled}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    />
                </div>
                {errors?.newPassword && (
                    <div className="text-danger small mb-3">
                        {errors.newPassword}
                    </div>
                )}

                <button type="submit" className="btn btn-success w-100" disable={isDisabled}>
                    Change Password
                </button>
                </form>
            </div>
            </div>

    )
}

export default ResetPassword;
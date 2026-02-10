import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { BeatLoader } from "react-spinners";

const CREDITS_PACK = [
    {
        price: 1,
        credits: 10
    },
    {
        price: 4,
        credits: 50
    },
    {
        price: 7,
        credits: 100
    }
]

function ManagePayments() {
    const [userProfile, setUserProfile] = useState(null);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCredits, setSelectedCredits] = useState();

    const getUserProfile = async () => {
        try {
            const res = await axios.get(`${serverEndpoint}/profile/get-user-info`, { withCredentials: true }); //dpnt need to pass anything as the body since the userid can be extracted fmo jwt token by the middleware 
            setUserProfile(res?.data?.user);

        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to fetch user profile. Try again later.' })
        } finally {
            setLoading(false);
        }
    }

    const paymentResponseHandler = async(credits, payment) => {
        try{
            const res = await axios.post(
                `${serverEndpoint}/payments/verify-order`,
                {
                    razorpay_order_id : payment.razorpay_order_id,
                    razorpay_payment_id : payment.razorpay_payment_id,
                    razorpay_signature: payment.razorpay_signature,
                    credits: credits
                },
                {withCredentials: true}
            )
            console.log(res.data.user.credits);

            setUserProfile(res.data.user);
            setMessage(`Payment success, ${credits} are credited to your account`);
        }catch (error){
            console.log(error);
            setErrors({message: "Unable to process payment request, constact customer service"});
        }
    }

    const handlePayment = async (credits) => {
        console.log("selected credits: ", credits);
        try {
            setLoading(true);
            const res = await axios.post(`${serverEndpoint}/payments/create-order`,
                { credits: credits },
                { withCredentials: true }
            );
            console.log(res);
            const order = res.data.order;

            setSelectedCredits(credits);
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'MergeMoney',
                description: `Order for purchasing ${credits} credits`,
                order_id: order.id,
                theme: {
                    color: '#3399cc'
                },
                handler: (response) => { paymentResponseHandler(credits, response)}
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to process the payment request at the moment' })
        }
    }

    useEffect(() => {
        getUserProfile();
    }, [])
    if (loading) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8f9fa"
                }}
            >
                <BeatLoader color="black" size={15} />
            </div>
        );
    }
    return (
        <div className="container p-5">
            {
                errors.message && (
                    <div className="alert alert-danger" role="alert">
                        {errors.message}
                    </div>
                )
            }

            {
                message && (
                    <div className="alert alert-success" role="alert">
                        {message}
                    </div>
                )
            }

            <div className="px-5 fs-3 text-center">
                <div className="rounded-4 mb-5">
                    Credits:
                    {
                        userProfile.credits === 0 ? (<span className="text-danger fw-bold">{userProfile.credits}
                        </span>) : (
                            <span className="text-primary fw-bold">{userProfile.credits}
                            </span>
                        )
                    }
                </div>

                <div className="bg  py-5 px-5">
                    Get credits now
                    <div className="d-flex gap-4 mt-5 fs-4">

                        {CREDITS_PACK.map((pack) => {
                            return (
                                <div className="bg-light rounded-5 p-4" style={{ height: "200px", width: "350px" }}>
                                    <p>{pack.credits} Credits for {pack.price} Rupee</p>
                                    <p className="fs-5">Create {pack.credits} groups</p>
                                    <button
                                        className="btn btn-lg btn-outline-dark px-5 rounded-pill"
                                        onClick={() => handlePayment(pack.credits)}
                                    > Buy Now
                                    </button>
                                </div>
                            )
                        })}


                    </div>
                </div>

            </div>
        </div >
    )
}

export default ManagePayments;
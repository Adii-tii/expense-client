import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { BeatLoader } from "react-spinners";

const CREDITS_PACK = [
  { price: 1, credits: 10 },
  { price: 4, credits: 50 },
  { price: 7, credits: 100 }
];

function ManagePayments() {

  const [userProfile, setUserProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);


  const getUserProfile = async () => {
    try {
      const res = await axios.get(
        `${serverEndpoint}/profile/get-user-info`,
        { withCredentials: true }
      );
      setUserProfile(res?.data?.user);
    } catch {
      setErrors({ message: "Unable to fetch user profile. Try again later." });
    } finally {
      setLoading(false);
    }
  };


  const paymentResponseHandler = async (credits, payment) => {
    try {
      const res = await axios.post(
        `${serverEndpoint}/payments/verify-order`,
        {
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_signature: payment.razorpay_signature,
          credits
        },
        { withCredentials: true }
      );

      setUserProfile(res.data.user);
      setMessage(`Payment successful. ${credits} credits added.`);
    } catch {
      setErrors({
        message: "Unable to process payment. Please contact support."
      });
    }
  };

  const handlePayment = async (credits) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${serverEndpoint}/payments/create-order`,
        { credits },
        { withCredentials: true }
      );

      const order = res.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MergeMoney",
        description: `Purchase ${credits} credits`,
        order_id: order.id,
        theme: { color: "#7C6CF2" },
        handler: (response) =>
          paymentResponseHandler(credits, response)
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch {
      setErrors({
        message: "Unable to initiate payment at the moment."
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getUserProfile();
  }, []);


  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F6F7FB"
        }}
      >
        <BeatLoader color="#7C6CF2" size={14} />
      </div>
    );
  }


  return (
    <div className="container py-5">

      {/* ALERTS */}
      {errors.message && (
        <div className="alert alert-danger">{errors.message}</div>
      )}

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {/* HEADER */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Manage Credits</h2>
        <p className="text-muted">
          Purchase credits to create and manage groups
        </p>
      </div>

      {/* CREDIT BALANCE */}
      <div
        className="mx-auto mb-5 p-4 text-center rounded-4"
        style={{
          maxWidth: "420px",
          background: "#F1EFFF",
          color: "#2B2D42"
        }}
      >
        <div className="fs-5 text-muted">Available Credits</div>
        <div
          className="fw-bold"
          style={{
            fontSize: "42px",
            color: userProfile.credits === 0 ? "#EF4444" : "#7C6CF2"
          }}
        >
          {userProfile.credits}
        </div>
      </div>

      {/* PACKS */}
      <div className="text-center mb-4">
        <h4 className="fw-semibold">Buy Credits</h4>
      </div>

      <div className="d-flex justify-content-center gap-4 flex-wrap">

        {CREDITS_PACK.map((pack) => (
          <div
            key={pack.credits}
            className="p-4 rounded-4 text-center"
            style={{
              width: "280px",
              background: "#FFFFFF",
              border: "1px solid #E6E7EC",
              boxShadow: "0 10px 24px rgba(0,0,0,0.05)"
            }}
          >
            <div
              className="fw-bold mb-2"
              style={{ fontSize: "28px", color: "#7C6CF2" }}
            >
              {pack.credits} Credits
            </div>

            <div className="text-muted mb-3">
              ₹{pack.price} · Create {pack.credits} groups
            </div>

            <button
              className="btn btn-lg rounded-pill px-4"
              style={{
                background: "#7C6CF2",
                color: "white"
              }}
              onClick={() => handlePayment(pack.credits)}
            >
              Buy Now
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}

export default ManagePayments;

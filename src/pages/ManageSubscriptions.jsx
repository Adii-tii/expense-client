import axios from "axios";
import { useEffect, useState } from "react";
import { serverEndpoint } from "../config/appConfig";
import { BeatLoader } from "react-spinners";
import colors from "../theme/colors";

const PLAN_IDS = {
  UNLIMITED_MONTHLY: {
    planName: "Unlimited Monthly",
    price: 5,
    frequency: "month"
  },

  UNLIMITED_YEARLY: {
    planName: "Unlimited Yearly",
    price: 50,
    frequency: "year"
  }
};

function ManageSubscription() {

  const {
    PRIMARY,
    PRIMARY_SOFT,
    TEXT_MAIN,
    TEXT_MUTED,
    BORDER,
    BG_WHITE,
    RADIUS_LG,
    SHADOW_SM
  } = colors;

  const [userProfile, setUserProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USER ================= */

  const getUserProfile = async () => {
    try {

      const res = await axios.get(
        `${serverEndpoint}/profile/get-user-info`,
        { withCredentials: true }
      );

      setUserProfile(res.data.user);

    } catch {
      setErrors({ message: "Unable to fetch subscription data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);


  const rzpResponseHandler = async (response) => {
    console.log("we are here....");


    try {

      setLoading(true);

      const captureRes = await axios.post(
        `${serverEndpoint}/payments/capture-subscription`,
        { subscriptionId: response.razorpay_subscription_id },
        { withCredentials: true }
      );

      console.log("res??" , captureRes);

      setUserProfile(captureRes.data.user);
      setMessage("Subscription activated successfully");

    } catch {
      setErrors({ message: "Unable to capture subscription" });
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBSCRIBE ================= */

  const handleSubscribe = async (planKey) => {

    try {

      setLoading(true);

      const createRes = await axios.post(
        `${serverEndpoint}/payments/create-subscription`,
        { plan_name: planKey },
        { withCredentials: true }
      );  
      
      console.log("res received");


      const subscription = createRes.data.subscription;

      const plan = PLAN_IDS[planKey];

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        name: plan.planName,
        description: `Pay ₹${plan.price} per ${plan.frequency}`,
        subscription_id: subscription.id,
        theme: { color: "#7C6CF2" },
        handler: (res) => rzpResponseHandler(res)
      };

      console.log("before opening window");

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch {
      setErrors({ message: "Unable to process subscription" });
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <BeatLoader color={PRIMARY} />
      </div>
    );
  }

  const notSubscribedStatus = [undefined, "completed", "cancelled"];

  const showSubscription =
    notSubscribedStatus.includes(userProfile?.subscription?.status);

  /* ================= UI ================= */

  return (
    <div className="container-fluid px-0" style={{ maxWidth: "900px" }}>

      <h4 className="fw-semibold mb-4" style={{ color: TEXT_MAIN }}>
        Manage Subscription
      </h4>

      {errors.message && (
        <div className="alert alert-danger">{errors.message}</div>
      )}

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {/* ===== AVAILABLE PLANS ===== */}
      {showSubscription && (
        <div className="row g-4">

          {Object.entries(PLAN_IDS).map(([key, plan]) => (

            <div key={key} className="col-md-6">

              <div
                className="p-4 h-100"
                style={{
                  background: BG_WHITE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: RADIUS_LG,
                  boxShadow: SHADOW_SM
                }}
              >

                <h5
                  style={{ color: TEXT_MAIN, fontWeight: 700 }}
                >
                  {plan.planName}
                </h5>

                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: 700,
                    color: PRIMARY
                  }}
                >
                  ₹{plan.price}
                </div>

                <div
                  style={{ color: TEXT_MUTED }}
                  className="mb-3"
                >
                  Billed every {plan.frequency}
                </div>

                <button
                  className="btn w-100 text-white"
                  style={{
                    background: PRIMARY,
                    borderRadius: "999px"
                  }}
                  onClick={() => handleSubscribe(key)}
                >
                  Subscribe
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* ===== ACTIVE SUBSCRIPTION ===== */}
      {!showSubscription && (

        <div
          className="p-4"
          style={{
            background: PRIMARY_SOFT,
            borderRadius: RADIUS_LG,
            border: `1px solid ${BORDER}`
          }}
        >

          <h5 style={{ color: TEXT_MAIN }}>
            Active Subscription
          </h5>

          <p style={{ color: TEXT_MUTED }}>
            Plan: {userProfile.subscription.planId}
          </p>

          <p style={{ color: TEXT_MUTED }}>
            Subscription ID: {userProfile.subscription.subscriptionId}
          </p>

          <p
            style={{
              color: PRIMARY,
              fontWeight: 600
            }}
          >
            Status: {userProfile.subscription.status}
          </p>

        </div>

      )}

    </div>
  );
}

export default ManageSubscription;

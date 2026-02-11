import { useNavigate } from "react-router-dom";
import colors from "../theme/colors";

function Footer() {

  const navigate = useNavigate();

  const {
    PRIMARY,
    PRIMARY_SOFT,
    TEXT_MUTED,
    RADIUS_PILL
  } = colors;

  return (
    <div
      style={{
        background: PRIMARY,
        color: "white"
      }}
      className="pt-5 pb-4"
    >
      <div className="container">

        <div className="row g-4">

          {/* BRAND COLUMN */}
          <div className="col-lg-4 col-md-6">

            <h5
              style={{
                fontWeight: 700,
                color: "white"
              }}
            >
              MergeMoney
            </h5>

            <p
              style={{
                color: "#E6E2FF",
                maxWidth: "320px",
                marginTop: "10px"
              }}
            >
              A simple way to manage shared expenses, track balances,
              and settle payments without confusion.
            </p>

          </div>

          {/* PRODUCT LINKS */}
          <div className="col-lg-2 col-md-6">

            <h6 style={{ fontWeight: 600 }}>
              Product
            </h6>

            <ul className="list-unstyled mt-3">
              <li>
                <button
                  className="btn p-0"
                  style={{ color: "#E6E2FF" }}
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </button>
              </li>
              <li>
                <button
                  className="btn p-0"
                  style={{ color: "#E6E2FF" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </li>
            </ul>

          </div>

          {/* COMPANY LINKS */}
          <div className="col-lg-2 col-md-6">

            <h6 style={{ fontWeight: 600 }}>
              Company
            </h6>

            <ul className="list-unstyled mt-3">
              <li>
                <button className="btn p-0" style={{ color: "#E6E2FF" }}>
                  About
                </button>
              </li>
              <li>
                <button className="btn p-0" style={{ color: "#E6E2FF" }}>
                  Contact
                </button>
              </li>
            </ul>

          </div>

          {/* CTA MINI BLOCK */}
          <div className="col-lg-4 col-md-6">

            <h6 style={{ fontWeight: 600 }}>
              Ready to Start?
            </h6>

            <p style={{ color: "#E6E2FF" }}>
              Create your first group and simplify shared expenses today.
            </p>

            <button
              className="btn px-4 py-2"
              style={{
                background: "white",
                color: PRIMARY,
                borderRadius: RADIUS_PILL,
                fontWeight: 600
              }}
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>

          </div>

        </div>

        {/* BOTTOM BAR */}
        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 pt-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.2)",
            color: "#E6E2FF",
            fontSize: "14px"
          }}
        >
          <div>
            © {new Date().getFullYear()} MergeMoney. All rights reserved.
          </div>

          <div className="d-flex gap-3 mt-2 mt-md-0">
            <span style={{ cursor: "pointer" }}>Privacy</span>
            <span style={{ cursor: "pointer" }}>Terms</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Footer;

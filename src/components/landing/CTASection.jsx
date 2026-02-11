import { useNavigate } from "react-router-dom";
import colors from "../../theme/colors";
function CTASection() {

  const navigate = useNavigate();

  const {
    PRIMARY,
    PRIMARY_GLOW,
    TEXT_MAIN,
    TEXT_MUTED,
    BG_WHITE,
    RADIUS_LG,
    RADIUS_PILL,
    SHADOW_MD
  } = colors;

  return (
    <div
      style={{
        background: PRIMARY_GLOW
      }}
      className="py-5"
    >
      <div className="container">

        <div
          className="text-center p-5"
          style={{
            background: BG_WHITE,
            borderRadius: RADIUS_LG,
            boxShadow: SHADOW_MD
          }}
        >

          {/* HEADLINE */}
          <h2
            style={{
              color: TEXT_MAIN,
              fontWeight: 700
            }}
            className="mb-3"
          >
            Ready to Simplify Shared Expenses?
          </h2>

          {/* SUBTEXT */}
          <p
            style={{
              color: TEXT_MUTED,
              maxWidth: "600px",
              margin: "0 auto"
            }}
            className="mb-4"
          >
            Join thousands managing group finances clearly and confidently.
          </p>

          {/* CTA BUTTON */}
          <button
            className="btn px-5 py-2 text-white"
            style={{
              background: PRIMARY,
              borderRadius: RADIUS_PILL,
              fontWeight: 600,
              fontSize: "16px"
            }}
            onClick={() => navigate("/register")}
          >
            Create Your First Group
          </button>

        </div>

      </div>
    </div>
  );
}

export default CTASection;

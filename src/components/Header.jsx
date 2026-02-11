import { Link, useNavigate } from "react-router-dom";
import colors from "../theme/colors";

function Header({ user }) {

  const navigate = useNavigate();

  const {
    PRIMARY,
    PRIMARY_SOFT,
    TEXT_MAIN,
    TEXT_MUTED,
    BG_WHITE,
    BORDER,
    RADIUS_PILL,
    SHADOW_SM
  } = colors;

  const NavButton = ({ to, label, isPrimary }) => (
    <button
      onClick={() => navigate(to)}
      className="btn px-3 py-1"
      style={{
        background: isPrimary ? PRIMARY : "transparent",
        color: isPrimary ? "white" : TEXT_MAIN,
        borderRadius: RADIUS_PILL,
        fontWeight: 500,
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        if (!isPrimary) {
          e.target.style.background = PRIMARY_SOFT;
          e.target.style.color = PRIMARY;
        }
      }}
      onMouseLeave={(e) => {
        if (!isPrimary) {
          e.target.style.background = "transparent";
          e.target.style.color = TEXT_MAIN;
        }
      }}
    >
      {label}
    </button>
  );

  return (
    <nav
      className="sticky-top"
      style={{
        background: BG_WHITE,
        borderBottom: `1px solid ${BORDER}`,
        boxShadow: SHADOW_SM,
        zIndex: 999
      }}
    >

      <div className="container d-flex justify-content-between align-items-center py-2">

        {/* ===== BRAND ===== */}
        <Link
          to="/"
          style={{
            fontWeight: 700,
            fontSize: "20px",
            color: PRIMARY,
            textDecoration: "none"
          }}
        >
          MergeMoney
        </Link>


        {/* ===== CENTER NAV ===== */}
        <div className="d-flex gap-2">

          {user ? (
            <NavButton to="/dashboard" label="Dashboard" />
          ) : (
            <>
              <NavButton to="/" label="Home" />
              <NavButton to="/about" label="About" />
            </>
          )}

        </div>


        {/* ===== RIGHT AUTH ===== */}
        <div className="d-flex gap-2">

          {!user && (
            <>
              <NavButton to="/login" label="Login" />
              <NavButton to="/register" label="Register" isPrimary />
            </>
          )}

          {user && (
            <div
              className="d-flex align-items-center justify-content-center fw-semibold"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: PRIMARY_SOFT,
                color: PRIMARY
              }}
            >
              {user.username?.[0]?.toUpperCase()}
            </div>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Header;

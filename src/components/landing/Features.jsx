import colors from "../../theme/colors";
function FeatureSection() {

  const {
    PRIMARY,
    PRIMARY_SOFT,
    TEXT_MAIN,
    TEXT_MUTED,
    BG_WHITE,
    BORDER,
    RADIUS_LG,
    SHADOW_SM
  } = colors;

  const features = [
    {
      icon: "bi-receipt",
      title: "Smart Expense Tracking",
      desc: "Automatically calculate balances and eliminate manual math."
    },
    {
      icon: "bi-people",
      title: "Group Management",
      desc: "Create groups for trips, roommates, or teams with ease."
    },
    {
      icon: "bi-wallet2",
      title: "Instant Settlements",
      desc: "Track payments and clear dues transparently."
    },
    {
      icon: "bi-graph-up",
      title: "Spending Insights",
      desc: "Visualize trends and understand where money goes."
    }
  ];

  return (
    <div className="container py-5">

      {/* ===== SECTION TITLE ===== */}
      <div className="text-center mb-5">
        <h2
          style={{
            color: TEXT_MAIN,
            fontWeight: 700
          }}
        >
          Everything You Need To Manage Shared Expenses
        </h2>

        <p
          style={{
            color: TEXT_MUTED,
            maxWidth: "600px",
            margin: "0 auto"
          }}
        >
          Designed to simplify group finances without confusion or awkward conversations.
        </p>
      </div>

      {/* ===== FEATURES GRID ===== */}
      <div className="row g-4">

        {features.map((feature, index) => (

          <div key={index} className="col-lg-3 col-md-6 col-sm-12">

            <div
              className="h-100 p-4"
              style={{
                background: BG_WHITE,
                border: `1px solid ${BORDER}`,
                borderRadius: RADIUS_LG,
                boxShadow: SHADOW_SM,
                transition: "all 0.25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >

              {/* ICON */}
              <div
                className="mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: PRIMARY_SOFT,
                  color: PRIMARY,
                  fontSize: "20px"
                }}
              >
                <i className={`bi ${feature.icon}`} />
              </div>

              {/* TITLE */}
              <h5
                style={{
                  color: TEXT_MAIN,
                  fontWeight: 600
                }}
                className="mb-2"
              >
                {feature.title}
              </h5>

              {/* DESCRIPTION */}
              <p
                style={{
                  color: TEXT_MUTED,
                  fontSize: "14px"
                }}
              >
                {feature.desc}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default FeatureSection;

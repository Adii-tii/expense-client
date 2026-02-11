import colors from "../../theme/colors";

function HowItWorks() {

  const {
    PRIMARY,
    PRIMARY_SOFT,
    TEXT_MAIN,
    TEXT_MUTED,
    BG_LIGHT,
    BORDER,
    RADIUS_LG,
    SHADOW_SM
  } = colors;

  const steps = [
    {
      title: "Create a Group",
      desc: "Start by creating a group for your trip, home, or team."
    },
    {
      title: "Add Expenses",
      desc: "Log shared expenses and choose how to split them."
    },
    {
      title: "Track Balances",
      desc: "See who owes whom instantly with automatic calculations."
    },
    {
      title: "Settle Up",
      desc: "Record payments and clear balances effortlessly."
    }
  ];

  return (
    <div
      style={{
        background: BG_LIGHT
      }}
      className="py-5"
    >
      <div className="container">

        {/* SECTION HEADER */}
        <div className="text-center mb-5">
          <h2
            style={{
              color: TEXT_MAIN,
              fontWeight: 700
            }}
          >
            How It Works
          </h2>

          <p
            style={{
              color: TEXT_MUTED,
              maxWidth: "600px",
              margin: "0 auto"
            }}
          >
            Four simple steps to manage shared expenses without confusion.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="row g-4">

          {steps.map((step, index) => (

            <div key={index} className="col-lg-3 col-md-6 col-sm-12">

              <div
                className="h-100 p-4 text-center"
                style={{
                  background: "#FFFFFF",
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

                {/* STEP NUMBER CIRCLE */}
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: PRIMARY_SOFT,
                    color: PRIMARY,
                    fontWeight: 700,
                    fontSize: "18px"
                  }}
                >
                  {index + 1}
                </div>

                {/* TITLE */}
                <h5
                  style={{
                    color: TEXT_MAIN,
                    fontWeight: 600
                  }}
                  className="mb-2"
                >
                  {step.title}
                </h5>

                {/* DESCRIPTION */}
                <p
                  style={{
                    color: TEXT_MUTED,
                    fontSize: "14px"
                  }}
                >
                  {step.desc}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}

export default HowItWorks;

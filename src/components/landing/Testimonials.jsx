import colors from "../../theme/colors";

function Testimonials() {

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

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Trip Organizer",
      quote:
        "Managing travel expenses used to be chaotic. Now everything stays clear and fair."
    },
    {
      name: "Ananya Verma",
      role: "Flatmate",
      quote:
        "No more awkward money conversations. The balance tracking is extremely helpful."
    },
    {
      name: "Karan Mehta",
      role: "Team Lead",
      quote:
        "We use it for team outings and reimbursements. Super smooth experience."
    }
  ];

  return (
    <div
      className="py-5"
      style={{
        background: BG_LIGHT
      }}
    >
      <div className="container">

        {/* HEADER */}
        <div className="text-center mb-5">
          <h2
            style={{
              color: TEXT_MAIN,
              fontWeight: 700
            }}
          >
            Loved By Users
          </h2>

          <p
            style={{
              color: TEXT_MUTED,
              maxWidth: "600px",
              margin: "0 auto"
            }}
          >
            Real experiences from people managing shared expenses effortlessly.
          </p>
        </div>

        {/* TESTIMONIAL CARDS */}
        <div className="row g-4">

          {testimonials.map((t, index) => (

            <div key={index} className="col-lg-4 col-md-6 col-sm-12">

              <div
                className="h-100 p-4"
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

                {/* QUOTE */}
                <p
                  style={{
                    color: TEXT_MUTED,
                    fontSize: "15px",
                    lineHeight: "1.6"
                  }}
                  className="mb-4"
                >
                  “{t.quote}”
                </p>

                {/* USER INFO */}
                <div className="d-flex align-items-center gap-3">

                  {/* AVATAR */}
                  <div
                    className="d-flex align-items-center justify-content-center fw-semibold"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: PRIMARY_SOFT,
                      color: PRIMARY
                    }}
                  >
                    {t.name[0]}
                  </div>

                  <div>
                    <div
                      style={{
                        color: TEXT_MAIN,
                        fontWeight: 600
                      }}
                    >
                      {t.name}
                    </div>

                    <small style={{ color: TEXT_MUTED }}>
                      {t.role}
                    </small>
                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}

export default Testimonials;

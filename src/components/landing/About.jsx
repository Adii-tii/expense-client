import colors from "../../theme/colors";

function AboutSection() {

  const {
    PRIMARY,
    PRIMARY_SOFT,
    TEXT_MAIN,
    TEXT_MUTED,
    BG_WHITE,
    RADIUS_LG,
    BORDER
  } = colors;

  return (
    <div
      style={{ background: BG_WHITE }}
      className="py-5"
    >
      <div className="container">

        <div className="row justify-content-center">

          <div className="col-lg-8 text-center">

            {/* SMALL LABEL */}
            <div
              style={{
                color: PRIMARY,
                fontWeight: 600,
                letterSpacing: "1px",
                fontSize: "14px"
              }}
              className="mb-3"
            >
              ABOUT MERGEMONEY
            </div>

            {/* MAIN HEADING */}
            <h2
              style={{
                fontSize: "40px",
                fontWeight: 700,
                color: TEXT_MAIN,
                lineHeight: "1.2"
              }}
              className="mb-4"
            >
              Built To Remove Financial Friction Between People
            </h2>

            {/* BODY TEXT */}
            <p
              style={{
                fontSize: "18px",
                color: TEXT_MUTED,
                lineHeight: "1.7"
              }}
              className="mb-5"
            >
              Managing shared expenses should feel effortless. MergeMoney was designed to replace messy tracking,
              forgotten payments, and uncomfortable money conversations with clarity, transparency, and trust.
            </p>

          </div>

        </div>


        {/* VALUE BLOCKS */}
        <div className="row g-4 justify-content-center">

          {[
            {
              title: "Clarity First",
              desc: "Every balance and expense stays transparent and easy to understand."
            },
            {
              title: "Human Friendly",
              desc: "Designed to reduce awkward reminders and financial tension."
            },
            {
              title: "Effortless Tracking",
              desc: "Automatic calculations remove manual work and errors."
            }
          ].map((item, i) => (

            <div key={i} className="col-lg-4 col-md-6">

              <div
                className="p-4 h-100"
                style={{
                  border: `1px solid ${BORDER}`,
                  borderRadius: RADIUS_LG,
                  background: PRIMARY_SOFT
                }}
              >

                <h5
                  style={{
                    fontWeight: 600,
                    color: TEXT_MAIN
                  }}
                  className="mb-2"
                >
                  {item.title}
                </h5>

                <p
                  style={{
                    color: TEXT_MUTED,
                    fontSize: "15px",
                    lineHeight: "1.6"
                  }}
                >
                  {item.desc}
                </p>

              </div>

            </div>

          ))}

        </div>


        {/* TYPOGRAPHY ACCENT */}
        <div
          className="text-center mt-5"
          style={{
            fontSize: "100px",
            fontWeight: 900,
            color: PRIMARY,
            opacity: 0.05,
            letterSpacing: "-5px",
            userSelect: "none"
          }}
        >
          TRUST
        </div>

      </div>
    </div>
  );
}

export default AboutSection;

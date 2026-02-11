import colors from "../../theme/colors";
import { Link } from "react-router-dom";
function HeroSection() {

    const {
        PRIMARY,
        PRIMARY_GLOW,
        TEXT_MAIN,
        TEXT_MUTED,
        BG_WHITE,
        RADIUS_PILL
    } = colors;

    return (
        <div
            style={{
                position: "relative",
                overflow: "hidden",
                background: `linear-gradient(180deg, ${PRIMARY_GLOW} 0%, ${BG_WHITE} 75%)`
            }}
        >

            {/* BACKGROUND TYPOGRAPHY */}
            <div
                style={{
                    position: "absolute",
                    top: "40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "220px",
                    fontWeight: 900,
                    letterSpacing: "-12px",
                    color: PRIMARY,
                    opacity: 0.035,
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    pointerEvents: "none"
                }}
            >
                MERGEMONEY
            </div>


            <div className="container py-5 position-relative">

                <div className="row justify-content-center text-center">

                    <div className="col-lg-9 col-md-11">

                        {/* MAIN HEADLINE */}
                        <h1
                            style={{
                                fontSize: "68px",
                                fontWeight: 900,
                                letterSpacing: "-2px",
                                lineHeight: "1.05",
                                color: TEXT_MAIN
                            }}
                            className="mb-2"
                        >
                            Split Smarter
                        </h1>

                        {/* ACCENT HEADLINE */}
                        <h1
                            style={{
                                fontSize: "68px",
                                fontWeight: 900,
                                letterSpacing: "-2px",
                                lineHeight: "1.05",
                                color: PRIMARY,
                                position: "relative",
                                display: "inline-block"
                            }}
                            className="mb-4"
                        >
                            Settle Faster


                        </h1>


                        {/* SUBTEXT */}
                        <p
                            style={{
                                fontSize: "20px",
                                color: TEXT_MUTED,
                                maxWidth: "680px",
                                margin: "0 auto",
                                lineHeight: "1.7",
                                fontWeight: 400
                            }}
                            className="mb-5"
                        >
                            Manage shared expenses without spreadsheets,
                            confusion, or awkward payment reminders.
                        </p>


                        {/* CTA */}
                        <div className="d-flex justify-content-center gap-3">

                            <Link to="/login"><button
                                className="btn px-5 py-3 text-white"
                                style={{
                                    background: PRIMARY,
                                    borderRadius: RADIUS_PILL,
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    letterSpacing: "0.6px",
                                    boxShadow: `0 10px 30px rgba(124,108,242,0.25)`
                                }}
                            > Get Started

                            </button>
                            </Link>

                            <button
                                className="btn px-5 py-3"
                                style={{
                                    background: "transparent",
                                    color: PRIMARY,
                                    borderRadius: RADIUS_PILL,
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    border: `1.5px solid ${PRIMARY}`
                                }}
                            >
                                Learn More
                            </button>

                        </div>


                        {/* MICRO TRUST LINE */}
                        <div
                            style={{
                                marginTop: "50px",
                                fontSize: "13px",
                                letterSpacing: "1px",
                                color: TEXT_MUTED,
                                textTransform: "uppercase"
                            }}
                        >
                            Built for clarity • Designed for trust • Made for real life
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default HeroSection;

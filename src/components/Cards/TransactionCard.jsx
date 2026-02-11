import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function TransactionCard({ settlement }) {

    const user = useSelector(state => state.userDetails);
    const navigate = useNavigate();

    const isSender = settlement.fromUser?.email === user.email;
    const isReceiver = settlement.toUser?.email === user.email;

    /* ================= THEME ================= */

    const PRIMARY = "#7C6CF2";
    const PRIMARY_BG = "rgba(124,108,242,0.08)";
    const PRIMARY_SOFT = "#F1EFFF";
    const TEXT_MAIN = "#2B2D42";
    const TEXT_MUTED = "#6B7280";
    const BORDER = "rgba(124,108,242,0.18)";

    /* ================= DATE ================= */

    const dateObj = new Date(settlement.createdAt);

    const date = dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
    });

    const time = dateObj.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const openExpense = () => {
        if (settlement.expenseId) {
            navigate(`/expenses/${settlement.expenseId}`);
        }
    };

    const getInitial = (email) =>
        email?.[0]?.toUpperCase() || "?";

    /* ================= UI ================= */

    return (
        <div
            onClick={openExpense}
            style={{
                background: PRIMARY_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: "12px",
                padding: "10px 14px",
                cursor: settlement.expenseId ? "pointer" : "default",
                transition: "0.2s"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background =
                    "rgba(124,108,242,0.14)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background =
                    PRIMARY_BG;
            }}
        >

            <div className="d-flex gap-3 align-items-center">

                {/* ===== AMOUNT BADGE ===== */}

                {/* ===== AMOUNT BADGE ===== */}

                <div
                    style={{
                        minWidth: "64px",
                        background: "#FFF6D6",
                        color: "#8A6B00"     ,  // TEXT_MAIN for contrast
                        borderRadius: "10px",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "6px 10px",
                        fontSize: "14px",
                    }}
                >
                    ₹{settlement.amount}
                </div>


                {/* ===== FLOW CONTENT ===== */}

                <div style={{ flex: 1 }}>

                    {/* USERS FLOW */}
                    <div className="d-flex align-items-center gap-2">

                        {/* FROM */}
                        <div className="d-flex align-items-center gap-2">

                            <div
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    background: PRIMARY_SOFT,
                                    color: PRIMARY,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 600,
                                    fontSize: "11px"
                                }}
                            >
                                {getInitial(settlement.fromUser?.email)}
                            </div>

                            <span style={{ fontSize: "13px", color: TEXT_MAIN }}>
                                {isSender ? "You" : settlement.fromUser?.email}
                            </span>

                        </div>

                        {/* ARROW */}
                        <i
                            className="bi bi-arrow-right"
                            style={{
                                fontSize: "14px",
                                color: TEXT_MUTED
                            }}
                        />

                        {/* TO */}
                        <div className="d-flex align-items-center gap-2">

                            <span style={{ fontSize: "13px", color: TEXT_MAIN }}>
                                {isReceiver ? "You" : settlement.toUser?.email}
                            </span>

                            <div
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "50%",
                                    background: PRIMARY_SOFT,
                                    color: PRIMARY,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 600,
                                    fontSize: "11px"
                                }}
                            >
                                {getInitial(settlement.toUser?.email)}
                            </div>

                        </div>

                    </div>

                    {/* META */}
                    <div
                        style={{
                            fontSize: "11px",
                            color: TEXT_MUTED,
                            marginTop: "3px",
                            display: "flex",
                            gap: "8px"
                        }}
                    >
                        <span>{date}</span>
                        <span>•</span>
                        <span>{time}</span>

                        {settlement.expenseId && (
                            <>
                                <span>•</span>
                                <span style={{ color: PRIMARY, fontWeight: 600 }}>
                                    Linked expense
                                </span>
                            </>
                        )}
                    </div>

                </div>

            </div>

        </div>
    );
}

export default TransactionCard;

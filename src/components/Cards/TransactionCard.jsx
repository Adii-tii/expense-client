import { useSelector } from "react-redux";

function TransactionCard({ settlement }) {

  const user = useSelector(state => state.userDetails);
  if (!settlement || !user) return null;

  const fromEmail =
    settlement.fromUserEmail ||
    settlement.fromUser?.email ||
    "";

  const toEmail =
    settlement.toUserEmail ||
    settlement.toUser?.email ||
    "";

  const isSender = fromEmail === user.email;
  const isReceiver = toEmail === user.email;

  const PRIMARY = "#7C6CF2";
  const PRIMARY_SOFT = "#F1EFFF";
  const TEXT_MAIN = "#111827";
  const TEXT_MUTED = "#6B7280";
  const BORDER = "#E5E7EB";

  const GREEN = "#16A34A";
  const RED = "#DC2626";

  const directionIcon = isSender
    ? "bi-arrow-up-right"
    : isReceiver
      ? "bi-arrow-down-right"
      : "bi-arrow-left-right";

  const iconColor = isSender ? RED : isReceiver ? GREEN : PRIMARY;


  const dateObj = new Date(settlement.createdAt);

  const date = dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short"
  });

  const time = dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const getInitial = (email) =>
    email?.[0]?.toUpperCase() || "?";

  const amountColor = isSender ? RED : isReceiver ? GREEN : TEXT_MAIN;

  const directionText = isSender
    ? "You paid"
    : isReceiver
      ? "You received"
      : "Settlement";

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: "16px",
        padding: "14px 16px",
        transition: "0.2s",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">

        <div className="d-flex align-items-center gap-3">

          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: PRIMARY_SOFT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <i
              className={`bi ${directionIcon}`}
              style={{ color: iconColor, fontSize: "18px" }}
            />
          </div>

          <div>

            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: TEXT_MAIN
              }}
            >
              {directionText}
            </div>

            <div
              className="d-flex align-items-center gap-2 mt-1"
              style={{ fontSize: "13px" }}
            >

              <div className="d-flex align-items-center gap-1">
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: PRIMARY_SOFT,
                    color: PRIMARY,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 600
                  }}
                >
                  {getInitial(fromEmail)}
                </div>

                <span style={{ color: TEXT_MAIN }}>
                  {isSender ? "You" : fromEmail}
                </span>
              </div>

              <i
                className="bi bi-arrow-right"
                style={{ color: TEXT_MUTED, fontSize: "12px" }}
              />

              <div className="d-flex align-items-center gap-1">
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: PRIMARY_SOFT,
                    color: PRIMARY,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 600
                  }}
                >
                  {getInitial(toEmail)}
                </div>

                <span style={{ color: TEXT_MAIN }}>
                  {isReceiver ? "You" : toEmail}
                </span>
              </div>

            </div>

            <div
              style={{
                fontSize: "11px",
                color: TEXT_MUTED,
                marginTop: "2px"
              }}
            >
              {date} • {time}
            </div>

          </div>

        </div>

        <div style={{ textAlign: "right" }}>

          <div
            style={{
              fontSize: "18px",
              fontWeight: 800,
              color: amountColor
            }}
          >
            ₹{Number(settlement.amount || 0).toFixed(2)}
          </div>

          <div
            style={{
              fontSize: "11px",
              color: TEXT_MUTED
            }}
          >
            Settlement
          </div>

        </div>

      </div>
    </div>
  );
}

export default TransactionCard;

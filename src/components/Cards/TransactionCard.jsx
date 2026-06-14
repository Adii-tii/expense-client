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

  const PRIMARY = "#9D5CFF";
  const PRIMARY_SOFT = "rgba(157, 92, 255, 0.15)";
  const TEXT_MAIN = "#FFFFFF";
  const TEXT_MUTED = "#A1A1AA";
  const BORDER = "#28282B";

  const GREEN = "#10B981";
  const YELLOW = "#FFD02F";

  const directionIcon = isSender
    ? "bi-arrow-up-right"
    : isReceiver
      ? "bi-arrow-down-right"
      : "bi-arrow-left-right";

  const iconColor = isSender ? YELLOW : isReceiver ? GREEN : PRIMARY;


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

  const amountColor = isSender ? YELLOW : isReceiver ? GREEN : TEXT_MAIN;

  const directionText = isSender
    ? <>You <span style={{ color: YELLOW }}>paid</span> {toEmail} ₹{settlement.amount}</>
    : isReceiver
      ? <>You <span style={{ color: GREEN }}>received</span> ₹{settlement.amount} from {fromEmail}</>
      : "Settlement";


  return (
    <div
      style={{
        background: "#1B1B1D",
        border: "none",
        borderRadius: "12px",
        padding: "8px 12px",
        transition: "0.18s",
      }}
    >
      <div className="d-flex justify-content-between">

        {/* LEFT */}
        <div className="d-flex gap-3">

          {/* ICON */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: PRIMARY_SOFT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <i
              className={`bi ${directionIcon}`}
              style={{ color: iconColor, fontSize: 14 }}
            />
          </div>

          {/* TEXT STACK */}
          <div style={{ lineHeight: 1.2 }}>

            {/* TITLE */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: TEXT_MAIN
              }}
            >
              {directionText}
            </div>

            {/* NOTE */}
            {settlement.note && (
              <div
                style={{
                  fontSize: 12,
                  color: TEXT_MUTED,
                  marginTop: 4,
                  maxWidth: 260,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {settlement.note}
              </div>
            )}

            {/* DATE */}
            <div
              style={{
                fontSize: 11,
                color: TEXT_MUTED,
                marginTop: 6
              }}
            >
              {date}
            </div>

          </div>
        </div>

        {/* RIGHT AMOUNT */}
        <div
          style={{
            textAlign: "right",
            marginLeft: 12,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: amountColor
            }}
          >
            ₹{Number(settlement.amount || 0).toFixed(2)}
          </div>

          <div
            style={{
              fontSize: 10,
              color: YELLOW,
              marginTop: 1
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

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
    ? <>You <span className="text-danger">paid</span> {toEmail} ₹{settlement.amount}</>
    : isReceiver
      ? <>You <span className="text-success">received</span> ₹{settlement.amount} from {fromEmail}</>
      : "Settlement";


  return (
    <div
      style={{
        background: "#FFFFFF",
        border: `1px solid ${BORDER}`,
        borderRadius: "16px",
        padding: "16px 18px",
        transition: "0.18s",
      }}
    >
      <div className="d-flex justify-content-between">

        {/* LEFT */}
        <div className="d-flex gap-3">

          {/* ICON */}
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              background: PRIMARY_SOFT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <i
              className={`bi ${directionIcon}`}
              style={{ color: iconColor, fontSize: 16 }}
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
              {date} • {time}
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
              fontSize: 18,
              fontWeight: 700,
              color: amountColor
            }}
          >
            ₹{Number(settlement.amount || 0).toFixed(2)}
          </div>

          <div
            style={{
              fontSize: 11,
              color: TEXT_MUTED,
              marginTop: 2
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

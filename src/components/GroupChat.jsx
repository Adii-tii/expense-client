import React, { useState, useRef, useEffect } from "react";

function GroupChat({ group, user, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "marco@gmail.com",
      text: "Just uploaded the Eurostar tickets! Can someone confirm the arrival time in London?",
      time: "10:24 AM",
      isSelf: false
    },
    {
      id: 2,
      sender: "you@gmail.com",
      text: "I see them. We arrive at St. Pancras at 2:30 PM. I'll handle the Uber to the hotel.",
      time: "10:28 AM",
      isSelf: true
    },
    {
      id: 3,
      sender: "lisa@gmail.com",
      text: "Great! Also, who is covering the museum passes for tomorrow?",
      time: "10:45 AM",
      isSelf: false
    }
  ]);

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.email || "you@gmail.com",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  };

  // Capitalize sender names nicely
  const getSenderName = (msg) => {
    if (msg.sender === "you@gmail.com" || msg.sender === user?.email) {
      return "You";
    }
    const parts = msg.sender.split("@")[0];
    return parts.charAt(0).toUpperCase() + parts.slice(1);
  };

  // Premium avatars from Unsplash for realistic mockup feel
  const getSenderAvatar = (email) => {
    const emailLower = email?.toLowerCase() || "";
    if (emailLower.includes("marco")) {
      return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"; // Marco (glasses, man)
    }
    if (emailLower.includes("lisa")) {
      return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"; // Lisa (blonde, woman)
    }
    if (emailLower.includes("rohan")) {
      return "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100&q=80"; // Rohan
    }
    if (emailLower.includes("neha")) {
      return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"; // Neha
    }
    if (emailLower.includes("amit")) {
      return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"; // Amit
    }

    // Default fallback list of premium avatars based on string hash
    const fallbacks = [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
    ];

    let hash = 0;
    for (let i = 0; i < emailLower.length; i++) {
      hash = emailLower.charCodeAt(i) + ((hash << 5) - hash);
    }
    return fallbacks[Math.abs(hash) % fallbacks.length];
  };

  const memberEmails = group?.memberEmail || [];
  // Exclude current user from top header avatar display to show other chatters
  const displayEmails = memberEmails.length > 0
    ? memberEmails.filter(email => email !== user?.email)
    : ["marco@gmail.com", "lisa@gmail.com", "random@gmail.com"];

  return (
    <div
      className="d-flex flex-column rounded-4 overflow-hidden"
      style={{
        background: "#18181A",
        height: "100%",
        border: "none"
      }}
    >
      {/* CHAT HEADER */}
      <div
        className="px-4 py-3 d-flex align-items-center justify-content-between"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          background: "transparent"
        }}
      >
        <div className="fw-bold text-white mb-0" style={{ fontSize: "18px", letterSpacing: "-0.2px" }}>
          Group Chat
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Overlapping member avatars */}
          <div className="d-flex align-items-center me-2">
            {displayEmails.slice(0, 3).map((email, idx) => (
              <img
                key={idx}
                src={getSenderAvatar(email)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "2px solid #18181A",
                  marginLeft: idx === 0 ? "0" : "-8px",
                  zIndex: 10 - idx,
                  objectFit: "cover"
                }}
                alt="Member Avatar"
              />
            ))}
          </div>

          {onClose && (
            <button
              className="btn btn-close btn-close-white p-1 ms-2"
              onClick={onClose}
              style={{ fontSize: "11px", boxShadow: "none", opacity: 0.7 }}
            />
          )}
        </div>
      </div>

      {/* MESSAGES VIEWPORT */}
      <div
        className={`flex-grow-1 px-4 py-3 chat-viewport ${isScrolling ? "scrolling" : ""}`}
        onScroll={handleScroll}
        style={{
          overflowY: "auto",
          background: "#131315" // Deep Obsidian
        }}
      >
        <style>
          {`
            .chat-viewport::-webkit-scrollbar {
              width: 4px;
            }
            .chat-viewport::-webkit-scrollbar-track {
              background: transparent;
            }
            .chat-viewport::-webkit-scrollbar-thumb {
              background: transparent;
              border-radius: 2px;
              transition: background-color 0.3s ease;
            }
            .chat-viewport.scrolling::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.15);
            }
            .chat-viewport.scrolling::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.25);
            }
          `}
        </style>

        <div className="d-flex flex-column gap-4 py-2">
          {messages.map((msg) => {
            const isMe = msg.isSelf || (user?.email && msg.sender === user.email) || msg.sender === "you@gmail.com";
            const senderName = getSenderName(msg);

            return (
              <div
                key={msg.id}
                className={`d-flex gap-2 ${isMe ? "align-self-end flex-row-reverse" : "align-self-start"}`}
                style={{ maxWidth: "85%" }}
              >
                {/* Avatar */}
                {isMe ? (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      fontSize: "10px",
                      fontWeight: "700",
                      letterSpacing: "0.5px",
                      background: "#C0B4E8", // Soft lavender avatar background
                      color: "#FFFFFF"
                    }}
                  >
                    YOU
                  </div>
                ) : (
                  <img
                    src={getSenderAvatar(msg.sender)}
                    alt={senderName}
                    className="rounded-circle flex-shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      objectFit: "cover"
                    }}
                  />
                )}

                {/* Message Bubble wrapper */}
                <div className={`d-flex flex-column ${isMe ? "align-items-end" : "align-items-start"}`}>
                  {/* Bubble */}
                  <div
                    className="px-3 py-2"
                    style={{
                      background: isMe ? "#3E354F" : "#242427", // Lavender/grey for you vs dark grey for others
                      color: "#FFFFFF",
                      fontSize: "14px",
                      lineHeight: "1.45",
                      borderRadius: "18px",
                      maxWidth: "100%",
                      wordBreak: "break-word"
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Timestamp / Info underneath bubble */}
                  <span
                    className="mt-1"
                    style={{
                      fontSize: "11px",
                      color: "#8E8E93",
                      paddingLeft: isMe ? "0" : "4px",
                      paddingRight: isMe ? "4px" : "0",
                      fontWeight: "400"
                    }}
                  >
                    {isMe ? `You • ${msg.time}` : `${senderName} • ${msg.time}`}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* CHAT INPUT AREA */}
      <form
        onSubmit={handleSend}
        className="p-3"
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          background: "transparent"
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control flex-grow-1"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              background: "#242427",
              border: "none",
              borderRadius: "24px",
              color: "#FFFFFF",
              fontSize: "14px",
              padding: "10px 18px",
              boxShadow: "none"
            }}
          />

          <button
            type="submit"
            className="btn d-flex align-items-center justify-content-center"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#9D5CFF",
              color: "#FFFFFF",
              border: "none",
              transition: "all 0.2s ease",
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#AB73FF";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#9D5CFF";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <i className="bi bi-arrow-up" style={{ fontSize: "16px", fontWeight: "bold" }} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default GroupChat;

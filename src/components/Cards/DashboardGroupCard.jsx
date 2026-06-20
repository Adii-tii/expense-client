import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const getGroupStyle = (name = "") => {
    const n = name.toLowerCase();
    if (["trip","travel","vacation","flight","europe","road"].some(k => n.includes(k)))
        return { icon: "bi-airplane", accent: "#9D5CFF", gradient: "linear-gradient(135deg,#3b1f6e 0%,#1a0d3a 100%)" };
    if (["apartment","flat","home","house","room","rent","4b"].some(k => n.includes(k)))
        return { icon: "bi-building", accent: "#FFD02F", gradient: "linear-gradient(135deg,#3d2e00 0%,#1c1500 100%)" };
    if (["food","cafe","dinner","lunch","drink","restaurant","grocery"].some(k => n.includes(k)))
        return { icon: "bi-cup-hot", accent: "#F59E0B", gradient: "linear-gradient(135deg,#3b2200 0%,#1c1000 100%)" };
    if (["shopping","gift","clothes","buy"].some(k => n.includes(k)))
        return { icon: "bi-bag", accent: "#EC4899", gradient: "linear-gradient(135deg,#3b0028 0%,#1c0013 100%)" };
    if (["bill","utility","wifi","internet","power"].some(k => n.includes(k)))
        return { icon: "bi-receipt", accent: "#6366F1", gradient: "linear-gradient(135deg,#1e1b4b 0%,#0d0b26 100%)" };
    return { icon: "bi-wallet2", accent: "#A1A1AA", gradient: "linear-gradient(135deg,#232325 0%,#131315 100%)" };
};

const timeAgo = (dateStr) => {
    if (!dateStr) return "Recently";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  <  1) return "just now";
    if (mins  < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days  <  7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const CARD_H      = 270;
const IMG_H       = 155;
const BODY_H_REST = 138;
const BODY_H_HVR  = 195;
const NOTCH_R     = 20;
const NOTCH_INSET = 20;

function DashboardGroupCard({ group }) {
    const navigate = useNavigate();
    const user = useSelector(state => state.userDetails);
    const [hovered, setHovered] = useState(false);

    if (!group) return null;

    const members = group.memberEmail || [];
    const visibleMembers = members.slice(0, 3);
    const extraMembers = Math.max(members.length - 3, 0);

    const style = getGroupStyle(group.name);
    const hasThumbnail = !!group.thumbnail;

    const userBalance = group.balances?.find(b => b.userEmail === user?.email);
    const net = userBalance ? Number(userBalance.netBalance) : 0;
    let balanceLabel = "Settled";
    let balanceColor = "#666";
    if (net > 0)  { balanceLabel = `+₹${net.toFixed(0)}`; balanceColor = "#10B981"; }
    if (net < 0)  { balanceLabel = `-₹${Math.abs(net).toFixed(0)}`; balanceColor = "#FFD02F"; }

    const bodyH     = hovered ? BODY_H_HVR : BODY_H_REST;
    const bodyTop   = CARD_H - bodyH;
    const btnSize   = 34;
    const btnTop    = bodyTop - btnSize / 2;

    const bodyMask = `radial-gradient(circle ${NOTCH_R}px at calc(100% - ${NOTCH_INSET}px) 0px, transparent ${NOTCH_R}px, black ${NOTCH_R + 0.5}px)`;

    return (
        <div
            onClick={() => navigate(`/groups/${group._id}`, { state: { group } })}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                height: CARD_H,
                borderRadius: 22,
                overflow: "hidden",
                background: "#1A1A1C",
                border: "1.5px solid #3A3A3C",
                cursor: "pointer",
                boxShadow: hovered
                    ? "0 14px 44px rgba(0,0,0,0.6)"
                    : "0 2px 14px rgba(0,0,0,0.32)",
                transition: "box-shadow 0.3s ease"
            }}
        >
            {/* ── IMAGE (fixed) ── */}
            <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: IMG_H,
                background: hasThumbnail
                    ? `url(${group.thumbnail}) center/cover no-repeat`
                    : style.gradient,
                zIndex: 1
            }}>
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.28) 100%)"
                }} />
                {!hasThumbnail && (
                    <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: "50%",
                            background: "rgba(255,255,255,0.08)",
                            backdropFilter: "blur(6px)",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <i className={`bi ${style.icon}`} style={{ fontSize: 22, color: style.accent }} />
                        </div>
                    </div>
                )}
            </div>

            {/* ── CARD BODY ── */}
            <div style={{
                position: "absolute",
                left: 0, right: 0, bottom: 0,
                height: bodyH,
                transition: "height 0.38s cubic-bezier(0.4,0,0.2,1)",
                background: "#1A1A1C",
                borderTopLeftRadius: 22,
                borderTopRightRadius: 0,
                maskImage: bodyMask,
                WebkitMaskImage: bodyMask,
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                padding: "12px 14px 14px 14px",
                overflow: "hidden"
            }}>
                {/* meta */}
                <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: "#6B6B72", fontWeight: 500, marginBottom: 5
                }}>
                    <span>{timeAgo(group.createdAt)}</span>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#6B6B72", display: "inline-block" }} />
                    <span style={{ color: "#9D5CFF", fontWeight: 600 }}>
                        {members.length} {members.length === 1 ? "member" : "members"}
                    </span>
                </div>

                {/* name */}
                <div style={{
                    fontSize: 15, fontWeight: 800, color: "#FFFFFF",
                    letterSpacing: "-0.3px", lineHeight: 1.2, marginBottom: 7
                }}>
                    {group.name}
                </div>

                {/* divider */}
                <div style={{ height: 1, background: "#28282B", marginBottom: 7, marginRight: 6 }} />

                {/* description on hover */}
                <div style={{
                    fontSize: 11, color: "#888", lineHeight: 1.55,
                    overflow: "hidden",
                    maxHeight: hovered ? 50 : 0,
                    opacity: hovered ? 1 : 0,
                    transition: "max-height 0.32s ease, opacity 0.28s ease",
                    marginBottom: hovered ? 7 : 0
                }}>
                    {group.description || `${members.length} members splitting expenses`}
                </div>

                {/* tags on hover */}
                <div style={{
                    display: "flex", gap: 5, flexWrap: "wrap",
                    maxHeight: hovered ? 28 : 0,
                    overflow: "hidden",
                    opacity: hovered ? 1 : 0,
                    transition: "max-height 0.3s ease 0.05s, opacity 0.25s ease 0.08s",
                    marginBottom: hovered ? 8 : 0
                }}>
                    <span style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 9px",
                        borderRadius: 999, border: "1px solid #38383A",
                        color: "#A1A1AA", background: "#232325"
                    }}>
                        {net > 0 ? "You're owed" : net < 0 ? "You owe" : "Settled"}
                    </span>
                    <span style={{
                        fontSize: 10, fontWeight: 600, padding: "2px 9px",
                        borderRadius: 999, border: "1px solid rgba(157,92,255,0.25)",
                        color: "#9D5CFF", background: "rgba(157,92,255,0.08)"
                    }}>
                        Active
                    </span>
                </div>

                <div style={{ flexGrow: 1 }} />

                {/* footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {visibleMembers.map((email, idx) => (
                            <div key={idx} style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: "#9D5CFF", color: "#FFFFFF",
                                fontSize: 11, fontWeight: 700,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginLeft: idx === 0 ? 0 : -9,
                                border: "2px solid #1A1A1C", flexShrink: 0
                            }}>
                                {email[0].toUpperCase()}
                            </div>
                        ))}
                        {extraMembers > 0 && (
                            <div style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: "#2A2A2C", color: "#A1A1AA",
                                fontSize: 10, fontWeight: 700,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginLeft: -9, border: "2px solid #1A1A1C", flexShrink: 0
                            }}>
                                +{extraMembers}
                            </div>
                        )}
                    </div>
                    <div style={{
                        fontSize: 11, fontWeight: 700, color: balanceColor,
                        background: net > 0 ? "rgba(16,185,129,0.12)"
                            : net < 0 ? "rgba(255,208,47,0.12)"
                            : "rgba(161,161,170,0.08)",
                        padding: "3px 10px", borderRadius: 999
                    }}>
                        {balanceLabel}
                    </div>
                </div>
            </div>

            {/* ── 3-DOT BUTTON (tracks card body junction) ── */}
            <div
                style={{
                    position: "absolute",
                    right: NOTCH_INSET - btnSize / 2,
                    top: btnTop,
                    width: btnSize, height: btnSize,
                    transition: "top 0.38s cubic-bezier(0.4,0,0.2,1)",
                    zIndex: 10
                }}
                className="dropdown"
                onClick={e => e.stopPropagation()}
            >
                <button
                    data-bs-toggle="dropdown"
                    style={{
                        width: "100%", height: "100%", borderRadius: "50%",
                        background: "#1A1A1C",
                        border: "1.5px solid #3A3A3C",
                        color: "#888",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                        transition: "border-color 0.15s, color 0.15s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#9D5CFF"; e.currentTarget.style.color = "#FFFFFF"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#3A3A3C"; e.currentTarget.style.color = "#888"; }}
                >
                    <i className="bi bi-three-dots" style={{ fontSize: 13 }} />
                </button>
            </div>
        </div>
    );
}

export default DashboardGroupCard;

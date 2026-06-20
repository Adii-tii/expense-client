import { useState } from "react";
import { useSelector } from "react-redux";
import DeleteConfirmationModal from "./Modals/DeleteConfirmationModal";

/* ── helpers ── */
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

// Card geometry constants
const CARD_H      = 290;  // total card height
const IMG_H       = 165;  // image height – NEVER changes
const BODY_H_REST = 148;  // card body height at rest
const BODY_H_HVR  = 210;  // card body height on hover
// notch: circular cutout in card body top-right, radius 22px, center 22px from right edge
const NOTCH_R     = 22;
const NOTCH_INSET = 22;   // px from right edge where notch circle is centered

function GroupCardGridView({
    handleRedirection,
    group,
    members,
    visibleMembers,
    extraMembers,
    handleEditGroup,
    setShowDelete,
    showDelete,
    handleDeleteGroup,
}) {
    const [hovered, setHovered] = useState(false);
    const user = useSelector(state => state.userDetails);

    if (!group) return null;

    const style = getGroupStyle(group.name);
    const hasThumbnail = !!group.thumbnail;

    const userBalance = group.balances?.find(b => b.userEmail === user?.email);
    const net = userBalance ? Number(userBalance.netBalance) : 0;
    let balanceLabel = "Settled";
    let balanceColor = "#666";
    if (net > 0)  { balanceLabel = `+₹${net.toFixed(0)}`; balanceColor = "#10B981"; }
    if (net < 0)  { balanceLabel = `-₹${Math.abs(net).toFixed(0)}`; balanceColor = "#FFD02F"; }

    const bodyH     = hovered ? BODY_H_HVR : BODY_H_REST;
    const bodyTop   = CARD_H - bodyH;          // where card body's top edge sits
    const btnCenter = bodyTop;                  // 3-dot centre Y = card body's top edge
    const btnSize   = 36;

    // CSS mask: circular notch at top-right of card body
    // Circle centre: (calc(100% - NOTCH_INSET), 0)
    const bodyMask = `radial-gradient(circle ${NOTCH_R}px at calc(100% - ${NOTCH_INSET}px) 0px, transparent ${NOTCH_R}px, black ${NOTCH_R + 0.5}px)`;

    return (
        <>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: "relative",
                    height: CARD_H,
                    borderRadius: 24,
                    overflow: "hidden",
                    background: "#1A1A1C",
                    border: "1.5px solid #3A3A3C",
                    cursor: "pointer",
                    boxShadow: hovered
                        ? "0 16px 48px rgba(0,0,0,0.65)"
                        : "0 2px 16px rgba(0,0,0,0.35)",
                    transition: "box-shadow 0.3s ease"
                }}
                onClick={handleRedirection}
            >
                {/* ── IMAGE (fixed, never moves) ── */}
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
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.3) 100%)"
                    }} />
                    {!hasThumbnail && (
                        <div style={{
                            position: "absolute", inset: 0,
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: "50%",
                                background: "rgba(255,255,255,0.08)",
                                backdropFilter: "blur(6px)",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <i className={`bi ${style.icon}`} style={{ fontSize: 24, color: style.accent }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── CARD BODY (slides up on hover) ──
                    Shape: top-left rounded, top-right has a circular notch via mask   */}
                <div style={{
                    position: "absolute",
                    left: 0, right: 0, bottom: 0,
                    height: bodyH,
                    transition: "height 0.38s cubic-bezier(0.4,0,0.2,1)",
                    background: "#1A1A1C",
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 0,
                    maskImage: bodyMask,
                    WebkitMaskImage: bodyMask,
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    padding: "14px 16px 16px 16px",
                    overflow: "hidden"
                }}>
                    {/* meta */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        fontSize: 12, color: "#6B6B72", fontWeight: 500, marginBottom: 6
                    }}>
                        <span>{timeAgo(group.createdAt)}</span>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#6B6B72", display: "inline-block" }} />
                        <span style={{ color: "#9D5CFF", fontWeight: 600 }}>
                            {members.length} {members.length === 1 ? "member" : "members"}
                        </span>
                    </div>

                    {/* group name */}
                    <div style={{
                        fontSize: 17, fontWeight: 800,
                        color: "#FFFFFF", letterSpacing: "-0.4px",
                        lineHeight: 1.2, marginBottom: 8
                    }}>
                        {group.name}
                    </div>

                    {/* divider */}
                    <div style={{ height: 1, background: "#28282B", marginBottom: 8, marginRight: 8 }} />

                    {/* description – revealed on hover */}
                    <div style={{
                        fontSize: 12, color: "#888", lineHeight: 1.55,
                        overflow: "hidden",
                        maxHeight: hovered ? 56 : 0,
                        opacity: hovered ? 1 : 0,
                        transition: "max-height 0.32s ease, opacity 0.28s ease",
                        marginBottom: hovered ? 8 : 0
                    }}>
                        {group.description || `${members.length} members splitting shared expenses`}
                    </div>

                    {/* tag pills – revealed on hover */}
                    <div style={{
                        display: "flex", gap: 6, flexWrap: "wrap",
                        maxHeight: hovered ? 32 : 0,
                        overflow: "hidden",
                        opacity: hovered ? 1 : 0,
                        transition: "max-height 0.3s ease 0.05s, opacity 0.25s ease 0.08s",
                        marginBottom: hovered ? 10 : 0
                    }}>
                        <span style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 11px",
                            borderRadius: 999, border: "1px solid #38383A",
                            color: "#A1A1AA", background: "#232325"
                        }}>
                            {net > 0 ? "You're owed" : net < 0 ? "You owe" : "Settled"}
                        </span>
                        <span style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 11px",
                            borderRadius: 999, border: "1px solid rgba(157,92,255,0.25)",
                            color: "#9D5CFF", background: "rgba(157,92,255,0.08)"
                        }}>
                            Active
                        </span>
                    </div>

                    <div style={{ flexGrow: 1 }} />

                    {/* footer */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {/* avatars */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                            {visibleMembers.map((email, idx) => (
                                <div key={idx} style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: "#9D5CFF", color: "#FFFFFF",
                                    fontSize: 13, fontWeight: 700,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    marginLeft: idx === 0 ? 0 : -10,
                                    border: "2.5px solid #1A1A1C", flexShrink: 0
                                }}>
                                    {email[0].toUpperCase()}
                                </div>
                            ))}
                            {extraMembers > 0 && (
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: "#2A2A2C", color: "#A1A1AA",
                                    fontSize: 11, fontWeight: 700,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    marginLeft: -10, border: "2.5px solid #1A1A1C", flexShrink: 0
                                }}>
                                    +{extraMembers}
                                </div>
                            )}
                        </div>

                        {/* balance badge */}
                        <div style={{
                            fontSize: 12, fontWeight: 700, color: balanceColor,
                            background: net > 0 ? "rgba(16,185,129,0.12)"
                                : net < 0 ? "rgba(255,208,47,0.12)"
                                : "rgba(161,161,170,0.08)",
                            padding: "4px 12px", borderRadius: 999
                        }}>
                            {balanceLabel}
                        </div>
                    </div>
                </div>

                {/* ── 3-DOT BUTTON
                    Sits in the notch: centre at (right edge - NOTCH_INSET, card body top)
                    Transitions in sync with card body ── */}
                <div
                    style={{
                        position: "absolute",
                        right: NOTCH_INSET - btnSize / 2,
                        top: btnCenter - btnSize / 2,
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
                            boxShadow: "0 2px 10px rgba(0,0,0,0.45)",
                            transition: "border-color 0.15s, color 0.15s"
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = "#9D5CFF";
                            e.currentTarget.style.color = "#FFFFFF";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = "#3A3A3C";
                            e.currentTarget.style.color = "#888";
                        }}
                    >
                        <i className="bi bi-three-dots" style={{ fontSize: 14 }} />
                    </button>

                    <ul
                        className="dropdown-menu dropdown-menu-end shadow border-0"
                        style={{
                            background: "#232325", minWidth: 140,
                            borderRadius: 14, border: "1px solid #38383A",
                            padding: "6px"
                        }}
                    >
                        <li>
                            <button
                                className="dropdown-item"
                                style={{ color: "#D1D1D6", fontSize: 13, borderRadius: 8, padding: "7px 12px" }}
                                onClick={handleEditGroup}
                            >
                                <i className="bi bi-pencil me-2" style={{ color: "#9D5CFF" }} />
                                Edit Group
                            </button>
                        </li>
                        <li>
                            <button
                                className="dropdown-item"
                                style={{ color: "#FF6B6B", fontSize: 13, borderRadius: 8, padding: "7px 12px" }}
                                onClick={e => { e.stopPropagation(); setShowDelete(true); }}
                            >
                                <i className="bi bi-trash me-2" />
                                Delete
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <DeleteConfirmationModal
                show={showDelete}
                setShow={setShowDelete}
                handleDelete={handleDeleteGroup}
            />
        </>
    );
}

export default GroupCardGridView;

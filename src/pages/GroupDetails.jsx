import { useLocation, useNavigate } from "react-router-dom";
import GroupTopBar from "../components/GroupTopBar";
import { useState, useEffect, useRef } from "react";
import AddExpense from "../components/Modals/AddExpense";
import { serverEndpoint } from "../config/appConfig";
import axios from "axios";
import ExpenseCard from "../components/Cards/ExpenseCard";
import TransactionCard from "../components/Cards/TransactionCard";
import { useSelector } from "react-redux";
import SettleUpModal from "../components/Modals/SettleUpModal";
import MembersDrawer from "../components/MembersDrawer";
import ExpenseDetailsModal from "../components/Modals/ExpenseDetailsModal";
import GroupSummaryCards from "../components/Cards/GroupSummaryCard";
import GroupChat from "../components/GroupChat";

function GroupDetails() {

    const location = useLocation();
    const navigate = useNavigate();
    const group = location.state?.group;
    const [groupData, setGroupData] = useState(group);
    const user = useSelector((state) => state.userDetails);

    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [settleOpen, setSettleOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [expenses, setExpenses] = useState([]);
    const [settlements, setSettlements] = useState([]);

    const [userOwes, setUserOwes] = useState(0);
    const [userIsOwed, setUserIsOwed] = useState(0);
    const [overallBalance, setOverallBalance] = useState(0);

    const [balances, setBalances] = useState([]);

    const handleAddExpense = () => setIsOpen(true);

    const [isTimelineScrolling, setIsTimelineScrolling] = useState(false);
    const timelineScrollTimeoutRef = useRef(null);

    const handleTimelineScroll = () => {
        setIsTimelineScrolling(true);
        if (timelineScrollTimeoutRef.current) {
            clearTimeout(timelineScrollTimeoutRef.current);
        }
        timelineScrollTimeoutRef.current = setTimeout(() => {
            setIsTimelineScrolling(false);
        }, 1000);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            if (timelineScrollTimeoutRef.current) {
                clearTimeout(timelineScrollTimeoutRef.current);
            }
        };
    }, []);


    const fetchExpenses = async () => {

        if (!groupData?._id) return;

        try {

            const [
                expRes,
                owedRes,
                isOwedRes,
                peopleIOweRes
            ] = await Promise.all([
                axios.get(`${serverEndpoint}/groups/${groupData._id}/expenses`, { withCredentials: true }),
                axios.get(`${serverEndpoint}/groups/${groupData._id}/total-owed`, { withCredentials: true }),
                axios.get(`${serverEndpoint}/groups/${groupData._id}/total-is-owed`, { withCredentials: true }),
                axios.get(`${serverEndpoint}/groups/${groupData._id}/people-i-owe`, { withCredentials: true })
            ]);

            setExpenses(expRes.data.expenses || []);

            const totalOwed = owedRes.data.totalOwed || 0;
            const totalIsOwed = isOwedRes.data.totalIsOwed || 0;

            setUserOwes(totalOwed);
            setUserIsOwed(totalIsOwed);
            setOverallBalance(totalIsOwed - totalOwed);

            setBalances(peopleIOweRes.data.creditors || []);

        } catch (err) {
            console.error("Expense fetch failed", err);
        }
    };


    const fetchSettlements = async () => {

        if (!groupData?._id) return;

        try {

            const res = await axios.get(
                `${serverEndpoint}/groups/${groupData._id}/settlements`,
                { withCredentials: true }
            );

            setSettlements(res.data.settlements || []);

        } catch (err) {
            console.error("Settlement fetch failed", err);
        }
    };

    const refreshGroupDetails = async () => {
        if (!groupData?._id) return;
        try {
            const res = await axios.get(
                `${serverEndpoint}/groups/my-groups`,
                { withCredentials: true }
            );
            const found = res.data.groups?.find(g => g._id === groupData._id);
            if (found) {
                setGroupData(found);
            }
        } catch (err) {
            console.error("Failed to refresh group details", err);
        }
    };

    const handleDeleteGroup = async () => {
        if (!groupData?._id) return;
        try {
            await axios.delete(
                `${serverEndpoint}/groups/${groupData._id}/delete`,
                { withCredentials: true }
            );
            navigate("/groups");
        } catch (err) {
            console.error("Failed to delete group", err);
        }
    };

    useEffect(() => {
        fetchExpenses();
        fetchSettlements();
    }, [groupData?._id]);


    const timelineItems = [
        ...expenses.map(e => ({ type: "expense", createdAt: e.createdAt, data: e })),
        ...settlements.map(s => ({ type: "settlement", createdAt: s.createdAt, data: s }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const groupTimelineByDate = (items) => {

        const groups = {};

        items.forEach(item => {

            const d = new Date(item.createdAt);
            const today = new Date();

            const diff = Math.floor((today - d) / (1000 * 60 * 60 * 24));

            let label = d.toDateString();

            if (diff === 0) label = "Today";
            else if (diff === 1) label = "Yesterday";

            groups[label] ??= [];
            groups[label].push(item);
        });

        return groups;
    };

    const groupedTimeline = groupTimelineByDate(timelineItems);

    if (!group) return <div className="p-4 mt-5">Group not found</div>;

    return (
        <div className="container-fluid px-0" style={{ height: "calc(100vh - 96px)", display: "flex", flexDirection: "column" }}>

            <GroupTopBar
                group={groupData}
                handleAddExpense={handleAddExpense}
                toggleMembers={() => setShowMembers(p => !p)}
                onSettle={() => setSettleOpen(true)}
                onToggleChat={() => setShowChat(prev => !prev)}
                isChatActive={showChat}
            />

            <div className="d-flex gap-4 flex-grow-1" style={{ minHeight: 0 }}>

                {/* Left Timeline Area */}
                <div
                    className={`flex-grow-1 timeline-scrollbar ${isTimelineScrolling ? "scrolling" : ""} ${isMobile && showChat ? "d-none" : ""}`}
                    onScroll={handleTimelineScroll}
                    style={{
                        minWidth: 0,
                        height: "100%",
                        overflowY: "auto",
                        paddingRight: "8px"
                    }}
                >
                    <style>
                        {`
                            .timeline-scrollbar::-webkit-scrollbar {
                                width: 6px;
                            }
                            .timeline-scrollbar::-webkit-scrollbar-track {
                                background: transparent;
                            }
                            .timeline-scrollbar::-webkit-scrollbar-thumb {
                                background: transparent;
                                border-radius: 3px;
                                transition: background-color 0.3s ease;
                            }
                            .timeline-scrollbar.scrolling::-webkit-scrollbar-thumb {
                                background: rgba(255, 255, 255, 0.12);
                            }
                            .timeline-scrollbar.scrolling::-webkit-scrollbar-thumb:hover {
                                background: rgba(255, 255, 255, 0.2);
                            }
                        `}
                    </style>

                    <div style={{ paddingBottom: "80px" }}>
                        {timelineItems.length > 0 && (
                            <GroupSummaryCards
                                myBalance={overallBalance}
                                userOwes={userOwes}
                                userIsOwed={userIsOwed}
                                onSettle={() => setSettleOpen(true)}
                                balances={balances}
                                memberEmails={group.memberEmail || []}
                                totalSpent={expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)}
                            />
                        )}

                        {timelineItems.length === 0 && (
                            <div
                                className="d-flex flex-column align-items-center justify-content-center"
                                style={{ height: "calc(100vh - 200px)" }}
                            >
                                <button
                                    className="btn rounded-circle mb-4"
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        background: "#FFD700",
                                        color: "#131315",
                                        fontSize: "28px"
                                    }}
                                    onClick={handleAddExpense}
                                >
                                    <i className="bi bi-plus-lg"></i>
                                </button>
                                <h5>No activity yet</h5>
                            </div>
                        )}

                        {timelineItems.length > 0 && (
                            <div className="px-0" style={{ position: "relative" }}>
                                {Object.entries(groupedTimeline).map(([date, items]) => (
                                    <div key={date}>
                                        <div
                                            style={{
                                                fontSize: "12px",
                                                color: "#A1A1AA",
                                                margin: "24px 0 12px",
                                                fontWeight: 400
                                            }}
                                        >
                                            {date}
                                        </div>

                                        {items.map(item => (
                                            <div key={item.data._id} style={{ marginBottom: "18px" }}>
                                                {item.type === "expense" && (
                                                    <ExpenseCard
                                                        expense={item.data}
                                                        onClick={setSelectedExpense}
                                                    />
                                                )}

                                                {item.type === "settlement" && (
                                                    <TransactionCard settlement={item.data} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Chat Side Panel */}
                <div
                    style={{
                        width: showChat ? (isMobile ? "100%" : "420px") : "0px",
                        opacity: showChat ? 1 : 0,
                        pointerEvents: showChat ? "auto" : "none",
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        overflow: "hidden",
                        flexShrink: 0,
                        height: "100%"
                    }}
                >
                    <GroupChat group={groupData} user={user} onClose={() => setShowChat(false)} />
                </div>
            </div>

            <button
                onClick={handleAddExpense}
                style={{
                    position: "fixed",
                    bottom: isMobile ? "16px" : "28px",
                    right: isMobile ? "16px" : (showChat ? "468px" : "28px"),
                    display: isMobile && showChat ? "none" : "block",
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#FFD700",
                    border: "none",
                    color: "#131315",
                    fontSize: "26px",
                    boxShadow: "none",
                    zIndex: 99,
                    transition: "right 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
            >
                <i className="bi bi-plus-lg"></i>
            </button>

            <AddExpense
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                group={groupData}
                refreshExpenses={fetchExpenses}
            />

            <SettleUpModal
                isOpen={settleOpen}
                setIsOpen={(val) => {
                    setSettleOpen(val);
                    if (!val) setSelectedExpense(null);
                }}
                group={groupData}
                balances={balances}
                expense={selectedExpense}
                refreshExpenses={() => {
                    fetchExpenses();
                    fetchSettlements();
                }}
            />

            <ExpenseDetailsModal
                expense={selectedExpense}
                isOpen={!!selectedExpense}
                onClose={() => setSelectedExpense(null)}
                onSettleExpense={(expense) => {
                    setSelectedExpense(expense);
                    setSettleOpen(true);
                }}
            />

            <MembersDrawer
                group={groupData}
                isOpen={showMembers}
                setIsOpen={setShowMembers}
            />

        </div>
    );
}

export default GroupDetails;

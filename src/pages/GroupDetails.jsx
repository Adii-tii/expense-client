import { useLocation } from "react-router-dom";
import GroupTopBar from "../components/GroupTopBar";
import { useState, useEffect, useMemo } from "react";
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

function GroupDetails() {

    const location = useLocation();
    const group = location.state?.group;
    const user = useSelector((state) => state.userDetails);

    const [selectedExpense, setSelectedExpense] = useState(null);

    const [settleOpen, setSettleOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showMembers, setShowMembers] = useState(false);

    const [expenses, setExpenses] = useState([]);
    const [settlements, setSettlements] = useState([]);
    const [userOwes, setUserOwes] = useState(0);
    const [userIsOwed, setUserIsOwed] = useState(0);
    const [overallBalance, setOverallBalance] = useState(0);

    const handleAddExpense = () => setIsOpen(true);

    // ================= FETCH EXPENSES =================
    const fetchExpenses = async () => {

        if (!group?._id) return;

        const res = await axios.get(
            `${serverEndpoint}/groups/${group._id}/expenses`,
            { withCredentials: true }
        );

        const { expenses, totalOwed, totalUserIsOwed } = res.data;

        setExpenses(expenses || []);
        setUserOwes(totalOwed || 0);
        setUserIsOwed(totalUserIsOwed || 0);
        setOverallBalance((totalUserIsOwed || 0) - (totalOwed || 0));
    };

    const fetchSettlements = async () => {

        if (!group?._id) return;

        const res = await axios.get(
            `${serverEndpoint}/groups/${group._id}/settlements`,
            { withCredentials: true }
        );

        setSettlements(res.data.settlements || []);
    };

    useEffect(() => {
        fetchExpenses();
        fetchSettlements();
    }, [group]);

    const balances = useMemo(() => {

        const map = {};

        expenses.forEach(exp => {

            if (exp.isSettled) return;

            const mySplit = exp.splits?.find(s => s.email === user.email);

            if (mySplit?.remaining > 0) {

                exp.paidBy?.forEach(payer => {

                    if (payer.email === user.email) return;

                    map[payer.email] =
                        (map[payer.email] || 0) + mySplit.remaining;
                });
            }

            exp.splits?.forEach(split => {

                if (split.email === user.email) return;

                const paidByUser = exp.paidBy?.find(p => p.email === user.email);

                if (paidByUser && split.remaining > 0) {

                    map[split.email] =
                        (map[split.email] || 0) - split.remaining;
                }
            });

        });

        return map;

    }, [expenses, user.email]);

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
        <div className="bg-light">

            <GroupTopBar
                group={group}
                handleAddExpense={handleAddExpense}
                toggleMembers={() => setShowMembers(p => !p)}
            />

            <div style={{ display: "flex" }}>

                <div
                    style={{
                        flex: 1,
                        transition: "0.25s ease",
                        paddingBottom: "80px"
                    }}
                >

                    {timelineItems.length > 0 && (
                        <GroupSummaryCards
                            myBalance={overallBalance}
                            userOwes={userOwes}
                            userIsOwed={userIsOwed}
                            onSettle={() => setSettleOpen(true)}
                        />
                    )}

                    {timelineItems.length === 0 && (
                        <div
                            className="d-flex flex-column align-items-center justify-content-center"
                            style={{ height: "calc(100vh - 120px)" }}
                        >
                            <button
                                className="btn rounded-circle mb-4"
                                style={{
                                    width: "90px",
                                    height: "90px",
                                    background: "#7C6CF2",
                                    color: "white",
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
                        <div style={{ position: "relative", padding: "20px 20px 0 52px" }}>

                            {Object.entries(groupedTimeline).map(([date, items]) => (
                                <div key={date}>

                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#9CA3AF",
                                            margin: "24px 0 12px",
                                            fontWeight: 600
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

                <MembersDrawer
                    group={group}
                    isOpen={showMembers}
                />

            </div>

            <button
                onClick={handleAddExpense}
                style={{
                    position: "fixed",
                    bottom: "28px",
                    right: "28px",
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#7C6CF2",
                    border: "none",
                    color: "white",
                    fontSize: "26px",
                    boxShadow: "0 10px 25px rgba(124,108,242,0.35)"
                }}
            >
                <i className="bi bi-plus-lg"></i>
            </button>

            <AddExpense
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                group={group}
                refreshExpenses={fetchExpenses}
            />

            <SettleUpModal
                isOpen={settleOpen}
                setIsOpen={setSettleOpen}
                group={group}
                balances={balances}
                refreshExpenses={() => {
                    fetchExpenses();
                    fetchSettlements();
                }}
            />

            <ExpenseDetailsModal
                expense={selectedExpense}
                isOpen={!!selectedExpense}
                onClose={() => setSelectedExpense(null)}
            />

        </div>
    );
}

export default GroupDetails;

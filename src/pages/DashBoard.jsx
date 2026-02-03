import SummaryCards from "../components/SummaryCards";
import Reminders from "../components/Reminders";
import TransactionsDue from "../components/TransactionsDue";
import Groups from "../components/Groups";
import RecentExpenses from "../components/RecentExpenses";
import SpendingTrends from "../components/SpendingTrends";

function Dashboard() {
  return (
    <div className="container-fluid">
      {/* Page Title */}
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-semibold">Dashboard</h4>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <SummaryCards />
        </div>
      </div>

      {/* Reminders + Transactions Due */}
      <div className="row g-3 mb-4">
        <div className="col-lg-6 col-md-12">
          <Reminders />
        </div>
        <div className="col-lg-6 col-md-12">
          <TransactionsDue />
        </div>
      </div>

      {/* Groups + Recent Expenses */}
      <div className="row g-3 mb-4">
        <div className="col-lg-4 col-md-12">
          <Groups />
        </div>
        <div className="col-lg-8 col-md-12">
          <RecentExpenses />
        </div>
      </div>

      {/* Spending Trends */}
      <div className="row g-3">
        <div className="col-12">
          <SpendingTrends />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

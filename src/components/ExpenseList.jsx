function ExpenseList() {
  return (
    <div className="border rounded">
      <div className="border-bottom p-3 fw-semibold">
        Recent Expenses
      </div>

      {[
        { title: "Dinner with Rahul", amount: "-₹450" },
        { title: "Cab ride", amount: "+₹300" },
        { title: "Movie tickets", amount: "-₹600" }
      ].map((item, i) => (
        <div
          key={i}
          className="d-flex justify-content-between p-3 border-bottom"
        >
          <span>{item.title}</span>
          <span className="fw-semibold">{item.amount}</span>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;

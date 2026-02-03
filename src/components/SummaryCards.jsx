function SummaryCards() {
  const cards = [
    {
      title: "Total Balance",
      value: "₹12,450",
      icon: "bi-wallet2",
    },
    {
      title: "You Owe",
      value: "₹3,200",
      icon: "bi-arrow-up-right",
    },
    {
      title: "You Are Owed",
      value: "₹5,800",
      icon: "bi-arrow-down-left",
    },
    {
      title: "This Month",
      value: "₹9,600",
      icon: "bi-calendar3",
    },
  ];

  return (
    <div className="row g-3">
      {cards.map((card, index) => (
        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12" key={index}>
          <div className="card border h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">
                  {card.title}
                </div>
                <div className="fw-semibold fs-5">
                  {card.value}
                </div>
              </div>

              <div
                className="d-flex align-items-center justify-content-center border rounded-circle"
                style={{ width: "40px", height: "40px" }}
              >
                <i className={`bi ${card.icon}`}></i>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;

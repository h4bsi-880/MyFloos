import "../styles/summary.css";

export default function SummaryCard({ title, amount, type }) {
  const emoji = type === "income" ? "📈" : "📉";

  return (
    <div className={`summary-card ${type}`}>
      <div className="summary-title-row">
        <span className="summary-emoji">{emoji}</span>
        <p className="summary-title">{title}</p>
      </div>
      <h2 className="summary-amount">{amount} OMR</h2>
    </div>
  );
}
import { useState } from "react";
import "../styles/budget.css";

export default function BudgetManager({ budgets, setBudgets, categories, spentByCategory }) {
  const [newCategory, setNewCategory] = useState(categories[0] || "");
  const [newLimit, setNewLimit] = useState("");

  function addBudget(e) {
    e.preventDefault();
    if (!newCategory || !newLimit || Number(newLimit) <= 0) return;
    setBudgets({ ...budgets, [newCategory]: Number(newLimit) });
    setNewLimit("");
  }

  function removeBudget(category) {
    const updated = { ...budgets };
    delete updated[category];
    setBudgets(updated);
  }

  const budgetEntries = Object.entries(budgets);

  return (
    <div className="budget-card">
      <h2>Monthly Budgets</h2>

      {budgetEntries.length === 0 && <p className="empty">No budgets set yet.</p>}

      <div className="budget-list">
        {budgetEntries.map(([category, limit]) => {
  const spent = spentByCategory[category] || 0;
  const noLimitSet = !limit || limit <= 0;
  const percent = noLimitSet ? 0 : Math.min((spent / limit) * 100, 100);
  const isOver = !noLimitSet && spent > limit;
  const isClose = !noLimitSet && !isOver && percent >= 80;

  return (
    <div key={category} className="budget-item">
      <div className="budget-item-header">
        <span>{category}</span>
        <span className={isOver ? "over" : isClose ? "close" : ""}>
          {noLimitSet
            ? `${spent.toFixed(3)} OMR spent — no limit set`
            : `${spent.toFixed(3)} / ${limit.toFixed(3)} OMR`}
        </span>
        <button className="remove-budget-btn" onClick={() => removeBudget(category)}>✕</button>
      </div>
      <div className="budget-bar-track">
        <div
          className={`budget-bar-fill ${isOver ? "over" : isClose ? "close" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {isOver && <p className="budget-warning over">⚠ Over budget by {(spent - limit).toFixed(3)} OMR</p>}
      {isClose && <p className="budget-warning close">⚠ Approaching limit</p>}
    </div>
  );
})}
      </div>

      <form onSubmit={addBudget} className="budget-form">
        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          step="0.001"
          placeholder="Limit (OMR)"
          value={newLimit}
          onChange={(e) => setNewLimit(e.target.value)}
        />
        <button type="submit" className="btn income-btn">Set Budget</button>
      </form>
    </div>
  );
}
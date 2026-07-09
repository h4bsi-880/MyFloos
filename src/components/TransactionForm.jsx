import { useState } from "react";
import { getCategoryEmoji } from "../utils/categoryIcons";
import "../styles/modal.css";

const EXPENSE_CATEGORIES = ["Food", "Groceries", "Clothing", "Coffee", "Health", "Cosmetics", "Car Maintenance", "Petrol", "Home Maintenance", "Gaming", "Electronics", "Furniture", "Gym", "School", "University", "Bills", "Entertainment", "Other"];
const INCOME_CATEGORIES = ["Salary", "Gift", "Freelance", "Other"];

function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TransactionForm({ type, initialData, onSave, onClose }) {
  const [amount, setAmount] = useState(initialData?.amount || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(
    initialData?.category || (type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0])
  );
  const [date, setDate] = useState(
    initialData?.date || getLocalDateString()
  );

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const categoryEmoji = getCategoryEmoji(category);

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    onSave({
      amount: Number(amount),
      description: description.trim() || category,
      category,
      date,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initialData ? "Edit" : "Add"} {type === "income" ? "Income": "Expense"}</h2>

        <form onSubmit={handleSubmit}>
          <label>Amount (OMR)</label>
          <input
            type="number"
            step="0.001"
            placeholder="0.000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />

          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Description</label>
          <input
            type="text"
            placeholder="e.g. Grocery shopping"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Category</label>
          <div className="category-select-row">
            <span className="category-preview-emoji">{categoryEmoji}</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="modal-buttons">
            <button type="button" className="btn cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className={`btn ${type === "income" ? "income-btn" : "expense-btn"}`}>
              {initialData ? "Save Changes" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
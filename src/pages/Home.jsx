import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import BalanceCard from "../components/BalanceCard";
import SummaryCard from "../components/SummaryCard";
import TransactionForm from "../components/TransactionForm";
import CategoryChart from "../components/CategoryChart";
import FilterBar from "../components/FilterBar";
import BudgetManager from "../components/BudgetManager";
import { exportToPDF } from "../utils/exportPDF";
import "../styles/summary.css";

function monthKey(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleString("default", { month: "long", year: "numeric" });
}

export default function Home() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("floostrack-transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("floostrack-budgets");
    return saved ? JSON.parse(saved) : {};
  });

  const [modalType, setModalType] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({ search: "", type: "all", category: "all", month: "all" });

  useEffect(() => {
    localStorage.setItem("floostrack-transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("floostrack-budgets", JSON.stringify(budgets));
  }, [budgets]);

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;

  const categories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))],
    [transactions]
  );

  const expenseCategories = useMemo(
    () => [...new Set(transactions.filter((t) => t.type === "expense").map((t) => t.category))],
    [transactions]
  );

  const months = useMemo(
    () => [...new Set(transactions.map((t) => monthKey(t.id)))],
    [transactions]
  );

  const spentByCategory = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const spent = {};
    transactions
      .filter((t) => t.type === "expense")
      .filter((t) => {
        const d = new Date(t.id);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .forEach((t) => {
        spent[t.category] = (spent[t.category] || 0) + t.amount;
      });
    return spent;
  }, [transactions]);

  const filtered = transactions.filter((t) => {
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (filters.category !== "all" && t.category !== filters.category) return false;
    if (filters.month !== "all" && monthKey(t.id) !== filters.month) return false;
    if (filters.search && !`${t.description} ${t.category}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((t) => {
      const key = monthKey(t.id);
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [filtered]);

  function openAddModal(type) {
    setEditingTransaction(null);
    setModalType(type);
  }

  function openEditModal(t) {
    setEditingTransaction(t);
    setModalType(t.type);
  }

  function closeModal() {
    setModalType(null);
    setEditingTransaction(null);
  }

  function handleSave(data) {
    if (editingTransaction) {
      setTransactions(transactions.map((t) => (t.id === editingTransaction.id ? { ...t, ...data } : t)));
    } else {
      setTransactions([{ id: Date.now(), type: modalType, ...data }, ...transactions]);
    }
    closeModal();
  }

  function deleteTransaction(id) {
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  return (
    <div className="home">
      <Header />
      <BalanceCard amount={balance.toFixed(3)} />

      <div className="summary-row">
        <SummaryCard title="Income" amount={income.toFixed(3)} type="income" />
        <SummaryCard title="Expenses" amount={expenses.toFixed(3)} type="expense" />
      </div>

      <div className="button-row">
        <button className="btn income-btn" onClick={() => openAddModal("income")}>+ Add Income</button>
        <button className="btn expense-btn" onClick={() => openAddModal("expense")}>+ Add Expense</button>
      </div>

      <CategoryChart transactions={transactions} />

      <BudgetManager
        budgets={budgets}
        setBudgets={setBudgets}
        categories={expenseCategories.length > 0 ? expenseCategories : ["Food", "Transport", "Bills", "Shopping", "Entertainment", "Other"]}
        spentByCategory={spentByCategory}
      />

      <FilterBar filters={filters} setFilters={setFilters} categories={categories} months={months} />

      <div className="transactions">
        <div className="transactions-header">
          <h2>Recent Transactions</h2>
          <button
            className="export-btn"
            onClick={() =>
              exportToPDF(filtered, {
                balance: balance.toFixed(3),
                income: income.toFixed(3),
                expenses: expenses.toFixed(3),
              })
            }
          >
            ⬇ Export PDF
          </button>
        </div>

        {filtered.length === 0 && <p className="empty">No transactions match...</p>}

        {Object.entries(grouped).map(([month, txs]) => (
          <div key={month} className="month-group">
            <h3 className="month-label">{month}</h3>
            <ul>
              {txs.map((t) => (
                <li key={t.id} className={t.type}>
                  <div className="tx-info">
                    <span className="tx-desc">{t.description}</span>
                    <span className="tx-category">{t.category}</span>
                  </div>
                  <div className="tx-right">
                    <span className="tx-amount">
                      {t.type === "income" ? "+" : "-"}{t.amount.toFixed(3)} OMR
                    </span>
                    <button className="edit-btn" onClick={() => openEditModal(t)}>✎</button>
                    <button className="delete-btn" onClick={() => deleteTransaction(t.id)}>✕</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {modalType && (
        <TransactionForm type={modalType} initialData={editingTransaction} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  );
}
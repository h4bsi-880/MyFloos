import { useState, useEffect, useMemo } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
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

export default function Home({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  const [modalType, setModalType] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({ search: "", type: "all", category: "all", month: "all" });

  // Live-sync transactions from Firestore
  useEffect(() => {
    const txRef = collection(db, "users", user.uid, "transactions");
    const unsubscribe = onSnapshot(txRef, (snapshot) => {
      const txs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      txs.sort((a, b) => b.id.localeCompare(a.id)); // fallback sort, replaced below
      setTransactions(
        txs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      );
      setLoadingData(false);
    });
    return unsubscribe;
  }, [user.uid]);

  // Load budgets once (single document)
  useEffect(() => {
    const budgetRef = doc(db, "users", user.uid, "meta", "budgets");
    const unsubscribe = onSnapshot(budgetRef, (snap) => {
      setBudgets(snap.exists() ? snap.data() : {});
    });
    return unsubscribe;
  }, [user.uid]);

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
    () => [...new Set(transactions.map((t) => monthKey(t.createdAt)))],
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
        const d = new Date(t.createdAt);
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
    if (filters.month !== "all" && monthKey(t.createdAt) !== filters.month) return false;
    if (filters.search && !`${t.description} ${t.category}`.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((t) => {
      const key = monthKey(t.createdAt);
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
      const txDoc = doc(db, "users", user.uid, "transactions", editingTransaction.id);
      updateDoc(txDoc, data);
    } else {
      const txRef = collection(db, "users", user.uid, "transactions");
      addDoc(txRef, { type: modalType, ...data, createdAt: Date.now() });
    }
    closeModal();
  }

  async function deleteTransaction(id) {
    const txDoc = doc(db, "users", user.uid, "transactions", id);
    await deleteDoc(txDoc);
  }

  async function updateBudgets(newBudgets) {
    setBudgets(newBudgets);
    const budgetRef = doc(db, "users", user.uid, "meta", "budgets");
    await setDoc(budgetRef, newBudgets);
  }
  if (loadingData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
        Loading your data...
      </div>
    );
  }

  return (
    <div className="home">
      <Header user={user} onLogout={onLogout} />
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
        setBudgets={updateBudgets}
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
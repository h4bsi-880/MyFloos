import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { getCategoryEmoji } from "../utils/categoryIcons";
import "../styles/chart.css";

const COLORS = ["#6d5df6", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"];

export default function CategoryChart({ transactions }) {
  const expenseData = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expenseData[t.category] = (expenseData[t.category] || 0) + t.amount;
    });

  const total = Object.values(expenseData).reduce((s, v) => s + v, 0);

  const data = Object.entries(expenseData)
    .map(([name, value]) => ({
      name,
      emoji: getCategoryEmoji(name),
      value,
      percent: total > 0 ? (value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h2>Spending by Category</h2>
        <p className="empty">No expenses yet...</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h2>Spending by Category</h2>
      <ResponsiveContainer width="100%" height={Math.max(260, data.length * 46)}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <defs>
            {data.map((_, i) => {
              const color = COLORS[i % COLORS.length];
              return (
                <linearGradient key={i} id={`barGradient${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={color} stopOpacity={1} />
                </linearGradient>
              );
            })}
            <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#24304a" horizontal={false} />
          <XAxis
            type="number"
            stroke="#64748b"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${v.toFixed(0)}%`}
            domain={[0, 100]}
          />
          <YAxis
            type="category"
            dataKey="emoji"
            stroke="#64748b"
            tick={{ fontSize: 20 }}
            width={50}
          />
          <Tooltip
            formatter={(value, name, props) => [`${props.payload.percent.toFixed(1)}%`, props.payload.name]}
            contentStyle={{ background: "#151c2c", border: "1px solid #24304a", borderRadius: 10 }}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="percent" radius={[0, 8, 8, 0]} filter="url(#barShadow)" barSize={26}>
            {data.map((_, i) => (
              <Cell key={i} fill={`url(#barGradient${i})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

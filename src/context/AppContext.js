import React, { createContext, useContext, useState, useCallback } from "react";
import {
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  CATEGORY_COLORS,
  MONTH_KEYS,
  CURRENT_MONTH,
  CURRENT_YEAR,
} from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("finflo_transactions");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("finflo_budgets");
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [role, setRole]         = useState("admin");
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // ── Persist to localStorage ──────────────────────────────────────────────
  const saveTransactions = (txs) => {
    setTransactions(txs);
    localStorage.setItem("finflo_transactions", JSON.stringify(txs));
  };
  const saveBudgets = (bds) => {
    setBudgets(bds);
    localStorage.setItem("finflo_budgets", JSON.stringify(bds));
  };

  // ── Helpers ──────────────────────────────────────────────────────────────
  const fmt = (n) =>
    "₹" + Math.abs(Math.round(n)).toLocaleString("en-IN");

  const getSpent = useCallback(
    (cat, period) => {
      let t = transactions.filter((x) => x.type === "expense" && x.cat === cat);
      if (period === "monthly") {
        t = t.filter((x) => x.date.startsWith(CURRENT_MONTH));
      } else if (period === "weekly") {
        const w = new Date("2026-03-28");
        w.setDate(w.getDate() - 7);
        t = t.filter((x) => new Date(x.date) >= w);
      } else {
        t = t.filter((x) => x.date.startsWith(CURRENT_YEAR));
      }
      return t.reduce((s, x) => s + x.amount, 0);
    },
    [transactions]
  );

  const getAlerts = useCallback(() => {
    return budgets
      .map((b) => {
        const spent = getSpent(b.cat, b.period);
        const pct   = Math.round((spent / b.limit) * 100);
        return { ...b, spent, pct };
      })
      .filter((b) => b.pct >= 80)
      .sort((a, b) => b.pct - a.pct);
  }, [budgets, getSpent]);

  const getMonthlyData = useCallback(() => {
    return MONTH_KEYS.map((mk) => {
      const t   = transactions.filter((x) => x.date.startsWith(mk));
      const inc = t.filter((x) => x.type === "income").reduce((s, x)  => s + x.amount, 0);
      const exp = t.filter((x) => x.type === "expense").reduce((s, x) => s + x.amount, 0);
      return { inc, exp, net: inc - exp };
    });
  }, [transactions]);

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const addTransaction = (tx) => {
    const newTx = {
      ...tx,
      id: Math.max(0, ...transactions.map((t) => t.id)) + 1,
    };
    saveTransactions([newTx, ...transactions]);
  };

  const deleteTransaction = (id) => {
    saveTransactions(transactions.filter((t) => t.id !== id));
  };

  const upsertBudget = (cat, limit, period) => {
    const idx = budgets.findIndex((b) => b.cat === cat && b.period === period);
    const updated = [...budgets];
    if (idx >= 0) updated[idx] = { cat, limit, period };
    else updated.push({ cat, limit, period });
    saveBudgets(updated);
  };

  return (
    <AppContext.Provider
      value={{
        transactions, budgets, role, darkMode, activeTab,
        setRole, setDarkMode, setActiveTab,
        addTransaction, deleteTransaction, upsertBudget,
        fmt, getSpent, getAlerts, getMonthlyData,
        CATEGORY_COLORS,
        CURRENT_MONTH,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Overview     from "./components/Overview";
import Transactions from "./components/Transactions";
import Budgets      from "./components/Budgets";
import Alerts       from "./components/Alerts";
import Insights     from "./components/Insights";
import "./App.css";

function Dashboard() {
  const { role, setRole, darkMode, setDarkMode, activeTab, setActiveTab, getAlerts } = useApp();
  const alerts      = getAlerts();
  const alertCount  = alerts.length;

  const tabs = [
    { id: "overview",     label: "Overview"     },
    { id: "transactions", label: "Transactions" },
    { id: "budgets",      label: "Budgets"      },
    { id: "alerts",       label: "Alerts",       badge: alertCount },
    { id: "insights",     label: "Insights"     },
  ];

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="logo">
          <div className="logo-dot" />
          Finflo
        </div>
        <div className="topbar-right">
          <span className={`role-badge ${role}`}>{role === "admin" ? "Admin" : "Viewer"}</span>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
          <button className="dark-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* ── Navbar ── */}
      <nav className="navbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`nav-item ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
            {t.badge > 0 && <span className="nav-badge">{t.badge}</span>}
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <main className="content">
        {activeTab === "overview"     && <Overview     onNavigate={setActiveTab} />}
        {activeTab === "transactions" && <Transactions />}
        {activeTab === "budgets"      && <Budgets />}
        {activeTab === "alerts"       && <Alerts />}
        {activeTab === "insights"     && <Insights />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

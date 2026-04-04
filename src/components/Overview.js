import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { useApp } from "../context/AppContext";
import { MONTHS } from "../data/mockData";

Chart.register(...registerables);

export default function Overview({ onNavigate }) {
  const { transactions, budgets, fmt, getSpent, getAlerts, getMonthlyData, CATEGORY_COLORS, CURRENT_MONTH: CUR } = useApp();
  const trendRef   = useRef(null);
  const catRef     = useRef(null);
  const trendChart = useRef(null);
  const catChart   = useRef(null);
  const [catData, setCatData] = useState({ cats: [], vals: [], colors: [] });

  const curTxs = transactions.filter((t) => t.date.startsWith(CUR));
  const inc  = curTxs.filter((t) => t.type === "income").reduce((s, t)  => s + t.amount, 0);
  const exp  = curTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const bal  = transactions.reduce((s, t) => t.type === "income" ? s + t.amount : s - t.amount, 0);
  const mb   = budgets.filter((b) => b.period === "monthly");
  const tl   = mb.reduce((s, b) => s + b.limit, 0);
  const ts   = mb.reduce((s, b) => s + getSpent(b.cat, "monthly"), 0);
  const bpct = tl > 0 ? Math.round((ts / tl) * 100) : 0;
  const alerts = getAlerts();

  useEffect(() => {
    const md = getMonthlyData();
    if (trendChart.current) trendChart.current.destroy();
    trendChart.current = new Chart(trendRef.current, {
      type: "line",
      data: {
        labels: MONTHS,
        datasets: [
          { data: md.map((d) => d.net), borderColor: "#18936c", backgroundColor: "rgba(24,147,108,0.07)", fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#18936c", label: "Net" },
          { data: md.map((d) => d.inc), borderColor: "#2672c8", tension: 0.4, pointRadius: 3, pointBackgroundColor: "#2672c8", borderDash: [5, 4], label: "Income" },
          { data: md.map((d) => d.exp), borderColor: "#cf3b3b", tension: 0.4, pointRadius: 3, pointBackgroundColor: "#cf3b3b", borderDash: [5, 4], label: "Expenses" },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => " " + c.dataset.label + ": " + fmt(c.raw) } }
        },
        scales: {
          y: { ticks: { callback: (v) => "₹" + Math.round(v / 1000) + "k", font: { size: 11 } }, grid: { color: "rgba(0,0,0,0.05)" } },
          x: { ticks: { font: { size: 11 } }, grid: { display: false } },
        },
      },
    });
    return () => { if (trendChart.current) trendChart.current.destroy(); };
  }, [transactions]);

  useEffect(() => {
    const expTxs = transactions.filter((t) => t.date.startsWith(CUR) && t.type === "expense");
    const cm = {};
    expTxs.forEach((t) => (cm[t.cat] = (cm[t.cat] || 0) + t.amount));
    const cats   = Object.keys(cm).sort((a, b) => cm[b] - cm[a]);
    const vals   = cats.map((c) => cm[c]);
    const colors = cats.map((c) => CATEGORY_COLORS[c] || "#888");
    setCatData({ cats, vals, colors });
    if (catChart.current) catChart.current.destroy();
    catChart.current = new Chart(catRef.current, {
      type: "doughnut",
      data: { labels: cats, datasets: [{ data: vals, backgroundColor: colors, borderWidth: 3, borderColor: "#ffffff", hoverOffset: 4 }] },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "65%",
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => " " + c.label + ": " + fmt(c.raw) } }
        },
      },
    });
    return () => { if (catChart.current) catChart.current.destroy(); };
  }, [transactions]);

  const stripBudgets = budgets.filter((b) => b.period === "monthly").slice(0, 4);
  const totalCat = catData.vals.reduce((s, v) => s + v, 0);

  return (
    <div>
      {alerts.length > 0 && (
        <div className={`alert-banner ${alerts[0].pct >= 100 ? "danger" : "warn"}`}>
          <span>{alerts[0].pct >= 100 ? "🔴" : "🟡"}</span>
          <span>
            <strong>{alerts[0].pct >= 100 ? "Budget exceeded" : "Approaching limit"}:</strong>{" "}
            {alerts.map((a) => `${a.cat} (${a.pct}%)`).join(", ")} —{" "}
            <span className="link" onClick={() => onNavigate("alerts")}>View alerts</span>
          </span>
        </div>
      )}

      <div className="cards-grid" style={{ marginTop: 20 }}>
        <div className="metric-card">
          <div className="metric-label"><div className="dot" style={{ background: "#18936c" }} />Total balance</div>
          <div className="metric-val">{fmt(bal)}</div>
          <div className="metric-sub">All-time net</div>
        </div>
        <div className="metric-card">
          <div className="metric-label"><div className="dot" style={{ background: "#2672c8" }} />Income</div>
          <div className="metric-val">{fmt(inc)}</div>
          <div className="metric-sub">This month</div>
        </div>
        <div className="metric-card">
          <div className="metric-label"><div className="dot" style={{ background: "#cf3b3b" }} />Expenses</div>
          <div className="metric-val">{fmt(exp)}</div>
          <div className="metric-sub">This month</div>
        </div>
        <div className="metric-card">
          <div className="metric-label"><div className="dot" style={{ background: "#a86010" }} />Budget used</div>
          <div className="metric-val" style={{ color: bpct >= 100 ? "#cf3b3b" : bpct >= 80 ? "#a86010" : undefined }}>{bpct}%</div>
          <div className="metric-sub">{fmt(ts)} of {fmt(tl)}</div>
        </div>
      </div>

      <div className="card budget-strip">
        <div className="strip-header">
          <span className="section-title">Monthly budget snapshot</span>
          <button className="link-btn" onClick={() => onNavigate("budgets")}>Manage limits →</button>
        </div>
        <div className="strip-bars">
          {stripBudgets.map((b) => {
            const sp  = getSpent(b.cat, "monthly");
            const pct = Math.min(Math.round((sp / b.limit) * 100), 100);
            const col = pct >= 100 ? "#cf3b3b" : pct >= 80 ? "#a86010" : "#18936c";
            return (
              <div className="strip-item" key={b.cat}>
                <div className="strip-cat-row">
                  <span>{b.cat}</span>
                  <span style={{ color: col, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div className="pb-bg"><div className="pb-fill" style={{ width: pct + "%", background: col }} /></div>
                <div className="strip-sub">{fmt(sp)} / {fmt(b.limit)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="charts-grid">
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="section-title">Balance trend</div>
          <div className="section-sub">Monthly net over 6 months</div>
          <div className="legend-row">
            {[["#18936c", "Net"], ["#2672c8", "Income"], ["#cf3b3b", "Expenses"]].map(([c, l]) => (
              <div className="legend-item" key={l}><div className="legend-sq" style={{ background: c }} />{l}</div>
            ))}
          </div>
          <div style={{ position: "relative", height: 210 }}><canvas ref={trendRef} /></div>
        </div>

        <div className="card" style={{ marginBottom: 0, display: "flex", flexDirection: "column" }}>
          <div className="section-title">Spending by category</div>
          <div className="section-sub">This month breakdown</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
            <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
              <canvas ref={catRef} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
              {catData.cats.map((cat, i) => (
                <div key={cat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 9, height: 9, borderRadius: 3, background: catData.colors[i], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{cat}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                    {totalCat > 0 ? Math.round((catData.vals[i] / totalCat) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
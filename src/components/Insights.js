import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { useApp } from "../context/AppContext";
import { MONTHS } from "../data/mockData";

Chart.register(...registerables);

export default function Insights() {
  const { transactions, getAlerts, getMonthlyData, fmt, CATEGORY_COLORS } = useApp();
  const mcRef   = useRef(null);
  const topRef  = useRef(null);
  const mcChart  = useRef(null);
  const topChart = useRef(null);

  const md    = getMonthlyData();
  const cur   = md[md.length - 1];
  const prev  = md[md.length - 2];
  const ec    = prev.exp > 0 ? Math.round(((cur.exp - prev.exp) / prev.exp) * 100) : 0;
  const avgI  = Math.round(md.reduce((s, d) => s + d.inc, 0) / md.length);
  const savT  = md.reduce((s, d) => s + (d.inc - d.exp), 0);
  const alerts = getAlerts();

  const exp = transactions.filter((t) => t.type === "expense");
  const cm  = {};
  exp.forEach((t) => (cm[t.cat] = (cm[t.cat] || 0) + t.amount));
  const topCat = Object.keys(cm).sort((a, b) => cm[b] - cm[a])[0] || "—";

  // Monthly comparison chart
  useEffect(() => {
    if (mcChart.current) mcChart.current.destroy();
    mcChart.current = new Chart(mcRef.current, {
      type: "bar",
      data: {
        labels: MONTHS,
        datasets: [
          { label: "Income",   data: md.map((d) => d.inc), backgroundColor: "rgba(55,138,221,0.75)", borderRadius: 4 },
          { label: "Expenses", data: md.map((d) => d.exp), backgroundColor: "rgba(226,75,74,0.75)",  borderRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => fmt(c.raw) } } },
        scales: {
          y: { ticks: { callback: (v) => "₹" + Math.round(v / 1000) + "k", font: { size: 10 } }, grid: { color: "rgba(128,128,128,0.1)" } },
          x: { ticks: { font: { size: 10 } }, grid: { display: false } },
        },
      },
    });
    return () => { if (mcChart.current) mcChart.current.destroy(); };
  }, [transactions]);

  // Top categories chart
  useEffect(() => {
    const cats   = Object.keys(cm).sort((a, b) => cm[b] - cm[a]).slice(0, 6);
    const colors = cats.map((c) => CATEGORY_COLORS[c] || "#888");
    if (topChart.current) topChart.current.destroy();
    topChart.current = new Chart(topRef.current, {
      type: "bar",
      data: { labels: cats, datasets: [{ data: cats.map((c) => cm[c]), backgroundColor: colors, borderRadius: 4 }] },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => fmt(c.raw) } } },
        scales: {
          x: { ticks: { callback: (v) => "₹" + Math.round(v / 1000) + "k", font: { size: 10 } }, grid: { color: "rgba(128,128,128,0.1)" } },
          y: { ticks: { font: { size: 11 } }, grid: { display: false } },
        },
      },
    });
    return () => { if (topChart.current) topChart.current.destroy(); };
  }, [transactions]);

  const insightCards = [
    { dot: CATEGORY_COLORS[topCat] || "#888",  label: "Top spending",   val: topCat,       sub: fmt(cm[topCat]) + " all time",       valColor: undefined },
    { dot: ec > 0 ? "#E24B4A" : "#1D9E75",     label: "Expense change", val: (ec > 0 ? "+" : "") + ec + "%", sub: "Mar vs Feb 2026", valColor: ec > 0 ? "#E24B4A" : "#0F6E56" },
    { dot: "#378ADD",                           label: "Avg income",     val: fmt(avgI),    sub: "Last 6 months",                     valColor: undefined },
    { dot: "#1D9E75",                           label: "Total savings",  val: fmt(savT),    sub: "Net 6 months",                      valColor: "#0F6E56" },
    { dot: cur.net >= 0 ? "#1D9E75" : "#E24B4A", label: "This month net", val: fmt(cur.net), sub: "Mar 2026",                        valColor: cur.net >= 0 ? "#0F6E56" : "#E24B4A" },
    { dot: alerts.length ? "#E24B4A" : "#1D9E75", label: "Budget alerts", val: String(alerts.length), sub: alerts.length ? "Need attention" : "All healthy", valColor: alerts.length ? "#E24B4A" : "#0F6E56" },
  ];

  return (
    <div>
      <div className="insights-grid">
        {insightCards.map((ic) => (
          <div className="metric-card" key={ic.label}>
            <div className="metric-label"><div className="dot" style={{ background: ic.dot }} />{ic.label}</div>
            <div className="metric-val" style={ic.valColor ? { color: ic.valColor } : {}}>{ic.val}</div>
            <div className="metric-sub">{ic.sub}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="section-title">Monthly income vs expenses</div>
          <div className="section-sub">Last 6 months comparison</div>
          <div className="legend-row">
            {[["#378ADD", "Income"], ["#E24B4A", "Expenses"]].map(([c, l]) => (
              <div className="legend-item" key={l}><div className="legend-sq" style={{ background: c }} />{l}</div>
            ))}
          </div>
          <div style={{ position: "relative", height: 200 }}><canvas ref={mcRef} /></div>
        </div>
        <div className="card">
          <div className="section-title">Top spending categories</div>
          <div className="section-sub">All-time totals</div>
          <div style={{ position: "relative", height: 200 }}><canvas ref={topRef} /></div>
        </div>
      </div>
    </div>
  );
}

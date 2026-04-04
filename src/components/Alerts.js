import React from "react";
import { useApp } from "../context/AppContext";

export default function Alerts() {
  const { budgets, getAlerts, getSpent, fmt } = useApp();
  const alerts = getAlerts();
  const over   = alerts.filter((a) => a.pct >= 100).length;
  const warn   = alerts.filter((a) => a.pct >= 80 && a.pct < 100).length;
  const ok     = budgets.length - over - warn;

  return (
    <div>
      {/* Summary cards */}
      <div className="alerts-summary">
        <div className="alert-summary-card">
          <div className="alert-icon-box danger">&times;</div>
          <div>
            <div className="as-title">Exceeded</div>
            <div className="as-sub">{over} categor{over === 1 ? "y" : "ies"} over budget</div>
          </div>
        </div>
        <div className="alert-summary-card">
          <div className="alert-icon-box warn">!</div>
          <div>
            <div className="as-title">Near limit</div>
            <div className="as-sub">{warn} categor{warn === 1 ? "y" : "ies"} above 80%</div>
          </div>
        </div>
        <div className="alert-summary-card">
          <div className="alert-icon-box ok">&#10003;</div>
          <div>
            <div className="as-title">On track</div>
            <div className="as-sub">{ok} categor{ok === 1 ? "y" : "ies"} within budget</div>
          </div>
        </div>
      </div>

      {/* Full alert list */}
      <div className="card">
        <div className="al-head">All budget alerts ({alerts.length})</div>
        {alerts.length === 0 ? (
          <div className="empty-state">No alerts. All budgets are within limits!</div>
        ) : (
          alerts.map((a) => {
            const col = a.pct >= 100 ? "#E24B4A" : "#BA7517";
            const fp  = Math.min(a.pct, 100);
            return (
              <div className="al-item" key={a.cat + a.period}>
                <div className="al-dot" style={{ background: col }} />
                <div className="al-info">
                  <div className="al-title">{a.cat} — {a.period} budget</div>
                  <div className="al-desc">
                    {fmt(a.spent)} spent of {fmt(a.limit)} limit
                    {a.pct >= 100
                      ? " — exceeded by " + fmt(a.spent - a.limit)
                      : " — " + fmt(a.limit - a.spent) + " remaining"}
                  </div>
                </div>
                <div className="al-bar">
                  <div className="pb-bg"><div className="pb-fill" style={{ width: fp + "%", background: col }} /></div>
                </div>
                <div className="al-pct" style={{ color: col }}>{a.pct}%</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

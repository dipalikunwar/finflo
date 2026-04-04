import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ALL_CATEGORIES } from "../data/mockData";

function BudgetModal({ period, onClose, onSave, editCat }) {
  const { budgets } = useApp();
  const existing = budgets.find((b) => b.cat === editCat && b.period === period);
  const [cat,   setCat]   = useState(editCat || ALL_CATEGORIES[0]);
  const [limit, setLimit] = useState(existing ? existing.limit : "");
  const [per,   setPer]   = useState(period);

  const handleSave = () => {
    if (!limit || Number(limit) <= 0) { alert("Enter a valid limit."); return; }
    onSave(cat, Number(limit), per);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editCat ? `Edit limit — ${editCat}` : "Set budget limit"}</h3>
        <div className="form-group">
          <label>Category</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} disabled={!!editCat}>
            {ALL_CATEGORIES.filter((c) => !["Salary", "Freelance"].includes(c)).map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Limit (₹)</label>
            <input type="number" min="0" value={limit} onChange={(e) => setLimit(e.target.value)} placeholder="e.g. 5000" />
          </div>
          <div className="form-group">
            <label>Period</label>
            <select value={per} onChange={(e) => setPer(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Budgets() {
  const { budgets, role, upsertBudget, getSpent, fmt, CATEGORY_COLORS } = useApp();
  const [period,   setPeriod]   = useState("monthly");
  const [showModal, setModal]   = useState(false);
  const [editCat,   setEditCat] = useState(null);

  const filtered = budgets.filter((b) => b.period === period);
  const tl = filtered.reduce((s, b) => s + b.limit, 0);
  const ts = filtered.reduce((s, b) => s + getSpent(b.cat, b.period), 0);
  const totalPct = tl > 0 ? Math.min(Math.round((ts / tl) * 100), 100) : 0;
  const totalCol = totalPct >= 100 ? "#E24B4A" : totalPct >= 80 ? "#BA7517" : "#1D9E75";

  const openEdit = (cat) => { setEditCat(cat); setModal(true); };
  const openAdd  = ()    => { setEditCat(null); setModal(true); };

  return (
    <div>
      {showModal && (
        <BudgetModal
          period={period}
          editCat={editCat}
          onClose={() => setModal(false)}
          onSave={upsertBudget}
        />
      )}

      {/* Period selector + add button */}
      <div className="budget-controls">
        <div className="period-btns">
          {["monthly", "weekly", "yearly"].map((p) => (
            <button key={p} className={`period-btn ${period === p ? "active" : ""}`} onClick={() => setPeriod(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        {role === "admin" && <button className="add-budget-btn" onClick={openAdd}>+ Set limit</button>}
      </div>

      {/* Total bar */}
      <div className="card total-bar-card">
        <div className="total-bar-row">
          <span className="section-title">Total {period} budget</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: totalCol }}>{totalPct}% used</span>
        </div>
        <div className="pb-bg"><div className="pb-fill" style={{ width: totalPct + "%", background: totalCol }} /></div>
        <div className="total-bar-nums">
          <span>{fmt(ts)} spent</span>
          <span>{fmt(Math.max(0, tl - ts))} remaining of {fmt(tl)}</span>
        </div>
      </div>

      {/* Budget cards grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">No {period} limits set. Click "+ Set limit" to add one.</div>
      ) : (
        <div className="budgets-grid">
          {filtered.map((b) => {
            const sp  = getSpent(b.cat, b.period);
            const pct = Math.round((sp / b.limit) * 100);
            const fp  = Math.min(pct, 100);
            const col = pct >= 100 ? "#E24B4A" : pct >= 80 ? "#BA7517" : "#1D9E75";
            const tag = pct >= 100 ? "over" : pct >= 80 ? "warn" : "ok";
            const tagLabel = pct >= 100 ? "Exceeded" : pct >= 80 ? "Near limit" : "On track";

            return (
              <div className="budget-card" key={b.cat}>
                <div className="bc-header">
                  <div className="bc-cat">
                    <div className="dot" style={{ background: CATEGORY_COLORS[b.cat] || "#888" }} />
                    {b.cat}
                  </div>
                  <span className={`bc-tag ${tag}`}>{tagLabel}</span>
                </div>
                <div className="bc-amounts">
                  <div>
                    <div className="tiny-label">Spent</div>
                    <div className="bc-spent" style={{ color: col }}>{fmt(sp)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="tiny-label">Limit</div>
                    <div className="bc-limit">{fmt(b.limit)}</div>
                  </div>
                </div>
                <div className="pb-bg thick"><div className="pb-fill" style={{ width: fp + "%", background: col }} /></div>
                <div className="bc-footer">
                  <span className="bc-remaining" style={{ color: sp > b.limit ? "#E24B4A" : "var(--color-text-secondary)" }}>
                    {sp > b.limit ? "Over by " + fmt(sp - b.limit) : fmt(b.limit - sp) + " left"} ({pct}%)
                  </span>
                  {role === "admin" && (
                    <button className="bc-edit-btn" onClick={() => openEdit(b.cat)}>Edit</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

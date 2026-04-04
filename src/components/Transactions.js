import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { ALL_CATEGORIES } from "../data/mockData";

function Modal({ onClose, onSave }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: "expense",
    desc: "",
    amount: "",
    cat: "Food",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.date || !form.desc || !form.amount || Number(form.amount) <= 0) {
      alert("Please fill all fields with valid values.");
      return;
    }
    onSave({ ...form, amount: Number(form.amount) });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add transaction</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <input type="text" placeholder="e.g. Grocery shopping" value={form.desc} onChange={(e) => set("desc", e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" min="0" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.cat} onChange={(e) => set("cat", e.target.value)}>
              {ALL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
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

export default function Transactions() {
  const { transactions, role, deleteTransaction, addTransaction, fmt, CATEGORY_COLORS } = useApp();
  const [search, setSearch]   = useState("");
  const [filterType, setType] = useState("");
  const [filterCat, setCat]   = useState("");
  const [sort, setSort]       = useState("date-desc");
  const [showModal, setModal] = useState(false);

  const allCats = [...new Set(transactions.map((t) => t.cat))].sort();

  let filtered = [...transactions];
  if (search)     filtered = filtered.filter((t) => t.desc.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase()));
  if (filterType) filtered = filtered.filter((t) => t.type === filterType);
  if (filterCat)  filtered = filtered.filter((t) => t.cat === filterCat);
  filtered.sort((a, b) => {
    if (sort === "date-desc")   return b.date.localeCompare(a.date);
    if (sort === "date-asc")    return a.date.localeCompare(b.date);
    if (sort === "amount-desc") return b.amount - a.amount;
    return a.amount - b.amount;
  });

  const exportCSV = () => {
    const rows = [["Date", "Description", "Category", "Type", "Amount"], ...transactions.map((t) => [t.date, t.desc, t.cat, t.type, t.amount])];
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(rows.map((r) => r.join(",")).join("\n"));
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div>
      {showModal && <Modal onClose={() => setModal(false)} onSave={addTransaction} />}

      <div className="filters-bar">
        <input type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filterType} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={filterCat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>
          {allCats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="amount-desc">Highest amount</option>
          <option value="amount-asc">Lowest amount</option>
        </select>
        <button className="export-btn" onClick={exportCSV}>Export CSV</button>
        {role === "admin" && <button className="add-btn" onClick={() => setModal(true)}>+ Add</button>}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Description</th><th>Category</th><th>Type</th><th>Amount</th>
              {role === "admin" && <th></th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state">No transactions match your filters.</div></td></tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id}>
                  <td className="muted small">{t.date}</td>
                  <td>{t.desc}</td>
                  <td>
                    <span className="cat-pill" style={{ background: (CATEGORY_COLORS[t.cat] || "#888") + "22", color: CATEGORY_COLORS[t.cat] || "#888" }}>
                      {t.cat}
                    </span>
                  </td>
                  <td>
                    <span className={`type-pill ${t.type}`}>{t.type}</span>
                  </td>
                  <td className={t.type === "income" ? "amount-pos" : "amount-neg"}>
                    {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                  </td>
                  {role === "admin" && (
                    <td>
                      <button className="remove-btn" onClick={() => deleteTransaction(t.id)}>Remove</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

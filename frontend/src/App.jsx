import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: 'Income',
    category: '',
    amount: '',
    date: '',
    note: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });

  useEffect(() => {
    fetchData();
    fetchSummary();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8080/transactions');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Gagal memuat data. Periksa koneksi backend.');
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch('http://localhost:8080/summary');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setError('Gagal memuat summary.');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:8080/transactions';

    try {
      let response;
      if (editingId) {
        response = await fetch(`${url}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            amount: parseFloat(form.amount),
            id: parseInt(editingId),
          }),
        });
      } else {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            amount: parseFloat(form.amount),
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedTransaction = await response.json();
      if (editingId) {
        setTransactions(
          transactions.map((t) =>
            t.id === parseInt(editingId) ? { ...updatedTransaction } : t
          )
        );
        setEditingId(null);
      } else {
        setTransactions([...transactions, updatedTransaction]);
      }

      setForm({
        type: 'Income',
        category: '',
        amount: '',
        date: '',
        note: '',
      });
      setError(null);
      fetchSummary(); // Perbarui summary setelah transaksi baru
    } catch (error) {
      console.error('Error saving data:', error);
      setError(`Gagal menyimpan data: ${error.message}`);
    }
  };

  const handleEdit = (transaction) => {
    setForm({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      note: transaction.note,
    });
    setEditingId(transaction.id.toString());
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/transactions/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      setTransactions(transactions.filter((t) => t.id !== id));
      setError(null);
      fetchSummary(); // Perbarui summary setelah penghapusan
    } catch (error) {
      console.error('Error deleting data:', error);
      setError(`Gagal menghapus data: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Pengelolaan Keuangan Pribadi <span role="img" aria-label="money"></span></h1>
      </div>
      <form onSubmit={handleSubmit} className="form-group">
        <div className="form-field">
          <label>Type</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div className="form-field">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
        </div>
        <div className="form-field">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            required
            step="0.01"
          />
        </div>
        <div className="form-field">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Note</label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Note"
          />
        </div>
        <div className="form-field">
          <button type="submit">{editingId ? 'Update Transaksi' : 'Tambah Transaksi'}</button>
        </div>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div className="summary-section">
        <h2>Summary <span role="img" aria-label="chart">📊</span></h2>
        <table className="summary-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount (Rp)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Income</td>
              <td>{summary.totalIncome.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Total Expense</td>
              <td>{summary.totalExpense.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Balance</td>
              <td>{summary.balance.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="table-section">
        <h2>📋 Daftar Transaksi <span role="img" aria-label="list"></span></h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Note</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">Belum ada transaksi</td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td>{new Date(t.date).toLocaleDateString('id-ID')}</td>
                  <td>{t.type}</td>
                  <td>{t.category}</td>
                  <td>{t.amount}</td>
                  <td>{t.note}</td>
                  <td>
                    <button onClick={() => handleEdit(t)}>Edit</button>
                    <button onClick={() => handleDelete(t.id)}>Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
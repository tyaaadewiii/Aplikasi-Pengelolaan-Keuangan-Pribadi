import React, { useState } from "react";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "Income",
    category: "",
    amount: "",
    date: "",
    note: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingId ? { ...form, id: editingId } : t
        )
      );
      setEditingId(null);
    } else {
      const newTransaction = {
        ...form,
        id: Date.now(),
      };
      setTransactions([...transactions, newTransaction]);
    }

    setForm({
      type: "Income",
      category: "",
      amount: "",
      date: "",
      note: "",
    });
  };

  const handleEdit = (transaction) => {
    setForm(transaction);
    setEditingId(transaction.id);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Hitung total income, expense, balance
  const income = transactions
    .filter((t) => t.type === "Income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expense;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        💰 Pengelolaan Keuangan Pribadi 💰
      </h1>

      {/* Ringkasan */}
      <div className="grid grid-cols-3 gap-6 text-center mb-8">
        <div className="bg-green-100 p-6 rounded shadow">
          <h2 className="text-2xl font-bold text-green-700">Income</h2>
          <p className="text-3xl font-extrabold text-green-800">
            Rp {income.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-red-100 p-6 rounded shadow">
          <h2 className="text-2xl font-bold text-red-700">Expense</h2>
          <p className="text-3xl font-extrabold text-red-800">
            Rp {expense.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-blue-100 p-6 rounded shadow">
          <h2 className="text-2xl font-bold text-blue-700">Balance</h2>
          <p className="text-3xl font-extrabold text-blue-800">
            Rp {balance.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Form Input */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white p-6 shadow rounded mb-8"
      >
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-4 rounded text-2xl font-semibold w-full h-16 appearance-none"
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-3 rounded text-xl font-semibold w-full h-14"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="border p-10 rounded text-xl font-semibold w-full h-20"
          required
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-3 rounded text-xl font-semibold w-full h-14"
          required
        />

        <input
          type="text"
          name="note"
          placeholder="Note"
          value={form.note}
          onChange={handleChange}
          className="border p-3 rounded text-xl font-semibold w-full h-14 col-span-2"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded col-span-2 text-xl font-bold h-14 w-full"
        >
          {editingId ? "Update Transaksi" : "Tambah Transaksi"}
        </button>
      </form>

      {/* Tabel Transaksi */}
      <h2 className="text-2xl font-bold mb-4">📋 Daftar Transaksi</h2>
      <table className="w-full text-left border-collapse text-xl">
        <thead>
          <tr className="bg-gray-2000">
            <th className="border px-10 py-4">Date</th>
            <th className="border px-10 py-4">Type</th>
            <th className="border px-10 py-4">Category</th>
            <th className="border px-10 py-4">Amount</th>
            <th className="border px-10 py-4">Note</th>
            <th className="border px-10 py-4">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="15" className="text-center p-10 text-gray-500">
                Belum ada transaksi
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="p-3 border">
                  {new Date(t.date).toLocaleDateString("id-ID")}
                </td>
                <td
                  className={`p-3 border font-bold ${
                    t.type === "Income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type}
                </td>
                <td className="p-3 border">{t.category}</td>
                <td className="p-3 border">
                  Rp {Number(t.amount).toLocaleString("id-ID")}
                </td>
                <td className="p-3 border">{t.note}</td>
                <td className="p-3 border flex gap-3">
                  <button
                    onClick={() => handleEdit(t)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-lg"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

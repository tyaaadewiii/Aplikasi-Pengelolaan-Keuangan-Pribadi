import { useState } from "react";

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "income",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      const data = await response.json();
      onAdd(data);
      setForm({ description: "", amount: "", type: "income" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow rounded mb-4 flex flex-col gap-2"
    >
      <input
        type="text"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Deskripsi"
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Jumlah"
        className="border p-2 rounded"
        required
      />
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="income">Pemasukan</option>
        <option value="expense">Pengeluaran</option>
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Tambah Transaksi
      </button>
    </form>
  );
}

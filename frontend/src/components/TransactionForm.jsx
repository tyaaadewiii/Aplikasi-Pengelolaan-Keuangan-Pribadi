import { useState, useEffect } from "react";

export default function TransactionForm({ onAdd, editing, onUpdate, cancelEdit }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "income",
  });

  useEffect(() => {
    if (editing) {
      setForm(editing);
    }
  }, [editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      // UPDATE
      const res = await fetch(`http://localhost:8080/transactions/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await onUpdate();
        cancelEdit();
        setForm({ description: "", amount: "", type: "income" });
      }
    } else {
      // CREATE
      const res = await fetch("http://localhost:8080/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await onAdd();
        setForm({ description: "", amount: "", type: "income" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded mb-4">
      <input
        type="text"
        name="description"
        placeholder="Deskripsi"
        value={form.description}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="Jumlah"
        value={form.amount}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
        required
      />
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="income">Pemasukan</option>
        <option value="expense">Pengeluaran</option>
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          className={`${
            editing ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
          } text-white px-4 py-2 rounded`}
        >
          {editing ? "Update" : "Simpan"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={cancelEdit}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

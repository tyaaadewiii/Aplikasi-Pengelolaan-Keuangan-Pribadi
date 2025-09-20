import { useState, useEffect } from "react";

export default function TransactionForm({ onAdd, onUpdate, editing, cancelEdit }) {
  const [form, setForm] = useState({
    type: "income",
    category: "",
    amount: "",
    date: "",
    note: "",
    description: "",
  });

  useEffect(() => {
    if (editing) {
      setForm(editing);
    }
  }, [editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      onUpdate({ ...form, id: editing.id });
    } else {
      onAdd(form);
    }
    setForm({
      type: "income",
      category: "",
      amount: "",
      date: "",
      note: "",
      description: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded mb-4">
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="income">Pemasukan</option>
        <option value="expense">Pengeluaran</option>
      </select>

      <input
        type="text"
        name="category"
        placeholder="Kategori"
        value={form.category}
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

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />

      <textarea
        name="note"
        placeholder="Catatan"
        value={form.note}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />

      <textarea
        name="description"
        placeholder="Deskripsi"
        value={form.description}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-2"
      />

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

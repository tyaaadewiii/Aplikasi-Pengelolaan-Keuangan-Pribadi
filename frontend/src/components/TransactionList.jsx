export default function TransactionList({ transactions, onDelete, onEdit }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-2">Daftar Transaksi</h2>
      <ul>
        {transactions.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center border-b py-2 text-sm"
          >
            <div>
              <span className="font-medium">{t.description}</span>{" "}
              <span
                className={
                  t.type === "income" ? "text-green-600" : "text-red-600"
                }
              >
                {t.type === "income" ? "+" : "-"} Rp {t.amount}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(t)}
                className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(t.id)}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

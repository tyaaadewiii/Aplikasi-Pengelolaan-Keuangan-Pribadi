export default function TransactionList({ transactions, onDelete, onEdit }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-bold mb-4">Daftar Transaksi</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">Belum ada transaksi</p>
      ) : (
        <ul>
          {transactions.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-semibold">{t.description}</p>
                <p
                  className={`${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  Rp {t.amount}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(t)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

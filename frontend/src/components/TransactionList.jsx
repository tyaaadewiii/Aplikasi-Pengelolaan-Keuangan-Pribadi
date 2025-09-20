export default function TransactionList({ transactions }) {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-2">Daftar Transaksi</h2>
      <ul className="divide-y">
        {transactions.map((t) => (
          <li key={t.id} className="py-2 flex justify-between">
            <span>{t.description}</span>
            <span
              className={`${
                t.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {t.type === "income" ? "+" : "-"}Rp {t.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

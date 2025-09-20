export default function Summary({ transactions }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, cur) => acc + parseFloat(cur.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, cur) => acc + parseFloat(cur.amount), 0);

  const balance = income - expense;

  // tambahan untuk format angka
  const formatRupiah = (num) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num);

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-green-100 p-4 rounded shadow">
        <h3 className="text-green-700 font-bold">Pemasukan</h3>
        <p className="text-xl font-semibold text-green-800">{formatRupiah(income)}</p>
      </div>
      <div className="bg-red-100 p-4 rounded shadow">
        <h3 className="text-red-700 font-bold">Pengeluaran</h3>
        <p className="text-xl font-semibold text-red-800">{formatRupiah(expense)}</p>
      </div>
      <div className="bg-blue-100 p-4 rounded shadow">
        <h3 className="text-blue-700 font-bold">Saldo Akhir</h3>
        <p className="text-xl font-semibold text-blue-800">{formatRupiah(balance)}</p>
      </div>
    </div>
  );
}

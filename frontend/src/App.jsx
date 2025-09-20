import { useEffect, useState } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import Summary from "./components/Summary";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchTransactions = async () => {
    const res = await fetch("http://localhost:8080/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/transactions/${id}`, {
      method: "DELETE",
    });
    fetchTransactions();
  };

  const handleEdit = (transaction) => {
    setEditing(transaction);
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Aplikasi Pengelolaan Keuangan
      </h1>

      {/* Ringkasan */}
      <Summary transactions={transactions} />

      {/* Form & List */}
      <TransactionForm
        onAdd={fetchTransactions}
        onUpdate={fetchTransactions}
        editing={editing}
        cancelEdit={cancelEdit}
      />
      <TransactionList
        transactions={transactions}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default App;

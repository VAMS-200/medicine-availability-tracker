import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { getInventory } from "../services/api";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { store } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await getInventory();
        const medicines = res.data.medicines || [];

        const total = medicines.length;
        const lowStock = medicines.filter(
          (m) => m.status === "LOW_STOCK"
        ).length;
        const outOfStock = medicines.filter(
          (m) => m.status === "OUT_OF_STOCK"
        ).length;

        setStats({ total, lowStock, outOfStock });
      } catch (err) {
        console.error("Dashboard inventory error:", err);
        setError("Failed to load inventory stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">
        Store Dashboard
      </h1>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {store && (
          <>
            <p className="text-sm text-slate-700">
              Welcome, <span className="font-semibold">{store.name}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Area:{" "}
              {store.addressLine
                ? `${store.addressLine}, `
                : ""}
              {store.city} {store.pincode}
            </p>
          </>
        )}

        {loading ? (
          <Loader text="Loading your inventory stats..." />
        ) : error ? (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <div className="rounded-xl bg-blue-50 px-3 py-2 text-blue-800">
              <span className="font-semibold">{stats.total}</span> medicines in
              inventory
            </div>
            <div className="rounded-xl bg-amber-50 px-3 py-2 text-amber-800">
              <span className="font-semibold">{stats.lowStock}</span> low stock
            </div>
            <div className="rounded-xl bg-red-50 px-3 py-2 text-red-800">
              <span className="font-semibold">{stats.outOfStock}</span> out of
              stock
            </div>
          </div>
        )}

        <div className="mt-5">
          <Link
            to="/inventory"
            className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Inventory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

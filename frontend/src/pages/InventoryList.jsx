import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getInventory, deleteMedicine } from "../services/api";
import Loader from "../components/Loader";
import { formatDateTime } from "../utils/formatDate";

const statusStyle = (status) => {
  if (status === "IN_STOCK")
    return "bg-emerald-50 text-emerald-700";
  if (status === "LOW_STOCK")
    return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
};

const InventoryList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const fetchInventory = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getInventory();
      setMedicines(res.data.medicines || []);
    } catch (err) {
      console.error("Get inventory error:", err);
      const message =
        err.response?.data?.message || "Failed to load inventory.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await deleteMedicine(id);
      setMedicines((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete medicine error:", err);
      alert(
        err.response?.data?.message || "Failed to delete medicine. Try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleAdd = () => {
    navigate("/inventory/add");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">Inventory</h1>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Manage the list of medicines available in your pharmacy.
          </p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            + Add Medicine
          </button>
        </div>

        {loading ? (
          <Loader text="Loading inventory..." />
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : medicines.length === 0 ? (
          <p className="text-sm text-slate-600">
            You have no medicines in your inventory yet.{" "}
            <button
              onClick={handleAdd}
              className="text-blue-600 hover:underline"
            >
              Click here to add one.
            </button>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Brand</th>
                  <th className="px-3 py-2">Quantity</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr
                    key={med._id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium text-slate-800">
                        {med.name}
                      </div>
                      {med.genericName && (
                        <div className="text-xs text-slate-500">
                          Generic: {med.genericName}
                        </div>
                      )}
                      <div className="mt-1 text-[11px] text-slate-400">
                        Last updated:{" "}
                        {formatDateTime(med.lastUpdated || med.updatedAt)}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top text-slate-700">
                      {med.brand || "-"}
                    </td>
                    <td className="px-3 py-2 align-top text-slate-700">
                      {med.quantity}
                    </td>
                    <td className="px-3 py-2 align-top text-slate-700">
                      ₹
                      {med.price?.toFixed
                        ? med.price.toFixed(2)
                        : med.price}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle(
                          med.status
                        )}`}
                      >
                        {med.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top text-right text-xs">
                      <Link
                        to={`/inventory/edit/${med._id}`}
                        className="mr-3 text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(med._id)}
                        disabled={deletingId === med._id}
                        className="text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingId === med._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;

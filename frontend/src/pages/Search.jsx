import { useState } from "react";
import { searchMedicines } from "../services/api";
import Loader from "../components/Loader";

const badgeClass = (status) => {
  if (status === "IN_STOCK") return "bg-emerald-50 text-emerald-700";
  if (status === "LOW_STOCK") return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
};

const Search = () => {
  const [medicineName, setMedicineName] = useState("");
  const [pincode, setPincode] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!medicineName || !pincode) {
      setError("Please enter both medicine name and pincode.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await searchMedicines(medicineName, pincode);
      setResults(res.data.stores || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-800">
        Search Medicines
      </h1>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 md:flex-row md:items-end"
        >
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Medicine Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g. Paracetamol"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:w-48">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 500001"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 md:mt-0"
          >
            Search
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>

      {loading && <Loader text="Searching for medicines..." />}

      {searched && !loading && results.length === 0 && !error && (
        <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
          No stores found with this medicine in this area.
        </div>
      )}

      {!loading &&
        results.map((store) => (
          <div
            className="rounded-2xl bg-white p-5 shadow-sm"
            key={store.storeId}
          >
            <h3 className="text-base font-semibold text-slate-800">
              {store.storeName}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {store.addressLine}, {store.city}, {store.pincode}
              {store.phone && <> • 📞 {store.phone}</>}
            </p>

            <div className="mt-3 space-y-2">
              {store.medicines.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      {med.name}
                      {med.brand && (
                        <span className="text-xs text-slate-500">
                          {" "}
                          — {med.brand}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Quantity: {med.quantity} • Price: ₹{med.price}
                    </div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass(
                      med.status
                    )}`}
                  >
                    {med.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Search;

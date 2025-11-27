import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createMedicine,
  getMedicineById,
  updateMedicine,
} from "../services/api";
import Loader from "../components/Loader";
import FormInput from "../components/FormInput";

const InventoryForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    genericName: "",
    brand: "",
    quantity: "",
    price: "",
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicine = async () => {
      if (!isEdit) return;

      try {
        const res = await getMedicineById(id);
        const med = res.data.medicine;

        setForm({
          name: med.name || "",
          genericName: med.genericName || "",
          brand: med.brand || "",
          quantity: med.quantity != null ? String(med.quantity) : "",
          price: med.price != null ? String(med.price) : "",
        });
      } catch (err) {
        console.error("Get medicine error:", err);
        const message =
          err.response?.data?.message ||
          "Failed to load medicine details for editing.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = { ...form };

      if (isEdit) {
        await updateMedicine(id, payload);
      } else {
        await createMedicine(payload);
      }

      navigate("/inventory");
    } catch (err) {
      console.error("Save medicine error:", err);
      const message =
        err.response?.data?.message ||
        `Failed to ${isEdit ? "update" : "create"} medicine.`;
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold text-slate-800">
          {isEdit ? "Edit Medicine" : "Add New Medicine"}
        </h1>
        <Loader text="Loading medicine details..." />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-xl">
        <h1 className="mb-4 text-2xl font-semibold text-slate-800">
          {isEdit ? "Edit Medicine" : "Add New Medicine"}
        </h1>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormInput
              label="Medicine Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g., Paracetamol 650mg"
            />

            <FormInput
              label="Generic Name"
              name="genericName"
              value={form.genericName}
              onChange={handleChange}
              placeholder="e.g., Paracetamol"
            />

            <FormInput
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g., Dolo"
            />

            <FormInput
              label="Quantity"
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              placeholder="e.g., 10"
            />

            <FormInput
              label="Price (₹)"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g., 35"
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-3 w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                ? "Save Changes"
                : "Add Medicine"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InventoryForm;

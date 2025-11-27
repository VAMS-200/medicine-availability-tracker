import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerStore } from "../services/api";
import useAuth from "../hooks/useAuth";
import FormInput from "../components/FormInput";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    email: "",
    password: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await registerStore(form);
      const { token, store } = res.data;
      login(token, store);
      navigate("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to register. Please check your details.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4">
      <div className="mt-10 w-full max-w-2xl">
        <h1 className="mb-4 text-2xl font-semibold text-slate-800">
          Register Your Pharmacy
        </h1>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm text-slate-600">
            Create an account for your pharmacy to manage your medicine
            inventory and let users find your store when searching for
            medicines.
          </p>

          {error && (
            <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-3 md:grid-cols-2">
              <FormInput
                label="Store Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g., Vamsi Medicals"
              />

              <FormInput
                label="Owner Name"
                name="ownerName"
                value={form.ownerName}
                onChange={handleChange}
                placeholder="e.g., Vamsi"
              />

              <FormInput
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="store@example.com"
              />

              <FormInput
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Min 6 characters"
              />

              <FormInput
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Contact number"
              />

              <FormInput
                label="Pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                required
                placeholder="Area pincode"
              />
            </div>

            <FormInput
              label="Address Line"
              name="addressLine"
              value={form.addressLine}
              onChange={handleChange}
              placeholder="Street / Locality"
            />

            <div className="grid gap-3 md:grid-cols-2">
              <FormInput
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
              />

              <FormInput
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Registering..." : "Register Store"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

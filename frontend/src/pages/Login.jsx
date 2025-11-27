import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginStore } from "../services/api";
import useAuth from "../hooks/useAuth";
import FormInput from "../components/FormInput";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginStore(form);
      const { token, store } = res.data;
      login(token, store);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message || "Failed to login. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4">
      <div className="mt-10 w-full max-w-md">
        <h1 className="mb-4 text-2xl font-semibold text-slate-800">
          Store Login
        </h1>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="mb-4 text-sm text-slate-600">
            Login with your registered email and password to manage your
            pharmacy&apos;s inventory.
          </p>

          {error && (
            <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-3 text-center text-xs text-slate-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-blue-600">
              Register your pharmacy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

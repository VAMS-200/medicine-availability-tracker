import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { store, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium px-3 py-1 rounded-full transition ${
      isActive
        ? "text-blue-700"
        : "text-slate-700 hover:text-blue-700"
    }`;

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        
        {/* LOGO / BRAND */}
        <div className="text-xl font-extrabold tracking-tight text-blue-700">
          <Link to="/">Medicine Finder</Link>
        </div>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-4">

          {/* ✅ Always Visible */}
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/search" className={linkClass}>
            Search
          </NavLink>

          {/* ✅ When Store is logged in */}
          {store && (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>

              <NavLink to="/inventory" className={linkClass}>
                Inventory
              </NavLink>

              <span
                className="hidden max-w-[150px] truncate border-l border-slate-300 pl-3 text-xs text-slate-500 md:inline"
                title={store.name}
              >
                {store.name}
              </span>

              <button
                onClick={handleLogout}
                className="ml-1 rounded-full border border-slate-300 px-4 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          )}

          {/* ✅ When NOT logged in */}
          {!store && (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>

              <Link
                to="/register"
                className="rounded-full bg-blue-600 px-5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Register Store
              </Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Navbar;

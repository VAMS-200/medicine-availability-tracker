import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 space-y-16">
      {/* HERO */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
          Medicine Availability &amp; Shortage Tracker
        </h1>
        <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto">
          Find medicines instantly. Manage pharmacy inventory easily.
        </p>

        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link
            to="/search"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm md:text-base font-semibold shadow"
          >
            🔍 Search Medicine
          </Link>
          <Link
            to="/register"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl text-sm md:text-base font-semibold shadow"
          >
            🏪 Register Store
          </Link>
        </div>
      </section>

      {/* THREE TILES */}
      <section className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {/* Public users */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-xl font-bold text-blue-600 mb-3">
            For Public Users
          </h2>
          <p className="text-sm md:text-base text-slate-600 mb-6">
            Search medicines by name &amp; pincode and find stores that have
            them.
          </p>
          <Link
            to="/search"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold"
          >
            Search Now
          </Link>
        </div>

        {/* Pharmacies – core features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-xl font-bold text-emerald-600 mb-3">
            For Pharmacies
          </h2>
          <p className="text-sm md:text-base text-slate-600 mb-6">
            Add &amp; manage your medicine stock online in real time from a
            simple dashboard.
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-semibold"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Smart tracking – explicitly for pharmacies */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-xl font-bold text-orange-500 mb-3">
            Smart Tracking for Pharmacies
          </h2>
          <p className="text-sm md:text-base text-slate-600 mb-6">
            Automatically highlights medicines that are Low Stock or Out of
            Stock so you can restock on time and avoid shortage.
          </p>
          <Link
            to="/inventory"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-semibold"
          >
            View Inventory
          </Link>
        </div>
      </section>

      <div className="text-center text-xs text-slate-400">
        Built with MERN Stack • Tailwind CSS • JWT
      </div>
    </div>
  );
};

export default Home;

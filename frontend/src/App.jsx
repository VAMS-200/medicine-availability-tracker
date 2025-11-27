import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InventoryList from "./pages/InventoryList";
import InventoryForm from "./pages/InventoryForm";
import ProtectedRoute from "./components/ProtectedRoute";

// Small layout wrapper for inner pages (not Home)
const PageContainer = ({ children }) => (
  <div className="mx-auto w-full max-w-5xl px-4 py-6">{children}</div>
);

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Home = FULL WIDTH (no container) */}
          <Route path="/" element={<Home />} />

          {/* Other public pages inside container */}
          <Route
            path="/search"
            element={
              <PageContainer>
                <Search />
              </PageContainer>
            }
          />
          <Route
            path="/login"
            element={
              <PageContainer>
                <Login />
              </PageContainer>
            }
          />
          <Route
            path="/register"
            element={
              <PageContainer>
                <Register />
              </PageContainer>
            }
          />

          {/* Protected pages inside container */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageContainer>
                  <Dashboard />
                </PageContainer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <PageContainer>
                  <InventoryList />
                </PageContainer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/add"
            element={
              <ProtectedRoute>
                <PageContainer>
                  <InventoryForm />
                </PageContainer>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/edit/:id"
            element={
              <ProtectedRoute>
                <PageContainer>
                  <InventoryForm />
                </PageContainer>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <PageContainer>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h1 className="mb-2 text-xl font-semibold">
                    404 - Page Not Found
                  </h1>
                  <p className="text-sm text-slate-600">
                    The page you’re looking for does not exist.
                  </p>
                </div>
              </PageContainer>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;

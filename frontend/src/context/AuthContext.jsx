import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [store, setStore] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keys used in localStorage
  const TOKEN_KEY = "mat_token";
  const STORE_KEY = "mat_store";

  useEffect(() => {
    // Load from localStorage on mount
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedStore = localStorage.getItem(STORE_KEY);

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedStore) {
      try {
        setStore(JSON.parse(savedStore));
      } catch (e) {
        console.error("Failed to parse saved store:", e);
      }
    }

    setLoading(false);
  }, []);

  const login = (tokenValue, storeData) => {
    setToken(tokenValue);
    setStore(storeData);
    localStorage.setItem(TOKEN_KEY, tokenValue);
    localStorage.setItem(STORE_KEY, JSON.stringify(storeData));
  };

  const logout = () => {
    setToken(null);
    setStore(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORE_KEY);
  };

  const value = {
    store,
    token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [showStock, setShowStock] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 GET stock visibility
  useEffect(() => {
    const fetchStockVisibility = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/AdminSettings/StockVisible`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // ✅ backend returns { value: true/false }
        setShowStock(res.data?.value ?? true);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch stock visibility");
      } finally {
        setLoading(false);
      }
    };
    fetchStockVisibility();
  }, []);

  // 🔹 Toggle function
  const toggleStock = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const newValue = !showStock;

      const res = await axios.put(
        `${API}/AdminSettings/StockVisible`,
        { value: newValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ update from response
      setShowStock(res.data?.value ?? newValue);
      setError(null);
      return res.data?.value ?? newValue;
    } catch (err) {
      console.error(err);
      setError("Failed to update stock visibility");
      return showStock; // fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <StockContext.Provider value={{ showStock, toggleStock, loading, error }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);

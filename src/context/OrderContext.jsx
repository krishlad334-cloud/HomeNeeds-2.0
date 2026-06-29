import { createContext, useContext, useEffect, useState, useCallback } from "react";

const OrderCtx = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("hn:orders");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  
  useEffect(() => {
    localStorage.setItem("hn:orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = useCallback((order) => {
    setOrders((prev) => [...prev, order]);
  }, []);

  const value = { orders, addOrder };
  return <OrderCtx.Provider value={value}>{children}</OrderCtx.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderCtx);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
}

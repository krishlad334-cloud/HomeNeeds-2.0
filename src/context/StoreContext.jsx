import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "@/data/products";

const Ctx = createContext(null);

const safeGet = (k, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => safeGet("hn:cart", []));
  const [wishlist, setWishlist] = useState(() => safeGet("hn:wl", []));
  const [recentlyViewed, setRecent] = useState(() => safeGet("hn:rv", []));
  const [user, setUser] = useState(() => safeGet("hn:user", null));
  const [compareList, setCompareList] = useState(() => safeGet("hn:compare", []));
  const [priceAlerts, setPriceAlerts] = useState(() => safeGet("hn:alerts", []));

  useEffect(() => {
    localStorage.setItem("hn:cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("hn:wl", JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem("hn:rv", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);
  useEffect(() => {
    localStorage.setItem("hn:user", JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem("hn:compare", JSON.stringify(compareList));
  }, [compareList]);
  useEffect(() => {
    localStorage.setItem("hn:alerts", JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  const addToCart = useCallback((id, opts = {}) => {
    setCart((c) => {
      const found = c.find((l) => l.id === id && l.size === opts.size && l.color === opts.color);
      if (found) return c.map((l) => (l === found ? { ...l, qty: l.qty + (opts.qty ?? 1) } : l));
      return [...c, { id, qty: opts.qty ?? 1, size: opts.size, color: opts.color }];
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    setCart((c) =>
      qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const removeFromCart = useCallback((id) => setCart((c) => c.filter((l) => l.id !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((id) => {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  }, []);
  const inWishlist = useCallback((id) => wishlist.includes(id), [wishlist]);

  const toggleCompare = useCallback((id) => {
    setCompareList((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id);
      if (c.length >= 4) return [...c.slice(1), id]; // Max 4 items
      return [...c, id];
    });
  }, []);
  const inCompare = useCallback((id) => compareList.includes(id), [compareList]);
  const clearCompare = useCallback(() => setCompareList([]), []);

  const toggleAlert = useCallback((id, type) => {
    setPriceAlerts((alerts) => {
      const existing = alerts.find((a) => a.id === id);
      if (existing) {
        const types = existing.types.includes(type)
          ? existing.types.filter((t) => t !== type)
          : [...existing.types, type];
        
        if (types.length === 0) return alerts.filter((a) => a.id !== id);
        return alerts.map((a) => (a.id === id ? { ...a, types } : a));
      }
      return [...alerts, { id, types: [type] }];
    });
  }, []);
  const getAlerts = useCallback((id) => {
    return priceAlerts.find((a) => a.id === id)?.types || [];
  }, [priceAlerts]);

  const pushRecent = useCallback((id) => {
    setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 12));
  }, []);

  const login = useCallback((email) => setUser({ email, name: email.split("@")[0] }), []);
  const logout = useCallback(() => setUser(null), []);

  const cartLines = useMemo(
    () => cart.map((l) => ({ ...l, product: getProduct(l.id) })).filter((l) => l.product),
    [cart],
  );
  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);
  const cartSubtotal = cartLines.reduce((s, l) => s + l.qty * l.product.price, 0);

  const value = {
    cart,
    wishlist,
    user,
    recentlyViewed,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    inWishlist,
    pushRecent,
    cartCount,
    cartSubtotal,
    cartLines,
    login,
    logout,
    compareList,
    toggleCompare,
    inCompare,
    clearCompare,
    priceAlerts,
    toggleAlert,
    getAlerts,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}

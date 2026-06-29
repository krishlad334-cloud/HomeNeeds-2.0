import { createContext, useCallback, useContext, useEffect, useState } from "react";

const SubscriptionCtx = createContext(null);

const FREQUENCIES = [
  { id: "weekly", label: "Every Week", days: 7 },
  { id: "biweekly", label: "Every 2 Weeks", days: 14 },
  { id: "monthly", label: "Every Month", days: 30 },
];

const safeGet = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const nextDeliveryDate = (frequencyId) => {
  const freq = FREQUENCIES.find((f) => f.id === frequencyId) ?? FREQUENCIES[2];
  const d = new Date();
  d.setDate(d.getDate() + freq.days);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export function SubscriptionProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState(() => safeGet("hn:subs", []));

  useEffect(() => {
    localStorage.setItem("hn:subs", JSON.stringify(subscriptions));
  }, [subscriptions]);

  const subscribe = useCallback((product, frequency = "monthly") => {
    setSubscriptions((prev) => {
      const existing = prev.find((s) => s.productId === product.id);
      if (existing) return prev; // already subscribed
      const sub = {
        id: `SUB-${Date.now()}`,
        productId: product.id,
        productTitle: product.title,
        productBrand: product.brand,
        productImage: product.images[0],
        productPrice: product.price,
        discountedPrice: Math.round(product.price * 0.95), // 5% off
        frequency,
        status: "active",
        startDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        nextDelivery: nextDeliveryDate(frequency),
      };
      return [...prev, sub];
    });
  }, []);

  const unsubscribe = useCallback((productId) => {
    setSubscriptions((prev) => prev.filter((s) => s.productId !== productId));
  }, []);

  const pauseSubscription = useCallback((id) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "paused" } : s))
    );
  }, []);

  const resumeSubscription = useCallback((id) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "active", nextDelivery: nextDeliveryDate(s.frequency) }
          : s
      )
    );
  }, []);

  const updateFrequency = useCallback((id, frequency) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, frequency, nextDelivery: nextDeliveryDate(frequency) }
          : s
      )
    );
  }, []);

  const isSubscribed = useCallback(
    (productId) => subscriptions.some((s) => s.productId === productId && s.status !== "cancelled"),
    [subscriptions]
  );

  return (
    <SubscriptionCtx.Provider
      value={{
        subscriptions,
        subscribe,
        unsubscribe,
        pauseSubscription,
        resumeSubscription,
        updateFrequency,
        isSubscribed,
        FREQUENCIES,
      }}
    >
      {children}
    </SubscriptionCtx.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionCtx);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}

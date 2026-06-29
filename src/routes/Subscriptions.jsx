import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  RefreshCw,
  ShoppingBag,
  Pause,
  Play,
  Trash2,
  ArrowRight,
  Calendar,
  Package,
  ChevronDown,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";
import { inr } from "@/lib/format";

const STATUS_STYLES = {
  active: "bg-green-50 text-green-700 border border-green-200",
  paused: "bg-amber-50 text-amber-700 border border-amber-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const STATUS_ICONS = {
  active: <CheckCircle2 className="size-3.5" />,
  paused: <Clock className="size-3.5" />,
  cancelled: <Trash2 className="size-3.5" />,
};

export default function Subscriptions() {
  const { subscriptions, unsubscribe, pauseSubscription, resumeSubscription, updateFrequency, FREQUENCIES } =
    useSubscription();
  const [expandedId, setExpandedId] = useState(null);

  const active = subscriptions.filter((s) => s.status === "active");
  const paused = subscriptions.filter((s) => s.status === "paused");
  const all = subscriptions;

  if (all.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-sm"
        >
          <div className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-gradient-to-br from-brand/20 to-clay/20">
            <RefreshCw className="size-10 text-brand" />
          </div>
          <h1 className="font-display text-2xl font-semibold">No Active Subscriptions</h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Subscribe to your favourite products and save 5% on every delivery — automatically delivered on your schedule.
          </p>
          <NavLink
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground shadow-lift hover:opacity-90 transition"
          >
            Browse Products <ArrowRight className="size-4" />
          </NavLink>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
            {[
              { icon: "🛒", label: "Auto-delivered" },
              { icon: "💸", label: "5% off always" },
              { icon: "⏸️", label: "Pause anytime" },
            ].map((b) => (
              <div key={b.label} className="surface-card p-3">
                <p className="text-2xl">{b.icon}</p>
                <p className="mt-1">{b.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      {/* Header */}
      <header className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">My Subscriptions</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {active.length} active · {paused.length} paused · Auto-delivered on your schedule
          </p>
        </div>
        <NavLink
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition"
        >
          Add more <ArrowRight className="size-4" />
        </NavLink>
      </header>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Active", value: active.length, color: "text-green-600", bg: "bg-green-50" },
          { label: "Paused", value: paused.length, color: "text-amber-600", bg: "bg-amber-50" },
          {
            label: "Monthly Savings",
            value: inr(subscriptions.reduce((s, sub) => s + (sub.productPrice - sub.discountedPrice), 0)),
            color: "text-brand",
            bg: "bg-brand/5",
          },
          {
            label: "Next Delivery",
            value: active[0]?.nextDelivery ?? "—",
            color: "text-foreground",
            bg: "bg-muted/50",
          },
        ].map((stat) => (
          <div key={stat.label} className={`surface-card p-4 ${stat.bg}`}>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`mt-1 font-display text-xl font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {all.map((sub, i) => (
          <motion.article
            key={sub.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
          >
            {/* Main row */}
            <div className="flex items-center gap-4 p-5 sm:gap-6 sm:p-6">
              <NavLink to={`/products/${sub.productId}`} className="shrink-0 overflow-hidden rounded-xl border border-border bg-sand">
                <img src={sub.productImage} alt={sub.productTitle} className="h-20 w-20 object-cover" />
              </NavLink>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{sub.productBrand}</p>
                    <NavLink to={`/products/${sub.productId}`} className="line-clamp-2 text-sm font-medium hover:text-brand transition">
                      {sub.productTitle}
                    </NavLink>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[sub.status]}`}>
                    {STATUS_ICONS[sub.status]}
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <RefreshCw className="size-3" />
                    {FREQUENCIES.find((f) => f.id === sub.frequency)?.label ?? sub.frequency}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    Next: <strong className="text-foreground">{sub.nextDelivery}</strong>
                  </span>
                  <span>
                    <span className="line-through">{inr(sub.productPrice)}</span>
                    {" "}
                    <strong className="text-green-600">{inr(sub.discountedPrice)}</strong>
                    {" "}
                    <span className="text-green-600">(5% off)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded controls */}
            <div className="border-t border-border bg-muted/20">
              <button
                onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                className="flex w-full items-center justify-between px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Package className="size-3.5" />
                  Manage subscription
                </span>
                <ChevronDown className={`size-4 transition-transform ${expandedId === sub.id ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {expandedId === sub.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4">
                      {/* Frequency selector */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Delivery Frequency</p>
                        <div className="flex flex-wrap gap-2">
                          {FREQUENCIES.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => updateFrequency(sub.id, f.id)}
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                                sub.frequency === f.id
                                  ? "border-brand bg-brand text-brand-foreground"
                                  : "border-border hover:border-brand"
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        {sub.status === "active" ? (
                          <button
                            onClick={() => pauseSubscription(sub.id)}
                            className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 hover:bg-amber-100 transition cursor-pointer"
                          >
                            <Pause className="size-3.5" /> Pause
                          </button>
                        ) : (
                          <button
                            onClick={() => resumeSubscription(sub.id)}
                            className="flex items-center gap-1.5 rounded-full border border-green-300 bg-green-50 px-4 py-2 text-xs font-medium text-green-700 hover:bg-green-100 transition cursor-pointer"
                          >
                            <Play className="size-3.5" /> Resume
                          </button>
                        )}
                        <NavLink
                          to={`/products/${sub.productId}`}
                          className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-medium hover:bg-muted transition"
                        >
                          <ShoppingBag className="size-3.5" /> View Product
                        </NavLink>
                        <button
                          onClick={() => unsubscribe(sub.productId)}
                          className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition cursor-pointer"
                        >
                          <Trash2 className="size-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Subscribe & Save banner */}
      <section className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-brand to-clay p-8 text-brand-foreground">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="size-5" />
          <h2 className="font-display text-xl font-semibold">Subscribe & Save 5%</h2>
        </div>
        <p className="text-sm opacity-80 max-w-md">
          Add more products to your subscription. Get automatic recurring deliveries with 5% off on every order — pause or cancel anytime.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { label: "🛒 Monthly Groceries", to: "/category/grocery" },
            { label: "💧 Water & Beverages", to: "/category/grocery" },
            { label: "🐾 Pet Food", to: "/category/pet-supplies" },
            { label: "👶 Baby Products", to: "/category/baby" },
          ].map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30 transition backdrop-blur-sm"
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </section>
    </div>
  );
}

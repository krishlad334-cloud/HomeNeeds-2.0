import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { Package, ShoppingBag, ArrowRight, Clock, CheckCircle2, Truck, MapPin } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { inr } from "@/lib/format";

const STATUS_CONFIG = {
  Processing: {
    label: "Processing",
    icon: <Clock className="size-3.5" />,
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  Shipped: {
    label: "Shipped",
    icon: <Truck className="size-3.5" />,
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  Delivered: {
    label: "Delivered",
    icon: <CheckCircle2 className="size-3.5" />,
    className: "bg-green-50 text-green-700 border border-green-200",
  },
};

export default function YourOrders() {
  const { orders } = useOrder();

  // Show newest orders first
  const sortedOrders = [...orders].reverse();

  if (!sortedOrders || sortedOrders.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-sm"
        >
          <div className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-sand">
            <ShoppingBag className="size-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-foreground">No Orders Yet</h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Looks like you haven't placed any orders. Browse our collection and find something you love.
          </p>
          <NavLink
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground shadow-lift hover:opacity-90 transition"
          >
            Start Shopping <ArrowRight className="size-4" />
          </NavLink>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      {/* Page Header */}
      <header className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Your Orders</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {sortedOrders.length} order{sortedOrders.length !== 1 ? "s" : ""} · Recent orders shown first
          </p>
        </div>
        <NavLink
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition"
        >
          Continue Shopping <ArrowRight className="size-4" />
        </NavLink>
      </header>

      {/* Orders List */}
      <div className="space-y-6">
        {sortedOrders.map((order, i) => {
          const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.Processing;
          return (
            <motion.article
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              {/* Order Meta Header */}
              <div className="grid grid-cols-2 gap-4 border-b border-border bg-muted/40 px-5 py-4 sm:grid-cols-4 sm:px-6">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Order Placed</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{order.date}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Total</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{inr(order.total)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Order ID</p>
                  <p className="mt-1 font-mono text-sm text-foreground">{order.id}</p>
                </div>
                <div className="flex items-center sm:justify-end">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusCfg.className}`}>
                    {statusCfg.icon}
                    {statusCfg.label}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <ul className="divide-y divide-border">
                {order.items.map((item, idx) => (
                  <li key={`${order.id}-${idx}`} className="flex items-center gap-4 px-5 py-4 sm:gap-6 sm:px-6">
                    <NavLink
                      to={`/products/${item.id}`}
                      className="flex-shrink-0 overflow-hidden rounded-xl border border-border bg-sand"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 object-cover transition hover:scale-105 duration-300"
                        onError={(e) => {
                          e.target.src = "";
                          e.target.style.display = "none";
                        }}
                      />
                    </NavLink>

                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <NavLink
                        to={`/products/${item.id}`}
                        className="truncate text-sm font-medium text-foreground hover:text-brand transition"
                      >
                        {item.name}
                      </NavLink>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-semibold text-foreground">{inr(item.price)}</span>
                        <span className="text-xs text-muted-foreground">× {item.quantity}</span>
                      </div>
                    </div>

                    {/* Item total on desktop */}
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-semibold text-foreground">{inr(item.price * item.quantity)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Order Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3.5 sm:px-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="size-4" />
                  <span className="text-xs">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                    Total: <span className="font-semibold text-foreground">{inr(order.total)}</span>
                  </span>
                </div>
              <div className="flex gap-2">
                  <NavLink
                    to={`/orders/${order.id}/track`}
                    className="flex items-center gap-1.5 rounded-lg border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand/10 transition"
                  >
                    <MapPin className="size-3.5" /> Track Order
                  </NavLink>
                  <NavLink
                    to={`/products/${order.items[0]?.id}`}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition"
                  >
                    Buy Again
                  </NavLink>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
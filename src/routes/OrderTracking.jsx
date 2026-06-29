import { useState, useEffect, useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Phone,
  CheckCircle2,
  Package,
  Truck,
  Home,
  Clock,
  Bell,
  BellRing,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Star,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { inr } from "@/lib/format";

// ─── Mock delivery partners ───────────────────────────────────────────────────
const PARTNERS = [
  { name: "Ravi Kumar", phone: "+91 98765 43210", vehicle: "KA-01-MX-2345", rating: 4.8, avatar: "RK" },
  { name: "Suresh M.", phone: "+91 87654 32109", vehicle: "MH-12-AB-7890", rating: 4.9, avatar: "SM" },
  { name: "Priya D.", phone: "+91 76543 21098", vehicle: "DL-05-CD-1234", rating: 4.7, avatar: "PD" },
];

// ─── Order stages ─────────────────────────────────────────────────────────────
const STAGES = [
  { id: "placed", label: "Order Placed", icon: CheckCircle2, detail: "Your order is confirmed" },
  { id: "packed", label: "Packed", icon: Package, detail: "Items packed & ready" },
  { id: "out", label: "Out for Delivery", icon: Truck, detail: "On the way to you" },
  { id: "delivered", label: "Delivered", icon: Home, detail: "Package received" },
];

// ─── Animated SVG Map ─────────────────────────────────────────────────────────
function DeliveryMap({ progress }) {
  // Path from warehouse (left) to home (right)
  const pathData = "M 60 140 C 140 80, 260 80, 340 140 C 380 165, 400 155, 440 140";

  // Interpolate position along path
  const t = Math.min(Math.max(progress, 0), 1);
  // Cubic bezier approximation
  const cx = (1 - t) ** 3 * 60 + 3 * (1 - t) ** 2 * t * 140 + 3 * (1 - t) * t ** 2 * 260 + t ** 3 * 340;
  const cy = (1 - t) ** 3 * 140 + 3 * (1 - t) ** 2 * t * 80 + 3 * (1 - t) * t ** 2 * 80 + t ** 3 * 140;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <svg viewBox="0 0 500 230" className="w-full" aria-label="Delivery map">
        {/* Background roads */}
        <rect width="500" height="230" fill="transparent" />

        {/* Grid lines (streets) */}
        {[40, 80, 120, 160, 200].map((y) => (
          <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {[60, 120, 180, 240, 300, 360, 420].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="230" stroke="#e2e8f0" strokeWidth="1" />
        ))}

        {/* Route dotted line */}
        <path d={pathData} fill="none" stroke="#e2e8f0" strokeWidth="4" strokeDasharray="8 4" />

        {/* Route progress line */}
        <path
          d={pathData}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="400"
          strokeDashoffset={400 - 400 * t}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />

        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1F3A2E" />
            <stop offset="100%" stopColor="#C2622D" />
          </linearGradient>
        </defs>

        {/* Warehouse icon */}
        <g transform="translate(40, 120)">
          <circle cx="0" cy="0" r="18" fill="#1F3A2E" />
          <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14">🏭</text>
        </g>

        {/* Delivery vehicle (animated) */}
        <motion.g
          animate={{ x: cx - 250, y: cy - 115 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <circle cx="250" cy="115" r="16" fill="#C2622D" className="drop-shadow-md" />
          <text x="250" y="120" textAnchor="middle" fill="white" fontSize="13">🛵</text>
        </motion.g>

        {/* Home icon */}
        <g transform="translate(450, 120)">
          <circle cx="0" cy="0" r="18" fill={t >= 0.95 ? "#22c55e" : "#94a3b8"} style={{ transition: "fill 0.5s" }} />
          <text x="0" y="5" textAnchor="middle" fill="white" fontSize="14">🏠</text>
        </g>

        {/* Location labels */}
        <text x="40" y="155" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600">WAREHOUSE</text>
        <text x="450" y="155" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600">YOUR HOME</text>
      </svg>

      {/* Map overlay info */}
      <div className="absolute top-3 right-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 px-3 py-2 text-xs">
        <div className="flex items-center gap-1.5 text-brand font-medium">
          <div className="size-2 rounded-full bg-green-500 animate-pulse" />
          Live tracking
        </div>
      </div>
    </div>
  );
}

// ─── OTP Widget ───────────────────────────────────────────────────────────────
function OTPWidget({ orderId }) {
  const [showOTP, setShowOTP] = useState(false);
  const [copied, setCopied] = useState(false);
  const otp = (parseInt(orderId.replace("ORD-", "")) % 9000 + 1000).toString().slice(0, 4);

  const handleCopy = () => {
    navigator.clipboard?.writeText(otp).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <ShieldCheck className="size-4 text-brand" />
          OTP Delivery Verification
        </h3>
        <span className="rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[10px] text-green-700 font-medium">Secure</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Share this OTP with your delivery partner to confirm receipt of your package.
      </p>
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {(showOTP ? otp : "****").split("").map((char, i) => (
            <div key={i} className="flex h-12 w-10 items-center justify-center rounded-lg border-2 border-brand/30 bg-brand/5 font-mono text-xl font-bold text-brand">
              {char}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setShowOTP(!showOTP)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted transition cursor-pointer"
          >
            {showOTP ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {showOTP ? "Hide" : "Show"} OTP
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-brand/30 bg-brand/5 px-3 py-1.5 text-xs text-brand hover:bg-brand/10 transition cursor-pointer"
          >
            <Copy className="size-3.5" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrderTracking() {
  const { id } = useParams();
  const { orders } = useOrder();
  const order = orders.find((o) => o.id === id) ?? null;

  const [mapProgress, setMapProgress] = useState(0.1);
  const [etaSeconds, setEtaSeconds] = useState(18 * 60 + 34);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [currentStage, setCurrentStage] = useState(1); // 0=placed,1=packed,2=out,3=delivered
  const intervalRef = useRef(null);

  // Determine partner from order id seed
  const partner = order
    ? PARTNERS[parseInt(order.id.replace("ORD-", "")) % PARTNERS.length]
    : PARTNERS[0];

  // Animate map progress based on stage
  const stageProgress = [0.05, 0.15, 0.65, 1.0];
  useEffect(() => {
    setMapProgress(stageProgress[currentStage] ?? 0.15);
  }, [currentStage]);

  // ETA countdown
  useEffect(() => {
    if (currentStage >= 3) return;
    intervalRef.current = setInterval(() => {
      setEtaSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [currentStage]);

  // Simulate stage progression (demo mode)
  useEffect(() => {
    if (!order) return;
    if (order.status === "Delivered") {
      setCurrentStage(3);
      setMapProgress(1.0);
    } else if (order.status === "Shipped") {
      setCurrentStage(2);
    } else {
      setCurrentStage(1);
    }
  }, [order]);

  const formatETA = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  // Demo: advance stage manually
  const advanceStage = () => {
    setCurrentStage((s) => Math.min(s + 1, 3));
    if (currentStage >= 2) setEtaSeconds(0);
  };

  if (!order) {
    return (
      <div className="container-page py-20 text-center">
        <Package className="mx-auto size-12 text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find order {id}</p>
        <NavLink to="/account/orders" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground">
          <ArrowLeft className="size-4" /> Back to Orders
        </NavLink>
      </div>
    );
  }

  return (
    <div className="container-page py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
        <NavLink to="/" className="hover:text-foreground">Home</NavLink>
        <ChevronRight className="size-3" />
        <NavLink to="/account/orders" className="hover:text-foreground">Your Orders</NavLink>
        <ChevronRight className="size-3" />
        <span className="text-foreground font-medium">{order.id}</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold md:text-3xl">Live Order Tracking</h1>
          <p className="mt-1 text-sm text-muted-foreground">Order {order.id} · Placed on {order.date}</p>
        </div>
        {/* Push notifications toggle */}
        <button
          onClick={() => setNotifEnabled(!notifEnabled)}
          className={`hidden sm:flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition cursor-pointer ${
            notifEnabled
              ? "border-brand bg-brand/5 text-brand"
              : "border-border hover:bg-muted"
          }`}
        >
          {notifEnabled ? <BellRing className="size-4" /> : <Bell className="size-4" />}
          {notifEnabled ? "Notifications On" : "Enable Notifications"}
        </button>
      </div>

      {/* Push notification banner */}
      <AnimatePresence>
        {notifEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 flex items-center gap-3 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm"
          >
            <BellRing className="size-5 text-brand animate-pulse" />
            <span className="text-brand font-medium">Push notifications enabled!</span>
            <span className="text-muted-foreground">You'll be notified when your delivery status changes.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Live Map */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <MapPin className="size-5 text-clay" /> Live Map
              </h2>
              {currentStage < 3 && (
                <button
                  onClick={advanceStage}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition cursor-pointer"
                  title="Demo: advance stage"
                >
                  <RefreshCw className="size-3" /> Simulate update
                </button>
              )}
            </div>
            <DeliveryMap progress={mapProgress} />
          </section>

          {/* Progress stages */}
          <section className="surface-card p-5">
            <h2 className="font-display text-base font-semibold mb-5">Order Progress</h2>
            <div className="relative">
              {/* Track line */}
              <div className="absolute left-[19px] top-0 w-0.5 h-full bg-border" />
              <div
                className="absolute left-[19px] top-0 w-0.5 bg-brand transition-all duration-700"
                style={{ height: `${(currentStage / (STAGES.length - 1)) * 100}%` }}
              />
              <div className="space-y-6">
                {STAGES.map((stage, i) => {
                  const Icon = stage.icon;
                  const done = i <= currentStage;
                  const active = i === currentStage;
                  return (
                    <div key={stage.id} className="flex items-start gap-4 relative">
                      <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                        done
                          ? "border-brand bg-brand text-brand-foreground"
                          : "border-border bg-background text-muted-foreground"
                      }`}>
                        <Icon className="size-4" />
                        {active && <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-green-400 border-2 border-background animate-pulse" />}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <p className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>
                          {stage.label}
                          {active && <span className="ml-2 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-medium">Current</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">{stage.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* OTP Widget */}
          {currentStage === 2 && <OTPWidget orderId={order.id} />}

          {/* Delivered message */}
          {currentStage === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="surface-card p-6 text-center bg-green-50 border-green-200"
            >
              <CheckCircle2 className="mx-auto size-12 text-green-600 mb-3" />
              <h3 className="font-display text-xl font-semibold text-green-800">Delivered Successfully!</h3>
              <p className="text-sm text-green-700 mt-1">Your package has been delivered. Enjoy your purchase!</p>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* ETA Card */}
          {currentStage < 3 && (
            <div className="surface-card p-5 bg-gradient-to-br from-brand/5 to-clay/5 border-brand/20">
              <p className="text-xs text-muted-foreground mb-1">Estimated arrival in</p>
              <div className="flex items-end gap-2">
                <span className="font-display text-4xl font-bold text-brand tabular-nums">
                  {formatETA(etaSeconds)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(Date.now() + etaSeconds * 1000).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" "}expected delivery
              </p>
            </div>
          )}

          {/* Delivery Partner Card */}
          <div className="surface-card p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Truck className="size-4 text-brand" />
              Delivery Partner
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-clay text-white font-bold text-lg">
                {partner.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{partner.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="size-3 fill-warning text-warning" />
                  <span className="text-xs text-muted-foreground">{partner.rating} rating</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{partner.vehicle}</p>
              </div>
            </div>
            <a
              href={`tel:${partner.phone}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-full border border-border bg-background py-2.5 text-sm font-medium hover:bg-muted transition"
            >
              <Phone className="size-4" />
              {partner.phone}
            </a>
          </div>

          {/* Order Summary */}
          <div className="surface-card p-5">
            <h3 className="text-sm font-semibold mb-4">Order Items</h3>
            <ul className="space-y-3">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover bg-sand shrink-0" onError={(e) => { e.target.style.display = "none"; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold">{inr(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-border pt-3 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>{inr(order.total)}</span>
            </div>
          </div>

          {/* Delivery address */}
          {order.address && (
            <div className="surface-card p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Home className="size-4 text-brand" />
                Delivery Address
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {order.address.fullName}<br />
                {order.address.addressLine1}<br />
                {order.address.city}, {order.address.state} — {order.address.postalCode}<br />
                {order.address.country}
              </p>
              <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="size-3" /> {order.address.phone}
              </p>
            </div>
          )}

          {/* Event timeline */}
          <div className="surface-card p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Clock className="size-4 text-brand" />
              Tracking Timeline
            </h3>
            <div className="space-y-4">
              {STAGES.slice(0, currentStage + 1).reverse().map((stage, i) => {
                const Icon = stage.icon;
                const mins = (currentStage - (STAGES.indexOf(stage))) * 47;
                const t = new Date(Date.now() - mins * 60000);
                return (
                  <div key={stage.id} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${i === 0 ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{stage.label}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        {" · "}
                        {t.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

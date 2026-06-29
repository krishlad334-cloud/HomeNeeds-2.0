import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  CreditCard,
  Smartphone,
  Wallet,
  Building2,
  HandCoins,
  Banknote,
  Truck,
  Zap,
  Flame,
  Calendar,
  Store,
  MapPin,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useOrder } from "@/context/OrderContext";
import { inr } from "@/lib/format";
import { z } from "zod";

const steps = ["Address", "Delivery", "Payment", "Review"];

// ─── Schemas ──────────────────────────────────────────────────────────────────
const addressSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  addressLine1: z.string().min(5, "Address required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit postal code"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
});

// ─── Delivery Options ─────────────────────────────────────────────────────────
const DELIVERY_OPTIONS = [
  {
    id: "standard",
    icon: Truck,
    label: "Standard Delivery",
    desc: "3–5 business days",
    price: 0,
    badge: "Free",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    id: "express",
    icon: Zap,
    label: "Express Delivery",
    desc: "1–2 business days",
    price: 99,
    badge: "Fast",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "sameday",
    icon: Flame,
    label: "Same-Day Delivery",
    desc: "Today by 9 PM (order before 2 PM)",
    price: 199,
    badge: "Fastest",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    id: "scheduled",
    icon: Calendar,
    label: "Scheduled Delivery",
    desc: "Pick your preferred date & time",
    price: 0,
    badge: "Free",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  {
    id: "pickup",
    icon: Store,
    label: "Store Pickup",
    desc: "Ready in 2 hours · Free",
    price: 0,
    badge: "Free",
    badgeColor: "bg-teal-100 text-teal-700",
  },
];

const TIME_SLOTS = [
  "9:00 AM – 12:00 PM",
  "12:00 PM – 3:00 PM",
  "3:00 PM – 6:00 PM",
  "6:00 PM – 9:00 PM",
];

// ─── Payment Methods ──────────────────────────────────────────────────────────
const PAY_TABS = [
  { id: "card", icon: CreditCard, label: "Card" },
  { id: "emi", icon: HandCoins, label: "EMI" },
  { id: "bnpl", icon: Clock, label: "Pay Later" },
  { id: "upi", icon: Smartphone, label: "UPI" },
  { id: "wallet", icon: Wallet, label: "Wallet" },
  { id: "netbank", icon: Building2, label: "Net Banking" },
  { id: "cod", icon: Banknote, label: "COD" },
];

const EMI_PLANS = [
  { months: 3, rate: 0 },
  { months: 6, rate: 12 },
  { months: 9, rate: 14 },
  { months: 12, rate: 15 },
];

const UPI_APPS = [
  { name: "GPay", emoji: "🔵" },
  { name: "PhonePe", emoji: "🟣" },
  { name: "Paytm", emoji: "🔷" },
  { name: "BHIM", emoji: "🟠" },
];

const WALLETS = [
  { name: "Paytm Wallet", emoji: "🔷" },
  { name: "Amazon Pay", emoji: "🟡" },
  { name: "MobiKwik", emoji: "🟢" },
  { name: "Freecharge", emoji: "🟠" },
];

const BANKS = [
  "HDFC Bank", "SBI", "ICICI Bank", "Axis Bank",
  "Kotak Mahindra", "Bank of Baroda", "Punjab National", "IndusInd Bank",
];

// ─── Helper Components ────────────────────────────────────────────────────────
function Field({ label, wide, value, onChange, error, type = "text", placeholder = "" }) {
  return (
    <label className={`block ${wide ? "col-span-2" : ""}`}>
      <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand transition-colors ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
    </label>
  );
}

function Row({ label, children, highlight }) {
  return (
    <div className={`flex justify-between ${highlight ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={highlight ? "" : "text-foreground"}>{children}</span>
    </div>
  );
}

// ─── Main Checkout ────────────────────────────────────────────────────────────
export default function Checkout() {
  const { cartLines, cartSubtotal, clearCart } = useStore();
  const { addOrder } = useOrder();
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Address
    fullName: "", phone: "", addressLine1: "", city: "",
    postalCode: "", state: "", country: "India",
    // Delivery
    delivery: "standard",
    scheduledDate: "",
    scheduledSlot: TIME_SLOTS[0],
    // Payment
    pay: "card",
    cardNumber: "", expiry: "", cvv: "",
    emiMonths: 3,
    upiId: "",
    upiApp: "",
    wallet: "",
    bank: "",
  });

  const nav = useNavigate();

  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === formData.delivery) ?? DELIVERY_OPTIONS[0];
  const deliveryFee = deliveryOption.price;
  const tax = Math.round(cartSubtotal * 0.05);
  const total = cartSubtotal + deliveryFee + tax;

  const emiPlan = EMI_PLANS.find((e) => e.months === formData.emiMonths) ?? EMI_PLANS[0];
  const emiInterest = emiPlan.rate > 0 ? Math.round(total * (emiPlan.rate / 100)) : 0;
  const emiTotal = total + emiInterest;
  const emiMonthly = Math.round(emiTotal / emiPlan.months);

  const handle = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((e) => { const c = { ...e }; delete c[field]; return c; });
  };

  const validate = () => {
    if (step === 0) {
      const r = addressSchema.safeParse(formData);
      if (!r.success) {
        const errs = {};
        r.error.errors.forEach((e) => { if (e.path[0]) errs[e.path[0]] = e.message; });
        setErrors(errs);
        return false;
      }
    } else if (step === 1) {
      if (formData.delivery === "scheduled" && !formData.scheduledDate) {
        setErrors({ scheduledDate: "Please select a delivery date" });
        return false;
      }
    } else if (step === 2) {
      if (formData.pay === "card") {
        const errs = {};
        if (!/^\d{16}$/.test(formData.cardNumber)) errs.cardNumber = "Enter a valid 16-digit number";
        if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) errs.expiry = "Use MM/YY format";
        if (!/^\d{3}$/.test(formData.cvv)) errs.cvv = "Enter 3-digit CVV";
        if (Object.keys(errs).length) { setErrors(errs); return false; }
      }
      if (formData.pay === "upi" && !formData.upiId && !formData.upiApp) {
        setErrors({ upiId: "Enter UPI ID or choose an app" });
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Place order
      const orderItems = cartLines.map((l) => ({
        id: l.id,
        name: l.product.title,
        image: l.product.images?.[0] ?? "",
        category: l.product.category ?? "",
        price: l.product.price,
        quantity: l.qty,
        size: l.size,
        color: l.color,
      }));

      const orderId = `ORD-${Date.now()}`;
      const order = {
        id: orderId,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Processing",
        items: orderItems,
        total,
        delivery: {
          type: formData.delivery,
          fee: deliveryFee,
          scheduledDate: formData.scheduledDate,
          scheduledSlot: formData.scheduledSlot,
        },
        address: {
          fullName: formData.fullName, phone: formData.phone,
          addressLine1: formData.addressLine1, city: formData.city,
          postalCode: formData.postalCode, state: formData.state,
          country: formData.country,
        },
        payment: formData.pay,
      };

      addOrder(order);
      clearCart();
      setPlacedOrderId(orderId);
      setPlaced(true);
    }
  };

  if (cartLines.length === 0 && !placed) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <NavLink to="/" className="mt-4 inline-block text-brand hover:underline">Start shopping</NavLink>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="container-page py-20 text-center max-w-lg">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-success/10 text-success">
            <Check className="size-10" />
          </div>
        </motion.div>
        <h1 className="mt-5 font-display text-3xl font-semibold">Order placed! 🎉</h1>
        <p className="mt-2 text-muted-foreground">
          {deliveryOption.label} · {deliveryOption.desc}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {placedOrderId && (
            <NavLink
              to={`/orders/${placedOrderId}/track`}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground shadow-lift hover:opacity-95 transition"
            >
              <MapPin className="size-4" /> Track Your Order
            </NavLink>
          )}
          <NavLink
            to="/account/orders"
            className="inline-flex rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-muted transition"
          >
            View Orders
          </NavLink>
          <NavLink
            to="/"
            className="inline-flex rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-muted transition"
          >
            Continue Shopping
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-3xl font-semibold">Checkout</h1>

      {/* Step indicators */}
      <ol className="mt-6 flex items-center gap-2 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2 shrink-0">
            <span className={`grid size-7 place-items-center rounded-full text-xs font-medium transition-colors ${
              i < step ? "bg-success text-white" : i === step ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span className={`text-sm ${i === step ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border shrink-0" />}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="surface-card p-6">

          {/* ── STEP 0: Address ──────────────────────────────────────────── */}
          {step === 0 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <MapPin className="size-5 text-brand" /> Shipping Address
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full name" value={formData.fullName} onChange={(v) => handle("fullName", v)} error={errors.fullName} />
                <Field label="Phone" value={formData.phone} onChange={(v) => handle("phone", v)} error={errors.phone} type="tel" />
                <Field label="Address line 1" wide value={formData.addressLine1} onChange={(v) => handle("addressLine1", v)} error={errors.addressLine1} />
                <Field label="City" value={formData.city} onChange={(v) => handle("city", v)} error={errors.city} />
                <Field label="Postal code" value={formData.postalCode} onChange={(v) => handle("postalCode", v)} error={errors.postalCode} />
                <Field label="State" value={formData.state} onChange={(v) => handle("state", v)} error={errors.state} />
                <Field label="Country" value={formData.country} onChange={(v) => handle("country", v)} error={errors.country} />
              </div>
              <label className="inline-flex items-center gap-2 text-sm mt-2 cursor-pointer">
                <input type="checkbox" defaultChecked /> Billing address is the same
              </label>
            </motion.div>
          )}

          {/* ── STEP 1: Delivery ─────────────────────────────────────────── */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <Truck className="size-5 text-brand" /> Delivery Options
              </h2>
              <div className="space-y-3">
                {DELIVERY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = formData.delivery === opt.id;
                  return (
                    <label key={opt.id} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                      selected ? "border-brand bg-brand/5 shadow-soft" : "border-border hover:border-brand/40"
                    }`}>
                      <input type="radio" name="delivery" checked={selected} onChange={() => handle("delivery", opt.id)} className="sr-only" />
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${selected ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground"}`}>
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${opt.badgeColor}`}>{opt.badge}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">
                        {opt.price === 0 ? <span className="text-green-600">Free</span> : inr(opt.price)}
                      </p>
                    </label>
                  );
                })}
              </div>

              {/* Scheduled delivery extras */}
              <AnimatePresence>
                {formData.delivery === "scheduled" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Field
                        label="Delivery Date"
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(v) => handle("scheduledDate", v)}
                        error={errors.scheduledDate}
                      />
                      <div>
                        <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Time Slot</span>
                        <div className="relative">
                          <select
                            value={formData.scheduledSlot}
                            onChange={(e) => handle("scheduledSlot", e.target.value)}
                            className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
                          >
                            {TIME_SLOTS.map((s) => <option key={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Store pickup extras */}
              {formData.delivery === "pickup" && (
                <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm">
                  <p className="font-semibold text-teal-800 flex items-center gap-2"><Store className="size-4" /> HomeNeeds Store — Bengaluru</p>
                  <p className="mt-1 text-teal-700">HSR Layout, 5th Sector, Bengaluru — 560102</p>
                  <p className="mt-0.5 text-teal-600 text-xs">Ready for pickup in 2 hours after order confirmation · Open 9 AM – 9 PM</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 2: Payment ──────────────────────────────────────────── */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <h2 className="font-display text-lg font-semibold">Payment Method</h2>

              {/* Tab bar */}
              <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1">
                {PAY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handle("pay", tab.id)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                        formData.pay === tab.id
                          ? "bg-background text-foreground shadow-soft"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {/* Card */}
                {formData.pay === "card" && (
                  <motion.div key="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Card Number" wide value={formData.cardNumber} onChange={(v) => handle("cardNumber", v.replace(/\D/g, "").slice(0, 16))} error={errors.cardNumber} placeholder="1234 5678 9012 3456" />
                      <Field label="Expiry (MM/YY)" value={formData.expiry} onChange={(v) => handle("expiry", v)} error={errors.expiry} placeholder="MM/YY" />
                      <Field label="CVV" value={formData.cvv} onChange={(v) => handle("cvv", v.replace(/\D/g, "").slice(0, 3))} error={errors.cvv} placeholder="•••" type="password" />
                    </div>
                    <div className="flex gap-2 text-xs text-muted-foreground items-center">
                      <span className="rounded border border-border px-2 py-1 font-bold">VISA</span>
                      <span className="rounded border border-border px-2 py-1 font-bold">MC</span>
                      <span className="rounded border border-border px-2 py-1 font-bold text-orange-600">RuPay</span>
                      <span className="ml-2">All major cards accepted</span>
                    </div>
                  </motion.div>
                )}

                {/* EMI */}
                {formData.pay === "emi" && (
                  <motion.div key="emi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                    <p className="text-sm text-muted-foreground">Split your payment into easy monthly installments.</p>
                    <div className="grid grid-cols-2 gap-3">
                      {EMI_PLANS.map((plan) => (
                        <label key={plan.months} className={`cursor-pointer rounded-xl border p-4 transition-all ${formData.emiMonths === plan.months ? "border-brand bg-brand/5" : "border-border hover:border-brand/40"}`}>
                          <input type="radio" className="sr-only" checked={formData.emiMonths === plan.months} onChange={() => handle("emiMonths", plan.months)} />
                          <p className="font-display text-lg font-bold">{plan.months} months</p>
                          <p className="text-sm font-semibold text-brand mt-1">
                            {inr(Math.round((total + Math.round(total * plan.rate / 100)) / plan.months))}/mo
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {plan.rate === 0 ? "0% interest" : `${plan.rate}% p.a.`}
                          </p>
                        </label>
                      ))}
                    </div>
                    <div className="rounded-xl bg-muted/50 p-4 text-sm space-y-1">
                      <div className="flex justify-between"><span className="text-muted-foreground">Order total</span><span>{inr(total)}</span></div>
                      {emiInterest > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Interest ({emiPlan.rate}% p.a.)</span><span>{inr(emiInterest)}</span></div>}
                      <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1"><span>Per month</span><span className="text-brand">{inr(emiMonthly)}</span></div>
                    </div>
                  </motion.div>
                )}

                {/* BNPL */}
                {formData.pay === "bnpl" && (
                  <motion.div key="bnpl" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/5 to-clay/5 p-6 text-center">
                      <p className="text-4xl font-bold text-brand font-display">{inr(total)}</p>
                      <p className="mt-2 text-sm text-muted-foreground">Pay within <strong className="text-foreground">30 days</strong> — no interest</p>
                      <p className="mt-1 text-xs text-muted-foreground">Available via Simpl, LazyPay & ZestMoney</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {["Simpl", "LazyPay", "ZestMoney"].map((app) => (
                        <div key={app} className="rounded-xl border border-border p-3 text-center text-sm font-medium hover:border-brand cursor-pointer transition">{app}</div>
                      ))}
                    </div>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {["No interest for 30 days", "Instant approval", "0% processing fee", "Auto-pay on due date"].map((f) => (
                        <li key={f} className="flex items-center gap-2"><Check className="size-3.5 text-success" />{f}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* UPI */}
                {formData.pay === "upi" && (
                  <motion.div key="upi" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      {UPI_APPS.map((app) => (
                        <button key={app.name} onClick={() => handle("upiApp", app.name)}
                          className={`rounded-xl border p-3 text-center transition cursor-pointer ${formData.upiApp === app.name ? "border-brand bg-brand/5" : "border-border hover:border-brand/40"}`}>
                          <p className="text-2xl">{app.emoji}</p>
                          <p className="text-[11px] font-medium mt-1">{app.name}</p>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-xs text-muted-foreground">or enter UPI ID</span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <Field label="UPI ID" value={formData.upiId} onChange={(v) => handle("upiId", v)} error={errors.upiId} placeholder="yourname@upi" />
                  </motion.div>
                )}

                {/* Wallet */}
                {formData.pay === "wallet" && (
                  <motion.div key="wallet" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-3">
                    {WALLETS.map((w) => (
                      <label key={w.name} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${formData.wallet === w.name ? "border-brand bg-brand/5" : "border-border hover:border-brand/40"}`}>
                        <input type="radio" className="sr-only" checked={formData.wallet === w.name} onChange={() => handle("wallet", w.name)} />
                        <span className="text-2xl">{w.emoji}</span>
                        <span className="text-sm font-medium">{w.name}</span>
                      </label>
                    ))}
                  </motion.div>
                )}

                {/* Net Banking */}
                {formData.pay === "netbank" && (
                  <motion.div key="netbank" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                    <p className="text-sm text-muted-foreground">Choose your bank</p>
                    <div className="grid grid-cols-2 gap-2">
                      {BANKS.map((b) => (
                        <label key={b} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition ${formData.bank === b ? "border-brand bg-brand/5" : "border-border hover:border-brand/40"}`}>
                          <input type="radio" className="sr-only" checked={formData.bank === b} onChange={() => handle("bank", b)} />
                          <Building2 className="size-4 text-muted-foreground" />
                          {b}
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* COD */}
                {formData.pay === "cod" && (
                  <motion.div key="cod" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border border-border p-6 text-center">
                    <Banknote className="mx-auto size-10 text-muted-foreground mb-3" />
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground mt-1">Pay {inr(total)} in cash when your order arrives.</p>
                    <p className="text-xs text-muted-foreground mt-2">Please keep exact change ready. COD fee: ₹29</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── STEP 3: Review ───────────────────────────────────────────── */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <h2 className="font-display text-lg font-semibold">Review Your Order</h2>

              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div className="surface-card p-4 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Ship To</p>
                  <p className="font-medium">{formData.fullName}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{formData.addressLine1}, {formData.city}, {formData.state} {formData.postalCode}</p>
                </div>
                <div className="surface-card p-4 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Delivery</p>
                  <p className="font-medium">{deliveryOption.label}</p>
                  <p className="text-muted-foreground text-xs">{deliveryOption.desc}</p>
                  {formData.scheduledDate && <p className="text-xs text-brand">{formData.scheduledDate} · {formData.scheduledSlot}</p>}
                </div>
                <div className="surface-card p-4 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Payment</p>
                  <p className="font-medium capitalize">{formData.pay === "emi" ? `EMI — ${formData.emiMonths} months` : formData.pay}</p>
                  {formData.pay === "card" && formData.cardNumber && <p className="text-xs text-muted-foreground">•••• {formData.cardNumber.slice(-4)}</p>}
                  {formData.pay === "emi" && <p className="text-xs text-brand">{inr(emiMonthly)}/month</p>}
                </div>
              </div>

              <ul className="divide-y divide-border">
                {cartLines.map((l) => (
                  <li key={l.id} className="flex items-center gap-3 py-3">
                    <img src={l.product.images[0]} alt="" className="size-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{l.product.title}</p>
                      <p className="text-xs text-muted-foreground">Qty {l.qty}</p>
                    </div>
                    <p className="text-sm font-semibold">{inr(l.product.price * l.qty)}</p>
                  </li>
                ))} 
              </ul>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between">
            <button type="button" onClick={() => (step === 0 ? nav("/cart") : setStep(step - 1))}
              className="rounded-full border border-border cursor-pointer px-5 py-2.5 text-sm hover:bg-muted transition">
              Back
            </button>
            <button type="button" onClick={handleNext}
              className="rounded-full bg-brand px-6 py-2.5 cursor-pointer text-sm font-medium text-brand-foreground shadow-lift hover:opacity-95 transition">
              {step < steps.length - 1 ? "Continue" : "Place Order"}
            </button>
          </div>
        </div>

        {/* ORDER SUMMARY SIDEBAR */}
        <aside className="surface-card h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-base font-semibold">Order Summary</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label="Subtotal">{inr(cartSubtotal)}</Row>
            <Row label={`Delivery (${deliveryOption.label})`}>
              {deliveryFee === 0 ? <span className="text-green-600">Free</span> : inr(deliveryFee)}
            </Row>
            <Row label="Tax (5%)">{inr(tax)}</Row>
            {formData.pay === "emi" && <Row label={`EMI interest (${emiPlan.rate}%)`}>{emiInterest > 0 ? inr(emiInterest) : "₹0"}</Row>}
            <div className="border-t border-border pt-3 flex justify-between font-display text-base font-semibold">
              <span>Total</span>
              <span>{inr(formData.pay === "emi" ? emiTotal : total)}</span>
            </div>
            {formData.pay === "emi" && (
              <p className="text-xs text-brand font-medium">{inr(emiMonthly)}/month × {emiPlan.months} months</p>
            )}
            {formData.pay === "bnpl" && (
              <p className="text-xs text-brand font-medium">Pay {inr(total)} within 30 days</p>
            )}
            {formData.pay === "cod" && (
              <Row label="COD fee">₹29</Row>
            )}
          </dl>

          {/* Cart items mini preview */}
          <ul className="mt-5 space-y-3 border-t border-border pt-4">
            {cartLines.map((l) => (
              <li key={l.id} className="flex items-center gap-3">
                <div className="relative">
                  <img src={l.product.images[0]} alt="" className="size-12 rounded-lg object-cover bg-sand" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold">{l.qty}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium">{l.product.title}</p>
                  <p className="text-xs text-muted-foreground">{inr(l.product.price)}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
import { NavLink } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { inr } from "@/lib/format";

export default function Cart() {
  const { cartLines, updateQty, removeFromCart, cartSubtotal, clearCart } = useStore();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);
  const discount = applied ? Math.min(500, Math.floor(cartSubtotal * 0.1)) : 0;
  const shipping = cartSubtotal === 0 ? 0 : cartSubtotal >= 1499 ? 0 : 99;
  const tax = Math.round((cartSubtotal - discount) * 0.05);
  const total = Math.max(0, cartSubtotal - discount + shipping + tax);

  if (cartLines.length === 0) {
    return (
      <div className="container-page py-20 text-center">
        <ShoppingBag className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add a few things to get started.</p>
        <NavLink to="/" className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground">
          Start shopping
        </NavLink>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-3xl font-semibold">Your cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{cartLines.length} {cartLines.length === 1 ? "item" : "items"}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-3">
          {cartLines.map((l) => (
            <li key={`${l.id}-${l.size ?? ""}-${l.color ?? ""}`} className="surface-card flex gap-4 p-4">
              <NavLink to={`/products/${l.id}`} className="shrink-0">
                <img src={l.product.images[0]} alt="" className="size-24 rounded-lg object-cover bg-sand" />
              </NavLink>
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <p className="text-xs text-muted-foreground">{l.product.brand}</p>
                <NavLink to={`/products/${l.id}`} className="text-sm font-medium hover:text-brand line-clamp-2">
                  {l.product.title}
                </NavLink>
                {(l.size || l.color) && (
                  <p className="text-xs text-muted-foreground">
                    {l.size && <>Size: {l.size}</>} {l.color && <>· Color: <span className="inline-block size-3 rounded-full align-middle border" style={{ backgroundColor: l.color }} /></>}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-md border border-border">
                    <button onClick={() => updateQty(l.id, l.qty - 1)} className="grid size-8 cursor-pointer place-items-center" aria-label="Decrease">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="min-w-8 text-center text-sm">{l.qty}</span>
                    <button onClick={() => updateQty(l.id, l.qty + 1)} className="grid size-8 cursor-pointer place-items-center" aria-label="Increase">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{inr(l.product.price * l.qty)}</span>
                    <button onClick={() => removeFromCart(l.id)} aria-label="Remove" className="text-muted-foreground cursor-pointer hover:text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
          <button onClick={clearCart} className="text-xs text-muted-foreground cursor-pointer hover:text-destructive">Clear cart</button>
        </ul>

        <aside className="surface-card h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal">{inr(cartSubtotal)}</Row>
            {discount > 0 && <Row label="Coupon">−{inr(discount)}</Row>}
            <Row label="Shipping">{shipping === 0 ? "Free" : inr(shipping)}</Row>
            <Row label="Estimated tax">{inr(tax)}</Row>
            <div className="border-t border-border pt-3 flex justify-between font-display text-base font-semibold">
              <span>Total</span><span>{inr(total)}</span>
            </div>
          </dl>

          <div className="mt-5 flex gap-2">
            <input
              value={coupon} onChange={(e) => setCoupon(e.target.value)}
              placeholder="Coupon code (try HOME10)" aria-label="Coupon"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={() => setApplied(coupon.trim().toUpperCase() === "HOME10")}
              className="rounded-md border cursor-pointer border-border px-3 text-sm hover:bg-muted"
            >Apply</button>
          </div>
          {applied && <p className="mt-2 text-xs text-success">Coupon applied — 10% off (up to ₹500)</p>}

          <NavLink to="/checkout" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand py-3 text-sm font-medium text-brand-foreground shadow-lift hover:opacity-95">
            Checkout
          </NavLink>
          <p className="mt-3 text-center text-xs text-muted-foreground">Free shipping on orders over ₹1,499</p>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="text-foreground">{children}</span></div>;
}

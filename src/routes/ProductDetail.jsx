import { NavLink, useParams } from "react-router-dom";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Layers,
  ThumbsUp,
  ShoppingCart,
  RefreshCw,
  Scale,
  Bell,
} from "lucide-react";
import { getProduct } from "@/data/products";
import { categories } from "@/data/categories";
import { useStore } from "@/context/StoreContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { inr, pctOff } from "@/lib/format";
import { ProductCard } from "@/components/product/ProductCard";
import { PriceAlertModal } from "@/components/product/PriceAlertModal";
import {
  getFrequentlyBoughtTogether,
  getSimilarProducts,
  getCompleteTheLook,
  getYouMayAlsoLike,
} from "@/lib/recommendations";

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProduct(id);

  const [active, setActive] = useState(0);
  const [size, setSize] = useState(product?.sizes?.[0]);
  const [color, setColor] = useState(product?.colors?.[0]);
  const [qty, setQty] = useState(1);
  const [subFreq, setSubFreq] = useState("monthly");
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const { addToCart, toggleWishlist, inWishlist, pushRecent, toggleCompare, inCompare } = useStore();
  const { subscribe, unsubscribe, isSubscribed, FREQUENCIES } = useSubscription();

  useEffect(() => {
    if (product) {
      pushRecent(product.id);
      setSize(product.sizes?.[0]);
      setColor(product.colors?.[0]);
      setActive(0);
      setQty(1);
    }
  }, [id, product, pushRecent]);

  const cat = useMemo(() => product ? categories.find((c) => c.slug === product.category) : null, [product]);
  const off = useMemo(() => product ? pctOff(product.mrp, product.price) : 0, [product]);

  // ── AI Recommendations ────────────────────────────────────────────────────
  const frequentlyBought = useMemo(() => product ? getFrequentlyBoughtTogether(product, 3) : [], [product]);
  const similarProducts  = useMemo(() => product ? getSimilarProducts(product, 4) : [], [product]);
  const completeTheLook  = useMemo(() => product ? getCompleteTheLook(product, 4) : [], [product]);
  const youMayAlsoLike   = useMemo(() => product ? getYouMayAlsoLike(product, 4) : [], [product]);

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <NavLink to="/" className="mt-4 inline-block text-brand hover:underline">
          Back home
        </NavLink>
      </div>
    );
  }

  return (
    <div className="container-page py-6 md:py-10">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1 text-xs text-muted-foreground"
      >
        <NavLink to="/" className="hover:text-foreground">
          Home
        </NavLink>
        <ChevronRight className="size-3" />
        {cat && (
          <>
            <NavLink
              to={`/category/${cat.slug}`}
              className="hover:text-foreground"
            >
              {cat.name}
            </NavLink>
            <ChevronRight className="size-3" />
          </>
        )}
        <span className="truncate text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* GALLERY */}
        <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
          <div className="order-2 sm:order-1 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={`size-20  cursor-pointer shrink-0 overflow-hidden rounded-lg border-2 ${active === i ? "border-brand" : "border-transparent"}`}
              >
                <img src={src} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
          <motion.div
            key={active}
            transition={{ duration: 0.3 }}
            className="order-1 sm:order-2 aspect-square overflow-hidden rounded-2xl bg-sand"
          >
            <img
              src={product.images[active]}
              alt={product.title}
              className="size-full object-cover"
            />
          </motion.div>
        </div>

        {/* INFO */}
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</p>
          <h1 className="mt-1 font-display text-2xl font-semibold leading-tight md:text-3xl">
            {product.title}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-success">
              <Star className="size-3.5 fill-success" /> {product.rating}
            </span>
            <span className="text-muted-foreground">
              {product.reviews.toLocaleString()} reviews
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="flex items-end gap-3">
              <span className="font-display text-3xl font-semibold">{inr(product.price)}</span>
              {off > 0 && (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    {inr(product.mrp)}
                  </span>
                  <span className="text-sm font-medium text-clay">{off}% off</span>
                </>
              )}
            </div>
            <button 
              onClick={() => setIsAlertModalOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline cursor-pointer"
            >
              <Bell className="size-4" /> Price Alert
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.colors && (
            <div className="mt-6">
              <p className="text-sm font-medium">Color</p>
              <div className="mt-2 flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                    className={`size-9  cursor-pointer rounded-full border-2 ${color === c ? "border-brand" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="mt-5">
              <p className="text-sm font-medium">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded-md border cursor-pointer px-3 py-1.5 text-sm ${size === s ? "border-brand bg-brand text-brand-foreground" : "border-border hover:border-foreground"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 text-sm cursor-pointer"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-10 px-2 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 text-sm cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => addToCart(product.id, { qty, size, color })}
              className="inline-flex flex-1 items-center cursor-pointer justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-brand-foreground shadow-lift hover:opacity-95"
            >
              <ShoppingBag className="size-4" /> Add to cart
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={inWishlist(product.id)}
                className="inline-flex flex-1 sm:flex-none items-center justify-center cursor-pointer gap-2 rounded-full border border-border bg-background px-4 py-3.5 text-sm font-medium hover:bg-muted"
                title="Wishlist"
              >
                <Heart className={`size-4 ${inWishlist(product.id) ? "fill-clay text-clay" : ""}`} />
              </button>
              <button
                onClick={() => toggleCompare(product.id)}
                aria-pressed={inCompare(product.id)}
                className="inline-flex flex-1 sm:flex-none items-center justify-center cursor-pointer gap-2 rounded-full border border-border bg-background px-4 py-3.5 text-sm font-medium hover:bg-muted"
                title="Compare"
              >
                <Scale className={`size-4 ${inCompare(product.id) ? "text-brand" : ""}`} />
              </button>
            </div>
          </div>

          {/* ── Subscribe & Save ─────────────────────────────────────── */}
          <div className="mt-5 rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/5 to-clay/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold flex items-center gap-2">
                  <RefreshCw className="size-4 text-brand" />
                  Subscribe &amp; Save <span className="rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-medium">5% OFF</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Auto-delivered on your schedule</p>
              </div>
              {isSubscribed(product.id) && (
                <span className="rounded-full bg-green-100 border border-green-300 text-green-700 px-2 py-1 text-[10px] font-medium">Subscribed ✓</span>
              )}
            </div>

            {!isSubscribed(product.id) && (
              <div className="mb-3 flex flex-wrap gap-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSubFreq(f.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                      subFreq === f.id ? "border-brand bg-brand text-brand-foreground" : "border-border hover:border-brand"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-xl font-bold text-brand">{inr(Math.round(product.price * 0.95))}</span>
                <span className="ml-1.5 text-xs text-muted-foreground line-through">{inr(product.price)}</span>
              </div>
              {isSubscribed(product.id) ? (
                <button
                  onClick={() => unsubscribe(product.id)}
                  className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition cursor-pointer"
                >
                  Unsubscribe
                </button>
              ) : (
                <button
                  onClick={() => subscribe(product, subFreq)}
                  className="rounded-full bg-brand px-5 py-2 text-xs font-medium text-brand-foreground shadow-lift hover:opacity-95 transition cursor-pointer"
                >
                  Subscribe &amp; Save
                </button>
              )}
            </div>
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
            <li className="surface-card p-3">
              <Truck className="mx-auto size-5 text-brand" />
              <p className="mt-1">{product.deliveryDays}-day delivery</p>
            </li>
            <li className="surface-card p-3">
              <RotateCcw className="mx-auto size-5 text-brand" />
              <p className="mt-1">30-day returns</p>
            </li>
            <li className="surface-card p-3">
              <ShieldCheck className="mx-auto size-5 text-brand" />
              <p className="mt-1">{product.warranty ?? "Quality guaranteed"}</p>
            </li>
          </ul>
        </div>
      </div>

      {/* DETAILS */}
      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-semibold">Features</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-2 size-1.5 rounded-full bg-brand" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Specifications</h2>
          <dl className="mt-3 surface-card divide-y divide-border">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] gap-4 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* REVIEWS PREVIEW */}
      <section className="mt-16">
        <h2 className="font-display text-xl font-semibold">Customer reviews</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {sampleReviews.map((r) => (
            <article key={r.name} className="surface-card p-5">
              <div className="flex items-center gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-3.5 ${i < r.stars ? "fill-warning" : "opacity-30"}`}
                  />
                ))}
              </div>
              <p className="mt-2 font-medium">{r.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              <p className="mt-3 text-xs text-muted-foreground">— {r.name} · Verified purchase</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── FREQUENTLY BOUGHT TOGETHER ─────────────────────────────── */}
      {frequentlyBought.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10">
              <ShoppingCart className="size-4 text-brand" />
            </span>
            <h2 className="font-display text-xl font-semibold">Frequently Bought Together</h2>
          </div>

          <div className="surface-card p-5 md:p-6">
            {/* Product strip */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Current product */}
              <div className="flex flex-col items-center gap-2 text-center w-[90px]">
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-sand">
                  <img src={product.images[0]} alt={product.title} className="size-full object-cover" />
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight">{product.title}</p>
                <p className="text-xs font-semibold">{inr(product.price)}</p>
              </div>

              {frequentlyBought.map((p, i) => (
                <React.Fragment key={p.id}>
                  <span className="text-lg text-muted-foreground font-light">+</span>
                  <NavLink to={`/products/${p.id}`} className="flex flex-col items-center gap-2 text-center w-[90px] group">
                    <div className="h-20 w-20 overflow-hidden rounded-xl bg-sand border-2 border-transparent group-hover:border-brand transition-colors">
                      <img src={p.images[0]} alt={p.title} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight group-hover:text-foreground transition-colors">{p.title}</p>
                    <p className="text-xs font-semibold">{inr(p.price)}</p>
                  </NavLink>
                </React.Fragment>
              ))}
            </div>

            {/* Summary + Add all to cart */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total for {1 + frequentlyBought.length} items:
                </p>
                <p className="font-display text-2xl font-semibold mt-0.5">
                  {inr(product.price + frequentlyBought.reduce((s, p) => s + p.price, 0))}
                </p>
              </div>
              <button
                onClick={() => {
                  addToCart(product.id, { qty: 1 });
                  frequentlyBought.forEach((p) => addToCart(p.id, { qty: 1 }));
                }}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground shadow-lift hover:opacity-95 cursor-pointer transition"
              >
                <ShoppingCart className="size-4" />
                Add All to Cart
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── SIMILAR PRODUCTS ──────────────────────────────────────────── */}
      {similarProducts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-clay/10">
              <Layers className="size-4 text-clay" />
            </span>
            <h2 className="font-display text-xl font-semibold">Similar Products</h2>
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Same category</span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {similarProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── COMPLETE THE LOOK ─────────────────────────────────────────── */}
      {completeTheLook.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success/10">
              <Sparkles className="size-4 text-success" />
            </span>
            <h2 className="font-display text-xl font-semibold">Complete the Look</h2>
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Pairs well with</span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {completeTheLook.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── YOU MAY ALSO LIKE ─────────────────────────────────────────── */}
      {youMayAlsoLike.length > 0 && (
        <section className="mt-16 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-warning/10">
              <ThumbsUp className="size-4 text-warning" />
            </span>
            <h2 className="font-display text-xl font-semibold">You May Also Like</h2>
            <span className="ml-1 rounded-full bg-gradient-to-r from-brand/10 to-clay/10 px-2 py-0.5 text-xs text-brand font-medium">AI Recommended</span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {youMayAlsoLike.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <PriceAlertModal
        product={product}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
}

const sampleReviews = [
  {
    name: "Maya K.",
    stars: 5,
    title: "Better than expected",
    body: "Quality is excellent and delivery was on time. Would buy again.",
  },
  {
    name: "Arjun P.",
    stars: 4,
    title: "Great value",
    body: "Solid build, clear instructions, and a tidy package.",
  },
  {
    name: "Leila S.",
    stars: 5,
    title: "Beautiful",
    body: "Photos do not do it justice. Looks even better in person.",
  },
];

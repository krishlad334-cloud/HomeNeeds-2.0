import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Star, Heart, ShoppingCart, Package, Scale } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { inr, pctOff } from "@/lib/format";
import { useStore } from "@/context/StoreContext";
import { useOrder } from "@/context/OrderContext";

export function ProductCard({ product, index = 0 }) {
  const { addOrder } = useOrder();
  const { toggleWishlist, inWishlist, addToCart, toggleCompare, inCompare } = useStore();
  const [showToast, setShowToast] = useState(false);
  const wished = inWishlist(product.id);
  const compared = inCompare(product.id);
  const off = pctOff(product.mrp, product.price);

  const handleOrderNow = () => {
    const order = {
      id: "ORD-" + Date.now().toString(),
      date: new Date().toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      total: product.price,
      status: "Processing",
      items: [
        {
          id: product.id,
          name: product.title,
          image: product.images[0],
          price: product.price,
          quantity: 1,
          category: product.brand,
        },
      ],
    };
    addOrder(order);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <motion.div
        transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.15) }}
        className="group surface-card overflow-hidden flex flex-col"
      >
        <NavLink
          to={`/products/${product.id}`}
          className="relative block aspect-[4/5] overflow-hidden bg-sand"
        >
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.style.display = "grid";
              e.target.parentElement.style.placeItems = "center";
              e.target.parentElement.insertAdjacentHTML(
                "beforeend",
                `<span style="color:var(--muted-foreground);font-size:0.75rem">${product.brand}</span>`
              );
            }}
          />

          {product.badges?.[0] && (
            <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-brand-foreground shadow-soft">
              {product.badges[0]}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            className="absolute right-3 top-3 grid size-9 cursor-pointer place-items-center rounded-full bg-background/90 backdrop-blur shadow-soft transition hover:scale-105"
          >
            <Heart className={`size-4 ${wished ? "fill-clay text-clay" : "text-foreground/70"}`} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(product.id);
            }}
            aria-label={compared ? "Remove from compare" : "Add to compare"}
            aria-pressed={compared}
            className="absolute right-3 top-14 grid size-9 cursor-pointer place-items-center rounded-full bg-background/90 backdrop-blur shadow-soft transition hover:scale-105"
          >
            <Scale className={`size-4 ${compared ? "text-brand" : "text-foreground/70"}`} />
          </button>
        </NavLink>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            <NavLink to={`/products/${product.id}`} className="hover:text-brand">
              {product.title}
            </NavLink>
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-warning text-warning" />
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>({product.reviews.toLocaleString()})</span>
          </div>
          <div className="mt-auto flex items-end gap-2 pt-2">
            <span className="text-base font-semibold text-foreground">{inr(product.price)}</span>
            {off > 0 && (
              <>
                <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>
                <span className="text-xs font-medium text-clay">{off}% off</span>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1.5 mt-2">
            <button
              type="button"
              onClick={() => addToCart(product.id)}
              className="flex items-center justify-center gap-1.5 w-full cursor-pointer rounded-md border border-border bg-background py-2 text-xs font-medium text-foreground transition hover:bg-brand hover:text-brand-foreground hover:border-brand"
            >
              <ShoppingCart className="size-3.5" />
              Add to cart
            </button>
            <button
              type="button"
              onClick={handleOrderNow}
              className="flex items-center justify-center gap-1.5 w-full cursor-pointer rounded-md bg-clay text-clay-foreground py-2 text-xs font-medium transition hover:opacity-90 active:scale-95"
            >
              <Package className="size-3.5" />
              Order Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* Toast — rendered outside the card to avoid stacking context issues */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="order-toast"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lift text-sm font-medium pointer-events-none"
          >
            ✅ Order placed! &nbsp;
            <NavLink
              to="/account/orders"
              className="underline underline-offset-2 pointer-events-auto hover:no-underline"
              onClick={() => setShowToast(false)}
            >
              View Orders →
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

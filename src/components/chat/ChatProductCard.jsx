import { NavLink } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { inr } from "@/lib/format";
import { useStore } from "@/context/StoreContext";

/**
 * ChatProductCard — compact product card rendered inside AI chat messages.
 */
export function ChatProductCard({ product }) {
  const { addToCart } = useStore();

  return (
    <div className="chat-product-card group flex items-center gap-3 rounded-xl border border-border/60 bg-background/80 p-3 hover:border-brand/40 transition-all duration-200">
      <NavLink
        to={`/products/${product.id}`}
        className="shrink-0 overflow-hidden rounded-lg"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-16 w-16 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </NavLink>

      <div className="flex flex-1 min-w-0 flex-col gap-1">
        <NavLink to={`/products/${product.id}`}>
          <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight hover:text-brand transition-colors">
            {product.title}
          </p>
        </NavLink>
        <p className="text-[10px] text-muted-foreground">{product.brand}</p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Star className="size-2.5 fill-warning text-warning" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-semibold text-foreground">{inr(product.price)}</span>
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="flex items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-[10px] font-medium text-brand-foreground transition hover:opacity-90 active:scale-95 cursor-pointer"
          >
            <ShoppingCart className="size-2.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

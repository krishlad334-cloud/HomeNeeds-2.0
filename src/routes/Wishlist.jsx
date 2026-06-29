import { NavLink } from "react-router-dom";
import { Heart, Share, Sparkles } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { getProduct, byCategory } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

export default function Wishlist() {
  const { wishlist, getAlerts } = useStore();
  const items = wishlist.map((id) => getProduct(id)).filter(Boolean);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get similar items from categories of wishlist items
  const wishlistCategories = Array.from(new Set(items.map(p => p.category)));
  const similarItems = wishlistCategories
    .flatMap(cat => byCategory(cat))
    .filter(p => !wishlist.includes(p.id))
    .slice(0, 4);

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Your wishlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} saved</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80 transition-colors cursor-pointer"
          >
            <Share className="size-4" />
            {copied ? "Link Copied!" : "Share Wishlist"}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-12 surface-card p-12 text-center">
          <Heart className="mx-auto size-10 text-muted-foreground" />
          <p className="mt-3">Nothing saved yet.</p>
          <NavLink to="/" className="mt-4 inline-block text-brand hover:underline">
            Find something you love
          </NavLink>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => {
            const isPriceDrop = getAlerts(p.id).includes('price') || p.badges?.some(b => b.includes('-'));
            return (
              <div key={p.id} className="relative group flex flex-col">
                <ProductCard product={p} index={i} />
                
                {/* Smart overlays for wishlist */}
                <div className="mt-2 text-xs flex items-center justify-between">
                  {p.stock < 40 ? (
                    <span className="text-destructive font-medium">Only {p.stock} left</span>
                  ) : (
                    <span className="text-success font-medium">In Stock</span>
                  )}
                  {isPriceDrop && (
                    <span className="bg-clay/10 text-clay px-1.5 py-0.5 rounded text-[10px] font-bold">
                      PRICE DROP
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {similarItems.length > 0 && items.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center gap-2 mb-6">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10">
              <Sparkles className="size-4 text-brand" />
            </span>
            <h2 className="font-display text-2xl font-semibold">Based on your wishlist</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {similarItems.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { NavLink } from "react-router-dom";
import { Check, X, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { getProduct } from "@/data/products";

export default function Compare() {
  const { compareList, toggleCompare, addToCart } = useStore();
  const items = compareList.map((id) => getProduct(id)).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="container-page py-8">
        <h1 className="font-display text-3xl font-semibold mb-6">Compare Products</h1>
        <div className="surface-card p-12 text-center">
          <p className="text-muted-foreground mb-4">You haven't added any products to compare yet.</p>
          <NavLink to="/" className="inline-block rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90">
            Browse Products
          </NavLink>
        </div>
      </div>
    );
  }

  const allFeatures = Array.from(new Set(items.flatMap(p => p.features || [])));
  const specKeys = Array.from(new Set(items.flatMap(p => Object.keys(p.specs || {}))));

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold">Compare Products</h1>
        <p className="text-sm text-muted-foreground">{items.length} of 4 items</p>
      </div>

      <div className="overflow-x-auto pb-4">
        <table className="w-full min-w-[800px] text-sm text-left">
          <thead>
            <tr>
              <th className="p-4 w-48 font-medium text-muted-foreground align-bottom border-b border-border">Product</th>
              {items.map((p) => (
                <th key={p.id} className="p-4 align-top w-1/4 border-b border-border">
                  <div className="relative group">
                    <button
                      onClick={() => toggleCompare(p.id)}
                      className="absolute -top-2 -right-2 grid cursor-pointer size-6 place-items-center rounded-full bg-muted text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      aria-label="Remove from compare"
                    >
                      <X className="size-3" />
                    </button>
                    <img src={p.images[0]} alt={p.title} className="w-full cursor-pointer aspect-square object-cover rounded-lg mb-3 border border-border" />
                    <h3 className="font-medium line-clamp-2">{p.title}</h3>
                    <p className="text-muted-foreground text-xs mt-1">{p.brand}</p>
                    <div className="font-semibold text-lg mt-2">
                      ₹{p.price.toLocaleString("en-IN")}
                    </div>
                    <button
                      onClick={() => addToCart(p.id)}
                      className="mt-4 w-full flex items-center justify-center cursor-pointer gap-2 rounded-md bg-brand px-3 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
                    >
                      <ShoppingBag className="size-4" /> Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4 font-medium text-muted-foreground bg-muted/30">Rating</td>
              {items.map(p => (
                <td key={p.id} className="p-4 bg-muted/30">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{p.rating}</span>
                    <span className="text-muted-foreground">({p.reviews})</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-muted-foreground">Delivery</td>
              {items.map(p => (
                <td key={p.id} className="p-4">
                  {p.deliveryDays ? `In ${p.deliveryDays} days` : 'Check availability'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-muted-foreground bg-muted/30">Warranty</td>
              {items.map(p => (
                <td key={p.id} className="p-4 bg-muted/30">
                  {p.warranty || 'No warranty details'}
                </td>
              ))}
            </tr>
            
            {/* Features section */}
            <tr>
              <td colSpan={items.length + 1} className="p-4 font-display font-semibold text-lg bg-background pt-8 pb-4">
                Key Features
              </td>
            </tr>
            {allFeatures.map((feature, i) => (
              <tr key={`feat-${i}`}>
                <td className="p-4 font-medium text-muted-foreground">{feature}</td>
                {items.map(p => (
                  <td key={p.id} className="p-4 text-center">
                    {(p.features || []).includes(feature) ? (
                      <Check className="size-4 text-success mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Specs section */}
            {specKeys.length > 0 && (
              <tr>
                <td colSpan={items.length + 1} className="p-4 font-display font-semibold text-lg bg-background pt-8 pb-4">
                  Specifications
                </td>
              </tr>
            )}
            {specKeys.map((key, i) => (
              <tr key={`spec-${i}`}>
                <td className="p-4 font-medium text-muted-foreground">{key}</td>
                {items.map(p => (
                  <td key={p.id} className="p-4">
                    {p.specs?.[key] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

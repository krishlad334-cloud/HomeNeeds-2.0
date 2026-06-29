import { NavLink, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { search as searchProducts, products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const results = useMemo(() => {
    if (!q) return products;
    if (q === "deals") return products.filter((p) => p.tags?.includes("deals"));
    if (q === "new") return products.filter((p) => p.tags?.includes("new"));
    if (q === "best") return products.filter((p) => p.tags?.includes("best-seller"));
    return searchProducts(q);
  }, [q]);

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-2xl font-semibold md:text-3xl">
        {q ? (
          <>
            Results for <em className="not-italic text-clay">"{q}"</em>
          </>
        ) : (
          "Browse everything"
        )}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">{results.length} products</p>

      {results.length === 0 ? (
        <div className="mt-10 surface-card p-12 text-center">
          <p>No matches. Try a different query.</p>
          <NavLink to="/" className="mt-4 inline-block text-brand hover:underline">
            Back home
          </NavLink>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

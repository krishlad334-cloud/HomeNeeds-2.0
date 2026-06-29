import { NavLink, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { byCategory } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductCard } from "@/components/product/ProductCard";

export default function CategoryDetail() {
  const { slug } = useParams();
  const cat = categories.find((c) => c.slug === slug);
  const items = useMemo(() => byCategory(slug), [slug]);

  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    const list = items.filter((p) => p.price <= maxPrice && p.rating >= minRating);
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [items, sort, maxPrice, minRating]);

  if (!cat) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-display text-3xl">Category not found</h1>
        <NavLink to="/" className="mt-4 inline-block text-brand hover:underline">
          Back home
        </NavLink>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Category</p>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">{cat.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{cat.blurb}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="surface-card h-fit p-5 lg:sticky lg:top-28">
          <h2 className="font-display text-base font-semibold">Filters</h2>

          <div className="mt-5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Max price
            </label>
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-2 w-full cursor-pointer accent-[var(--brand)]"
            />

            <p className="mt-1 text-sm">Up to ₹{maxPrice.toLocaleString("en-IN")}</p>
          </div>

          <div className="mt-5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Min rating
            </label>
            <div className="mt-2 flex gap-2">
              {[0, 3, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`rounded-md  cursor-pointer border px-2 py-1 text-xs ${minRating === r ? "border-brand bg-brand text-brand-foreground" : "border-border"}`}
                >
                  {r === 0 ? "Any" : `${r}★+`}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setMaxPrice(100000);
              setMinRating(0);
              setSort("featured");
            }}
            className="mt-6 w-full cursor-pointer rounded-md border border-border py-2 text-sm hover:bg-muted"
          >
            Reset
          </button>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{filtered.length} products</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort"
              className="rounded-md border border-border bg-background cursor-pointer px-3 py-1.5 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="surface-card p-12 text-center text-muted-foreground">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

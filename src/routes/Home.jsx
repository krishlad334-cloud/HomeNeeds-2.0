import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Sparkles } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductCard } from "@/components/product/ProductCard";
import { inr, pctOff } from "@/lib/format";
import { getRecommendedForYou } from "@/lib/recommendations";
import { useStore } from "@/context/StoreContext";

export default function Home() {
  const { recentlyViewed } = useStore();
  const deals = products.filter((p) => p.tags?.includes("deals"));
  const featured = products.filter((p) => p.tags?.includes("featured"));
  const trending = products.filter((p) => p.tags?.includes("trending"));
  const fresh = products.filter((p) => p.tags?.includes("new"));
  const recommended = getRecommendedForYou(recentlyViewed, 8);

  return (
    <>
      {/* HERO */}
      <section className="hero-grid-bg">
        <div className="container-page grid items-center gap-10 py-15 md:py-20 lg:grid-cols-2">
          <motion.div transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-soft">
              <Sparkles className="size-3.5 text-clay" /> New season · Hand-picked for fall
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              The things that make a house <em className="not-italic text-clay">feel like home.</em>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground">
              From the daily essentials to the once-in-a-while splurges — curated brands, fair
              prices, fast delivery.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <NavLink
                to="/category/decor"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-brand-foreground shadow-lift hover:opacity-95"
              >
                Shop the edit <ArrowRight className="size-4" />
              </NavLink>
              <NavLink
                to="/search?q=deals"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-muted"
              >
                Today's deals
              </NavLink>
            </div>
            <ul className="mt-10 grid grid-cols-3 gap-4 text-xs text-muted-foreground">
              <Feature icon={<Truck className="size-4" />} label="Free over ₹1,499" />
              <Feature icon={<RotateCcw className="size-4" />} label="30-day returns" />
              <Feature icon={<ShieldCheck className="size-4" />} label="Secure checkout" />
            </ul>
          </motion.div>

          <motion.div transition={{ duration: 0.7, delay: 0.15 }} className="relative">
            <div className="relative aspect-[5/6] overflow-hidden rounded-3xl shadow-lift">
              <img
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1100&q=80"
                alt=""
                className="size-full object-cover"
              />
            </div>
            <div className="absolute -left-6 bottom-8 w-56 surface-card p-4 hidden sm:block">
              <p className="text-xs text-muted-foreground">Editor's pick</p>
              <p className="mt-1 font-display font-semibold">Linen Weave Throw</p>
              <p className="text-sm text-muted-foreground">{inr(2499)} · 4.8 ★</p>
            </div>
            <div className="absolute -right-3 top-6 w-44 surface-card p-3 hidden sm:flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-clay/10 text-clay">
                ★
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rated</p>
                <p className="text-sm font-semibold">4.8 / 5 · 24k+</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <Section title="Shop by category" subtitle="Eighteen aisles, one cart">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 12).map((c, i) => (
            <motion.div key={c.slug} transition={{ duration: 0.3, delay: i * 0.02 }}>
              <NavLink to={`/category/${c.slug}`} className="group relative block overflow-hidden rounded-2xl shadow-soft hover:shadow-lift transition-shadow duration-300">
                <div className="aspect-[4/5] overflow-hidden bg-sand">
                  <img
                    src={c.cover}
                    alt={c.name}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'grid';
                    }}
                  />
                  <div className="hidden size-full place-items-center bg-gradient-to-br from-brand/20 to-clay/20 text-brand font-display text-lg font-semibold">
                    {c.name}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-sm font-semibold text-white drop-shadow-sm">{c.name}</p>
                  <p className="text-[11px] text-white/80">{c.blurb}</p>
                </div>
              </NavLink>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* DEALS STRIP */}
      <Section
        title="Today's deals"
        subtitle="Up to 35% off — refreshed daily"
        linkTo="/search"
        linkSearch={{ q: "deals" }}
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {deals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </Section>

      {/* RECOMMENDED FOR YOU */}
      <Section
        title={
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand to-clay">
              <Sparkles className="size-3.5 text-white" />
            </span>
            Recommended For You
            
          </span>
        }
        subtitle={recentlyViewed.length > 0 ? "Based on your browsing history" : "Handpicked by our AI based on what's popular"}
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {recommended.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </Section>

      {/* EDITORIAL BANNER */}
      <section className="container-page my-16">
        <div className="grid overflow-hidden rounded-3xl bg-brand text-brand-foreground md:grid-cols-2">
          <div className="p-10 md:p-14">
            <p className="text-xs uppercase tracking-[0.2em] opacity-70">The HomeNeeds journal</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold leading-tight">
              Build a kitchen that lasts a lifetime.
            </h2>
            <p className="mt-3 max-w-md text-sm opacity-80">
              Six pieces of cookware our test kitchen reaches for every day — and the brands behind
              them.
            </p>
            <NavLink
              to="/category/home-kitchen"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-background px-5 py-2.5 text-sm font-medium text-foreground"
            >
              Read the edit <ArrowRight className="size-4" />
            </NavLink>
          </div>
          <div className="relative min-h-[260px]">
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1100&q=80"
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <Section title="Trending now" subtitle="What the community is loving this week">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {trending.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </Section>

      {/* NEW ARRIVALS */}
      <Section title="New arrivals" subtitle="Just landed at HomeNeeds">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {fresh.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </Section>

      {/* FEATURED */}
      <Section title="Editor's picks" subtitle="Quietly excellent things">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <section className="container-page my-20">
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="surface-card p-6"
            >
              <p className="font-display text-lg leading-relaxed">"{t.quote}"</p>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                — {t.name}, {t.city}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
    </>
  );
}

function Section({ title, subtitle, linkTo, linkSearch, children }) {
  return (
    <section className="container-page my-14 md:my-20">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {linkTo && (
          <NavLink
            to={linkTo + (linkSearch ? `?q=${linkSearch.q}` : "")}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            View all <ArrowRight className="size-4" />
          </NavLink>
        )}
      </header>
      {children}
    </section>
  );
}

function Feature({ icon, label }) {
  return (
    <li className="flex items-center gap-2">
      <span className="grid size-7 place-items-center rounded-full bg-background shadow-soft">
        {icon}
      </span>
      <span>{label}</span>
    </li>
  );
}

const testimonials = [
  {
    name: "Anika R.",
    city: "Bengaluru",
    quote:
      "The Dutch oven arrived in two days and looks even better in person. The whole experience felt premium.",
  },
  {
    name: "Rohan M.",
    city: "Mumbai",
    quote: "I came for headphones, stayed for the lamp. The site is genuinely fun to browse.",
  },
  {
    name: "Priya S.",
    city: "Delhi",
    quote: "Their returns are painless. Wishlist-to-cart flow is the smoothest I've used.",
  },
];

// silence the placeholder marker
void pctOff;

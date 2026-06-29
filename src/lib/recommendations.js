/**
 * recommendations.js
 * Local rule-based AI recommendation engine.
 * No external API required — all logic derived from product metadata.
 */
import { products } from "@/data/products";

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/** Products sharing the same category, excluding a given product id */
const sameCategory = (product) =>
  products.filter((p) => p.category === product.category && p.id !== product.id);

/** Tag overlap score between two products (0–N) */
const tagScore = (a, b) => {
  if (!a.tags || !b.tags) return 0;
  return a.tags.filter((t) => b.tags.includes(t)).length;
};

/** Price proximity score — higher when prices are close */
const priceScore = (a, b) => {
  const ratio = Math.min(a.price, b.price) / Math.max(a.price, b.price);
  return ratio; // 0–1
};

// ---------------------------------------------------------------------------
// Category affinities — defines what pairs well with each category
// ---------------------------------------------------------------------------
const CATEGORY_PAIRS = {
  electronics: ["office", "furniture", "appliances"],
  mobiles: ["electronics", "fashion", "office"],
  fashion: ["beauty", "sports", "decor"],
  "home-kitchen": ["furniture", "decor", "appliances"],
  furniture: ["decor", "home-kitchen", "office"],
  appliances: ["home-kitchen", "furniture", "electronics"],
  beauty: ["fashion", "health", "sports"],
  sports: ["fashion", "health", "electronics"],
  books: ["office", "home-kitchen", "furniture"],
  office: ["electronics", "books", "furniture"],
  decor: ["furniture", "home-kitchen", "fashion"],
  toys: ["baby", "books", "electronics"],
  baby: ["toys", "health", "fashion"],
  health: ["beauty", "sports", "grocery"],
  grocery: ["home-kitchen", "health"],
  automotive: ["electronics", "sports"],
  gardening: ["home-kitchen", "decor", "outdoor"],
  "pet-supplies": ["health", "home-kitchen"],
};

// ---------------------------------------------------------------------------
// 1. Frequently Bought Together
//    Returns 2–3 products from affinity categories, most popular first
// ---------------------------------------------------------------------------
export function getFrequentlyBoughtTogether(product, limit = 3) {
  const affinities = CATEGORY_PAIRS[product.category] ?? [];
  const candidates = products.filter(
    (p) => p.id !== product.id && affinities.includes(p.category)
  );

  // Sort by rating × reviews (proxy for popularity)
  candidates.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
  return candidates.slice(0, limit);
}

// ---------------------------------------------------------------------------
// 2. Similar Products
//    Same category, ranked by rating/review similarity
// ---------------------------------------------------------------------------
export function getSimilarProducts(product, limit = 4) {
  const candidates = sameCategory(product);
  candidates.sort((a, b) => {
    const scoreA = tagScore(product, a) * 2 + priceScore(product, a) + a.rating / 5;
    const scoreB = tagScore(product, b) * 2 + priceScore(product, b) + b.rating / 5;
    return scoreB - scoreA;
  });
  return candidates.slice(0, limit);
}

// ---------------------------------------------------------------------------
// 3. Complete the Look
//    Cross-category curation — relevant for fashion, decor, furniture
// ---------------------------------------------------------------------------
const LOOK_CATEGORIES = {
  fashion: ["beauty", "sports"],
  decor: ["furniture", "home-kitchen"],
  furniture: ["decor", "home-kitchen"],
  beauty: ["fashion", "health"],
  sports: ["fashion", "health"],
};

export function getCompleteTheLook(product, limit = 4) {
  const targetCats = LOOK_CATEGORIES[product.category];
  if (!targetCats) {
    // Fallback: affinity categories
    const affinities = CATEGORY_PAIRS[product.category] ?? [];
    return products
      .filter((p) => p.id !== product.id && affinities.slice(0, 2).includes(p.category))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }
  return products
    .filter((p) => p.id !== product.id && targetCats.includes(p.category))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// 4. You May Also Like
//    Tag-based + price range similarity
// ---------------------------------------------------------------------------
export function getYouMayAlsoLike(product, limit = 4) {
  const priceMin = product.price * 0.5;
  const priceMax = product.price * 2.0;

  const scored = products
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      product: p,
      score:
        tagScore(product, p) * 3 +
        priceScore(product, p) +
        (p.price >= priceMin && p.price <= priceMax ? 1 : 0) +
        p.rating / 5,
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.product);
}

// ---------------------------------------------------------------------------
// 5. Gift Suggestions
//    Used by the AI chatbot — filter by budget and optional category hint
// ---------------------------------------------------------------------------
const RECIPIENT_HINTS = {
  mom: ["home-kitchen", "beauty", "decor", "health"],
  dad: ["electronics", "automotive", "sports", "office"],
  wife: ["beauty", "fashion", "decor", "jewelry"],
  husband: ["electronics", "sports", "automotive"],
  boyfriend: ["electronics", "sports", "fashion"],
  girlfriend: ["beauty", "fashion", "decor"],
  friend: ["books", "home-kitchen", "office", "sports"],
  sister: ["beauty", "fashion", "electronics"],
  brother: ["electronics", "sports", "gaming"],
  kids: ["toys", "baby", "books"],
  child: ["toys", "baby", "books"],
  son: ["toys", "electronics", "sports"],
  daughter: ["toys", "beauty", "fashion", "books"],
  parent: ["home-kitchen", "health", "decor"],
  grandma: ["health", "home-kitchen", "decor"],
  grandpa: ["health", "electronics", "books"],
  colleague: ["office", "books", "home-kitchen"],
  teacher: ["books", "office", "home-kitchen"],
  boss: ["office", "electronics", "furniture"],
};

export function getGiftSuggestions({ budget, recipient, limit = 4 }) {
  const recipientLower = (recipient || "").toLowerCase();

  // Find a matching recipient key
  const matchedKey = Object.keys(RECIPIENT_HINTS).find((k) =>
    recipientLower.includes(k)
  );
  const preferredCats = matchedKey ? RECIPIENT_HINTS[matchedKey] : null;

  let candidates = [...products];

  // Budget filter
  if (budget) {
    candidates = candidates.filter((p) => p.price <= budget);
  }

  // Prefer matching categories
  if (preferredCats) {
    const preferred = candidates.filter((p) => preferredCats.includes(p.category));
    if (preferred.length >= limit) {
      candidates = preferred;
    }
  }

  // Sort by rating then reviews
  candidates.sort((a, b) => b.rating * b.reviews - a.rating * a.reviews);
  return candidates.slice(0, limit);
}

// ---------------------------------------------------------------------------
// 6. Trending Products (for chatbot "what's trending" queries)
// ---------------------------------------------------------------------------
export function getTrending(limit = 4) {
  return products
    .filter((p) => p.tags?.includes("trending") || p.tags?.includes("best-seller"))
    .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// 7. On-Sale / Deal Products
// ---------------------------------------------------------------------------
export function getDeals(limit = 4) {
  return products
    .filter((p) => p.tags?.includes("deals") || (p.mrp && p.mrp > p.price))
    .sort((a, b) => {
      const offA = ((a.mrp - a.price) / a.mrp) * 100;
      const offB = ((b.mrp - b.price) / b.mrp) * 100;
      return offB - offA;
    })
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// 8. Recommended For You (Home page — based on recently viewed or popular)
// ---------------------------------------------------------------------------
export function getRecommendedForYou(recentlyViewed = [], limit = 8) {
  if (recentlyViewed.length > 0) {
    // Use the last viewed product's category as the seed
    const seedId = recentlyViewed[0];
    const seed = products.find((p) => p.id === seedId);
    if (seed) {
      const recs = getYouMayAlsoLike(seed, limit);
      if (recs.length >= limit) return recs;
    }
  }
  // Fallback: top-rated across all categories
  return [...products]
    .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
    .slice(0, limit);
}

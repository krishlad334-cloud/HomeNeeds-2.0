import { NavLink, useNavigate, useLocation} from "react-router-dom";
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, Mic, ClipboardList, Sparkles, RefreshCw, Sun, Moon, SunDim, ArrowRightLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { useTheme } from "@/context/ThemeContext";
import { categories } from "@/data/categories";
import { search as searchProducts } from "@/data/products";

export function Header() {
  const { cartCount, wishlist, user, compareList } = useStore();
  const { isDark, toggle: toggleTheme } = useTheme();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    setMenuOpen(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const suggestions = q.length > 1 ? searchProducts(q).slice(0, 6) : [];

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      {/* Top Banner Utilities */}
      <div className="hidden md:block bg-brand text-brand-foreground text-xs">
        <div className="container-page flex h-9 items-center justify-between">
          <span>Free shipping on orders over ₹1,499 · Easy 30-day returns</span>
          <div className="flex items-center gap-4">
            <NavLink 
              to="/seller" 
              className={`hover:underline ${pathname === '/seller' ? 'font-semibold underline' : ''}`}
            >
              Sell on HomeNeeds
            </NavLink>
            <NavLink 
              to="/help" 
              className={`hover:underline ${pathname === '/help' ? 'font-semibold underline' : ''}`}
            >
              Help
            </NavLink>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container-page flex h-16 items-center gap-3 justify-center md:gap-6">
          <button
            type="button"
            aria-label="Open menu"
            className="md:hidden grid size-9 place-items-center rounded-md hover:bg-muted"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          <NavLink to="/" className="flex items-center mr-auto gap-2 shrink-0" aria-label="HomeNeeds home">
             <img src="/favicon.svg" alt="HomeNeeds Logo" />
            <span className="hidden sm:inline font-display text-xl font-semibold tracking-tight">
              HomeNeeds
            </span>
          </NavLink>

          <form onSubmit={submit} className="relative flex-1 max-w-2xl" ref={wrapRef}>
            <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-soft focus-within:border-brand">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                type="search"
                placeholder="Search products, brands, categories…"
                aria-label="Search"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />

              <button
                type="button"
                aria-label="Voice search"
                className="text-muted-foreground cursor-pointer hover:text-foreground"
              >
                <Mic className="size-4" />
              </button>
            </div>
            {open && (suggestions.length > 0 || q.length > 1) && (
              <div className="absolute left-0 right-0 top-full mt-2 surface-card overflow-hidden">
                {suggestions.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">No matches for "{q}"</p>
                ) : (
                  suggestions.map((p) => (
                    <NavLink
                      key={p.id}
                      to={`/products/${p.id}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-muted"
                    >
                      <img src={p.images[0]} alt="" className="size-10 rounded-md object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                    </NavLink>
                  ))
                )}
                <div className="border-t border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
                  Trending: headphones · linen · cookware · sneakers
                </div>
              </div>
            )}
          </form>

          {/* Icon Navigation Actions */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
              className="relative grid size-10 place-items-center cursor-pointer rounded-md hover:bg-muted transition-colors overflow-hidden"
            >
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isDark ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
                <SunDim  className="size-5 text-warning" />
              </span>
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isDark ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}>
                <Moon className="size-5" />
              </span>
            </button>
            <NavLink
              to="/auth/login"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted ${pathname.startsWith('/auth') ? 'bg-muted text-foreground' : ''}`}
            >
              <UserIcon className="size-4" />
              <span className="hidden lg:inline">{user ? user.name : "Sign in"}</span>
            </NavLink>
            <NavLink
              to="/account/orders"
              className={`relative grid size-10 place-items-center rounded-md hover:bg-muted ${pathname === '/account/orders' ? 'bg-muted text-foreground' : ''}`}
              aria-label="Your Orders"
              title="Your Orders"
            >
              <ClipboardList className="size-5" />
            </NavLink>
            <NavLink
              to="/compare"
              className={`relative grid size-10 place-items-center rounded-md hover:bg-muted ${pathname === '/compare' ? 'bg-muted text-foreground' : ''}`}
              aria-label="Compare"
            >
              <ArrowRightLeft className="size-5" />
              {compareList.length > 0 && <Badge n={compareList.length} />}
            </NavLink>
            <NavLink
              to="/wishlist"
              className={`relative grid size-10 place-items-center rounded-md hover:bg-muted ${pathname === '/wishlist' ? 'bg-muted text-foreground' : ''}`}
              aria-label="Wishlist"
            >
              <Heart className="size-5" />
              {wishlist.length > 0 && <Badge n={wishlist.length} />}
            </NavLink>
            <NavLink
              to="/cart"
              className={`relative grid size-10 place-items-center rounded-md hover:bg-muted ${pathname === '/cart' ? 'bg-muted text-foreground' : ''}`}
              aria-label="Cart"
            >
              <ShoppingBag className="size-5" />
              {cartCount > 0 && <Badge n={cartCount} />}
            </NavLink>
          </nav>

          <NavLink
            to="/cart"
            className="md:hidden relative grid size-9 place-items-center rounded-md hover:bg-muted"
            aria-label="Cart"
          >
            <ShoppingBag className="size-5" />
            {cartCount > 0 && <Badge n={cartCount} />}
          </NavLink>
        </div>

        {/* Category Row Navigation */}
        <div className="hidden md:block border-t border-border/60">
          <div className="container-page flex h-11 items-center gap-1 justify-center overflow-x-auto">
            {categories.slice(0, 12).map((c) => {
              const isActive = pathname === `/category/${c.slug}`;
              return (
                <NavLink
                  key={c.slug}
                  to={`/category/${c.slug}`}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive 
                      ? 'text-foreground bg-muted font-medium' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {c.name}
                </NavLink>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] bg-background p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-lg font-semibold">Browse</span>
              <div className="flex items-center gap-1">
                {/* Theme toggle for mobile */}
                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  className="relative grid size-9 place-items-center rounded-md hover:bg-muted overflow-hidden cursor-pointer"
                >
                  <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isDark ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`}>
                    <Sun className="size-4 text-warning" />
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isDark ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`}>
                    <Moon className="size-4" />
                  </span>
                </button>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid size-9 place-items-center rounded-md hover:bg-muted cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-border">
              <NavLink to="/account/orders" className="flex items-center justify-center gap-1.5 text-xs text-center p-2 rounded-md bg-muted hover:bg-muted/80"><ClipboardList className="size-3.5" /> Your Orders</NavLink>
              <NavLink to="/compare" className="flex items-center justify-center gap-1.5 text-xs text-center p-2 rounded-md bg-muted hover:bg-muted/80"><ArrowRightLeft className="size-3.5" /> Compare</NavLink>
              <NavLink to="/wishlist" className="flex items-center justify-center gap-1.5 text-xs text-center p-2 rounded-md bg-muted hover:bg-muted/80"><Heart className="size-3.5" /> Wishlist</NavLink>
              <NavLink to="/help" className="text-xs text-center p-2 rounded-md bg-muted hover:bg-muted/80">Help Center</NavLink>
            </div>

            <div className="space-y-1">
              {categories.map((c) => {
                const isActive = pathname === `/category/${c.slug}`;
                return (
                  <NavLink
                    key={c.slug}
                    to={`/category/${c.slug}`}
                    className={`block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-muted text-foreground font-medium' : 'hover:bg-muted'}`}
                  >
                    {c.name}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Badge({ n }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 min-w-[18px] h-[18px] grid place-items-center rounded-full bg-clay text-clay-foreground text-[10px] font-semibold px-1">
      {n > 99 ? "99+" : n}
    </span>
  );
}
import { NavLink , useLocation } from "react-router-dom";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/cart", label: "Cart", icon: ShoppingBag },
  { to: "/auth/login", label: "Account", icon: User },
];

export function MobileNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const { cartCount, wishlist } = useStore();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border"
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== "/" && pathname.startsWith(to));
          const badge = to === "/cart" ? cartCount : to === "/wishlist" ? wishlist.length : 0;
          return (
            <li key={to}>
              <NavLink
                to={to}
                className={`relative flex flex-col items-center justify-center gap-1 py-2 text-[10px] ${active ? "text-brand" : "text-muted-foreground"}`}
              >
                <Icon className="size-5" />
                {label}
                {badge > 0 && (
                  <span className="absolute top-1 right-[28%] min-w-[16px] h-[16px] grid place-items-center rounded-full bg-clay text-clay-foreground text-[9px] font-semibold px-1">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

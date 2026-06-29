import React from "react";
import {NavLink } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-sand/60">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-brand text-brand-foreground font-display text-lg font-bold">
              H
            </span>
            <span className="font-display text-xl font-semibold">HomeNeeds</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A modern marketplace for the things that make a house feel like home — thoughtfully
            sourced, fairly priced, beautifully delivered.
          </p>
          <form className="mt-6 flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="you@home.com"
              aria-label="Email for newsletter"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
            />

            <button type="submit" className="rounded-md bg-brand px-4 py-2 cursor-pointer text-sm font-medium text-brand-foreground hover:opacity-90">
              Subscribe
            </button>
          </form>
        </div>

        <FooterCol
          title="Shop"
          links={[
            ["New arrivals", "/search?q=new"],
            ["Today's deals", "/search?q=deals"],
            ["Best sellers", "/search?q=best"],
            ["Gift cards", "/help"],
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            ["Sign in", "/auth/login"],
            ["Your orders", "/account/orders"], 
            ["Wishlist", "/wishlist"],
            ["Subscriptions", "/subscriptions"],
            ["Settings", "/auth/settings"], 
            ["Returns", "/help"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["About", "/about"],
            ["Careers", "/about"],
            ["Privacy Policy", "/privacy-policy"],
            ["Terms of Service", "/terms-of-service"],
          ]}
        />
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-2 py-5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} HomeNeeds. A sample storefront.</p>
         <a href="https://github.com/KrishLad-Narola/HomeNeeds"
            target="_blank" 
            className="hover:text-black cursor-pointer"
            rel="noopener noreferrer">Home source code </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold uppercase tracking-wider">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <NavLink to={href} className="text-muted-foreground hover:text-foreground">
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
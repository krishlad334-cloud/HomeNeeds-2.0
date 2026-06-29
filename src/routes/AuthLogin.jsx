import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Eye, EyeOff } from "lucide-react";

export default function AuthLogin() {
  const { login, user, logout } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  if (user) {
    return (
      <div className="container-page py-16 max-w-md">
        <div className="surface-card p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">Hi, {user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-6 flex gap-3 justify-center">
            <NavLink to="/" className="rounded-md bg-brand px-4 py-2 text-sm text-brand-foreground">
              Keep shopping
            </NavLink>
            <button
              onClick={logout}
              className="rounded-md border border-border cursor-pointer px-4 py-2 text-sm hover:bg-muted"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12 grid lg:grid-cols-2 gap-12 items-center">
      <div className="hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80"
          alt=""
          className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lift"
        />
      </div>
      <div className="max-w-md mx-auto w-full">
        <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to view orders, wishlist, and addresses.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) {
              login(email);
              nav("/");
            }
          }}
          className="mt-8 space-y-4"
        >
          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand"
              placeholder="you@home.com"
            />
          </Field>

          <Field label="Password">
            <div className="relative w-full">
              <input
                type={showPwd ? "text" : "password"}
                required
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="w-full rounded-md border border-border bg-background pl-3 pr-10 py-2.5 text-sm outline-none focus:border-brand"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </Field>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="rounded cursor-pointer border-border" /> Remember me
            </label>
            <NavLink to="/auth/forgot-password" className="text-brand hover:underline">
              Forgot
            </NavLink>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-brand py-3 cursor-pointer text-sm font-medium text-brand-foreground shadow-lift hover:opacity-95"
          >
            Sign in
          </button>

          <button
            type="button"
            className="w-full rounded-full cursor-pointer border border-border bg-background py-3 text-sm font-medium hover:bg-muted"
          >
            Continue with Google
          </button>

          <p className="text-center cursor-pointer text-sm text-muted-foreground">
            New here?{" "}
            <NavLink to="/auth/register" className="text-brand hover:underline">
              Create an account
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
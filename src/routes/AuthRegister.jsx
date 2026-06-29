import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

export default function AuthRegister() {
  const { login } = useStore();
  const nav = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <div className="container-page py-12 max-w-md">
      <h1 className="font-display text-3xl font-semibold">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">It takes about thirty seconds.</p>
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
        <input
          required
          placeholder="Full name"
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
        />
        <input
          required
          type="password"
          placeholder="Password"
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-brand cursor-pointer py-3 text-sm font-medium text-brand-foreground shadow-lift hover:opacity-95"
        >
          Create account
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Already have one?{" "}
          <NavLink to="/auth/login" className="text-brand hover:underline">
            Sign in
          </NavLink>
        </p>
      </form>
    </div>
  );
}

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

export default function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] || "",
      });
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      
      setIsSubmitted(true);
    } catch (err) {
      setErrors({ email: "Something went wrong. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container-page py-16 max-w-md">
        <div className="surface-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 19.5l8.25-7.5 8.25 7.5m-16.5-6l8.25-7.5 8.25 7.5" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-semibold mt-4">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a password reset link to <strong className="text-foreground">{email}</strong>.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <NavLink to="/auth/login" className="rounded-md bg-brand px-4 py-2 text-sm text-brand-foreground hover:opacity-95">
              Back to login
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12 grid lg:grid-cols-2 gap-12 items-center">
      <div className="hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&q=80"
          alt="Secure reset panel"
          className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lift"
        />
      </div>

      {/* Main interaction form box */}
      <div className="max-w-md mx-auto w-full">
        <h1 className="font-display text-3xl font-semibold">Forgot password?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No worries! Enter your email address and we will send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors
                ${errors.email ? "border-destructive focus:border-destructive" : "border-border focus:border-brand"}`}
              placeholder="you@home.com"
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand py-3 cursor-pointer text-sm font-medium text-brand-foreground shadow-lift hover:opacity-95 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Sending link..." : "Send reset link"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Remembered your password?{" "}
            <NavLink to="/auth/login" className="text-brand hover:underline">
              Back to login
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="block">
      <label className="block">
        <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
          {label}
        </span>
        {children}
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-destructive font-medium flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
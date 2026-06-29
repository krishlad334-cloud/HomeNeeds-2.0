import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";

export default function ChangePassword() {
    const { user } = useStore(); 
    const nav = useNavigate();

    // State for form fields
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");

    // UI States
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError("");
        setSuccess(false);

        if (newPwd.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }

        if (newPwd !== confirmPwd) {
            setError("New password and confirmation password do not match.");
            return;
        }

        if (currentPwd === newPwd) {
            setError("New password cannot be the same as your current password.");
            return;
        }

        try {
            setIsLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSuccess(true);
            // Clear inputs
            setCurrentPwd("");
            setNewPwd("");
            setConfirmPwd("");

            setTimeout(() => {
                nav("/");
            }, 2000);

        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-page py-12 grid lg:grid-cols-2 gap-12 items-center">
            {/* Decorative Image Side */}
            <div className="hidden lg:block">
                <img
                    src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80"
                    alt="Change Password Context"
                    className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lift"
                />
            </div>

            {/* Form Side */}
            <div className="max-w-md mx-auto w-full">
                <h1 className="font-display text-3xl font-semibold">Update Password</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Ensure your account stays secure by using a strong password.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    {/* Error Message Notification */}
                    {error && (
                        <div className="p-3 text-sm rounded-md bg-destructive/10 text-destructive border border-destructive/20 font-medium">
                            {error}
                        </div>
                    )}

                    {/* Success Message Notification */}
                    {success && (
                        <div className="p-3 text-sm rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium">
                            Password updated successfully! Redirecting...
                        </div>
                    )}

                    <Field label="Current Password">
                        <input
                            type="password"
                            required
                            disabled={isLoading}
                            value={currentPwd}
                            onChange={(e) => setCurrentPwd(e.target.value)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand disabled:opacity-50"
                            placeholder="••••••••"
                        />
                    </Field>

                    <Field label="New Password">
                        <input
                            type="password"
                            required
                            disabled={isLoading}
                            value={newPwd}
                            onChange={(e) => setNewPwd(e.target.value)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand disabled:opacity-50"
                            placeholder="Minimum 8 characters"
                        />
                    </Field>

                    <Field label="Confirm New Password">
                        <input
                            type="password"
                            required
                            disabled={isLoading}
                            value={confirmPwd}
                            onChange={(e) => setConfirmPwd(e.target.value)}
                            className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand disabled:opacity-50"
                            placeholder="••••••••"
                        />
                    </Field>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 rounded-full bg-brand py-3 cursor-pointer text-sm font-medium text-brand-foreground shadow-lift hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? "Saving changes..." : "Update Password"}
                    </button>

                    <p className="text-center cursor-pointer text-sm text-muted-foreground pt-2">
                        Changed your mind?{" "}
                        <NavLink to="/" className="text-brand hover:underline">
                            Back to Store
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
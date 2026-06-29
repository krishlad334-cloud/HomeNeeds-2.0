import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; 

export function SettingsPage({ currentUser }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Initialize state with currentUser data if available immediately
  const [profile, setProfile] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
  });
  
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    if (currentUser) {
      setProfile({
        name: currentUser.name || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      setMessage({ type: "success", text: "Profile details updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateAccount = async (e) => {
    e.preventDefault();
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate your account? You can log back in anytime to reactivate it."
    );
    
    if (!confirmDeactivate) return;

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      alert("Your account has been temporarily deactivated. Logging out...");
    } catch (error) {
      setMessage({ type: "error", text: "Failed to deactivate account." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleteConfirmation.trim().toUpperCase() !== "DELETE") {
      setMessage({ type: "error", text: "Please type 'DELETE' precisely to confirm." });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Account has been permanently deleted. Goodbye.");
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete account." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-page max-w-4xl mx-auto mt-10 p-6 bg-background rounded-xl border border-border shadow-sm">
      <h1 className="font-display text-3xl font-bold tracking-tight mb-6 text-foreground">
        Account Settings
      </h1>

      {/* Global Status Banner */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md text-sm border font-medium ${
          message.type === "success" 
            ? "bg-green-50 text-green-700 border-green-200" 
            : "bg-red-50 text-red-700 border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-1/4 flex flex-col gap-2">
          <button
            disabled={isLoading}
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2.5 cursor-pointer rounded-md text-sm font-medium transition ${
              activeTab === "profile"
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:bg-sand/40 hover:text-foreground disabled:opacity-50"
            }`}
          >
            User Profile
          </button>

          <NavLink
            to="/auth/change-password"
            className="w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition text-muted-foreground hover:bg-sand/40 hover:text-foreground"
          >
            Change Password
          </NavLink>

          <button
            disabled={isLoading}
            onClick={() => setActiveTab("deactivate")}
            className={`w-full text-left px-4 py-2.5 cursor-pointer rounded-md text-sm font-medium transition ${
              activeTab === "deactivate"
                ? "bg-amber-50 text-amber-700 font-semibold border-amber-200"
                : "text-muted-foreground hover:bg-amber-50/50 hover:text-amber-600 disabled:opacity-50"
            }`}
          >
            Deactivate Account
          </button>

          <button
            disabled={isLoading}
            onClick={() => setActiveTab("delete")}
            className={`w-full text-left px-4 py-2.5 cursor-pointer rounded-md text-sm font-medium transition ${
              activeTab === "delete"
                ? "bg-red-50 text-red-600 font-semibold"
                : "text-muted-foreground hover:bg-red-50/50 hover:text-red-500 disabled:opacity-50"
            }`}
          >
            Delete Account
          </button>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 bg-sand/10 p-6 rounded-lg border border-border/40 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-lg z-10 backdrop-blur-[1px]">
              <div className="text-sm font-medium text-muted-foreground animate-pulse">Processing request...</div>
            </div>
          )}

          {/* TAB 1: Profile Details */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 rounded-md bg-brand px-4 py-2 cursor-pointer text-sm font-medium text-brand-foreground hover:opacity-90 disabled:opacity-50 transition"
              >
                Save Changes
              </button>
            </form>
          )}

          {/* TAB 2: Deactivate Account */}
          {activeTab === "deactivate" && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-amber-600 mb-2">Deactivate Account</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Temporarily disable your account. This hides your profile and data across the store until you decide to return. You can easily reactivate it at any time by simply logging back in.
              </p>
              <button
                onClick={handleDeactivateAccount}
                disabled={isLoading}
                className="mt-2 rounded-md cursor-pointer bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50 transition"
              >
                Deactivate My Account
              </button>
            </div>
          )}

          {/* TAB 3: Delete Account */}
          {activeTab === "delete" && (
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Danger Zone</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Deleting your account is permanent. All your purchase history, credentials, and data will be permanently wiped.
              </p>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                  Type <span className="font-bold text-foreground">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  placeholder="DELETE"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="w-full rounded-md border border-red-300 bg-background px-3 py-2 text-sm outline-none focus:border-red-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 rounded-md cursor-pointer bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition"
              >
                Permanently Delete My Account
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
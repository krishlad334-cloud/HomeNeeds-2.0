import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("hn:theme");
      if (stored === "dark" || stored === "light") return stored;
    } catch {}
    // System preference fallback
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Apply class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("hn:theme", theme); } catch {}
  }, [theme]);

  const toggle = useCallback((e) => {
    const isDark = theme === "dark";
    const nextTheme = isDark ? "light" : "dark";
    
    if (!document.startViewTransition || !e || typeof e.clientX !== 'number') {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      setTheme(nextTheme);
      try { localStorage.setItem("hn:theme", nextTheme); } catch {}
      return;
    }
    
    // Get click coordinates
    const x = e.clientX;
    const y = e.clientY;
    
    // Calculate max radius needed to cover the screen
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    
    const transition = document.startViewTransition(() => {
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      setTheme(nextTheme);
      try { localStorage.setItem("hn:theme", nextTheme); } catch {}
    });
    
    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];
      
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: isDark ? "::view-transition-old(root)" : "::view-transition-new(root)",
        }
      );
    });
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, toggle, isDark: theme === "dark" }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

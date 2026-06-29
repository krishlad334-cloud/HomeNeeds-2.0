import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "@/context/StoreContext";
import { OrderProvider } from "@/context/OrderContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { AIChatbot } from "@/components/chat/AIChatbot";

// Import pages
import Home from "./routes/Home";
import Cart from "./routes/Cart";
import Checkout from "./routes/Checkout";
import Search from "./routes/Search";
import Wishlist from "./routes/Wishlist";
import AuthLogin from "./routes/AuthLogin";
import AuthRegister from "./routes/AuthRegister";
import ForgotPassword from "./routes/ForgotPassword";
import CategoryDetail from "./routes/CategoryDetail";
import ProductDetail from "./routes/ProductDetail";
import ChangePassword from "./routes/ChangePassword";
import { SettingsPage } from "./routes/SettingsPage";
import About from "./routes/About";
import PrivacyPolicy from "./routes/PrivacyPolicy";
import TermsOfService from "./routes/TermsOfService";
import YourOrders from "./routes/YourOrders";
import HelpPage from "./routes/HelpPage";
import Subscriptions from "./routes/Subscriptions";
import OrderTracking from "./routes/OrderTracking";
import Compare from "./routes/Compare";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Layout({ children }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNav />
      <AIChatbot />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <OrderProvider>
          <StoreProvider>
            <SubscriptionProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/account/orders" element={<YourOrders />} />
                  <Route path="/orders/:id/track" element={<OrderTracking />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  {/* Auth Routes */}
                  <Route path="/auth/login" element={<AuthLogin />} />
                  <Route path="/auth/register" element={<AuthRegister />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  {/* Account Routes */}
                  <Route path="/compare" element={<Compare />} />
                  <Route path="/auth/settings" element={<SettingsPage />} />
                  <Route path="/auth/change-password" element={<ChangePassword />} />
                  <Route path="/category/:slug" element={<CategoryDetail />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  {/* Catch-all 404 */}
                  <Route path="*" element={
                    <div className="flex min-h-[70vh] items-center justify-center px-4">
                      <div className="max-w-md text-center">
                        <h1 className="font-display text-7xl font-bold">404</h1>
                        <p className="mt-3 text-muted-foreground">We can't find that page.</p>
                        <a href="/" className="mt-6 inline-flex rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90">
                          Back home
                        </a>
                      </div>
                    </div>
                  } />
                </Routes>
              </Layout>
            </BrowserRouter>
            </SubscriptionProvider>
          </StoreProvider>
        </OrderProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
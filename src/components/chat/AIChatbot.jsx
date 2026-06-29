import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  Minimize2,
  ShoppingBag,
  Package,
  Gift,
  TrendingUp,
  Tag,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useOrder } from "@/context/OrderContext";
import { inr } from "@/lib/format";
import { ChatProductCard } from "./ChatProductCard";
import {
  getGiftSuggestions,
  getTrending,
  getDeals,
  getYouMayAlsoLike,
} from "@/lib/recommendations";
import { products, search as searchProducts } from "@/data/products";

// ─────────────────────────────────────────────────────────────────────────────
// Quick-reply chip data
// ─────────────────────────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  { icon: TrendingUp, label: "What's trending?" },
  { icon: Tag, label: "Show me deals" },
  { icon: Gift, label: "Gift suggestions" },
  { icon: Package, label: "Track my order" },
  { icon: ShoppingBag, label: "Popular picks" },
];

// ─────────────────────────────────────────────────────────────────────────────
// AI Brain — pure function, returns { text, products?, quickReplies? }
// ─────────────────────────────────────────────────────────────────────────────
function aiRespond(input, orders) {
  const q = input.toLowerCase().trim();

  // ── Greetings ──────────────────────────────────────────────────────────────
  if (/^(hi|hello|hey|sup|yo|hola|namaste|good\s*(morning|afternoon|evening))/.test(q)) {
    return {
      text: "Hey there! 👋 I'm your HomeNeeds AI Shopping Assistant. I can help you:\n\n• 🔍 Find the perfect product\n• 🎁 Get gift ideas by budget\n• 📦 Track your orders\n• 🔥 Discover deals & trending items\n\nWhat can I help you with today?",
      quickReplies: QUICK_REPLIES,
    };
  }

  // ── Help / What can you do ─────────────────────────────────────────────────
  if (/\b(help|what can you do|capabilities|how do you work)\b/.test(q)) {
    return {
      text: "Here's everything I can help with:\n\n**🛍️ Product Discovery**\nAsk me things like *\"show me headphones\"*, *\"find kitchen appliances\"*, or *\"what's good under ₹2000\"*\n\n**🎁 Gift Ideas**\nTry *\"gift for mom under ₹3000\"* or *\"birthday gift for husband\"*\n\n**📦 Order Tracking**\nAsk *\"where is my order\"* or *\"track order\"*\n\n**🔥 Trending & Deals**\nAsk *\"what's trending\"* or *\"show deals\"*\n\n**💬 General Support**\nI'm here for returns, delivery queries, and more!",
      quickReplies: QUICK_REPLIES,
    };
  }

  // ── Order tracking ─────────────────────────────────────────────────────────
  if (/\b(track|order|orders|where.*order|order.*status|shipment|shipped|delivery status)\b/.test(q)) {
    if (!orders || orders.length === 0) {
      return {
        text: "You don't have any orders yet. 😊\n\nStart shopping and your orders will appear here once placed! Want me to show you some popular products?",
        quickReplies: [
          { icon: TrendingUp, label: "What's trending?" },
          { icon: Tag, label: "Show me deals" },
        ],
      };
    }
    const recent = [...orders].reverse().slice(0, 3);
    const orderLines = recent
      .map(
        (o) =>
          `📦 **${o.id}** — ${o.status}\n   Placed: ${o.date} · Total: ${inr(o.total)}`
      )
      .join("\n\n");
    return {
      text: `Here are your recent orders:\n\n${orderLines}\n\nNeed help with returns or more details? Just ask!`,
      quickReplies: [
        { icon: RotateCcw, label: "Return policy?" },
        { icon: ShoppingBag, label: "Continue shopping" },
      ],
    };
  }

  // ── Gift suggestions ───────────────────────────────────────────────────────
  if (/\b(gift|present|birthday|anniversary|surprise)\b/.test(q)) {
    // Extract budget
    const budgetMatch = q.match(/(?:under|below|within|upto|up to|₹|rs\.?)\s*(\d[\d,]*)/i);
    let budget = null;
    if (budgetMatch) {
      budget = parseInt(budgetMatch[1].replace(/,/g, ""), 10);
    }

    // Extract recipient
    const RECIPIENTS = ["mom", "dad", "wife", "husband", "boyfriend", "girlfriend", "friend",
      "sister", "brother", "kids", "son", "daughter", "parent", "grandma", "grandpa",
      "colleague", "teacher", "boss"];
    const recipient = RECIPIENTS.find((r) => q.includes(r)) || null;

    const suggestions = getGiftSuggestions({ budget, recipient, limit: 4 });

    let intro = "🎁 Here are some great gift ideas";
    if (recipient) intro += ` for your **${recipient}**`;
    if (budget) intro += ` under **${inr(budget)}**`;
    intro += "!\n\nAll of these are highly rated and popular:";

    return {
      text: intro,
      products: suggestions,
      quickReplies: budget
        ? []
        : [
            { icon: Gift, label: "Gift under ₹1000" },
            { icon: Gift, label: "Gift under ₹3000" },
            { icon: Gift, label: "Gift under ₹10000" },
          ],
    };
  }

  // ── Budget-based search ────────────────────────────────────────────────────
  if (/\b(under|below|within|budget|cheap|affordable|₹|rs\.?)\b/.test(q) && !q.includes("gift")) {
    const budgetMatch = q.match(/(?:under|below|within|₹|rs\.?)\s*(\d[\d,]*)/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, ""), 10) : 5000;

    const inBudget = products
      .filter((p) => p.price <= budget)
      .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
      .slice(0, 4);

    return {
      text: `Here are top-rated products under **${inr(budget)}** 💰:`,
      products: inBudget,
    };
  }

  // ── Trending ───────────────────────────────────────────────────────────────
  if (/\b(trending|popular|hot|viral|top|best seller|bestseller|most loved)\b/.test(q)) {
    const trending = getTrending(4);
    return {
      text: "🔥 Here's what's trending at HomeNeeds right now:",
      products: trending,
      quickReplies: [{ icon: Tag, label: "Show me deals" }],
    };
  }

  // ── Deals / Sales ──────────────────────────────────────────────────────────
  if (/\b(deal|deals|sale|discount|offer|off|save|coupon)\b/.test(q)) {
    const deals = getDeals(4);
    return {
      text: "🏷️ Here are today's best deals — prices won't last long!",
      products: deals,
      quickReplies: [{ icon: TrendingUp, label: "What's trending?" }],
    };
  }

  // ── Popular picks ──────────────────────────────────────────────────────────
  if (/\b(popular|recommend|suggestion|what to buy|good product|best product|top product)\b/.test(q)) {
    const popular = [...products]
      .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
      .slice(0, 4);
    return {
      text: "⭐ Here are our most loved products across all categories:",
      products: popular,
    };
  }

  // ── Return policy ──────────────────────────────────────────────────────────
  if (/\b(return|refund|exchange|policy)\b/.test(q)) {
    return {
      text: "↩️ **Return & Refund Policy**\n\n• **30-day returns** on all products\n• Items must be in original condition with tags\n• Refunds processed within 5–7 business days\n• Free return pickup available\n\nTo initiate a return, go to **Your Orders** and click 'Return Item'. Need more help?",
      quickReplies: [{ icon: Package, label: "Track my order" }],
    };
  }

  // ── Delivery / Shipping ────────────────────────────────────────────────────
  if (/\b(delivery|shipping|ship|dispatch|when.*arrive|how long)\b/.test(q)) {
    return {
      text: "🚚 **Delivery Information**\n\n• **Free shipping** on orders above ₹1,499\n• Standard delivery: **2–5 business days**\n• Express delivery available at checkout\n• Real-time tracking once shipped\n\nWant to know the delivery time for a specific product? Just search for it!",
    };
  }

  // ── Warranty / Quality ─────────────────────────────────────────────────────
  if (/\b(warranty|guarantee|quality|authentic|original|genuine)\b/.test(q)) {
    return {
      text: "🛡️ **Quality Assurance**\n\nAll products at HomeNeeds are:\n\n• ✅ 100% authentic from verified brands\n• ✅ Quality-checked before shipping\n• ✅ Covered by manufacturer warranty\n• ✅ Easy returns if not satisfied\n\nYou shop with full confidence here!",
    };
  }

  // ── Payment ────────────────────────────────────────────────────────────────
  if (/\b(payment|pay|upi|card|emi|cash|cod|net banking)\b/.test(q)) {
    return {
      text: "💳 **Payment Options**\n\nWe accept:\n• UPI (GPay, PhonePe, Paytm)\n• Credit/Debit cards (Visa, Mastercard, RuPay)\n• Net Banking\n• EMI (0% on select products)\n• Cash on Delivery\n\nAll transactions are 100% secure with SSL encryption. 🔒",
    };
  }

  // ── Category-based search ──────────────────────────────────────────────────
  const CATEGORY_KEYWORDS = {
    electronics: ["electronics", "gadget", "tech", "device", "speaker", "headphone", "earphone", "earbud", "laptop", "computer"],
    mobiles: ["mobile", "phone", "smartphone", "iphone", "android"],
    fashion: ["fashion", "cloth", "shirt", "pant", "dress", "apparel", "wear", "outfit", "sweater", "hoodie"],
    "home-kitchen": ["kitchen", "cook", "cookware", "pan", "pot", "oven", "utensil", "coffee"],
    furniture: ["furniture", "chair", "table", "sofa", "desk", "shelf", "wardrobe", "couch"],
    appliances: ["appliance", "vacuum", "washing machine", "fridge", "refrigerator", "microwave", "robot"],
    beauty: ["beauty", "serum", "skincare", "makeup", "moisturizer", "cream", "face wash"],
    sports: ["sport", "fitness", "gym", "yoga", "running", "shoe", "sneaker", "workout"],
    decor: ["decor", "decoration", "lamp", "candle", "vase", "throw", "blanket", "cushion", "pillow"],
    office: ["office", "stationery", "notebook", "pen", "desk", "work from home"],
    books: ["book", "novel", "read", "fiction", "non-fiction"],
    toys: ["toy", "game", "play", "puzzle", "lego"],
    health: ["health", "wellness", "supplement", "vitamin", "medicine"],
    grocery: ["grocery", "food", "snack", "beverage", "drink"],
  };

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      const catProducts = products.filter((p) => p.category === cat);
      if (catProducts.length > 0) {
        const sorted = catProducts
          .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
          .slice(0, 4);
        return {
          text: `Here are our top picks in **${cat.replace("-", " & ")}** 🛍️:`,
          products: sorted,
          quickReplies: [{ icon: TrendingUp, label: "What's trending?" }],
        };
      }
    }
  }

  // ── Product search by name ─────────────────────────────────────────────────
  const searchResults = searchProducts(input);
  if (searchResults.length > 0) {
    return {
      text: `I found **${searchResults.length}** product${searchResults.length > 1 ? "s" : ""} matching "${input}" 🔍:`,
      products: searchResults.slice(0, 4),
    };
  }

  // ── You may also like fallback ─────────────────────────────────────────────
  const fallbackProducts = getYouMayAlsoLike(products[0], 4);
  return {
    text: `Hmm, I'm not sure about *"${input}"* 🤔\n\nBut here are some products you might love! Or try asking me something like:\n• "Show me headphones"\n• "Gift for mom under ₹2000"\n• "What's trending?"`,
    products: fallbackProducts,
    quickReplies: QUICK_REPLIES.slice(0, 3),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AIChatbot — the main component
// ─────────────────────────────────────────────────────────────────────────────
export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi there! 👋 I'm your **AI Shopping Assistant**. I can recommend products, find great deals, suggest gifts, and track your orders.\n\nHow can I help you today?",
      quickReplies: QUICK_REPLIES,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { orders } = useOrder();

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Show unread pulse after 8s if user hasn't opened chat
  useEffect(() => {
    const t = setTimeout(() => {
      if (!isOpen) setHasUnread(true);
    }, 8000);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
  };

  const sendMessage = useCallback(
    (text) => {
      const userText = (text || input).trim();
      if (!userText) return;

      const userMsg = {
        id: Date.now().toString(),
        role: "user",
        text: userText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Simulate AI "thinking" delay (400–900ms)
      const delay = 400 + Math.random() * 500;
      setTimeout(() => {
        const response = aiRespond(userText, orders);
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          ...response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, delay);
    },
    [input, orders]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  // Parse **bold** markdown in text
  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      // Handle newlines
      return part.split("\n").map((line, j) => (
        <span key={`${i}-${j}`}>
          {line}
          {j < part.split("\n").length - 1 && <br />}
        </span>
      ));
    });
  };

  return (
    <>
      {/* ── Floating Trigger Button ───────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={handleOpen}
            id="ai-chatbot-trigger"
            aria-label="Open AI Shopping Assistant"
            className="fixed bottom-6 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-clay shadow-lift cursor-pointer hover:scale-110 transition-transform duration-200 md:bottom-8 md:right-8"
          >
            <Sparkles className="size-6 text-white" />
            {hasUnread && (
              <span className="absolute -right-0.5 -top-0.5 size-4 rounded-full bg-red-500 border-2 border-background animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 right-4 z-[9998] flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-[0_8px_40px_rgba(0,0,0,0.18)] md:bottom-8 md:right-8"
            style={{
              width: "min(390px, calc(100vw - 32px))",
              height: isMinimized ? "auto" : "min(580px, calc(100dvh - 100px))",
            }}
            role="dialog"
            aria-label="AI Shopping Assistant"
            aria-modal="false"
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-brand to-clay p-4 text-white">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <Sparkles className="size-5" />
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-clay bg-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">AI Shopping Assistant</p>
                <p className="text-[11px] text-white/75">Always online · Powered by HomeNeeds AI</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized((v) => !v)}
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                  className="grid h-7 w-7 place-items-center rounded-md hover:bg-white/20 transition cursor-pointer"
                >
                  <Minimize2 className="size-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="grid h-7 w-7 place-items-center rounded-md hover:bg-white/20 transition cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* ── Messages ─────────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-smooth">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`shrink-0 mt-1 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                          msg.role === "assistant"
                            ? "bg-gradient-to-br from-brand to-clay text-white"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <Bot className="size-3.5" />
                        ) : (
                          <UserIcon className="size-3.5" />
                        )}
                      </div>

                      <div
                        className={`flex max-w-[82%] flex-col gap-2 ${
                          msg.role === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        {/* Text bubble */}
                        {msg.text && (
                          <div
                            className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                              msg.role === "user"
                                ? "rounded-tr-sm bg-brand text-brand-foreground"
                                : "rounded-tl-sm bg-muted text-foreground"
                            }`}
                          >
                            {renderText(msg.text)}
                          </div>
                        )}

                        {/* Product cards */}
                        {msg.products && msg.products.length > 0 && (
                          <div className="w-full max-w-[300px] space-y-2">
                            {msg.products.map((p) => (
                              <ChatProductCard key={p.id} product={p} />
                            ))}
                          </div>
                        )}

                        {/* Quick reply chips */}
                        {msg.quickReplies && msg.quickReplies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {msg.quickReplies.map((qr) => (
                              <button
                                key={qr.label}
                                onClick={() => sendMessage(qr.label)}
                                className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-medium text-foreground hover:bg-brand hover:text-brand-foreground hover:border-brand transition-colors cursor-pointer"
                              >
                                <qr.icon className="size-2.5" />
                                {qr.label}
                                <ChevronRight className="size-2.5 opacity-50" />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Timestamp */}
                        <p className="text-[9px] text-muted-foreground/60 px-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="flex items-center gap-2.5"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-clay text-white">
                          <Bot className="size-3.5" />
                        </div>
                        <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="block h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.15,
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={bottomRef} />
                </div>

                {/* ── Input Bar ────────────────────────────────────────── */}
                <div className="shrink-0 border-t border-border bg-background/95 p-3">
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 focus-within:border-brand transition-colors">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything… products, gifts, orders"
                      className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground/70"
                      aria-label="Message AI Shopping Assistant"
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isTyping}
                      aria-label="Send message"
                      className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-brand-foreground transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Send className="size-3.5" />
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[9px] text-muted-foreground/50">
                    AI responses are based on HomeNeeds product catalog
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

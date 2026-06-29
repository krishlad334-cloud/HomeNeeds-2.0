import React, { useState } from 'react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: "How do I qualify for free shipping?",
      answer: "Free shipping is automatically applied to all orders over ₹1,499. For orders below this amount, a standard delivery fee will be calculated at checkout based on your location."
    },
    {
      question: "What is your return policy?",
      answer: "We offer an easy 30-day return policy on most items. Products must be unused, in their original packaging, and with all tags intact. You can initiate a return directly from your 'Orders' panel."
    },
    {
      question: "How can I sell my products on HomeNeeds?",
      answer: "Click on the 'Sell on HomeNeeds' link in the top announcement bar, fill out our seller registration form, upload your business documents (GSTIN/PAN), and you can start listing your products within 24 hours!"
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery times vary depending on your location. Typically, metro cities receive orders within 2-4 business days, while other regions take 4-7 business days. Fast delivery tracking links are shared via SMS and Email."
    }
  ];

  const categories = [
    { icon: "📦", title: "Orders & Delivery", desc: "Track, change, or cancel your shipments." },
    { icon: "🔄", title: "Returns & Refunds", desc: "Return policies and tracking your money." },
    { icon: "👤", title: "Account & Settings", desc: "Manage your profile, addresses, and security." },
    { icon: "🏪", title: "Selling on HomeNeeds", desc: "Merchant support, listings, and payouts." }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <nav className="glass border-b border-border py-3 px-6 text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto flex gap-2">
          <a href="/" className="hover:text-brand transition">Home</a>
          <span>/</span>
          <span className="text-foreground font-medium">Help & Support</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-brand to-clay text-brand-foreground py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">How can we help you today?</h1>
          <p className="text-brand-foreground/80 mb-8">Search for topics, orders, returns, and seller guides.</p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-5 pr-12 py-3.5 rounded-full border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand shadow-soft"
            />
            <span className="absolute right-4 top-3.5 text-xl cursor-pointer">🔍</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Help Categories Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Browse Help Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="surface-card p-6 transition hover:-translate-y-1 cursor-pointer">
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-lg text-foreground mb-1">{cat.title}</h3>
                <p className="text-sm text-muted-foreground">{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Accordion */}
        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs
              .filter(faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((faq, idx) => (
                <div key={idx} className="surface-card overflow-hidden transition">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center p-5 text-left font-medium text-foreground hover:bg-muted transition"
                  >
                    <span>{faq.question}</span>
                    <span className="text-xl cursor-pointer text-muted-foreground">{activeFaq === idx ? '−' : '+'}</span>
                  </button>
                  {activeFaq === idx && (
                    <div className="p-5 bg-muted/30 border-t border-border text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>

        {/* Contact/Support Footer Box */}
        <section className="surface-card bg-brand/5 border-brand/20 p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-2">Still need help?</h3>
          <p className="text-muted-foreground text-sm mb-6">Our customer support team is available 24/7 to assist you.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-brand text-brand-foreground px-6 py-2.5 cursor-pointer rounded-lg font-medium hover:opacity-90 transition shadow-sm">
              Chat Live With Us
            </button>
            <button className="bg-background border border-border text-foreground cursor-pointer px-6 py-2.5 rounded-lg font-medium hover:bg-muted transition shadow-sm">
              Email Support
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
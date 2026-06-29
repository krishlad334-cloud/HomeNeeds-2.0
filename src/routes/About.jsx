import { WalletCards, WalletCardsIcon } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Banner Accent - Using matching footer & brand styles */}
      <div className="bg-brand text-brand-foreground text-xs py-2 px-4 text-center font-medium tracking-wide">
        Crafting spaces, building comfort — The HomeNeeds Story.
      </div>

      {/* Main Layout Container */}
      <main className="container-page py-16 md:py-24">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-brand font-medium text-sm uppercase tracking-widest block">
              <WalletCardsIcon /> Our Purpose
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight">
              We believe every space should <span className="text-[#C87A53] italic">feel like home.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Founded with a simple mission, HomeNeeds curates everyday essentials and once-in-a-while splurges to help you design a life well-lived. We bridge the gap between fair pricing, premium quality, and thoughtful design.
            </p>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="rounded-t-[100px] rounded-b-3xl overflow-hidden shadow-xl bg-sand/40 aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80" 
                alt="Beautifully curated living room" 
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </div>
            <div className="absolute top-8 right-[-10px] bg-background/95 backdrop-blur-sm py-3 px-6 rounded-2xl shadow-lg border border-border">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Est. Since</p>
              <p className="text-xl font-display font-bold text-brand">2024</p>
            </div>
          </div>
        </div>

        <hr className="border-border my-16" />

        <div className="mb-24">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-semibold text-foreground">The Core Pillars of HomeNeeds</h2>
            <p className="text-muted-foreground mt-2 text-sm">The standards we live by to bring you the finest storefront experiences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-sand/20 p-8 rounded-2xl border border-border hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-brand text-brand-foreground rounded-full flex items-center justify-center font-display font-bold text-lg mb-6">
                01
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">Curated Quality</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We hand-pick every item on our platform, working closely with creators and brands who care deeply about durability and aesthetics.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-sand/20 p-8 rounded-2xl border border-border hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-sand text-brand rounded-full flex items-center justify-center font-display font-bold text-lg mb-6">
                02
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">Fair Pricing</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                By optimizing our logistics network and reducing unnecessary markups, we deliver premium home goods without the luxury price tag.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-sand/20 p-8 rounded-2xl border border-border hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-brand text-brand-foreground rounded-full flex items-center justify-center font-display font-bold text-lg mb-6">
                03
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">Fast Delivery</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your home can’t wait. We ensure secure, tracked, and rapid delivery right to your doorstep, backed by easy 30-day returns.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-brand rounded-[40px] text-brand-foreground p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight">Ready to transform your daily living spaces?</h2>
            <p className="text-brand-foreground/80 text-sm md:text-base max-w-md mx-auto">
              Explore our fresh seasonal collections and find your home's missing piece today.
            </p>
            <div className="pt-4">
              <NavLink 
                to="/search?q=new" 
                className="bg-background text-foreground hover:bg-sand/40 px-8 py-3 rounded-md text-sm font-medium transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                Shop the edit 
                <span className="text-base">→</span>
              </NavLink>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
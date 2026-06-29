import React, { useEffect, useRef } from "react";
import { X, Bell, TrendingDown, PackageCheck, Zap } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function PriceAlertModal({ product, isOpen, onClose }) {
  const { getAlerts, toggleAlert } = useStore();
  const alerts = getAlerts(product.id);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 shadow-lift transition-all"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-full bg-brand/10">
            <Bell className="size-6 text-brand" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Set Alerts</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{product.title}</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => toggleAlert(product.id, 'price')}
            className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors cursor-pointer ${alerts.includes('price') ? 'border-brand bg-brand/5' : 'border-border hover:border-brand/50'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`grid size-8 place-items-center rounded-full ${alerts.includes('price') ? 'bg-brand text-brand-foreground' : 'bg-muted'}`}>
                <TrendingDown className="size-4" />
              </div>
              <div>
                <p className="font-medium">Price Drop</p>
                <p className="text-xs text-muted-foreground">Notify me when price decreases</p>
              </div>
            </div>
            <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${alerts.includes('price') ? 'bg-brand' : 'bg-muted-foreground/30'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${alerts.includes('price') ? 'translate-x-4.5' : 'translate-x-1'}`} />
            </div>
          </button>

          <button
            onClick={() => toggleAlert(product.id, 'stock')}
            className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors cursor-pointer ${alerts.includes('stock') ? 'border-brand bg-brand/5' : 'border-border hover:border-brand/50'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`grid size-8 place-items-center rounded-full ${alerts.includes('stock') ? 'bg-brand text-brand-foreground' : 'bg-muted'}`}>
                <PackageCheck className="size-4" />
              </div>
              <div>
                <p className="font-medium">Back in Stock</p>
                <p className="text-xs text-muted-foreground">Notify me when it's available</p>
              </div>
            </div>
            <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${alerts.includes('stock') ? 'bg-brand' : 'bg-muted-foreground/30'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${alerts.includes('stock') ? 'translate-x-4.5' : 'translate-x-1'}`} />
            </div>
          </button>

          <button
            onClick={() => toggleAlert(product.id, 'sale')}
            className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors cursor-pointer ${alerts.includes('sale') ? 'border-brand bg-brand/5' : 'border-border hover:border-brand/50'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`grid size-8 place-items-center rounded-full ${alerts.includes('sale') ? 'bg-brand text-brand-foreground' : 'bg-muted'}`}>
                <Zap className="size-4" />
              </div>
              <div>
                <p className="font-medium">Flash Sales</p>
                <p className="text-xs text-muted-foreground">Notify me on special deals</p>
              </div>
            </div>
            <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${alerts.includes('sale') ? 'bg-brand' : 'bg-muted-foreground/30'}`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${alerts.includes('sale') ? 'translate-x-4.5' : 'translate-x-1'}`} />
            </div>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background hover:opacity-90 cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}

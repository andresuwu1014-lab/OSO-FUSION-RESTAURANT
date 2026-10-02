import React from 'react';
import { ShoppingBag, UtensilsCrossed, Settings, MapPin, Sparkles } from 'lucide-react';
import { OrderModality } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  modality: OrderModality;
  onSelectModality: (mod: OrderModality) => void;
  onOpenAdmin: () => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  modality,
  onSelectModality,
  onOpenAdmin,
  onOpenAssistant,
}) => {
  const modalityLabels: Record<OrderModality, string> = {
    mesa: 'Dine In',
    recoger: 'Takeaway',
    domicilio: 'Delivery (Ibagué)',
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#111412]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single Brand Wordmark */}
        <a href="#hero" className="flex items-center gap-2.5 text-decoration-none group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A231D] gold-border text-[#E5B869] transition-transform duration-200 group-hover:scale-105">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-wider text-[#F3EFE6] transition-colors group-hover:text-[#E5B869]">
            OSO FUSION
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#CFCBC0]">
          <a href="#menu" className="transition-colors hover:text-[#E5B869]">
            Menu
          </a>
          <a href="#promociones" className="transition-colors hover:text-[#E5B869]">
            Promotions
          </a>
          <a href="#historia" className="transition-colors hover:text-[#E5B869]">
            Our Fusion
          </a>
          <a href="#ubicacion" className="transition-colors hover:text-[#E5B869]">
            Location
          </a>
          <button
            type="button"
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 text-xs text-[#E5B869] hover:underline"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Oso Assistant</span>
          </button>
        </nav>

        {/* Zone 3: Interactive Controls & Cart */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Modality Selector dropdown or button */}
          <div className="flex items-center rounded-lg bg-[#1A231D] p-1 border border-white/10 text-xs">
            {(['mesa', 'recoger', 'domicilio'] as OrderModality[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onSelectModality(mode)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium whitespace-nowrap ${
                  modality === mode
                    ? 'bg-[#E5B869] text-[#111412] font-semibold shadow-sm'
                    : 'text-[#CFCBC0] hover:text-[#F3EFE6]'
                }`}
              >
                {modalityLabels[mode]}
              </button>
            ))}
          </div>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Open order cart"
            className="relative flex items-center gap-2 rounded-lg bg-[#E5B869] px-3.5 py-2 text-xs font-bold text-[#111412] shadow-md transition-all hover:bg-[#F5DCA3] active:scale-95 whitespace-nowrap"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">My Order</span>
            {cartCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111412] text-[11px] font-bold text-[#E5B869] tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin PIN Settings trigger */}
          <button
            type="button"
            onClick={onOpenAdmin}
            title="Management Panel"
            className="p-2 rounded-lg text-[#CFCBC0] hover:text-[#E5B869] hover:bg-[#1A231D] transition-colors border border-transparent hover:border-white/10"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

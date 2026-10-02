import React from 'react';
import { ArrowDown, MessageCircle, Clock, Sparkles, Flame, Coffee, Award } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface HeroProps {
  config: RestaurantConfig;
  onExploreMenu: () => void;
  onOpenAssistant: () => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onExploreMenu, onOpenAssistant }) => {
  const whatsappUrl = `https://api.whatsapp.com/send?phone=57${config.whatsappNumber}&text=Hello%20Oso%20Fusion%2C%20I%20would%20like%20to%20inquire%20about%20a%20table%20reservation%20or%20place%20an%20order%20in%20Ibagu%C3%A9.`;

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Scrim Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_oso_fusion_1789763695701.jpg"
          alt="Oso Fusion dining ambiance"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center filter brightness-[0.4] scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111412] via-[#111412]/75 to-transparent" />
        <div className="absolute inset-0 bg-andean-pattern pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28 text-center flex flex-col items-center">
        {/* Subtle trust pill tags */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6 text-xs font-semibold">
          <span className="bamboo-badge px-3 py-1 rounded-full flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#8ED09E]" />
            Wok & Ancestral Techniques
          </span>
          <span className="ocobo-badge px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#E89DA8]" />
            Ibagué, Tolima • Colombia
          </span>
          <span className="bg-[#E5B869]/10 text-[#E5B869] border border-[#E5B869]/30 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5" />
            Specialty Coffee 1,800m
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F3EFE6] max-w-4xl text-balance leading-tight">
          Flavors of <span className="gold-text-gradient">Asia & Colombia</span> in the Heart of Ibagué
        </h1>

        {/* Subhead */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-[#CFCBC0] leading-relaxed text-balance">
          A bold culinary journey where extra-crispy pork belly, savory green plantains, and Andean mountain lulo unite with ancient wok mastery and handcrafted dumplings.
        </p>

        {/* Primary CTAs */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={onExploreMenu}
            id="btn-hero-explore"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-[#E5B869] px-7 py-3.5 text-sm font-bold text-[#111412] shadow-lg shadow-[#E5B869]/20 transition-all hover:bg-[#F5DCA3] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <span>Explore Menu & Order</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#1A231D]/80 hover:bg-[#253229] border border-white/10 hover:border-[#E5B869]/50 px-6 py-3.5 text-sm font-semibold text-[#F3EFE6] transition-all backdrop-blur-md active:scale-95 whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4 text-[#8ED09E]" />
            <span>Direct WhatsApp ({config.whatsappNumber})</span>
          </a>

          <button
            type="button"
            onClick={onOpenAssistant}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#202B24] to-[#161D19] border border-[#E5B869]/40 px-5 py-3.5 text-sm font-medium text-[#E5B869] transition-all hover:border-[#E5B869] active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Oso Assistant</span>
          </button>
        </div>

        {/* Status Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#CFCBC0]/80 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8ED09E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8ED09E]"></span>
            </span>
            <span>Open Today: 12:00 PM - 10:30 PM</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#E5B869]" />
            <span>Avg. preparation: 20-30 min</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#E5B869]" />
            <span>Piedra Pintada Sector, Cra 6</span>
          </div>
        </div>
      </div>
    </section>
  );
};

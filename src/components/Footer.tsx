import React from 'react';
import { UtensilsCrossed, MessageCircle, MapPin, Phone } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface FooterProps {
  config: RestaurantConfig;
  onOpenAssistant: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenAssistant }) => {
  return (
    <footer className="border-t border-white/10 bg-[#0E110F] text-[#CFCBC0] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A231D] gold-border text-[#E5B869]">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-bold tracking-wider text-[#F3EFE6]">
                OSO FUSION
              </span>
            </div>
            <p className="text-xs text-[#CFCBC0]/80 leading-relaxed max-w-sm">
              Fusion of Asian high culinary craft with the generosity of Tolima's regional produce. High-flame wok, handcrafted dumplings, and warm Colombian hospitality.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8ED09E]">
              <span className="w-2 h-2 rounded-full bg-[#8ED09E]" />
              <span>Open Tuesday to Sunday in Ibagué</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#F3EFE6]">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="hover:text-[#E5B869] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#E5B869] transition-colors">
                  Our Menu
                </a>
              </li>
              <li>
                <a href="#promociones" className="hover:text-[#E5B869] transition-colors">
                  Promotions
                </a>
              </li>
              <li>
                <a href="#historia" className="hover:text-[#E5B869] transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAssistant}
                  className="hover:text-[#E5B869] transition-colors text-left cursor-pointer"
                >
                  Virtual Oso Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct contact */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#F3EFE6]">
              Contact & Orders
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E5B869] shrink-0" />
                <span>{config.address}, Ibagué</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E5B869] shrink-0" />
                <span>{config.phone}</span>
              </p>
              <a
                href={`https://api.whatsapp.com/send?phone=57${config.whatsappNumber}&text=Hello%20Oso%20Fusion`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline pt-1 font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#CFCBC0]/60">
          <p>© {new Date().getFullYear()} Oso Fusion. Flavors of Asia & Colombia • Ibagué, Tolima.</p>
          <div className="flex items-center gap-4">
            <span>Cra. 6 with Calle 50, Piedra Pintada</span>
            <span>·</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

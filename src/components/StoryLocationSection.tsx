import React from 'react';
import { MapPin, Clock, Phone, Sparkles, Flame, Coffee, Heart, CheckCircle2 } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface StoryLocationProps {
  config: RestaurantConfig;
}

export const StoryLocationSection: React.FC<StoryLocationProps> = ({ config }) => {
  return (
    <section id="historia" className="py-20 bg-[#111412] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Story Part */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bamboo-badge text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Our Culinary Essence
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#F3EFE6] leading-tight">
              Where the Bamboo Forest Meets the Tolima Valley
            </h2>
            <p className="text-sm text-[#CFCBC0] leading-relaxed">
              At <strong>Oso Fusion</strong> we were founded on a singular conviction: to bridge two worlds that celebrate bold, deep flavors. We combine the discipline of living fire, the crunchy textures of wok stir-frying, and ancient Asian reductions of soy, ginger, and tamarind with the unrivaled agricultural bounty of our Tolima homeland.
            </p>
            <p className="text-sm text-[#CFCBC0] leading-relaxed">
              Here, crispy pork belly doesn't compete with jasmine rice—they harmonize. The vibrant tang of Andean lulo becomes an exquisite glaze for braised meats, and coffee cultivated above 1,800 meters crowns every memorable evening under the Ibagué sky.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 rounded-xl bg-[#171E19] border border-white/5">
                <Flame className="w-5 h-5 text-[#E5B869] mb-2" />
                <h4 className="font-display font-bold text-sm text-[#F3EFE6]">Wok over Living Fire</h4>
                <p className="text-xs text-[#CFCBC0]/80 mt-1">Seared in seconds above 250°C to lock in freshness and crispness.</p>
              </div>
              <div className="p-4 rounded-xl bg-[#171E19] border border-white/5">
                <Coffee className="w-5 h-5 text-[#8ED09E] mb-2" />
                <h4 className="font-display font-bold text-sm text-[#F3EFE6]">100% Tolima Origin</h4>
                <p className="text-xs text-[#CFCBC0]/80 mt-1">Lulo, green plantains, soursop, and coffee from regional smallholders.</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden gold-border shadow-2xl relative">
              <img
                src="/images/paisa_bowl_1789763734770.jpg"
                alt="Oso Fusion Signature Dish Paisa Bowl"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[11px] font-bold text-[#E5B869] uppercase tracking-wider">
                  Signature Dish
                </span>
                <h3 className="font-display text-xl font-bold text-[#F3EFE6]">
                  Oriental Paisa Bowl
                </h3>
                <p className="text-xs text-[#CFCBC0]/90 mt-1">
                  Crispy hoisin-lulo pork belly, coconut jasmine rice, edamame, and farm-fresh egg.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Contact Grid */}
        <div id="ubicacion" className="rounded-3xl bg-[#171E19] border border-white/10 p-8 sm:p-12 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full ocobo-badge text-xs font-semibold mb-3">
              <MapPin className="w-3.5 h-3.5" />
              Visit Us in Ibagué
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F3EFE6]">
              Location, Hours & Delivery Coverage
            </h3>
            <p className="text-xs text-[#CFCBC0] mt-2">
              Dine in our comfortable dining room or order home delivery across all urban sectors of Ibagué.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <div className="p-6 rounded-2xl bg-[#141A16] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E5B869]/10 flex items-center justify-center text-[#E5B869]">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-[#F3EFE6]">Main Location</h4>
              <p className="text-xs text-[#CFCBC0] leading-relaxed">
                {config.address}
                <br />
                {config.city}, {config.department}
              </p>
              <p className="text-[11px] text-[#E5B869]">Piedra Pintada Sector / Gastronomic Zone</p>
            </div>

            {/* Hours */}
            <div className="p-6 rounded-2xl bg-[#141A16] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8ED09E]/10 flex items-center justify-center text-[#8ED09E]">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-[#F3EFE6]">Opening Hours</h4>
              <p className="text-xs text-[#CFCBC0] leading-relaxed">
                {config.openingHours}
              </p>
              <p className="text-[11px] text-[#8ED09E]">{config.scheduleDescription}</p>
            </div>

            {/* Direct Line */}
            <div className="p-6 rounded-2xl bg-[#141A16] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E89DA8]/10 flex items-center justify-center text-[#E89DA8]">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-[#F3EFE6]">Direct Orders</h4>
              <p className="text-xs text-[#CFCBC0] leading-relaxed">
                Telephone & WhatsApp:
                <br />
                <span className="font-mono text-sm font-bold text-[#F3EFE6]">{config.phone}</span>
              </p>
              <p className="text-[11px] text-[#CFCBC0]/70">
                Base delivery fee: ${config.baseDeliveryFee.toLocaleString('en-US')} COP
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

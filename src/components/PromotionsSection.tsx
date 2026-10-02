import React from 'react';
import { Tag, Cake, Users, Calendar, Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { Promotion } from '../types';

interface PromotionsSectionProps {
  promotions: Promotion[];
  onSelectPromo: (promo: Promotion) => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  promotions,
  onSelectPromo,
}) => {
  const getPromoIcon = (type: Promotion['type']) => {
    switch (type) {
      case 'birthday':
        return <Cake className="w-5 h-5 text-[#E89DA8]" />;
      case 'groups':
        return <Users className="w-5 h-5 text-[#8ED09E]" />;
      case 'wednesday':
        return <Tag className="w-5 h-5 text-[#E5B869]" />;
      case 'sunday':
        return <Calendar className="w-5 h-5 text-[#93C5FD]" />;
      case 'special_date':
        return <Heart className="w-5 h-5 text-[#F43F5E]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#E5B869]" />;
    }
  };

  return (
    <section id="promociones" className="py-20 bg-[#141A16] relative border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5B869]/10 text-[#E5B869] text-xs font-semibold gold-border mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Exclusive Perks
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F3EFE6]">
            Promotions & Special Moments
          </h2>
          <p className="mt-3 text-sm text-[#CFCBC0] leading-relaxed text-balance">
            We love rewarding your patronage. Enjoy our seasonal and weekly promotions crafted to celebrate birthdays, family gatherings, or romantic dates in Ibagué.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className={`rounded-2xl bg-[#1A231D] border transition-all duration-300 p-6 flex flex-col justify-between ${
                promo.active
                  ? 'border-white/10 hover:border-[#E5B869]/60 shadow-xl hover:-translate-y-1'
                  : 'border-white/5 opacity-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="p-2.5 rounded-xl bg-[#141A16] border border-white/10">
                    {getPromoIcon(promo.type)}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E5B869]/15 text-[#E5B869] border border-[#E5B869]/30">
                    {promo.badge}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-[#F3EFE6]">
                  {promo.name}
                </h3>

                <p className="mt-2 text-xs text-[#CFCBC0] leading-relaxed">
                  {promo.description}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-[#141A16] border border-[#E5B869]/20 text-xs">
                  <span className="font-bold text-[#E5B869] block mb-1">Benefit:</span>
                  <span className="text-[#F3EFE6]">{promo.benefit}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[11px] text-[#CFCBC0]/60 italic mb-4 leading-normal">
                  * {promo.conditions}
                </p>
                <button
                  type="button"
                  onClick={() => onSelectPromo(promo)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#202923] hover:bg-[#E5B869] hover:text-[#111412] text-[#F3EFE6] py-2.5 text-xs font-bold transition-all border border-white/10 hover:border-transparent active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Claim in my Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

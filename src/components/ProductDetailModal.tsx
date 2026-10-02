import React, { useState } from 'react';
import { X, Plus, Minus, Check, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { Product, Customization, ExtraOption } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, customization: Customization) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSauce, setSelectedSauce] = useState<string>(
    product.availableSauces.length > 0 ? product.availableSauces[0] : ''
  );
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const toggleRemoved = (ing: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  };

  const toggleExtra = (extra: ExtraOption) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.priceExtra, 0);
  const unitPrice = product.price + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart(product, quantity, {
      selectedSauce: selectedSauce || undefined,
      removedIngredients,
      addedExtras: selectedExtras,
      specialInstructions: specialInstructions.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#171E19] border border-[#E5B869]/40 shadow-2xl text-[#F3EFE6] overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header with image */}
        <div className="relative aspect-[21/9] w-full bg-[#202923] shrink-0">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171E19] via-[#171E19]/40 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E5B869]">
                {product.category}
              </span>
              <h3 className="font-display text-2xl font-bold">{product.name}</h3>
            </div>
            <div className="text-right">
              <span className="font-mono text-lg font-bold text-[#E5B869] tabular-nums">
                ${product.price.toLocaleString('es-CO')} COP
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          <p className="text-xs text-[#CFCBC0] leading-relaxed">{product.description}</p>

          {/* Allergens warning */}
          {product.allergens.length > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#2A1E20] border border-[#E89DA8]/30 text-xs text-[#F4C4CC]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E89DA8]" />
              <span>
                <strong>Allergen notice:</strong> Contains {product.allergens.join(', ')}.
              </span>
            </div>
          )}

          {/* Sauce selection */}
          {product.availableSauces.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#E5B869] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Choose your sauce or dressing</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.availableSauces.map((sauce) => (
                  <button
                    key={sauce}
                    type="button"
                    onClick={() => setSelectedSauce(sauce)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                      selectedSauce === sauce
                        ? 'border-[#E5B869] bg-[#E5B869]/10 text-[#F3EFE6] font-semibold'
                        : 'border-white/10 bg-[#1D2620] text-[#CFCBC0] hover:border-white/20'
                    }`}
                  >
                    <span>{sauce}</span>
                    {selectedSauce === sauce && (
                      <Check className="w-3.5 h-3.5 text-[#E5B869]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Removable ingredients */}
          {product.removableIngredients.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#CFCBC0] uppercase tracking-wider mb-2">
                Would you like to remove any ingredients?
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.removableIngredients.map((ing) => {
                  const isRemoved = removedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => toggleRemoved(ing)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        isRemoved
                          ? 'bg-[#E89DA8]/20 border border-[#E89DA8] text-[#F4C4CC] line-through font-semibold'
                          : 'bg-[#1D2620] border border-white/10 text-[#CFCBC0] hover:border-white/30'
                      }`}
                    >
                      No {ing}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extra options */}
          {product.extraOptions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-[#E5B869] uppercase tracking-wider mb-2">
                Special add-ons and extras
              </h4>
              <div className="space-y-2">
                {product.extraOptions.map((extra) => {
                  const isSelected = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                        isSelected
                          ? 'border-[#E5B869] bg-[#E5B869]/15 text-[#F3EFE6] font-medium'
                          : 'border-white/10 bg-[#1D2620] text-[#CFCBC0] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#E5B869] border-[#E5B869] text-[#111412]'
                              : 'border-white/30'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{extra.name}</span>
                      </div>
                      <span className="font-mono text-[#E5B869] tabular-nums font-semibold">
                        +${extra.priceExtra.toLocaleString('en-US')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kitchen notes */}
          <div>
            <h4 className="text-xs font-bold text-[#CFCBC0] uppercase tracking-wider mb-2">
              Kitchen instructions (optional)
            </h4>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g.: Serve piping hot, mild heat level, sauce on the side..."
              rows={2}
              className="w-full rounded-xl bg-[#1D2620] border border-white/10 p-3 text-xs text-[#F3EFE6] placeholder-[#CFCBC0]/40 focus:outline-none focus:border-[#E5B869]"
            />
          </div>

          {/* Sticky footer submit */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Quantity */}
            <div className="flex items-center gap-3 bg-[#1D2620] border border-white/10 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#F3EFE6] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-sm text-[#F3EFE6] w-6 text-center tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#F3EFE6] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total and button */}
            <button
              type="submit"
              className="w-full sm:w-auto flex-1 flex items-center justify-between gap-4 rounded-xl bg-[#E5B869] hover:bg-[#F5DCA3] text-[#111412] font-bold px-6 py-3 text-sm transition-all shadow-lg shadow-[#E5B869]/20 active:scale-98"
            >
              <span>Add to My Order</span>
              <span className="font-mono text-base tabular-nums">
                ${totalPrice.toLocaleString('en-US')} COP
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

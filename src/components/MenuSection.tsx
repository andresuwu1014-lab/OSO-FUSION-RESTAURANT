import React, { useState, useMemo } from 'react';
import { Search, Plus, SlidersHorizontal, Clock, AlertCircle, Sparkles, Check } from 'lucide-react';
import { Product, ProductCategory, OrderModality } from '../types';

interface MenuSectionProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  modality: OrderModality;
  onChangeModality: (mod: OrderModality) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  products,
  onOpenDetails,
  onQuickAdd,
  modality,
  onChangeModality,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAllergenFilter, setSelectedAllergenFilter] = useState<string | null>(null);

  const categories: { id: ProductCategory | 'todas'; label: string }[] = [
    { id: 'todas', label: 'All Menu' },
    { id: 'entradas', label: 'Starters' },
    { id: 'principales', label: 'Main Courses' },
    { id: 'postres', label: 'Desserts' },
    { id: 'bebidas', label: 'Beverages' },
  ];

  const allergensList = ['Gluten', 'Dairy', 'Shellfish', 'Egg'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'todas' && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesIng = p.ingredients.some((i) => i.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }
      // Allergen filter (e.g. Free of selected allergen)
      if (selectedAllergenFilter) {
        if (p.allergens.some((a) => a.toLowerCase().includes(selectedAllergenFilter.toLowerCase()))) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery, selectedAllergenFilter]);

  return (
    <section id="menu" className="py-20 bg-[#111412] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#E5B869] uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Virtual Menu</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F3EFE6]">
              Dishes with an Asian Soul and Colombian Roots
            </h2>
            <p className="mt-2 text-sm text-[#CFCBC0] max-w-2xl">
              Each creation is prepared fresh to order on high-flame wok or steam basket using produce from local growers in Ibagué and time-honored culinary techniques.
            </p>
          </div>

          {/* Modality Bar Reminder */}
          <div className="flex items-center gap-3 bg-[#1A231D] p-3 rounded-xl border border-white/10 text-xs">
            <span className="text-[#CFCBC0]">Current mode:</span>
            <div className="flex items-center gap-1.5">
              {(['mesa', 'recoger', 'domicilio'] as OrderModality[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChangeModality(mode)}
                  className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                    modality === mode
                      ? 'bg-[#E5B869] text-[#111412]'
                      : 'text-[#CFCBC0] hover:text-[#F3EFE6] bg-black/20'
                  }`}
                >
                  {mode === 'mesa' ? 'Dine In' : mode === 'recoger' ? 'Takeaway' : 'Delivery'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#E5B869] text-[#111412] shadow-md shadow-[#E5B869]/20'
                    : 'bg-[#1A231D] text-[#CFCBC0] hover:text-[#F3EFE6] hover:bg-[#232F27] border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Allergen Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CFCBC0]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by dish or ingredient..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1A231D] border border-white/10 text-xs text-[#F3EFE6] placeholder-[#CFCBC0]/50 focus:outline-none focus:border-[#E5B869] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#CFCBC0] hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            {/* Allergen Filters */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#CFCBC0]/70 text-[11px] hidden sm:inline">Without:</span>
              {allergensList.map((allergen) => {
                const isSelected = selectedAllergenFilter === allergen;
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => setSelectedAllergenFilter(isSelected ? null : allergen)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      isSelected
                        ? 'bg-[#8ED09E]/20 text-[#8ED09E] border border-[#8ED09E]/40 font-semibold'
                        : 'bg-[#1A231D] text-[#CFCBC0]/80 border border-white/5 hover:border-white/20'
                    }`}
                  >
                    {allergen}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between rounded-2xl bg-[#171E19] border border-white/10 overflow-hidden hover:border-[#E5B869]/50 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Image Container with Fallback */}
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden bg-[#202923] cursor-pointer"
                  onClick={() => onOpenDetails(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171E19] via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {product.featured ? (
                      <span className="bg-[#E5B869] text-[#111412] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider shadow">
                        Signature Fusion
                      </span>
                    ) : (
                      <span className="bg-black/60 backdrop-blur-md text-[#CFCBC0] text-[10px] font-medium px-2.5 py-1 rounded-md uppercase">
                        {product.category}
                      </span>
                    )}

                    <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-[#F3EFE6] text-[11px] font-medium px-2.5 py-1 rounded-md">
                      <Clock className="w-3 h-3 text-[#E5B869]" />
                      <span>{product.prepTimeMinutes} min</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3
                      onClick={() => onOpenDetails(product)}
                      className="font-display text-lg font-bold text-[#F3EFE6] group-hover:text-[#E5B869] transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <span className="font-mono text-sm font-bold text-[#E5B869] tabular-nums whitespace-nowrap">
                      ${product.price.toLocaleString('en-US')} COP
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#CFCBC0] line-clamp-3 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Ingredients Preview */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {product.ingredients.slice(0, 3).map((ing, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] text-[#CFCBC0]/70 bg-white/5 px-2 py-0.5 rounded-md"
                      >
                        {ing}
                      </span>
                    ))}
                    {product.ingredients.length > 3 && (
                      <span className="text-[11px] text-[#E5B869]/80 px-1 py-0.5">
                        +{product.ingredients.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Allergens Notice */}
                  {product.allergens.length > 0 && (
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-[#CFCBC0]/60">
                      <AlertCircle className="w-3 h-3 text-[#E89DA8]" />
                      <span>Contains: {product.allergens.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2 border-t border-white/5 mt-3 pt-3">
                <button
                  type="button"
                  onClick={() => onOpenDetails(product)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#202923] hover:bg-[#2A372E] text-[#F3EFE6] py-2.5 px-3 text-xs font-semibold transition-all border border-white/10 hover:border-[#E5B869]/30"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#E5B869]" />
                  <span>Customize</span>
                </button>

                <button
                  type="button"
                  onClick={() => onQuickAdd(product)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#E5B869] hover:bg-[#F5DCA3] text-[#111412] py-2.5 px-3 text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-16 text-center py-12 rounded-2xl bg-[#171E19] border border-white/10 p-8">
            <p className="text-base text-[#F3EFE6] font-display">No dishes match these filters</p>
            <p className="mt-2 text-xs text-[#CFCBC0]">
              Try changing your search terms or clearing the allergen filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('todas');
                setSearchQuery('');
                setSelectedAllergenFilter(null);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#E5B869] text-[#111412] text-xs font-bold"
            >
              View entire menu
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

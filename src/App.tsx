import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { PromotionsSection } from './components/PromotionsSection';
import { StoryLocationSection } from './components/StoryLocationSection';
import { OsoAssistantModal } from './components/OsoAssistantModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

import { INITIAL_CONFIG, INITIAL_PRODUCTS, INITIAL_PROMOTIONS } from './data/initialData';
import { Product, Promotion, RestaurantConfig, CartItem, OrderModality, Order, Customization } from './types';
import { Sparkles, Check, MessageCircle } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [config, setConfig] = useState<RestaurantConfig>(INITIAL_CONFIG);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Cart & Ordering
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('oso_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [modality, setModality] = useState<OrderModality>('domicilio');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('oso_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [cartItems]);

  // Fetch initial data from backend if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, promoRes, cfgRes, orderRes] = await Promise.all([
          fetch('/api/products').catch(() => null),
          fetch('/api/promotions').catch(() => null),
          fetch('/api/config').catch(() => null),
          fetch('/api/orders').catch(() => null),
        ]);

        if (prodRes && prodRes.ok) {
          const prods = await prodRes.json();
          if (Array.isArray(prods) && prods.length > 0) setProducts(prods);
        }
        if (promoRes && promoRes.ok) {
          const promos = await promoRes.json();
          if (Array.isArray(promos) && promos.length > 0) setPromotions(promos);
        }
        if (cfgRes && cfgRes.ok) {
          const cfg = await cfgRes.json();
          if (cfg && cfg.name) setConfig(cfg);
        }
        if (orderRes && orderRes.ok) {
          const ords = await orderRes.json();
          if (Array.isArray(ords)) setOrders(ords);
        }
      } catch (err) {
        console.warn('API sync fallback active:', err);
      }
    };
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Cart operations
  const handleQuickAdd = (product: Product) => {
    const defaultSauce = product.availableSauces.length > 0 ? product.availableSauces[0] : undefined;
    const customization: Customization = {
      selectedSauce: defaultSauce,
      removedIngredients: [],
      addedExtras: [],
    };
    const cartItemId = `${product.id}-${defaultSauce || 'none'}`;
    const existingIndex = cartItems.findIndex((ci) => ci.cartItemId === cartItemId);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].subtotal = updated[existingIndex].unitPrice * updated[existingIndex].quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        cartItemId,
        product,
        quantity: 1,
        customization,
        unitPrice: product.price,
        subtotal: product.price,
      };
      setCartItems([...cartItems, newItem]);
    }
    showToast(`Added 1x ${product.name} to your order!`);
  };

  const handleCustomAddToCart = (product: Product, quantity: number, customization: Customization) => {
    const extrasTotal = customization.addedExtras.reduce((sum, e) => sum + e.priceExtra, 0);
    const unitPrice = product.price + extrasTotal;
    const subtotal = unitPrice * quantity;

    const extrasKey = customization.addedExtras.map((e) => e.id).sort().join('-');
    const removedKey = customization.removedIngredients.sort().join('-');
    const cartItemId = `${product.id}-${customization.selectedSauce || ''}-${removedKey}-${extrasKey}-${customization.specialInstructions || ''}`;

    const existingIndex = cartItems.findIndex((ci) => ci.cartItemId === cartItemId);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].subtotal = updated[existingIndex].unitPrice * updated[existingIndex].quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        cartItemId,
        product,
        quantity,
        customization,
        unitPrice,
        subtotal,
      };
      setCartItems([...cartItems, newItem]);
    }
    showToast(`Added ${quantity}x customized ${product.name} to your order!`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems(
      cartItems.map((ci) =>
        ci.cartItemId === cartItemId
          ? { ...ci, quantity: newQty, subtotal: ci.unitPrice * newQty }
          : ci
      )
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(cartItems.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderPlaced = (order: Order) => {
    setOrders([order, ...orders]);
    setActiveOrder(order);
    setIsOrderTrackerOpen(true);
    setCartItems([]);
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleSelectPromo = (promo: Promotion) => {
    showToast(`Promotion selected: "${promo.name}". Applied in your order.`);
    setIsCartOpen(true);
  };

  // Admin updates
  const handleUpdateConfig = async (newCfg: RestaurantConfig) => {
    setConfig(newCfg);
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCfg),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    setProducts(products.map((p) => (p.id === product.id ? product : p)));
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    setProducts([...products, newProduct]);
    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePromotion = async (promo: Promotion) => {
    setPromotions(promotions.map((p) => (p.id === promo.id ? promo : p)));
    try {
      await fetch(`/api/promotions/${promo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promo),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#111412] text-[#F3EFE6] selection:bg-[#E5B869] selection:text-[#111412]">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 rounded-xl bg-[#1A231D] gold-border-glow px-4 py-3 text-xs font-semibold text-[#F3EFE6] shadow-2xl animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-[#8ED09E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        modality={modality}
        onSelectModality={setModality}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        config={config}
        onExploreMenu={() => {
          const el = document.getElementById('menu');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Virtual Interactive Menu Section */}
      <MenuSection
        products={products}
        onOpenDetails={handleOpenProduct}
        onQuickAdd={handleQuickAdd}
        modality={modality}
        onChangeModality={setModality}
      />

      {/* Promotions Section */}
      <PromotionsSection
        promotions={promotions}
        onSelectPromo={handleSelectPromo}
      />

      {/* Story & Location in Ibagué Section */}
      <StoryLocationSection config={config} />

      {/* Footer */}
      <Footer config={config} onOpenAssistant={() => setIsAssistantOpen(true)} />

      {/* Floating Oso Asistente Bear Emblem */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setIsAssistantOpen((prev) => !prev)}
          id="btn-trigger-oso-assistant"
          title="Open Virtual Oso Assistant"
          className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-[#1E2721] to-[#121614] gold-border-glow p-2.5 pr-4 sm:pr-5 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-[#202923] border border-[#E5B869] flex items-center justify-center relative overflow-hidden shadow-inner">
            <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
              <circle cx="27" cy="30" r="14" fill="#202422" stroke="#E5B869" strokeWidth="2" />
              <circle cx="73" cy="30" r="14" fill="#202422" stroke="#E5B869" strokeWidth="2" />
              <circle cx="50" cy="54" r="34" fill="#181C19" stroke="#E5B869" strokeWidth="2" />
              <path d="M 28 46 C 26 38, 44 38, 45 47 C 46 54, 30 55, 28 46 Z" stroke="#E5B869" strokeWidth="3" />
              <path d="M 72 46 C 74 38, 56 38, 55 47 C 54 54, 70 55, 72 46 Z" stroke="#E5B869" strokeWidth="3" />
              <circle cx="37" cy="46" r="3" fill="#F3EFE6" />
              <circle cx="63" cy="46" r="3" fill="#F3EFE6" />
              <ellipse cx="50" cy="62" rx="7" ry="5" fill="#E5B869" />
            </svg>
          </div>
          <div className="text-left hidden sm:block">
            <span className="font-display block text-xs font-bold text-[#F3EFE6]">
              Oso Assistant
            </span>
            <span className="block text-[10px] text-[#E5B869]">
              What are you craving today?
            </span>
          </div>
        </button>
      </div>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAddToCart={handleCustomAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        modality={modality}
        onChangeModality={setModality}
        config={config}
        promotions={promotions}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderTrackerModal
        order={activeOrder}
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        config={config}
      />

      <OsoAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        config={config}
        products={products}
        onOpenProduct={handleOpenProduct}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        products={products}
        onUpdateProduct={handleUpdateProduct}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        promotions={promotions}
        onUpdatePromotion={handleUpdatePromotion}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}

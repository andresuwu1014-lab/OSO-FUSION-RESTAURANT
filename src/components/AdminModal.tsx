import React, { useState } from 'react';
import { X, Lock, KeyRound, Utensils, Tag, Clock, CheckCircle, Save, Plus, Trash2, Settings } from 'lucide-react';
import { Product, Promotion, RestaurantConfig, Order } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  onUpdateConfig: (cfg: RestaurantConfig) => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  promotions: Promotion[];
  onUpdatePromotion: (promo: Promotion) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  promotions,
  onUpdatePromotion,
  orders,
  onUpdateOrderStatus,
}) => {
  if (!isOpen) return null;

  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'pedidos' | 'carta' | 'promociones' | 'configuracion'>('pedidos');

  // Config editor state
  const [editConfig, setEditConfig] = useState<RestaurantConfig>({ ...config });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === config.adminPin) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect PIN. (Default PIN: 1234)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#161D18] border border-white/10 shadow-2xl flex flex-col text-[#F3EFE6] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#1A231D] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#E5B869]/15 text-[#E5B869]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#F3EFE6]">
                Management Panel • Oso Fusion
              </h3>
              <p className="text-[11px] text-[#CFCBC0]/70">
                Order queue, menu catalog, promotions, and settings
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#CFCBC0] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* PIN Verification screen */
          <div className="p-8 max-w-sm mx-auto my-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#202923] border border-[#E5B869] text-[#E5B869] flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h4 className="font-display text-lg font-bold text-[#F3EFE6]">Administrative Access</h4>
            <p className="text-xs text-[#CFCBC0] mt-1 mb-6">
              Enter the restaurant PIN to manage orders, dishes, and settings.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (1234)"
                className="w-full text-center tracking-widest text-lg font-mono rounded-xl bg-[#141A16] border border-white/10 py-3 text-[#F3EFE6] focus:border-[#E5B869] focus:outline-none"
              />

              {authError && <p className="text-xs text-[#E89DA8] font-medium">{authError}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#E5B869] hover:bg-[#F5DCA3] text-[#111412] font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Access Dashboard
              </button>
              <p className="text-[11px] text-[#CFCBC0]/50">Default PIN: 1234</p>
            </form>
          </div>
        ) : (
          /* Admin Main Interface */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex items-center gap-2 p-3 bg-[#141A16] border-b border-white/10 text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('pedidos')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'pedidos'
                    ? 'bg-[#E5B869] text-[#111412]'
                    : 'text-[#CFCBC0] hover:text-[#F3EFE6] bg-[#1D2620]'
                }`}
              >
                <span>Kitchen Queue & Orders ({orders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('carta')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'carta'
                    ? 'bg-[#E5B869] text-[#111412]'
                    : 'text-[#CFCBC0] hover:text-[#F3EFE6] bg-[#1D2620]'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Menu Manager ({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('promociones')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'promociones'
                    ? 'bg-[#E5B869] text-[#111412]'
                    : 'text-[#CFCBC0] hover:text-[#F3EFE6] bg-[#1D2620]'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Promotions ({promotions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('configuracion')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'configuracion'
                    ? 'bg-[#E5B869] text-[#111412]'
                    : 'text-[#CFCBC0] hover:text-[#F3EFE6] bg-[#1D2620]'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Restaurant Settings</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: ORDERS */}
              {activeTab === 'pedidos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-base text-[#F3EFE6]">
                      Real-Time Kitchen Orders
                    </h4>
                    <span className="text-xs text-[#CFCBC0]">
                      Showing {orders.length} recent orders
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center bg-[#141A16] rounded-xl text-xs text-[#CFCBC0]">
                      No orders placed yet. Orders submitted by guests will display here in real time.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-xl bg-[#141A16] border border-white/10 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-[#E5B869]">
                                {ord.id}
                              </span>
                              <span className="text-xs bg-[#202923] text-[#CFCBC0] px-2 py-0.5 rounded uppercase">
                                {ord.modality === 'mesa' ? 'Dine In' : ord.modality === 'recoger' ? 'Takeaway' : 'Delivery'}
                              </span>
                              <span className="text-xs text-[#CFCBC0]/70">
                                {new Date(ord.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            {/* Status changer buttons */}
                            <div className="flex items-center gap-1.5">
                              {(['recibido', 'preparando', 'listo', 'entregado'] as Order['status'][]).map(
                                (st) => (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => onUpdateOrderStatus(ord.id, st)}
                                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all capitalize ${
                                      ord.status === st
                                        ? 'bg-[#E5B869] text-[#111412]'
                                        : 'bg-[#1D2620] text-[#CFCBC0] hover:text-white'
                                    }`}
                                  >
                                    {st === 'recibido'
                                      ? 'Received'
                                      : st === 'preparando'
                                      ? 'Cooking'
                                      : st === 'listo'
                                      ? 'Ready'
                                      : 'Delivered'}
                                  </button>
                                )
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="text-[#F3EFE6] font-semibold">{ord.customerName}</p>
                              <p className="text-[#CFCBC0]/80">Tel: {ord.phone}</p>
                              {ord.deliveryAddress && (
                                <p className="text-[#CFCBC0]/80">
                                  Address: {ord.deliveryAddress} ({ord.deliveryNeighborhood})
                                </p>
                              )}
                              {ord.tableNumber && (
                                <p className="text-[#E5B869]">Table: {ord.tableNumber}</p>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="font-mono text-sm font-bold text-[#E5B869] tabular-nums">
                                Total: ${ord.total.toLocaleString('en-US')} COP
                              </p>
                              <p className="text-[#CFCBC0]/70 text-[11px] uppercase">
                                Payment: {ord.paymentMethod}
                              </p>
                            </div>
                          </div>

                          <div className="text-xs text-[#CFCBC0]/80 bg-[#1D2620] p-2.5 rounded-lg space-y-1">
                            {ord.items.map((it, i) => (
                              <div key={i} className="flex justify-between">
                                <span>
                                  {it.quantity}x {it.product.name}
                                </span>
                                <span className="font-mono tabular-nums">
                                  ${it.subtotal.toLocaleString('en-US')} COP
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MENU EDITOR */}
              {activeTab === 'carta' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-base text-[#F3EFE6]">
                      Manage Dishes & Prices
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-4 rounded-xl bg-[#141A16] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-lg object-cover bg-[#202923]"
                          />
                          <div>
                            <h5 className="font-display font-bold text-sm text-[#F3EFE6]">
                              {prod.name}
                            </h5>
                            <span className="text-[11px] text-[#CFCBC0]/70 uppercase">
                              {prod.category} • {prod.prepTimeMinutes} min
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-[#CFCBC0]">$ COP</span>
                            <input
                              type="number"
                              defaultValue={prod.price}
                              onBlur={(e) => {
                                const newPrice = parseInt(e.target.value, 10);
                                if (!isNaN(newPrice)) {
                                  onUpdateProduct({ ...prod, price: newPrice });
                                }
                              }}
                              className="w-24 text-right rounded-lg bg-[#1D2620] border border-white/10 px-2 py-1 text-xs text-[#E5B869] font-mono font-bold"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onUpdateProduct({ ...prod, featured: !prod.featured })
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              prod.featured
                                ? 'bg-[#E5B869] text-[#111412]'
                                : 'bg-[#1D2620] text-[#CFCBC0]'
                            }`}
                          >
                            {prod.featured ? 'Featured ★' : 'Standard'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PROMOTIONS */}
              {activeTab === 'promociones' && (
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-base text-[#F3EFE6]">
                    Promotions Management
                  </h4>

                  <div className="space-y-3">
                    {promotions.map((promo) => (
                      <div
                        key={promo.id}
                        className="p-4 rounded-xl bg-[#141A16] border border-white/10 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-display font-bold text-sm text-[#F3EFE6]">
                              {promo.name}
                            </h5>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-[#E5B869]/15 text-[#E5B869]">
                              {promo.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#CFCBC0] mt-1">{promo.benefit}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onUpdatePromotion({ ...promo, active: !promo.active })
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            promo.active
                              ? 'bg-[#8ED09E] text-[#111412]'
                              : 'bg-white/10 text-[#CFCBC0]'
                          }`}
                        >
                          {promo.active ? 'Active ✓' : 'Inactive ✕'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CONFIG */}
              {activeTab === 'configuracion' && (
                <div className="space-y-4 max-w-xl">
                  <h4 className="font-display font-bold text-base text-[#F3EFE6]">
                    Restaurant Info & Rates
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[#CFCBC0] block mb-1">Business Name</label>
                      <input
                        type="text"
                        value={editConfig.name}
                        onChange={(e) => setEditConfig({ ...editConfig, name: e.target.value })}
                        className="w-full rounded-lg bg-[#141A16] border border-white/10 p-2.5 text-[#F3EFE6]"
                      />
                    </div>

                    <div>
                      <label className="text-[#CFCBC0] block mb-1">Address in Ibagué</label>
                      <input
                        type="text"
                        value={editConfig.address}
                        onChange={(e) => setEditConfig({ ...editConfig, address: e.target.value })}
                        className="w-full rounded-lg bg-[#141A16] border border-white/10 p-2.5 text-[#F3EFE6]"
                      />
                    </div>

                    <div>
                      <label className="text-[#CFCBC0] block mb-1">WhatsApp Ordering Line</label>
                      <input
                        type="text"
                        value={editConfig.whatsappNumber}
                        onChange={(e) =>
                          setEditConfig({ ...editConfig, whatsappNumber: e.target.value })
                        }
                        className="w-full rounded-lg bg-[#141A16] border border-white/10 p-2.5 text-[#F3EFE6]"
                      />
                    </div>

                    <div>
                      <label className="text-[#CFCBC0] block mb-1">Base Delivery Fee (COP)</label>
                      <input
                        type="number"
                        value={editConfig.baseDeliveryFee}
                        onChange={(e) =>
                          setEditConfig({
                            ...editConfig,
                            baseDeliveryFee: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        className="w-full rounded-lg bg-[#141A16] border border-white/10 p-2.5 text-[#F3EFE6] font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[#CFCBC0] block mb-1">Operating Hours</label>
                      <input
                        type="text"
                        value={editConfig.openingHours}
                        onChange={(e) =>
                          setEditConfig({ ...editConfig, openingHours: e.target.value })
                        }
                        className="w-full rounded-lg bg-[#141A16] border border-white/10 p-2.5 text-[#F3EFE6]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onUpdateConfig(editConfig);
                        alert('Settings saved successfully!');
                      }}
                      className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#E5B869] text-[#111412] font-bold text-xs cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

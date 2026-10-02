import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, Send, CheckCircle2, AlertCircle, Sparkles, MapPin, Table, User, Phone, DollarSign } from 'lucide-react';
import { CartItem, OrderModality, RestaurantConfig, Order, Promotion } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  modality: OrderModality;
  onChangeModality: (mod: OrderModality) => void;
  config: RestaurantConfig;
  promotions: Promotion[];
  onOrderPlaced: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  modality,
  onChangeModality,
  config,
  promotions,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('Table 4');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState('Piedra Pintada');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'nequi' | 'tarjeta'>('nequi');
  const [cashAmount, setCashAmount] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isBirthdayCelebration, setIsBirthdayCelebration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  // Check Wednesday 20% promo on main courses
  const todayDay = new Date().getDay(); // 3 = Wednesday
  const wednesdayPromoActive = promotions.some((p) => p.type === 'wednesday' && p.active);
  const isWednesday = todayDay === 3;
  
  let discount = 0;
  let discountReason = '';

  if (isWednesday && wednesdayPromoActive) {
    const mainsSubtotal = items
      .filter((i) => i.product.category === 'principales')
      .reduce((s, i) => s + i.subtotal, 0);
    if (mainsSubtotal > 0) {
      discount = Math.round(mainsSubtotal * 0.2);
      discountReason = 'Fusion Wednesday: 20% OFF on main courses';
    }
  }

  const deliveryFee = modality === 'domicilio' && items.length > 0 ? config.baseDeliveryFee : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const generateWhatsAppMessage = () => {
    let msg = `🎋 *NEW ORDER - OSO FUSION IBAGUÉ* 🎋\n\n`;
    msg += `📍 *Modality:* ${
      modality === 'mesa'
        ? `Dine In (${tableNumber})`
        : modality === 'recoger'
        ? 'Takeaway Pickup at Restaurant (Piedra Pintada)'
        : `Home Delivery in Ibagué (${deliveryNeighborhood})`
    }\n`;
    msg += `👤 *Customer Name:* ${customerName || 'Oso Fusion Guest'}\n`;
    msg += `📞 *Phone:* ${phone || 'Not specified'}\n`;

    if (modality === 'domicilio') {
      msg += `🏠 *Delivery Address:* ${deliveryAddress} (${deliveryNeighborhood})\n`;
    }

    msg += `\n🛒 *ORDER DETAILS:*\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.quantity}x ${item.product.name}* - $${item.subtotal.toLocaleString('en-US')} COP\n`;
      if (item.customization.selectedSauce) {
        msg += `   • Sauce: ${item.customization.selectedSauce}\n`;
      }
      if (item.customization.removedIngredients.length > 0) {
        msg += `   • Without: ${item.customization.removedIngredients.join(', ')}\n`;
      }
      if (item.customization.addedExtras.length > 0) {
        msg += `   • Extras: ${item.customization.addedExtras.map((e) => e.name).join(', ')}\n`;
      }
      if (item.customization.specialInstructions) {
        msg += `   • Note: ${item.customization.specialInstructions}\n`;
      }
    });

    if (isBirthdayCelebration && subtotal >= 45000) {
      msg += `\n🎂 *BIRTHDAY SPECIAL:* Please include complimentary Fusion Dessert for birthday celebrant.\n`;
    }

    msg += `\n💵 *SUMMARY:*\n`;
    msg += `• Subtotal: $${subtotal.toLocaleString('en-US')} COP\n`;
    if (discount > 0) {
      msg += `• Discount (${discountReason}): -$${discount.toLocaleString('en-US')} COP\n`;
    }
    if (deliveryFee > 0) {
      msg += `• Delivery in Ibagué: $${deliveryFee.toLocaleString('en-US')} COP\n`;
    }
    msg += `*TOTAL TO PAY: $${total.toLocaleString('en-US')} COP*\n\n`;
    msg += `💳 *Payment Method:* ${
      paymentMethod === 'nequi'
        ? 'NEQUI / DAVIPLATA (Mobile Transfer)'
        : paymentMethod === 'efectivo'
        ? `CASH${cashAmount ? ` (Paying with: $${cashAmount})` : ''}`
        : 'CREDIT/DEBIT CARD POS'
    }\n`;

    if (orderNotes) {
      msg += `📝 *Notes:* ${orderNotes}\n`;
    }

    msg += `\n_Generated via Oso Fusion Virtual Menu_ 🐾`;
    return encodeURIComponent(msg);
  };

  const handleSendWhatsApp = () => {
    const text = generateWhatsAppMessage();
    const url = `https://api.whatsapp.com/send?phone=57${config.whatsappNumber}&text=${text}`;
    window.open(url, '_blank');
  };

  const handleCreateOrderSystem = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    const orderData: Order = {
      id: `OSO-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      items: [...items],
      modality,
      customerName: customerName.trim() || 'Fusion Guest',
      phone: phone.trim() || config.phone,
      tableNumber: modality === 'mesa' ? tableNumber : undefined,
      deliveryAddress: modality === 'domicilio' ? deliveryAddress : undefined,
      deliveryNeighborhood: modality === 'domicilio' ? deliveryNeighborhood : undefined,
      paymentMethod,
      cashChangeAmount: cashAmount || undefined,
      notes: orderNotes || (isBirthdayCelebration ? 'Birthday celebrant' : undefined),
      subtotal,
      discount,
      deliveryFee,
      total,
      status: 'recibido',
      discountReason: discountReason || undefined,
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
    } catch (err) {
      console.warn('Network sync note:', err);
    } finally {
      setIsSubmitting(false);
      onOrderPlaced(orderData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#161D18] border-l border-white/10 shadow-2xl flex flex-col text-[#F3EFE6]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-5 bg-[#1A231D]">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg">Your Fusion Order</span>
              {items.length > 0 && (
                <span className="rounded-full bg-[#E5B869] px-2 py-0.5 text-xs font-bold text-[#111412] tabular-nums">
                  {items.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#CFCBC0] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modality selector tabs */}
          <div className="p-4 bg-[#141A16] border-b border-white/10">
            <label className="text-[11px] font-bold uppercase text-[#CFCBC0]/70 tracking-wider block mb-2">
              How would you like to enjoy your order?
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#1D2620]">
              {(['mesa', 'recoger', 'domicilio'] as OrderModality[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChangeModality(mode)}
                  className={`py-2 px-1 text-xs font-semibold rounded-lg transition-all text-center ${
                    modality === mode
                      ? 'bg-[#E5B869] text-[#111412] shadow-sm'
                      : 'text-[#CFCBC0] hover:text-[#F3EFE6]'
                  }`}
                >
                  {mode === 'mesa' ? 'Dine In' : mode === 'recoger' ? 'Takeaway' : 'Delivery'}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Items List & Order Form */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center text-[#CFCBC0]">
                <p className="font-display text-lg text-[#F3EFE6]">Your cart is empty</p>
                <p className="mt-1 text-xs">Discover our tostones, gyozas, and the legendary Paisa Bowl.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#E5B869] text-[#111412] text-xs font-bold"
                >
                  Explore the Menu
                </button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-3.5 rounded-xl bg-[#1A231D] border border-white/10 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-display font-bold text-sm text-[#F3EFE6]">
                            {item.product.name}
                          </h4>
                          <span className="font-mono text-xs font-bold text-[#E5B869] tabular-nums">
                            ${item.unitPrice.toLocaleString('en-US')} COP ea.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="text-[#CFCBC0]/60 hover:text-[#E89DA8] p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customizations summary */}
                      <div className="text-[11px] text-[#CFCBC0]/80 space-y-0.5">
                        {item.customization.selectedSauce && (
                          <p>• Sauce: {item.customization.selectedSauce}</p>
                        )}
                        {item.customization.removedIngredients.length > 0 && (
                          <p className="text-[#E89DA8]">
                            • Without: {item.customization.removedIngredients.join(', ')}
                          </p>
                        )}
                        {item.customization.addedExtras.length > 0 && (
                          <p className="text-[#E5B869]">
                            • Extras: {item.customization.addedExtras.map((e) => e.name).join(', ')}
                          </p>
                        )}
                        {item.customization.specialInstructions && (
                          <p className="italic text-[#CFCBC0]/60">
                            • "{item.customization.specialInstructions}"
                          </p>
                        )}
                      </div>

                      {/* Quantity & Subtotal */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2 bg-[#141A16] rounded-lg p-0.5 border border-white/10">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-xs"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-mono text-sm font-bold text-[#F3EFE6] tabular-nums">
                          ${item.subtotal.toLocaleString('en-US')} COP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modality specifics inputs */}
                <div className="p-4 rounded-xl bg-[#1A231D] border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold text-[#E5B869] uppercase tracking-wider">
                    Order Details
                  </h4>

                  {modality === 'mesa' && (
                    <div>
                      <label className="text-[11px] text-[#CFCBC0] block mb-1">
                        Table Number
                      </label>
                      <select
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full rounded-lg bg-[#141A16] border border-white/10 px-3 py-2 text-xs text-[#F3EFE6] focus:border-[#E5B869]"
                      >
                        {Array.from({ length: 20 }, (_, i) => `Table ${i + 1}`).map((m) => (
                          <option key={m} value={m}>
                            {m} (Main Dining Room)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {modality === 'domicilio' && (
                    <>
                      <div>
                        <label className="text-[11px] text-[#CFCBC0] block mb-1">
                          Delivery Address in Ibagué *
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="e.g.: Cra 5 # 41-20, Ocobos Bldg Apt 302"
                          className="w-full rounded-lg bg-[#141A16] border border-white/10 px-3 py-2 text-xs text-[#F3EFE6] focus:border-[#E5B869]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#CFCBC0] block mb-1">
                          Neighborhood / Sector in Ibagué
                        </label>
                        <select
                          value={deliveryNeighborhood}
                          onChange={(e) => setDeliveryNeighborhood(e.target.value)}
                          className="w-full rounded-lg bg-[#141A16] border border-white/10 px-3 py-2 text-xs text-[#F3EFE6] focus:border-[#E5B869]"
                        >
                          <option value="Piedra Pintada">Piedra Pintada (Local Zone)</option>
                          <option value="El Vergel">El Vergel</option>
                          <option value="Cádiz">Cádiz</option>
                          <option value="Interlaken">Interlaken</option>
                          <option value="La Pola">La Pola / Downtown</option>
                          <option value="Calambeo">Calambeo</option>
                          <option value="Macarena">Macarena</option>
                          <option value="Jordán">Jordán (Sectors 1-9)</option>
                          <option value="Santa Helena">Santa Helena</option>
                          <option value="Salado">El Salado</option>
                          <option value="Picaleña">Picaleña</option>
                          <option value="Other">Other Ibagué Sector</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#CFCBC0] block mb-1">Your Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g.: Alex Miller"
                        className="w-full rounded-lg bg-[#141A16] border border-white/10 px-3 py-2 text-xs text-[#F3EFE6] focus:border-[#E5B869]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#CFCBC0] block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g.: 3201234567"
                        className="w-full rounded-lg bg-[#141A16] border border-white/10 px-3 py-2 text-xs text-[#F3EFE6] focus:border-[#E5B869]"
                      />
                    </div>
                  </div>

                  {/* Payment method */}
                  <div>
                    <label className="text-[11px] text-[#CFCBC0] block mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'nequi', label: 'Nequi / Davi' },
                        { id: 'efectivo', label: 'Cash' },
                        { id: 'tarjeta', label: 'Card POS' },
                      ].map((pay) => (
                        <button
                          key={pay.id}
                          type="button"
                          onClick={() => setPaymentMethod(pay.id as any)}
                          className={`py-2 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                            paymentMethod === pay.id
                              ? 'border-[#E5B869] bg-[#E5B869]/10 text-[#E5B869]'
                              : 'border-white/10 bg-[#141A16] text-[#CFCBC0]'
                          }`}
                        >
                          {pay.label}
                        </button>
                      ))}
                    </div>

                    {paymentMethod === 'efectivo' && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          placeholder="How much cash are you paying with? (for change)"
                          className="w-full rounded-lg bg-[#141A16] border border-white/10 px-3 py-1.5 text-xs text-[#F3EFE6] focus:border-[#E5B869]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Birthday Promo Checkbox */}
                  <label className="flex items-start gap-2.5 p-2 rounded-lg bg-[#241F2B] border border-[#E89DA8]/30 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={isBirthdayCelebration}
                      onChange={(e) => setIsBirthdayCelebration(e.target.checked)}
                      className="mt-0.5 rounded text-[#E5B869]"
                    />
                    <div>
                      <span className="font-bold text-[#F4C4CC]">I am celebrating my birthday today! 🎂</span>
                      <p className="text-[10px] text-[#CFCBC0]/80">
                        Free dessert for the birthday celebrant on orders over $45,000 COP (present official ID).
                      </p>
                    </div>
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Sticky Total & Order Actions */}
          {items.length > 0 && (
            <div className="border-t border-white/10 bg-[#141A16] p-5 space-y-3">
              {/* Cost summary breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#CFCBC0]">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">${subtotal.toLocaleString('en-US')} COP</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#8ED09E]">
                    <span>Discount ({discountReason})</span>
                    <span className="font-mono tabular-nums">-${discount.toLocaleString('en-US')} COP</span>
                  </div>
                )}
                {modality === 'domicilio' && (
                  <div className="flex justify-between text-[#CFCBC0]">
                    <span>Delivery Fee (Ibagué)</span>
                    <span className="font-mono tabular-nums">
                      ${deliveryFee.toLocaleString('en-US')} COP
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#F3EFE6] pt-2 border-t border-white/10">
                  <span className="font-display">Total to Pay</span>
                  <span className="font-mono text-[#E5B869] tabular-nums">
                    ${total.toLocaleString('en-US')} COP
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-[#111412] font-bold py-3 px-3 text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCreateOrderSystem}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#E5B869] hover:bg-[#F5DCA3] text-[#111412] font-bold py-3 px-3 text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing...' : 'Confirm in System'}</span>
                </button>
              </div>

              <div className="flex justify-between items-center text-[10px] text-[#CFCBC0]/60 pt-1">
                <span>Estimated time: 25 - 40 min</span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="hover:text-[#E89DA8] transition-colors cursor-pointer"
                >
                  Clear cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

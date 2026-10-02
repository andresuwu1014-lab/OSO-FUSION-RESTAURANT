import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, ChefHat, Package, Bike, Sparkles, MessageCircle } from 'lucide-react';
import { Order, RestaurantConfig } from '../types';

interface OrderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  isOpen,
  onClose,
  config,
}) => {
  if (!isOpen || !order) return null;

  // Simulate progress step over time
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    // Map status string to step number
    if (order.status === 'recibido') setCurrentStep(1);
    else if (order.status === 'preparando') setCurrentStep(2);
    else if (order.status === 'listo') setCurrentStep(3);
    else if (order.status === 'entregado') setCurrentStep(4);

    // Auto progress simulation for active experience
    const timer1 = setTimeout(() => setCurrentStep((s) => Math.max(s, 2)), 6000);
    const timer2 = setTimeout(() => setCurrentStep((s) => Math.max(s, 3)), 18000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [order]);

  const steps = [
    { num: 1, label: 'Order Confirmed', desc: 'Recorded in digital kitchen queue', icon: CheckCircle },
    { num: 2, label: 'At the Wok & Kitchen', desc: 'Cooking over high flame with craft', icon: ChefHat },
    { num: 3, label: 'Packed & Ready', desc: 'Thermal insulated packaging with sealed sauces', icon: Package },
    {
      num: 4,
      label: order.modality === 'domicilio' ? 'On the Way' : 'Served at Table',
      desc: order.modality === 'domicilio' ? 'Courier en route to your address' : 'Enjoy your meal!',
      icon: Bike,
    },
  ];

  const whatsappInquiryUrl = `https://api.whatsapp.com/send?phone=57${config.whatsappNumber}&text=Hello%20Oso%20Fusion%2C%20I%20would%20like%20to%20check%20the%20status%20of%20my%20order%20${order.id}.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#171E19] border border-[#E5B869]/50 shadow-2xl p-6 text-[#F3EFE6]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#CFCBC0] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center pb-6 border-b border-white/10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5B869]/15 text-[#E5B869] text-xs font-semibold gold-border mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Your order is in progress!
          </span>
          <h3 className="font-display text-2xl font-bold text-[#F3EFE6]">
            Order Tracking
          </h3>
          <p className="mt-1 text-xs text-[#CFCBC0] font-mono">
            Code: <span className="text-[#E5B869] font-bold">{order.id}</span> •{' '}
            {order.modality === 'mesa'
              ? order.tableNumber
              : order.modality === 'recoger'
              ? 'Takeaway Pickup'
              : `${order.deliveryNeighborhood || 'Ibagué'}`}
          </p>
        </div>

        {/* Stepper Visualizer */}
        <div className="py-6 space-y-4">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCompleted = currentStep >= st.num;
            const isCurrent = currentStep === st.num;

            return (
              <div
                key={st.num}
                className={`flex items-start gap-4 p-3 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-[#1F2922] border border-[#E5B869]/60 shadow-lg shadow-[#E5B869]/10'
                    : isCompleted
                    ? 'bg-[#141A16] border border-white/5 opacity-90'
                    : 'opacity-40'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-[#E5B869] text-[#111412] font-bold shadow'
                      : 'bg-white/10 text-[#CFCBC0]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-bold ${
                        isCurrent ? 'text-[#E5B869]' : 'text-[#F3EFE6]'
                      }`}
                    >
                      {st.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] text-[#8ED09E] font-medium animate-pulse">
                        In progress...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#CFCBC0]/80 mt-0.5">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Details Brief */}
        <div className="p-4 rounded-xl bg-[#141A16] border border-white/5 text-xs space-y-2">
          <div className="flex justify-between font-bold text-[#F3EFE6]">
            <span>Total Paid / Due</span>
            <span className="font-mono text-[#E5B869] tabular-nums">
              ${order.total.toLocaleString('en-US')} COP
            </span>
          </div>
          <div className="text-[11px] text-[#CFCBC0]/70">
            {order.items.map((it) => `${it.quantity}x ${it.product.name}`).join(' • ')}
          </div>
          {order.deliveryAddress && (
            <p className="text-[11px] text-[#CFCBC0]">
              <strong>Shipping to:</strong> {order.deliveryAddress}
            </p>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-[#111412] py-3 text-xs font-bold transition-all shadow active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Check via WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1F2922] hover:bg-[#28352C] text-[#F3EFE6] text-xs font-semibold transition-all border border-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

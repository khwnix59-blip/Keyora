import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, ArrowRight, Package, MapPin, Sparkles } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useStore();

  const order = location.state?.order as Order | undefined;

  useEffect(() => {
    // Fire festive gold confetti on mount
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C9A24B', '#E6C97A', '#F5F0E6', '#A58235']
      });
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-[#F5F0E6]">
        <h2 className="text-2xl font-serif">No Active Order Found</h2>
        <p className="text-xs text-neutral-400 mt-2 mb-6">
          You can track your orders or browse our new arrivals.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C9A24B] text-[#0B0B0B] text-xs uppercase tracking-wider font-semibold rounded-lg"
        >
          <span>Return to Shop</span>
        </Link>
      </div>
    );
  }

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappMsg = `*Order Confirmation - KEYORA STUDIO*
• *Order #:* ${order.orderNumber}
• *Customer:* ${order.customer.name}
• *Phone:* ${order.customer.phone}
• *City:* ${order.customer.city}
• *Total Payable:* Rs. ${order.total.toLocaleString()} PKR (COD)

Items:
${order.items.map((i) => `- ${i.name} (${i.qty}x) ${i.personalization ? `[Engraving: "${i.personalization}"]` : ''}`).join('\n')}

I've placed my order on the website and would appreciate confirmation!`;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-[#F5F0E6]">
      <div className="bg-[#121212] border border-[#C9A24B]/30 rounded-3xl p-6 sm:p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#C9A24B]/10 blur-3xl pointer-events-none" />

        {/* Checkmark icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-[0.3em] text-[#C9A24B] font-semibold">
          Artisan Token Reserved
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#F5F0E6] mt-2 mb-3">
          Thank You For Your Order
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
          Your custom piece is queued for diamond engraving and meticulous polishing at our studio.
        </p>

        {/* Order Number Plaque */}
        <div className="mt-8 p-5 bg-[#181818] border border-[#C9A24B]/40 rounded-2xl inline-block max-w-sm w-full">
          <span className="text-[11px] uppercase tracking-widest text-neutral-400 block mb-1">
            Order Reference
          </span>
          <span className="text-2xl sm:text-3xl font-mono font-bold text-[#E6C97A] tracking-wider">
            #{order.orderNumber}
          </span>
          <p className="text-[11px] text-neutral-500 mt-1">
            Status: <span className="text-[#C9A24B] font-medium">{order.status}</span> · Cash on Delivery
          </p>
        </div>

        {/* Shipping details and items summary */}
        <div className="mt-10 text-left bg-[#161616] border border-neutral-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-start justify-between border-b border-neutral-800 pb-4 text-xs">
            <div>
              <span className="text-neutral-500 block uppercase tracking-wider text-[10px]">
                Shipping Address
              </span>
              <p className="font-medium text-[#F5F0E6] mt-1">{order.customer.name}</p>
              <p className="text-neutral-300">{order.customer.address}, {order.customer.city}</p>
              <p className="text-neutral-400 font-mono mt-0.5">{order.customer.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 block uppercase tracking-wider text-[10px]">
                Payment
              </span>
              <p className="text-[#E6C97A] font-medium mt-1">Cash on Delivery</p>
              <p className="font-mono text-sm font-semibold text-[#F5F0E6] mt-0.5">
                Rs. {order.total.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Items */}
          <div>
            <span className="text-neutral-500 block uppercase tracking-wider text-[10px] mb-3">
              Items Ordered
            </span>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg border border-neutral-800"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div>
                      <p className="font-medium text-[#F5F0E6]">{item.name} <span className="text-neutral-400">×{item.qty}</span></p>
                      {item.personalization && (
                        <p className="text-[11px] text-[#C9A24B] font-mono">
                          Engraved: &quot;{item.personalization}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-neutral-300">
                    Rs. {(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-[0.15em] font-medium rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Send Confirmation on WhatsApp</span>
          </a>

          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-neutral-700 text-neutral-200 text-xs uppercase tracking-[0.15em] font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

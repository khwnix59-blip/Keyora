import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, updateQty, removeFromCart, subtotal, deliveryCharges, total, clearCart } = useCart();
  const { settings } = useStore();
  const navigate = useNavigate();

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 5000;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-[#F5F0E6]">
        <div className="w-20 h-20 rounded-full border border-dashed border-[#C9A24B]/30 flex items-center justify-center mx-auto mb-6 text-neutral-500">
          <ShoppingBag className="w-10 h-10 stroke-1 text-[#C9A24B]/60" />
        </div>
        <h1 className="text-3xl font-serif font-medium">Your Shopping Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-2 mb-8">
          Personalize a luxury heirloom for yourself or a meaningful gift for someone special.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C9A24B] hover:bg-[#E6C97A] text-[#0B0B0B] text-xs uppercase tracking-[0.2em] font-semibold rounded-lg gold-glow transition-all"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-[#F5F0E6]">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#C9A24B]/20">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
            Review Bag
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
            Shopping Cart
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ================= ITEMS LIST ================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free delivery banner */}
          <div className="p-4 bg-[#141414] border border-neutral-800 rounded-xl flex items-center justify-between text-xs">
            {isFreeDelivery ? (
              <span className="text-[#E6C97A] flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-[#C9A24B]" />
                Congratulations! You qualify for Free Delivery across Pakistan.
              </span>
            ) : (
              <span className="text-neutral-300">
                Add <span className="font-semibold text-[#E6C97A]">Rs. {amountNeeded.toLocaleString()}</span> more to enjoy free nationwide delivery.
              </span>
            )}
            <Link to="/shop" className="text-[#C9A24B] hover:underline font-medium ml-4 shrink-0">
              Add More
            </Link>
          </div>

          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-5 bg-[#121212] border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="min-w-0 space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#C9A24B] font-mono">
                      {item.product.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-serif font-medium text-[#F5F0E6] truncate">
                      {item.product.name}
                    </h3>
                    {item.personalization && (
                      <div className="text-[11px] font-mono text-[#E6C97A] bg-[#181818] border border-[#C9A24B]/30 px-2 py-0.5 rounded inline-block truncate max-w-full">
                        Engraved: &quot;{item.personalization}&quot;
                      </div>
                    )}
                    <div className="text-xs font-mono text-neutral-400">
                      Rs. {item.product.price.toLocaleString()} each
                    </div>
                  </div>
                </div>

                {/* Quantity and Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  <div className="flex items-center border border-neutral-700 rounded-xl bg-[#181818] overflow-hidden">
                    <button
                      onClick={() => updateQty(item.cartItemId, item.qty - 1)}
                      className="px-3 py-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-medium">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.cartItemId, item.qty + 1)}
                      disabled={item.qty >= item.product.stock}
                      className="px-3 py-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-mono font-semibold text-[#E6C97A]">
                      Rs. {(item.product.price * item.qty).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-[#E6C97A]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="lg:col-span-4">
          <div className="p-6 sm:p-8 bg-[#121212] border border-neutral-800 rounded-2xl space-y-6 shadow-2xl">
            <h2 className="text-lg font-serif font-medium text-[#F5F0E6] pb-4 border-b border-neutral-800">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal</span>
                <span className="font-mono text-[#F5F0E6]">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Nationwide Delivery</span>
                <span className="font-mono text-[#F5F0E6]">
                  {deliveryCharges === 0 ? (
                    <span className="text-[#C9A24B] font-medium">FREE</span>
                  ) : (
                    `Rs. ${deliveryCharges}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#F5F0E6] pt-4 border-t border-neutral-800">
                <span>Total Amount</span>
                <span className="font-mono text-lg text-[#E6C97A]">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] text-[#0B0B0B] font-semibold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 gold-glow hover:opacity-95 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="space-y-2.5 pt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0" />
                <span>Cash on Delivery — pay only upon receipt</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C9A24B] shrink-0" />
                <span>Bespoke presentation packaging included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

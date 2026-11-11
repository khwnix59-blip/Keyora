import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, updateQty, removeFromCart, subtotal, deliveryCharges, total, itemCount } = useCart();
  const { settings } = useStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 5000;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0B0B0B] border-l border-[#C9A24B]/20 flex flex-col shadow-2xl text-[#F5F0E6]">
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#C9A24B]" />
              <h2 className="text-lg font-serif font-medium tracking-wide">
                Your Bag <span className="text-xs font-sans text-[#C9A24B]">({itemCount})</span>
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full text-neutral-400 hover:text-[#F5F0E6] hover:bg-neutral-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-[#141414] border-b border-neutral-800/80">
            {amountNeededForFree > 0 ? (
              <p className="text-xs text-neutral-300 mb-2 flex items-center justify-between">
                <span>Add <span className="font-semibold text-[#E6C97A]">Rs. {amountNeededForFree.toLocaleString()}</span> for Free Delivery</span>
                <span className="text-[#C9A24B]">{freeDeliveryPercent}%</span>
              </p>
            ) : (
              <p className="text-xs text-[#E6C97A] mb-2 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
                You unlocked Free Nationwide Delivery!
              </p>
            )}
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeDeliveryPercent}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full border border-dashed border-[#C9A24B]/30 flex items-center justify-center mb-4 text-neutral-500">
                  <ShoppingBag className="w-8 h-8 stroke-1 text-[#C9A24B]/60" />
                </div>
                <h3 className="text-base font-serif font-medium text-[#F5F0E6]">Your bag is empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs mt-1 mb-6">
                  Discover our bespoke collection of handcrafted gold and brass keepsakes.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#C9A24B] text-[#F5F0E6] hover:text-[#0B0B0B] border border-[#C9A24B]/40 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 p-3.5 bg-[#121212] border border-neutral-800/80 rounded-xl hover:border-[#C9A24B]/30 transition-colors"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-neutral-900 border border-neutral-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-[#F5F0E6] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.personalization && (
                        <div className="mt-1 text-[11px] text-[#C9A24B] font-mono tracking-wider bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#C9A24B]/20 inline-block truncate max-w-full">
                          Engraved: &quot;{item.personalization}&quot;
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60">
                      <div className="flex items-center border border-neutral-700/80 rounded-lg overflow-hidden bg-[#181818]">
                        <button
                          onClick={() => updateQty(item.cartItemId, item.qty - 1)}
                          className="px-2 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-medium">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.cartItemId, item.qty + 1)}
                          disabled={item.qty >= item.product.stock}
                          className="px-2 py-1 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-medium font-mono text-[#E6C97A]">
                        Rs. {(item.product.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-[#0E0E0E] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#F5F0E6]">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Charges</span>
                  <span className="font-mono text-[#F5F0E6]">
                    {deliveryCharges === 0 ? (
                      <span className="text-[#C9A24B] font-medium">FREE</span>
                    ) : (
                      `Rs. ${deliveryCharges}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium text-[#F5F0E6] pt-2 border-t border-neutral-800">
                  <span>Estimated Total</span>
                  <span className="font-mono text-base text-[#E6C97A]">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                  className="py-3 px-4 rounded-lg border border-neutral-700 hover:border-[#C9A24B] text-xs uppercase tracking-[0.15em] font-medium transition-colors text-center"
                >
                  View Bag
                </button>

                <button
                  onClick={handleCheckoutClick}
                  className="py-3 px-4 rounded-lg bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] hover:opacity-95 text-[#0B0B0B] font-medium text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 gold-glow-sm transition-transform active:scale-[0.98]"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-center text-neutral-500">
                Cash on Delivery available nationwide · Handcrafted with care
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { CustomerInfo, OrderItem } from '../types';
import { ShieldCheck, Truck, Lock, ArrowLeft, ShoppingBag } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, deliveryCharges, total, clearCart } = useCart();
  const { createOrder } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    phone: '',
    city: 'Lahore',
    address: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect to shop
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-[#F5F0E6]">
        <h2 className="text-2xl font-serif">No items in your bag</h2>
        <p className="text-xs text-neutral-400 mt-2 mb-6">
          Please add keychains to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C9A24B] text-[#0B0B0B] text-xs uppercase tracking-wider font-semibold rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shop</span>
        </Link>
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = 'Please provide a valid Pakistani contact number';
    }
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete street address with house/sector details';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const items: OrderItem[] = cart.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        qty: item.qty,
        image: item.product.images[0],
        personalization: item.personalization
      }));

      const newOrder = await createOrder({
        customer: formData,
        items,
        subtotal,
        deliveryCharges,
        total,
        status: 'Pending',
        paymentMethod: 'Cash on Delivery'
      });

      // Clear shopping cart
      clearCart();

      // Navigate to success page with created order state
      navigate('/order-success', { state: { order: newOrder } });
    } catch (err) {
      console.error('Failed to submit order:', err);
      setIsSubmitting(false);
    }
  };

  const cities = [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Gujranwala',
    'Hyderabad',
    'Bahawalpur',
    'Other'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-[#F5F0E6]">
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-[#E6C97A]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Bag</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* ================= LEFT: SHIPPING FORM ================= */}
        <div className="lg:col-span-7 bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <div className="mb-8 pb-4 border-b border-neutral-800">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
              Delivery Details
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
              Checkout & Confirmation
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Payment is made upon receipt via Cash on Delivery.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium mb-2">
                Full Name <span className="text-[#C9A24B]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Hamza Tariq"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full bg-[#181818] border rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B] ${
                  errors.name ? 'border-red-500' : 'border-neutral-700'
                }`}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Phone & City Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium mb-2">
                  Phone (WhatsApp Active) <span className="text-[#C9A24B]">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="0300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full bg-[#181818] border rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B] ${
                    errors.phone ? 'border-red-500' : 'border-neutral-700'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium mb-2">
                  City <span className="text-[#C9A24B]">*</span>
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none"
                >
                  {cities.map((city) => (
                    <option key={city} value={city} className="bg-[#181818]">
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium mb-2">
                Full Delivery Address <span className="text-[#C9A24B]">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="House / Apartment #, Street #, Sector / Colony, Landmark"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full bg-[#181818] border rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B] ${
                  errors.address ? 'border-red-500' : 'border-neutral-700'
                }`}
              />
              {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium mb-2">
                Special Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Call before delivery / Leave with guard"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none"
              />
            </div>

            {/* Payment Method Badge */}
            <div className="p-4 bg-[#181818] border border-[#C9A24B]/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#C9A24B]" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#F5F0E6]">
                    Payment Method: Cash on Delivery (COD)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#E6C97A] bg-[#222222] px-2 py-0.5 rounded border border-[#C9A24B]/20">
                  Verified
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                You only pay when the rider arrives at your doorstep with your Keyora keepsake parcel.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] text-[#0B0B0B] font-semibold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 gold-glow hover:opacity-95 transition-all disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting ? 'Securing Order...' : `Confirm Order · Rs. ${total.toLocaleString()}`}
              </span>
            </button>
          </form>
        </div>

        {/* ================= RIGHT: ORDER REVIEW ================= */}
        <div className="lg:col-span-5 bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <h2 className="text-base font-serif font-medium text-[#F5F0E6]">
              Bag Overview ({cart.length} items)
            </h2>
            <Link to="/cart" className="text-xs text-[#C9A24B] hover:underline">
              Edit
            </Link>
          </div>

          {/* Items breakdown */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.cartItemId} className="flex gap-3 text-xs">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-14 h-14 object-cover rounded-lg border border-neutral-800 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-[#F5F0E6] truncate">
                    {item.product.name}
                  </h4>
                  {item.personalization && (
                    <div className="text-[10px] text-[#C9A24B] font-mono truncate">
                      &quot;{item.personalization}&quot;
                    </div>
                  )}
                  <div className="text-neutral-400 mt-0.5">
                    Qty: {item.qty} × Rs. {item.product.price.toLocaleString()}
                  </div>
                </div>
                <div className="text-right font-mono font-medium text-[#E6C97A]">
                  Rs. {(item.product.price * item.qty).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="space-y-2 pt-4 border-t border-neutral-800 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span className="font-mono text-[#F5F0E6]">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Delivery Fee</span>
              <span className="font-mono text-[#F5F0E6]">
                {deliveryCharges === 0 ? (
                  <span className="text-[#C9A24B] font-semibold">FREE</span>
                ) : (
                  `Rs. ${deliveryCharges}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#F5F0E6] pt-3 border-t border-neutral-800">
              <span>Total Payable</span>
              <span className="font-mono text-lg text-[#E6C97A]">
                Rs. {total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#161616] rounded-xl text-xs text-neutral-400 space-y-2 border border-neutral-800">
            <div className="flex items-center gap-2 text-[#C9A24B] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Keyora Studio Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Every parcel comes inside our signature rigid gift box with satin ribbon and foam casing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

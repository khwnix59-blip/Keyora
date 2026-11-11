import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Plus,
  Minus,
  Check
} from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, settings } = useStore();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [personalizationText, setPersonalizationText] = useState('');
  const [engravingFont, setEngravingFont] = useState<'serif' | 'sans' | 'script'>('serif');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-[#F5F0E6]">
        <h2 className="text-2xl font-serif">Product Not Found</h2>
        <p className="text-xs text-neutral-400 mt-2 mb-6">
          This piece may have been retired or does not exist.
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

  const isOutOfStock = product.stock <= 0;
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, personalizationText);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  // WhatsApp prefilled message builder
  const whatsappMessage = `*New Order Inquiry - KEYORA STUDIO*
• *Product:* ${product.name}
• *Price:* Rs. ${product.price.toLocaleString()} PKR
• *Quantity:* ${quantity}
• *Total:* Rs. ${(product.price * quantity).toLocaleString()} PKR
${product.isPersonalizable ? `• *Personalization:* "${personalizationText.trim() || 'Not specified'}"` : ''}

I would like to confirm this order via Cash on Delivery. Please assist with delivery timeline.`;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 text-[#F5F0E6]">
      {/* Back button */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-[#E6C97A] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* ================= LEFT: IMAGE GALLERY (Sticky) ================= */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-28">
          {/* Main Showcase Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
              referrerPolicy="no-referrer"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {isOutOfStock ? (
                <span className="px-3 py-1 bg-neutral-950/90 text-neutral-300 border border-neutral-700 text-xs uppercase tracking-wider backdrop-blur-sm rounded">
                  Out of Stock
                </span>
              ) : (
                <span className="px-3 py-1 bg-[#0B0B0B]/85 text-[#E6C97A] border border-[#C9A24B]/50 text-xs uppercase tracking-widest backdrop-blur-sm rounded">
                  {product.category}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#C9A24B] shadow-md scale-95'
                      : 'border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Live Virtual Engraving Preview if Personalizable */}
          {product.isPersonalizable && (
            <div className="mt-8 p-6 bg-[#121212] border border-[#C9A24B]/30 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-[0.2em] text-[#C9A24B] flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Engraving Simulation
                </span>
                <span className="text-[11px] text-neutral-500">
                  Rotary Diamond Cut Preview
                </span>
              </div>

              {/* Simulated Brass Bar Plate */}
              <div className="relative py-8 px-6 rounded-xl bg-gradient-to-r from-[#A58235] via-[#E6C97A] to-[#C9A24B] flex items-center justify-center shadow-inner overflow-hidden border border-[#F5F0E6]/30">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#523F16] shadow-sm" />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#523F16] shadow-sm" />
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#523F16] shadow-sm" />
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#523F16] shadow-sm" />

                <span
                  className={`text-xl sm:text-2xl tracking-[0.25em] uppercase font-bold text-[#2A1E0B] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] ${
                    engravingFont === 'serif'
                      ? 'font-serif'
                      : engravingFont === 'script'
                      ? 'font-serif italic'
                      : 'font-sans'
                  }`}
                >
                  {personalizationText.trim() || 'YOUR NAME'}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3 text-[11px] text-neutral-400">
                <span>Font Style:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEngravingFont('serif')}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-serif ${
                      engravingFont === 'serif' ? 'bg-[#C9A24B] text-[#0B0B0B]' : 'bg-neutral-800'
                    }`}
                  >
                    Classic Serif
                  </button>
                  <button
                    onClick={() => setEngravingFont('sans')}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-sans ${
                      engravingFont === 'sans' ? 'bg-[#C9A24B] text-[#0B0B0B]' : 'bg-neutral-800'
                    }`}
                  >
                    Modern Sans
                  </button>
                  <button
                    onClick={() => setEngravingFont('script')}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-serif italic ${
                      engravingFont === 'script' ? 'bg-[#C9A24B] text-[#0B0B0B]' : 'bg-neutral-800'
                    }`}
                  >
                    Italic
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT: CONTIGUOUS PURCHASE MODULE ================= */}
        <div className="lg:col-span-5 space-y-8 bg-[#101010] p-6 sm:p-8 rounded-2xl border border-neutral-800/90 shadow-2xl">
          {/* Header */}
          <div className="space-y-3 pb-6 border-b border-neutral-800">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-medium">
              <span>{product.category}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className={product.stock > 0 ? 'text-emerald-400' : 'text-neutral-500'}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Sold Out'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] leading-tight">
              {product.name}
            </h1>

            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-semibold font-mono text-[#E6C97A]">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400">PKR (Includes all taxes)</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">
              The Details
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light font-sans">
              {product.description}
            </p>
          </div>

          {/* Personalization Field (shown only if product.isPersonalizable) */}
          {product.isPersonalizable && (
            <div className="space-y-2.5 pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-[0.2em] text-[#E6C97A] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
                  Custom Personalization
                </label>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {personalizationText.length}/16 chars
                </span>
              </div>

              <input
                type="text"
                maxLength={16}
                placeholder="Enter name, initials, or year (e.g. A.L. · 2026)"
                value={personalizationText}
                onChange={(e) => setPersonalizationText(e.target.value.toUpperCase())}
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F0E6] uppercase placeholder:normal-case placeholder:text-neutral-500 font-mono tracking-wider focus:outline-none"
              />
              <p className="text-[11px] text-neutral-400">
                Engraving is complimentary. Names or monograms are permanently etched.
              </p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2 pt-4 border-t border-neutral-800">
            <label className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-neutral-700 rounded-xl bg-[#181818] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-3 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-mono text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-3 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-neutral-400">
                Total:{' '}
                <strong className="font-mono text-[#E6C97A]">
                  Rs. {(product.price * quantity).toLocaleString()}
                </strong>
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-4">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 shadow-xl ${
                isOutOfStock
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] hover:opacity-95 text-[#0B0B0B] gold-glow hover:scale-[1.01]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                </>
              )}
            </button>

            {/* Order on WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl border border-[#25D366]/60 hover:bg-[#25D366]/10 text-[#25D366] text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Order on WhatsApp</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-neutral-800/80 space-y-3 text-xs text-neutral-400">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#C9A24B] shrink-0" />
              <span>Cash on Delivery nationwide (2–4 working days)</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0" />
              <span>Solid jeweler&apos;s brass with anti-tarnish coating</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-[#C9A24B] shrink-0" />
              <span>Free replacement if any spelling defect occurs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

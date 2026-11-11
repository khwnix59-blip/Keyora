import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Logo } from '../components/Logo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Crown,
  HeartHandshake,
  MessageCircle,
  Truck,
  Star
} from 'lucide-react';

export const Home: React.FC = () => {
  const { products, categories, settings } = useStore();

  const featuredProducts = products
    .filter((p) => p.isFeatured && p.isActive)
    .slice(0, 4);

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-24 md:space-y-32 pb-24 text-[#F5F0E6]">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#C9A24B]/20">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_keychain_showcase_1794382966635.jpg"
            alt="KEYORA STUDIO artisanal personalized keychains"
            className="w-full h-full object-cover object-center filter brightness-[0.38] scale-105 transform animate-fade-in"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0B0B0B]/40 to-[#0B0B0B]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Brand Logo in Hero */}
          <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
            <Logo variant="gold-on-dark" size="xl" showTagline={false} />
          </div>

          {/* Subtitle / Keywords */}
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#C9A24B] mb-5 font-medium">
            <span>Personalized</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Stylish</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Premium</span>
          </div>

          {/* Main Tagline Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight text-[#F5F0E6] max-w-3xl leading-[1.15] text-balance">
            {settings.heroText || "More than just a keychain. It's a story."}
          </h1>

          <p className="mt-6 text-sm sm:text-base text-neutral-300 max-w-xl font-sans font-light leading-relaxed">
            Crafted from solid brass, warm 18K gold finishes, and full-grain Italian leather.
            Individually engraved with the names, milestones, and bonds that matter most.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] text-[#0B0B0B] font-semibold text-xs uppercase tracking-[0.2em] rounded-lg gold-glow transition-all duration-300 hover:opacity-95 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Keyora Studio, I would like to design a bespoke keychain.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#141414]/90 hover:bg-[#1E1E1E] border border-[#C9A24B]/40 hover:border-[#C9A24B] text-[#F5F0E6] font-medium text-xs uppercase tracking-[0.2em] rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#C9A24B]" />
              <span>Order on WhatsApp</span>
            </a>
          </div>

          {/* Trust Badges Strip */}
          <div className="mt-14 pt-8 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-neutral-400">
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-[#C9A24B]" />
              <span>Cash on Delivery Nationwide</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A24B]" />
              <span>Precision Diamond Engraving</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2">
              <Crown className="w-4 h-4 text-[#C9A24B]" />
              <span>Jewelry Grade Finish</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-4 border-b border-[#C9A24B]/20">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
              Curated Heirlooms
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
              Featured Keepsakes
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-[#E6C97A] flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C9A24B]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
            Signature Silhouettes
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
            Shop by Collection
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-sans">
            Whether honoring a partnership, commemorating an achievement, or gifting with elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-xl overflow-hidden border border-neutral-800 hover:border-[#C9A24B]/50 transition-all duration-300 flex flex-col bg-[#141414]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-900">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-serif font-medium text-[#F5F0E6] group-hover:text-[#E6C97A] transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-neutral-300 mt-1 line-clamp-2 font-light">
                    {cat.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#C9A24B] font-medium">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= WHY KEYORA ================= */}
      <section className="bg-[#121212] border-y border-[#C9A24B]/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
              The Artisan Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
              Why Keyora Studio
            </h2>
            <div className="w-12 h-0.5 bg-[#C9A24B] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* 1. Personalized */}
            <div className="p-8 rounded-xl bg-[#171717] border border-neutral-800 hover:border-[#C9A24B]/30 transition-all text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#1F1F1F] border border-[#C9A24B]/30 flex items-center justify-center mb-6 text-[#C9A24B]">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-serif font-medium text-[#F5F0E6] mb-2">
                Personalized
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Each piece is custom-engraved with your initials, significant anniversary dates, or custom coordinates using high-precision diamond rotary cutters.
              </p>
            </div>

            {/* 2. Stylish */}
            <div className="p-8 rounded-xl bg-[#171717] border border-neutral-800 hover:border-[#C9A24B]/30 transition-all text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#1F1F1F] border border-[#C9A24B]/30 flex items-center justify-center mb-6 text-[#C9A24B]">
                <Crown className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-serif font-medium text-[#F5F0E6] mb-2">
                Stylish
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Rooted in minimalist aesthetics, combining rich black textures, vintage key motifs, and deep brushed gold accents designed to elevate everyday essentials.
              </p>
            </div>

            {/* 3. Premium */}
            <div className="p-8 rounded-xl bg-[#171717] border border-neutral-800 hover:border-[#C9A24B]/30 transition-all text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#1F1F1F] border border-[#C9A24B]/30 flex items-center justify-center mb-6 text-[#C9A24B]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-serif font-medium text-[#F5F0E6] mb-2">
                Premium
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Forged from solid jeweler&apos;s brass, electroplated with tarnish-resistant gold coats, and paired with full-grain Italian leather built to endure decades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
            Client Reflections
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
            Stories Held Close
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#121212] border border-neutral-800 rounded-xl space-y-4">
            <div className="flex items-center gap-1 text-[#C9A24B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#C9A24B]" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 italic font-serif leading-relaxed">
              &quot;The Aurum brass bar felt substantially heavier and more luxurious than I expected. The engraving of our wedding date was impeccably sharp.&quot;
            </p>
            <div className="pt-2 border-t border-neutral-800/80 text-xs">
              <span className="font-medium text-[#F5F0E6] block">Zainab Khan</span>
              <span className="text-neutral-500 text-[11px]">Verified Buyer · Islamabad</span>
            </div>
          </div>

          <div className="p-6 bg-[#121212] border border-neutral-800 rounded-xl space-y-4">
            <div className="flex items-center gap-1 text-[#C9A24B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#C9A24B]" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 italic font-serif leading-relaxed">
              &quot;Ordered the Couple Interlocking set for our 3rd anniversary. My husband loved the matte gunmetal contrast against the gold. 10/10 gift presentation.&quot;
            </p>
            <div className="pt-2 border-t border-neutral-800/80 text-xs">
              <span className="font-medium text-[#F5F0E6] block">Ayesha Siddiqui</span>
              <span className="text-neutral-500 text-[11px]">Verified Buyer · Lahore</span>
            </div>
          </div>

          <div className="p-6 bg-[#121212] border border-neutral-800 rounded-xl space-y-4">
            <div className="flex items-center gap-1 text-[#C9A24B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#C9A24B]" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 italic font-serif leading-relaxed">
              &quot;The Sovereign Gift Suite arrived in Karachi in under 3 days. Cash on delivery was seamless, and the box with the wax seal felt like royal mail.&quot;
            </p>
            <div className="pt-2 border-t border-neutral-800/80 text-xs">
              <span className="font-medium text-[#F5F0E6] block">Bilal Rauf</span>
              <span className="text-neutral-500 text-[11px]">Verified Buyer · Karachi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Quick Contact Button */}
      <a
        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hi Keyora Studio! I have a question about placing a custom keychain order.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 p-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 gold-glow-sm"
        aria-label="Chat with Keyora Studio on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    </div>
  );
};

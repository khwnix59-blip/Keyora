import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from '../components/Logo';
import {
  Instagram,
  MessageCircle,
  Mail,
  MapPin,
  Send,
  Sparkles,
  ShieldCheck,
  Crown,
  CheckCircle2
} from 'lucide-react';

export const AboutContactPage: React.FC = () => {
  const { settings, addToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('error', 'Missing Information', 'Please complete all required fields.');
      return;
    }

    setSubmitted(true);
    addToast('success', 'Message Received', 'Our concierge team will respond within 4 business hours.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-[#F5F0E6] space-y-24">
      {/* ================= BRAND STORY SECTION ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#C9A24B] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Heritage of Keyora</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-normal text-[#F5F0E6] leading-tight text-balance">
            More than just a keychain. It&apos;s an enduring story.
          </h1>

          <div className="w-16 h-0.5 bg-[#C9A24B]" />

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            Founded in 2024, <strong className="text-[#E6C97A] font-medium">KEYORA STUDIO</strong> was born from a singular belief: the objects you carry every single day should carry weight, intention, and meaning.
          </p>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
            A key is historically a symbol of access, sanctuary, and return. By fusing timeless vintage silhouette craftsmanship with bespoke diamond rotary engraving, each Keyora piece serves as a daily tactile reminder of the people and moments you cherish.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
            <div>
              <span className="text-2xl font-serif text-[#C9A24B] block">Solid Brass</span>
              <span className="text-xs text-neutral-400">Forged from dense jewelry-grade alloys</span>
            </div>
            <div>
              <span className="text-2xl font-serif text-[#C9A24B] block">Diamond Cut</span>
              <span className="text-xs text-neutral-400">Permanent rotary etching that never fades</span>
            </div>
          </div>
        </div>

        {/* Story Visual Banner */}
        <div className="lg:col-span-6">
          <div className="relative rounded-2xl overflow-hidden border border-[#C9A24B]/30 shadow-2xl bg-neutral-900 group">
            <img
              src="/src/assets/images/product_leather_gold_1794382969682.jpg"
              alt="KEYORA STUDIO bespoke craftsmanship"
              className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0B0B0B]/85 backdrop-blur-md rounded-xl border border-neutral-800">
              <p className="text-xs font-serif italic text-neutral-200">
                &quot;Every keychain is inspected by hand, hand-buffed with jewelers rouge, and wrapped in acid-free tissue inside our black keepsake case.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALUES / PILLARS ================= */}
      <section className="border-y border-[#C9A24B]/20 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
            Our Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium mt-1">
            Personalized · Stylish · Premium
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#121212] rounded-xl border border-neutral-800 space-y-3">
            <Crown className="w-6 h-6 text-[#C9A24B]" />
            <h3 className="text-base font-serif font-medium text-[#F5F0E6]">Bespoke Personalization</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We never use surface stickers or shallow laser burns. Our diamond engraving removes metal micro-layers for lasting legibility.
            </p>
          </div>

          <div className="p-6 bg-[#121212] rounded-xl border border-neutral-800 space-y-3">
            <Sparkles className="w-6 h-6 text-[#C9A24B]" />
            <h3 className="text-base font-serif font-medium text-[#F5F0E6]">Minimalist Sophistication</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Understated, high-contrast black and gold palettes that complement luxury car remotes, apartment keys, and tailored bags.
            </p>
          </div>

          <div className="p-6 bg-[#121212] rounded-xl border border-neutral-800 space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#C9A24B]" />
            <h3 className="text-base font-serif font-medium text-[#F5F0E6]">Enduring Longevity</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Electroplated with durable 18K gold and protective clear sealants to resist pocket abrasions and everyday wear.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTACT SECTION ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Contact Info & Direct Links */}
        <div className="lg:col-span-5 space-y-8 bg-[#121212] p-6 sm:p-10 rounded-2xl border border-neutral-800">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
              Get in Touch
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
              Studio Concierge
            </h2>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Have a bulk corporate gifting request, a custom wedding favor order, or a bespoke design idea? Reach out directly.
            </p>
          </div>

          {/* Direct channels */}
          <div className="space-y-4">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hi Keyora Studio, I have a customer inquiry.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-[#171717] border border-neutral-800 hover:border-[#25D366] transition-colors group"
            >
              <div className="p-2.5 rounded-lg bg-[#25D366]/10 text-[#25D366]">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block">
                  Instant Support
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#F5F0E6] group-hover:text-[#25D366] transition-colors">
                  Chat on WhatsApp ({settings.whatsappNumber})
                </span>
              </div>
            </a>

            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-[#171717] border border-neutral-800 hover:border-[#E1306C] transition-colors group"
            >
              <div className="p-2.5 rounded-lg bg-[#E1306C]/10 text-[#E1306C]">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block">
                  Follow Our Journey
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#F5F0E6] group-hover:text-[#E6C97A] transition-colors">
                  @keyorastudio on Instagram
                </span>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#171717] border border-neutral-800">
              <div className="p-2.5 rounded-lg bg-[#C9A24B]/10 text-[#C9A24B]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block">
                  Email Concierge
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#F5F0E6]">
                  concierge@keyora.studio
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#171717] border border-neutral-800">
              <div className="p-2.5 rounded-lg bg-[#C9A24B]/10 text-[#C9A24B]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500 block">
                  Delivery Coverage
                </span>
                <span className="text-xs sm:text-sm font-medium text-[#F5F0E6]">
                  Nationwide Express across Pakistan
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7 bg-[#121212] p-6 sm:p-10 rounded-2xl border border-neutral-800 shadow-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
            Send an Inquiry
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1 mb-6">
            Leave a Note for the Craftsmen
          </h2>

          {submitted ? (
            <div className="p-8 text-center bg-[#171717] border border-[#C9A24B]/40 rounded-xl space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-medium">Thank You</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                We have received your message. Our concierge representative will contact you via WhatsApp or Email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#C9A24B] hover:underline uppercase tracking-wider font-medium"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium mb-2">
                    Your Name <span className="text-[#C9A24B]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zara Ahmed"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium mb-2">
                    Email Address <span className="text-[#C9A24B]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="zara@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium mb-2">
                  WhatsApp Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-neutral-300 font-medium mb-2">
                  Message / Custom Request <span className="text-[#C9A24B]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your desired customization, bulk requirements, or any questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] text-[#0B0B0B] font-semibold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 gold-glow hover:opacity-95 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

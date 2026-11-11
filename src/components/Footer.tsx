import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useStore } from '../context/StoreContext';
import { Instagram, MessageCircle, Mail, MapPin, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useStore();
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#080808] border-t border-[#C9A24B]/20 text-[#F5F0E6] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-neutral-800">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Logo variant="gold-on-dark" size="md" horizontal={false} />
            <p className="font-serif italic text-xs text-neutral-400 text-center md:text-left mt-3 leading-relaxed">
              &quot;More than just a keychain. It&apos;s a story.&quot;
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-neutral-800 hover:border-[#C9A24B] hover:text-[#C9A24B] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello Keyora Studio, I have an inquiry about custom keychains.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-neutral-800 hover:border-[#C9A24B] hover:text-[#C9A24B] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/shop?category=Name Keychains" className="hover:text-[#F5F0E6] transition-colors">
                  Name Keychains
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Couple Keychains" className="hover:text-[#F5F0E6] transition-colors">
                  Couple Keychains
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Gift Sets" className="hover:text-[#F5F0E6] transition-colors">
                  Luxury Gift Sets
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#F5F0E6] transition-colors">
                  View Full Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
              Client Service
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/about" className="hover:text-[#F5F0E6] transition-colors">
                  The Keyora Craft
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F5F0E6] transition-colors">
                  Contact & Concierge
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F5F0E6] transition-colors inline-flex items-center gap-1"
                >
                  <span>WhatsApp Direct Order</span>
                  <ArrowUpRight className="w-3 h-3 text-[#C9A24B]" />
                </a>
              </li>
              <li>
                <span className="text-neutral-500">Cash on Delivery Available</span>
              </li>
            </ul>
          </div>

          {/* Brand Promise / Contact */}
          <div className="space-y-4 text-center md:text-left">
            <h4 className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
              Workshop
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every token is individually cut, polished, and diamond-engraved with personalized dedication.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-neutral-400">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                <span>Lahore · Karachi · Islamabad (Nationwide)</span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                <span>orders@keyora.studio</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & admin access */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} KEYORA STUDIO. All rights reserved. Crafted with excellence.</p>
          <div className="flex items-center gap-6">
            <span className="text-neutral-600">Personalized · Stylish · Premium</span>
            <Link to="/admin" className="hover:text-[#C9A24B] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

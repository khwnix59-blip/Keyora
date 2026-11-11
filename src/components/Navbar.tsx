import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { itemCount, openCart } = useCart();
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#C9A24B]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Zone */}
          <Link to="/" className="flex items-center whitespace-nowrap shrink-0 group">
            <Logo variant="gold-on-dark" size="sm" horizontal={true} />
          </Link>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-neutral-300">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#E6C97A] ${
                  isActive(link.path)
                    ? 'text-[#C9A24B]'
                    : 'text-neutral-400'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C9A24B]" />
                )}
              </Link>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Bag */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Admin badge link */}
            <Link
              to="/admin"
              className={`p-2 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                isAdmin
                  ? 'text-[#C9A24B] bg-[#1A1A1A] border border-[#C9A24B]/40'
                  : 'text-neutral-400 hover:text-[#E6C97A]'
              }`}
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden lg:inline text-[11px] font-sans">
                {isAdmin ? 'Admin' : 'Owner'}
              </span>
            </Link>

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-lg text-neutral-200 hover:text-[#C9A24B] hover:bg-neutral-900 border border-transparent hover:border-[#C9A24B]/30 transition-all duration-200 flex items-center justify-center group"
              aria-label={`Shopping bag with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105 text-[#E6C97A]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#C9A24B] text-[#0B0B0B] text-[11px] font-mono font-bold rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-300 hover:text-[#C9A24B]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F0F0F] border-b border-[#C9A24B]/30 px-6 py-6 space-y-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm uppercase tracking-[0.2em] py-2 border-b border-neutral-800 ${
                  isActive(link.path) ? 'text-[#C9A24B] font-semibold' : 'text-neutral-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-[0.2em] py-2 text-[#C9A24B] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management Portal</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

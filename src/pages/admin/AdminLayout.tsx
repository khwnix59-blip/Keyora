import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  Database,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, loading, logout, isFirebaseActive } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Protected route check
  React.useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F0E6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C9A24B] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-[#C9A24B]">
            Verifying Credentials...
          </span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Firebase Setup', path: '/admin/firebase-guide', icon: Database }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F0E6] flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0F0F0F] border-r border-[#C9A24B]/20 shrink-0">
        {/* Brand header */}
        <div className="p-6 border-b border-neutral-800">
          <Link to="/" className="block">
            <Logo variant="gold-on-dark" size="sm" horizontal={true} />
          </Link>
          <div className="mt-3 flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#C9A24B] bg-[#171717] px-2 py-1 rounded border border-[#C9A24B]/20">
            <ShieldCheck className="w-3 h-3" />
            <span>Admin Control Panel</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium transition-colors ${
                  active
                    ? 'bg-[#C9A24B] text-[#0B0B0B] font-semibold'
                    : 'text-neutral-400 hover:text-[#F5F0E6] hover:bg-neutral-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* System & Footer */}
        <div className="p-4 border-t border-neutral-800 space-y-3">
          <div className="px-3 py-2 rounded-lg bg-[#141414] border border-neutral-800 text-[11px] text-neutral-400">
            <span className="block text-[10px] uppercase text-neutral-500 font-medium">Logged in as</span>
            <span className="truncate block font-mono text-[#E6C97A]">{user?.email}</span>
            <span className="text-[10px] text-neutral-500 mt-1 block">
              DB: {isFirebaseActive ? 'Firebase Active' : 'Persistent Local'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <Link
              to="/"
              target="_blank"
              className="text-xs text-neutral-400 hover:text-[#E6C97A] flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Store</span>
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors p-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-[#0F0F0F] border-r border-[#C9A24B]/30 flex flex-col p-6 z-10">
            <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
              <Logo variant="gold-on-dark" size="sm" horizontal={true} />
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-medium ${
                      active
                        ? 'bg-[#C9A24B] text-[#0B0B0B] font-semibold'
                        : 'text-neutral-400 hover:text-[#F5F0E6]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="py-2.5 text-xs text-red-400 hover:text-red-300 flex items-center gap-2 border-t border-neutral-800"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 text-neutral-400 hover:text-white"
              aria-label="Open navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C9A24B] font-semibold">
              Owner Management
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-neutral-700 text-xs text-neutral-200 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span className="hidden sm:inline">View Public Store</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Route Content */}
        <main className="p-4 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

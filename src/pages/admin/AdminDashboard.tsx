import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import {
  Package,
  ShoppingBag,
  Clock,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, orders, updateOrderStatus } = useStore();

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const recentOrders = orders.slice(0, 5);

  const statusColors: Record<OrderStatus, string> = {
    Pending: 'bg-amber-950/40 text-amber-300 border-amber-600/40',
    Confirmed: 'bg-blue-950/40 text-blue-300 border-blue-600/40',
    Shipped: 'bg-purple-950/40 text-purple-300 border-purple-600/40',
    Delivered: 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40',
    Cancelled: 'bg-red-950/40 text-red-300 border-red-600/40'
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
            Executive Summary
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
            Studio Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-[#C9A24B] hover:bg-[#E6C97A] text-[#0B0B0B] text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Manage Catalog</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-neutral-700 text-neutral-200 text-xs uppercase tracking-wider font-medium rounded-lg transition-colors"
          >
            <span>View All Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="p-6 bg-[#121212] border border-neutral-800 rounded-2xl flex items-center justify-between hover:border-[#C9A24B]/40 transition-colors">
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
              Total Products
            </span>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-[#F5F0E6] mt-1">
              {totalProducts}
            </p>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              {products.filter((p) => p.isActive).length} currently active
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#181818] text-[#C9A24B] border border-[#C9A24B]/20">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-[#121212] border border-neutral-800 rounded-2xl flex items-center justify-between hover:border-[#C9A24B]/40 transition-colors">
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
              Total Orders
            </span>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-[#F5F0E6] mt-1">
              {totalOrders}
            </p>
            <span className="text-[11px] text-neutral-500 mt-1 block">All-time bookings</span>
          </div>
          <div className="p-3 rounded-xl bg-[#181818] text-[#E6C97A] border border-[#C9A24B]/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-6 bg-[#121212] border border-neutral-800 rounded-2xl flex items-center justify-between hover:border-[#C9A24B]/40 transition-colors">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-medium">
              Pending Orders
            </span>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 mt-1">
              {pendingOrders}
            </p>
            <span className="text-[11px] text-neutral-500 mt-1 block">Awaiting confirmation</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/30 text-amber-400 border border-amber-500/30">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-6 bg-[#121212] border border-neutral-800 rounded-2xl flex items-center justify-between hover:border-[#C9A24B]/40 transition-colors">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#C9A24B] font-medium">
              Gross Revenue
            </span>
            <p className="text-xl sm:text-2xl font-mono font-bold text-[#E6C97A] mt-1 truncate">
              Rs. {totalRevenue.toLocaleString()}
            </p>
            <span className="text-[11px] text-neutral-500 mt-1 block">Cash on Delivery</span>
          </div>
          <div className="p-3 rounded-xl bg-[#181818] text-[#C9A24B] border border-[#C9A24B]/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#C9A24B]" />
            <h2 className="text-base font-serif font-medium text-[#F5F0E6]">
              Recent Client Orders
            </h2>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs text-[#C9A24B] hover:text-[#E6C97A] flex items-center gap-1 font-medium transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 text-xs">
            No orders received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">City</th>
                  <th className="py-3 px-6">Items</th>
                  <th className="py-3 px-6">Total (PKR)</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#161616] transition-colors">
                    <td className="py-4 px-6 font-mono font-semibold text-[#E6C97A]">
                      #{order.orderNumber}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-[#F5F0E6]">{order.customer.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{order.customer.phone}</div>
                    </td>
                    <td className="py-4 px-6 text-neutral-300">{order.customer.city}</td>
                    <td className="py-4 px-6 text-neutral-400">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="py-4 px-6 font-mono font-medium text-[#F5F0E6]">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-full border bg-transparent focus:outline-none cursor-pointer ${
                          statusColors[order.status]
                        }`}
                      >
                        <option value="Pending" className="bg-[#1A1A1A] text-amber-300">Pending</option>
                        <option value="Confirmed" className="bg-[#1A1A1A] text-blue-300">Confirmed</option>
                        <option value="Shipped" className="bg-[#1A1A1A] text-purple-300">Shipped</option>
                        <option value="Delivered" className="bg-[#1A1A1A] text-emerald-300">Delivered</option>
                        <option value="Cancelled" className="bg-[#1A1A1A] text-red-300">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to="/admin/orders"
                        className="text-[#C9A24B] hover:underline font-medium"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

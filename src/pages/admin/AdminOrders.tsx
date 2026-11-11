import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import {
  Search,
  ShoppingBag,
  Trash2,
  X,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, settings } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const statuses: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'All' || o.status === selectedStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q) ||
      o.customer.city.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const statusStyles: Record<OrderStatus, string> = {
    Pending: 'bg-amber-950/40 text-amber-300 border-amber-600/40',
    Confirmed: 'bg-blue-950/40 text-blue-300 border-blue-600/40',
    Shipped: 'bg-purple-950/40 text-purple-300 border-purple-600/40',
    Delivered: 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40',
    Cancelled: 'bg-red-950/40 text-red-300 border-red-600/40'
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({ ...activeOrder, status: newStatus });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingOrderId) return;
    await deleteOrder(deletingOrderId);
    if (activeOrder?.id === deletingOrderId) {
      setActiveOrder(null);
    }
    setDeletingOrderId(null);
  };

  const cleanCustomerPhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
            Order Fulfillment
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
            Client Orders ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by order #, customer name, phone, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181818] border border-neutral-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedStatus('All')}
              className={`px-3 py-1.5 text-xs rounded-lg uppercase tracking-wider font-medium transition-colors whitespace-nowrap ${
                selectedStatus === 'All'
                  ? 'bg-[#C9A24B] text-[#0B0B0B] font-semibold'
                  : 'bg-[#181818] text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1.5 text-xs rounded-lg uppercase tracking-wider font-medium transition-colors whitespace-nowrap ${
                  selectedStatus === s
                    ? 'bg-[#C9A24B] text-[#0B0B0B] font-semibold'
                    : 'bg-[#181818] text-neutral-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-400">
            No matching orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181818] text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="py-3.5 px-6">Order #</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Location</th>
                  <th className="py-3.5 px-6">Items & Engravings</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#161616] transition-colors">
                    <td className="py-4 px-6 font-mono font-semibold text-[#E6C97A]">
                      #{o.orderNumber}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-medium text-[#F5F0E6] text-sm">{o.customer.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {o.customer.phone}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="text-[#F5F0E6]">{o.customer.city}</div>
                      <div className="text-[11px] text-neutral-500 truncate max-w-xs">
                        {o.customer.address}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {o.items.map((i, idx) => (
                          <div key={idx} className="text-neutral-300">
                            <span>{i.name} ×{i.qty}</span>
                            {i.personalization && (
                              <span className="text-[#C9A24B] font-mono ml-1.5 text-[11px]">
                                [&quot;{i.personalization}&quot;]
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono font-semibold text-[#E6C97A]">
                      Rs. {o.total.toLocaleString()}
                    </td>

                    <td className="py-4 px-6">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                        className={`text-[11px] font-mono px-3 py-1 rounded-full border bg-[#121212] focus:outline-none cursor-pointer ${
                          statusStyles[o.status]
                        }`}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st} className="bg-[#1A1A1A] text-neutral-200">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveOrder(o)}
                          className="px-3 py-1 bg-[#1E1E1E] hover:bg-[#C9A24B] hover:text-[#0B0B0B] text-neutral-300 rounded-lg text-xs font-medium transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDeletingOrderId(o.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 rounded transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-2xl w-full bg-[#121212] border border-[#C9A24B]/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C9A24B] font-semibold">
                  Order Details
                </span>
                <h2 className="text-2xl font-mono font-bold text-[#E6C97A] mt-0.5">
                  #{activeOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Customer Info Box */}
              <div className="bg-[#181818] p-4 rounded-xl border border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block mb-1">
                    Customer Name
                  </span>
                  <p className="text-sm font-semibold text-[#F5F0E6]">{activeOrder.customer.name}</p>
                  <p className="font-mono text-neutral-400 mt-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>{activeOrder.customer.phone}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-neutral-500 block mb-1">
                    Shipping Destination
                  </span>
                  <p className="text-[#F5F0E6] font-medium">{activeOrder.customer.city}</p>
                  <p className="text-neutral-400 mt-0.5 leading-relaxed">{activeOrder.customer.address}</p>
                </div>

                {activeOrder.customer.notes && (
                  <div className="sm:col-span-2 pt-2 border-t border-neutral-800 text-neutral-400">
                    <span className="text-[10px] uppercase text-neutral-500 block mb-0.5">
                      Customer Instructions
                    </span>
                    <p className="italic text-[#E6C97A]">&quot;{activeOrder.customer.notes}&quot;</p>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-3">
                  Purchased Items ({activeOrder.items.length})
                </h3>
                <div className="space-y-3">
                  {activeOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border border-neutral-800"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div>
                          <p className="text-xs font-medium text-[#F5F0E6]">
                            {item.name} <span className="text-neutral-400">×{item.qty}</span>
                          </p>
                          {item.personalization && (
                            <p className="text-[11px] text-[#C9A24B] font-mono mt-0.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Laser Engraving: &quot;{item.personalization}&quot;</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="font-mono text-xs font-semibold text-[#E6C97A]">
                        Rs. {(item.price * item.qty).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="p-4 bg-[#181818] rounded-xl border border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#F5F0E6]">Rs. {activeOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Delivery Charges</span>
                  <span className="font-mono text-[#F5F0E6]">Rs. {activeOrder.deliveryCharges}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#F5F0E6] pt-2 border-t border-neutral-800">
                  <span>Total Amount (COD)</span>
                  <span className="font-mono text-base text-[#E6C97A]">
                    Rs. {activeOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status Update & Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs text-neutral-400">Status:</span>
                  <select
                    value={activeOrder.status}
                    onChange={(e) => handleStatusChange(activeOrder.id, e.target.value as OrderStatus)}
                    className={`text-xs font-mono px-3 py-1.5 rounded-lg border bg-[#121212] focus:outline-none cursor-pointer ${
                      statusStyles[activeOrder.status]
                    }`}
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st} className="bg-[#1A1A1A] text-neutral-200">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <a
                    href={`https://wa.me/${cleanCustomerPhone(activeOrder.customer.phone)}?text=${encodeURIComponent(
                      `Hello ${activeOrder.customer.name}, this is KEYORA STUDIO regarding your order #${activeOrder.orderNumber}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-medium flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp Customer</span>
                  </a>

                  <button
                    onClick={() => setActiveOrder(null)}
                    className="px-4 py-2 border border-neutral-700 text-xs rounded-xl hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#121212] border border-red-500/30 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-medium text-[#F5F0E6]">Delete Order?</h3>
            <p className="text-xs text-neutral-400 mt-2 mb-6">
              This order record will be permanently deleted from Firestore and storage records.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingOrderId(null)}
                className="px-5 py-2.5 rounded-xl border border-neutral-700 text-xs text-neutral-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

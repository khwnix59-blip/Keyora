import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { uploadProductImage } from '../../firebase/service';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Upload,
  X,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { products, categories, createOrUpdateProduct, deleteProduct, addToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt'>>({
    name: '',
    price: 1800,
    category: categories[0]?.name || 'Name Keychains',
    description: '',
    images: ['/src/assets/images/product_name_bar_1794382967325.jpg'],
    stock: 20,
    isFeatured: false,
    isPersonalizable: true,
    isActive: true
  });

  const [newImageUrl, setNewImageUrl] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 1800,
      category: categories[0]?.name || 'Name Keychains',
      description: '',
      images: ['/src/assets/images/product_name_bar_1794382967325.jpg'],
      stock: 20,
      isFeatured: false,
      isPersonalizable: true,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      images: [...product.images],
      stock: product.stock,
      isFeatured: product.isFeatured,
      isPersonalizable: product.isPersonalizable,
      isActive: product.isActive
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const file = files[0];
      const uploadedUrl = await uploadProductImage(file);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, uploadedUrl]
      }));
      addToast('success', 'Image Uploaded', 'Product image added.');
    } catch (err) {
      addToast('error', 'Upload Error', 'Could not upload image.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()]
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    if (formData.images.length <= 1) {
      addToast('error', 'Image Required', 'A product must have at least one image.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('error', 'Validation Error', 'Product name is required.');
      return;
    }

    try {
      await createOrUpdateProduct({
        id: editingProduct?.id,
        ...formData
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleToggleActive = async (product: Product) => {
    await createOrUpdateProduct({
      ...product,
      isActive: !product.isActive
    });
  };

  const handleConfirmDelete = async () => {
    if (!isDeletingId) return;
    await deleteProduct(isDeletingId);
    setIsDeletingId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
            Inventory & Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
            Products Management
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] text-[#0B0B0B] text-xs uppercase tracking-[0.15em] font-semibold rounded-xl flex items-center justify-center gap-2 gold-glow transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181818] border border-neutral-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-neutral-400 shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#181818] border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B]"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181818] text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price (PKR)</th>
                <th className="py-3.5 px-6">Stock</th>
                <th className="py-3.5 px-6">Engravable</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#161616] transition-colors">
                  {/* Thumbnail & Title */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg border border-neutral-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-medium text-[#F5F0E6] text-sm flex items-center gap-2">
                          <span>{p.name}</span>
                          {p.isFeatured && (
                            <span className="text-[#C9A24B]" title="Featured signature piece">
                              <Sparkles className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-500 font-mono">ID: {p.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-neutral-300 font-medium">{p.category}</td>

                  <td className="py-4 px-6 font-mono font-semibold text-[#E6C97A]">
                    Rs. {p.price.toLocaleString()}
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`font-mono px-2 py-0.5 rounded text-[11px] ${
                        p.stock === 0
                          ? 'bg-red-950/40 text-red-400 border border-red-500/30'
                          : p.stock <= 5
                          ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    {p.isPersonalizable ? (
                      <span className="text-[#C9A24B] font-mono text-[11px]">Yes</span>
                    ) : (
                      <span className="text-neutral-500 font-mono text-[11px]">No</span>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border font-medium transition-colors ${
                        p.isActive
                          ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
                      }`}
                      title="Click to toggle store visibility"
                    >
                      {p.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{p.isActive ? 'Active' : 'Hidden'}</span>
                    </button>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-neutral-400 hover:text-[#C9A24B] hover:bg-neutral-800 rounded transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsDeletingId(p.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
                        title="Delete product"
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
      </div>

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#121212] border border-red-500/30 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-medium text-[#F5F0E6]">Delete Product?</h3>
            <p className="text-xs text-neutral-400 mt-2 mb-6 leading-relaxed">
              Are you sure you want to delete this piece? This action cannot be reversed.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeletingId(null)}
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-2xl w-full bg-[#121212] border border-[#C9A24B]/30 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-xl font-serif font-medium text-[#F5F0E6]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5 mt-6">
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                    Price in PKR *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              {/* Image Management */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                  Product Images
                </label>

                {/* Current images thumbnails */}
                <div className="flex flex-wrap gap-3 mb-3">
                  {formData.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-neutral-700">
                      <img src={imgUrl} alt="Product view" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-red-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload or URL input */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="px-4 py-2.5 bg-[#181818] border border-neutral-700 hover:border-[#C9A24B] rounded-xl text-xs text-neutral-300 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-[#C9A24B]" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Or paste image URL..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 bg-[#181818] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-[#F5F0E6] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs rounded-xl"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#C9A24B] rounded"
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.isPersonalizable}
                    onChange={(e) => setFormData({ ...formData, isPersonalizable: e.target.checked })}
                    className="w-4 h-4 accent-[#C9A24B] rounded"
                  />
                  <span>Personalizable</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#C9A24B] rounded"
                  />
                  <span>Active in Store</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-700 text-xs text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] text-[#0B0B0B] text-xs uppercase tracking-wider font-semibold gold-glow hover:opacity-95"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

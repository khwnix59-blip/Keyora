import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { uploadProductImage } from '../../firebase/service';
import { Plus, Edit2, Trash2, Upload, X, AlertTriangle, Layers } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, products, createOrUpdateCategory, deleteCategory, addToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: '',
    image: '/src/assets/images/product_name_bar_1794382967325.jpg',
    description: ''
  });

  const openAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      image: '/src/assets/images/product_name_bar_1794382967325.jpg',
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      image: cat.image,
      description: cat.description || ''
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const url = await uploadProductImage(files[0]);
      setFormData((prev) => ({ ...prev, image: url }));
      addToast('success', 'Image Uploaded', 'Category cover image updated.');
    } catch {
      addToast('error', 'Upload Failed', 'Could not upload image.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('error', 'Validation Error', 'Category name is required.');
      return;
    }

    await createOrUpdateCategory({
      id: editingCategory?.id,
      ...formData
    });
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    await deleteCategory(deletingId);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
            Catalog Taxonomy
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
            Categories Management
          </h1>
        </div>

        <button
          onClick={openAdd}
          className="px-5 py-2.5 bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] text-[#0B0B0B] text-xs uppercase tracking-[0.15em] font-semibold rounded-xl flex items-center justify-center gap-2 gold-glow hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const itemCount = products.filter((p) => p.category === cat.name).length;

          return (
            <div
              key={cat.id}
              className="bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col group hover:border-[#C9A24B]/40 transition-colors"
            >
              <div className="aspect-[16/10] bg-neutral-900 relative overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-[#E6C97A] border border-neutral-700">
                  {itemCount} product{itemCount === 1 ? '' : 's'}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-serif font-medium text-[#F5F0E6]">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 text-neutral-400 hover:text-[#C9A24B] hover:bg-neutral-800 rounded-lg transition-colors"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(cat.id)}
                    className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#121212] border border-red-500/30 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-medium text-[#F5F0E6]">Delete Category?</h3>
            <p className="text-xs text-neutral-400 mt-2 mb-6">
              Deleting this category will not delete the associated products, but they will need to be recategorized.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-lg w-full bg-[#121212] border border-[#C9A24B]/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h2 className="text-xl font-serif font-medium text-[#F5F0E6]">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vintage Keys"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A short summary of this collection..."
                  className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-[#F5F0E6] focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl cursor-pointer text-xs flex items-center gap-1.5 text-neutral-300">
                    <Upload className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

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
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings } from '../../types';
import { Save, Phone, Instagram, Truck, Sparkles, Check, RefreshCw } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, addToast } = useStore();

  const [formData, setFormData] = useState<StoreSettings>({
    whatsappNumber: settings.whatsappNumber,
    instagram: settings.instagram,
    deliveryCharges: settings.deliveryCharges,
    heroText: settings.heroText,
    freeDeliveryThreshold: settings.freeDeliveryThreshold || 5000
  });

  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateSettings(formData);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    } catch (err) {
      addToast('error', 'Update Failed', 'Could not save store settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-800">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A24B] font-semibold">
          Storefront Preferences
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-[#F5F0E6] mt-1">
          Store Configuration
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Changes made here are applied instantly to the live customer-facing store.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        {/* WhatsApp Number */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-2">
            Business WhatsApp Contact
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#25D366]" />
            <input
              type="text"
              required
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="+923001234567"
              className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none font-mono"
            />
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            All &quot;Order on WhatsApp&quot; and floating buttons will route inquiries to this number.
          </p>
        </div>

        {/* Instagram Link */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-2">
            Official Instagram Profile URL
          </label>
          <div className="relative">
            <Instagram className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E1306C]" />
            <input
              type="url"
              required
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="https://instagram.com/keyorastudio"
              className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none"
            />
          </div>
        </div>

        {/* Delivery Charges & Free Threshold */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-2">
              Standard Delivery Charges (PKR)
            </label>
            <div className="relative">
              <Truck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C9A24B]" />
              <input
                type="number"
                min={0}
                required
                value={formData.deliveryCharges}
                onChange={(e) => setFormData({ ...formData, deliveryCharges: Number(e.target.value) })}
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none font-mono"
              />
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Flat shipping fee applied at checkout.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-2">
              Free Delivery Order Threshold (PKR)
            </label>
            <div className="relative">
              <Sparkles className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E6C97A]" />
              <input
                type="number"
                min={0}
                required
                value={formData.freeDeliveryThreshold || 5000}
                onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none font-mono"
              />
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">
              Carts at or above this amount receive free nationwide shipping.
            </p>
          </div>
        </div>

        {/* Hero Banner Text */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-2">
            Hero Headline Tagline
          </label>
          <textarea
            rows={2}
            required
            value={formData.heroText}
            onChange={(e) => setFormData({ ...formData, heroText: e.target.value })}
            placeholder="More than just a keychain. It's a story."
            className="w-full bg-[#181818] border border-neutral-700 focus:border-[#C9A24B] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F5F0E6] focus:outline-none font-serif text-base"
          />
          <p className="text-[11px] text-neutral-500 mt-1">
            Displayed prominently on the customer homepage banner.
          </p>
        </div>

        {/* Live Preview Card */}
        <div className="p-5 bg-[#171717] rounded-2xl border border-neutral-800 space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-[#C9A24B] font-mono block">
            Live Preview
          </span>
          <p className="text-lg font-serif italic text-[#F5F0E6]">
            &quot;{formData.heroText}&quot;
          </p>
          <div className="text-xs text-neutral-400 flex items-center gap-4 pt-1">
            <span>WhatsApp: <strong className="text-neutral-200">{formData.whatsappNumber}</strong></span>
            <span>Delivery: <strong className="text-neutral-200">Rs. {formData.deliveryCharges}</strong></span>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`px-8 py-3.5 rounded-xl text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2 transition-all ${
              justSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-[#C9A24B] to-[#E6C97A] text-[#0B0B0B] gold-glow hover:opacity-95'
            }`}
          >
            {justSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved Live!</span>
              </>
            ) : saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Update Storefront</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';

export const Shop: React.FC = () => {
  const { products, categories, loading } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'All';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [showPersonalizableOnly, setShowPersonalizableOnly] = useState(false);

  const handleCategorySelect = (categoryName: string) => {
    if (categoryName === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryName);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.isActive);

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Personalizable toggle
    if (showPersonalizableOnly) {
      result = result.filter((p) => p.isPersonalizable);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Newest
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, showPersonalizableOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#F5F0E6] min-h-[75vh]">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C9A24B] font-semibold">
          Artisanal Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#F5F0E6] mt-1.5">
          The Keyora Collection
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-sans">
          Bespoke keychains cast in solid brass and gold, each personalized with laser-honed precision.
        </p>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="bg-[#121212] border border-neutral-800 rounded-xl p-4 sm:p-5 mb-10 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search keychains, sets, leather..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181818] border border-neutral-700/80 rounded-lg pl-10 pr-9 py-2 text-xs text-[#F5F0E6] placeholder-neutral-500 focus:outline-none focus:border-[#C9A24B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort & Toggle controls */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full md:w-auto">
            {/* Personalizable checkbox */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300 select-none">
              <input
                type="checkbox"
                checked={showPersonalizableOnly}
                onChange={(e) => setShowPersonalizableOnly(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#C9A24B] rounded bg-neutral-900 border-neutral-700"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C9A24B]" />
                Personalizable Only
              </span>
            </label>

            <span className="hidden sm:inline text-neutral-700">|</span>

            {/* Price Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#181818] border border-neutral-700/80 rounded-lg px-3 py-1.5 text-xs text-[#F5F0E6] focus:outline-none focus:border-[#C9A24B]"
              >
                <option value="newest">Newest Additions</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories segmented filter control */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-neutral-800/80">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-[#C9A24B] text-[#0B0B0B] font-semibold'
                : 'bg-[#181818] text-neutral-400 hover:text-[#F5F0E6] hover:bg-neutral-800'
            }`}
          >
            All Pieces
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-[#C9A24B] text-[#0B0B0B] font-semibold'
                  : 'bg-[#181818] text-neutral-400 hover:text-[#F5F0E6] hover:bg-neutral-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-neutral-400 mb-6">
        <span>
          Showing <span className="font-mono text-[#F5F0E6]">{filteredProducts.length}</span> pieces
        </span>
        {selectedCategory !== 'All' && (
          <button
            onClick={() => handleCategorySelect('All')}
            className="text-[#C9A24B] hover:underline"
          >
            Clear category filter
          </button>
        )}
      </div>

      {/* Skeleton Loaders or Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#141414] border border-neutral-800 rounded-xl overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] bg-neutral-800" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-1/3 bg-neutral-800 rounded" />
                <div className="h-5 w-3/4 bg-neutral-800 rounded" />
                <div className="h-4 w-full bg-neutral-800 rounded" />
                <div className="h-8 w-full bg-neutral-800 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] border border-dashed border-neutral-800 rounded-2xl max-w-lg mx-auto">
          <p className="text-base font-serif text-[#F5F0E6]">No matching products found</p>
          <p className="text-xs text-neutral-400 mt-1 mb-6">
            Try adjusting your search terms or clearing your selected filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategorySelect('All');
              setShowPersonalizableOnly(false);
            }}
            className="px-6 py-2.5 bg-[#1F1F1F] hover:bg-[#C9A24B] text-[#F5F0E6] hover:text-[#0B0B0B] border border-neutral-700 text-xs uppercase tracking-wider font-medium transition-colors rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

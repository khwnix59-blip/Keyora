import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative flex flex-col bg-[#121212] border border-neutral-800/90 hover:border-[#C9A24B]/50 transition-all duration-300 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C9A24B]/5">
      {/* Image Container with 4:3 Aspect Ratio */}
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-neutral-900">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Gradient Scrim for subtle contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 bg-neutral-900/90 text-neutral-300 border border-neutral-700 text-[10px] uppercase font-mono tracking-wider backdrop-blur-sm rounded">
              Out of Stock
            </span>
          ) : product.isFeatured ? (
            <span className="px-2.5 py-1 bg-[#0B0B0B]/85 text-[#E6C97A] border border-[#C9A24B]/50 text-[10px] uppercase tracking-widest backdrop-blur-sm rounded flex items-center gap-1 font-medium">
              <Sparkles className="w-2.5 h-2.5 text-[#C9A24B]" />
              Signature
            </span>
          ) : null}
        </div>

        {/* Personalizable Tag on Right */}
        {product.isPersonalizable && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 bg-[#0B0B0B]/80 text-[#C9A24B] border border-[#C9A24B]/30 text-[10px] font-mono tracking-wider backdrop-blur-sm rounded">
              Custom Engravable
            </span>
          </div>
        )}
      </Link>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category unboxed text metadata */}
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#C9A24B]/90 font-medium mb-1.5">
            <span>{product.category}</span>
            {product.stock > 0 && product.stock <= 5 && (
              <>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="text-amber-400 font-mono text-[10px]">Only {product.stock} left</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-[#E6C97A] transition-colors">
            <h3 className="text-base font-serif font-medium text-[#F5F0E6] line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
              Price
            </span>
            <span className="text-sm md:text-base font-semibold font-mono text-[#E6C97A] tracking-tight">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <span className="px-3 py-1.5 text-xs text-neutral-500 font-medium">
                Sold Out
              </span>
            ) : (
              <Link
                to={`/product/${product.id}`}
                className="px-3 py-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#C9A24B] text-neutral-200 hover:text-[#0B0B0B] border border-neutral-700/80 hover:border-[#C9A24B] text-xs font-medium uppercase tracking-[0.15em] transition-all duration-200 flex items-center gap-1.5"
              >
                <span>{product.isPersonalizable ? 'Personalize' : 'View'}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

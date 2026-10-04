import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link, useRouter } from '../../lib/router';
import { Product } from '../../types/product';
import { PriceTag } from '../ui/PriceTag';
import { RatingStars } from '../ui/RatingStars';
import { Button } from '../ui/Button';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useUIStore } from '../../store/useUIStore';

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { navigate } = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const showToast = useUIStore((s) => s.showToast);

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1608248597359-00109968a35d?auto=format&fit=crop&w=600&q=80';
  const secondaryImage = product.images[1] || primaryImage;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    setIsAdding(true);
    addItem(product.id, undefined, 1, true);
    setTimeout(() => setIsAdding(false), 400);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem(product.id, undefined, 1, false);
    navigate('/checkout');
  };

  const handleNotifyMe = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`We'll notify you as soon as ${product.name} is back in stock!`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className={`group relative flex flex-col bg-[#FAF7F2] border border-[#E8E2D8] hover:border-[#D5CCC0] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-sm ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image & Wishlist Button */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#F2ECE3]">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges / Metadata */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="bg-[#434D3D] text-[#FAF7F2] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-medium">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#FAF7F2]/90 backdrop-blur-xs text-[#434D3D] border border-[#D5CCC0] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-medium">
              New Batch
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-[#FAF7F2]/90 backdrop-blur-xs text-[#23201D] hover:text-[#A35843] flex items-center justify-center transition-transform hover:scale-110 shadow-xs border border-[#E8E2D8]"
        >
          <Heart
            size={15}
            className={isFavorited ? 'fill-[#A35843] text-[#A35843]' : 'text-[#635F59]'}
          />
        </button>
      </Link>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category & Routine Kicker */}
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#8E8A83] mb-1 font-medium">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <span>{product.format}</span>
        </div>

        {/* Product Title */}
        <Link
          href={`/products/${product.slug}`}
          className="font-serif text-lg font-medium text-[#23201D] hover:text-[#434D3D] line-clamp-1 leading-snug transition-colors"
        >
          {product.name}
        </Link>

        {/* Short Descriptor */}
        <p className="text-xs text-[#635F59] line-clamp-2 mt-1 leading-relaxed min-h-[34px]">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="mt-2.5">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        </div>

        {/* Pricing */}
        <div className="mt-3 pt-3 border-t border-[#E8E2D8]/60 flex items-center justify-between">
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="md" />
          <span className="text-[11px] text-[#8E8A83] font-medium">{product.size}</span>
        </div>

        {/* Actions - Always visible on mobile, responsive hover/always-available on desktop */}
        <div className="mt-3.5 pt-1 grid grid-cols-2 gap-2">
          {isOutOfStock ? (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              className="col-span-2"
              onClick={handleNotifyMe}
            >
              Notify Me
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                isLoading={isAdding}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                variant="clay"
                size="sm"
                fullWidth
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

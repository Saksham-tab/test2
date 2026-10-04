import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { PriceTag } from '../../components/ui/PriceTag';
import { RatingStars } from '../../components/ui/RatingStars';
import { Link, useRouter } from '../../lib/router';

export const WishlistPage: React.FC = () => {
  const { navigate } = useRouter();
  const wishlistProducts = useWishlistStore((s) => s.wishlistProducts);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);
  const addItem = useCartStore((s) => s.addItem);

  const handleMoveToCart = (productId: string) => {
    addItem(productId, undefined, 1, true);
    toggleWishlist(productId);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EBE3D8] text-[#A35843] flex items-center justify-center mx-auto mb-4">
          <Heart size={28} />
        </div>
        <h1 className="font-serif text-3xl font-light text-[#23201D]">
          Your Wishlist is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#635F59] mt-2 max-w-sm mx-auto leading-relaxed">
          Save your cherished formulations and planned rituals here for mindful consideration.
        </p>
        <div className="mt-8">
          <Button variant="primary" size="lg" onClick={() => navigate('/shop')}>
            Explore Formulations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <Breadcrumbs items={[{ label: 'Saved Formulations' }]} />

      <div className="mt-2 mb-8 flex items-end justify-between pb-4 border-b border-[#E8E2D8]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D]">
            Saved Formulations ({wishlistProducts.length})
          </h1>
          <p className="text-xs text-[#635F59] mt-1">
            Items saved in your local consideration sanctuary.
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs text-[#8E8A83] hover:text-[#A35843] transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl overflow-hidden shadow-xs justify-between"
          >
            <div>
              <Link href={`/products/${product.slug}`} className="block aspect-[4/5] bg-[#EBE3D8] overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="p-4 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#8E8A83] font-semibold">
                  {product.category}
                </span>
                <Link
                  href={`/products/${product.slug}`}
                  className="font-serif text-base font-medium text-[#23201D] hover:text-[#434D3D] line-clamp-1 block"
                >
                  {product.name}
                </Link>
                <RatingStars rating={product.rating} size="sm" showCountText={false} />
                <div className="pt-2">
                  <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 space-y-2">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                disabled={product.stock <= 0}
                onClick={() => handleMoveToCart(product.id)}
                leftIcon={<ShoppingBag size={13} />}
              >
                {product.stock <= 0 ? 'Out of Stock' : 'Move to Basket'}
              </Button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-full text-center text-xs text-[#8E8A83] hover:text-[#A35843] py-1 transition-colors flex items-center justify-center gap-1"
              >
                <Trash2 size={12} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

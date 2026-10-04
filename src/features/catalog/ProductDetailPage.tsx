import React, { useState, useEffect } from 'react';
import {
  Heart,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Share2,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Link, useRouter, updatePageMeta } from '../../lib/router';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { Product, ProductVariant } from '../../types/product';
import { Review } from '../../types/review';
import { PriceTag } from '../../components/ui/PriceTag';
import { RatingStars } from '../../components/ui/RatingStars';
import { QuantityStepper } from '../../components/ui/QuantityStepper';
import { Button } from '../../components/ui/Button';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { ProductCard } from '../../components/product/ProductCard';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useHistoryStore } from '../../store/useHistoryStore';
import { useUIStore } from '../../store/useUIStore';
import { formatPrice, getEstimatedDeliveryDate } from '../../lib/utils';
import { generateProductJsonLd } from '../../lib/seo';
import { analytics } from '../../lib/analytics';
import { pincodeLookupSchema } from '../../lib/validation';

export const ProductDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { navigate } = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [pincodeError, setPincodeError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const recordView = useHistoryStore((s) => s.recordView);
  const recentlyViewedProducts = useHistoryStore((s) => s.recentlyViewedProducts);
  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    let isMounted = true;
    productService.getProductBySlug(slug).then((p) => {
      if (!isMounted) return;
      if (p) {
        setProduct(p);
        setSelectedVariant(p.variants && p.variants.length > 0 ? p.variants[0] : undefined);
        setActiveImageIndex(0);
        setQuantity(1);
        recordView(p.id);
        updatePageMeta(p.name, p.shortDescription);
        analytics.track('product_view', { productId: p.id, name: p.name, price: p.price });

        productService.getRelatedProducts(p.id, 4).then((rel) => {
          if (isMounted) setRelatedProducts(rel);
        });

        reviewService.getReviewsByProductId(p.id).then((revs) => {
          if (isMounted) setReviews(revs);
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-[#23201D]">Formulation not found</h2>
        <p className="text-xs text-[#635F59] mt-2">
          The requested botanical preparation is either currently unavailable or archived.
        </p>
        <div className="mt-6">
          <Button variant="primary" size="md" onClick={() => navigate('/shop')}>
            Return to Apothecary
          </Button>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentCompareAt = selectedVariant ? selectedVariant.compareAtPrice : product.compareAtPrice;
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = availableStock <= 0;
  const isFavorited = isInWishlist(product.id);
  const recentlyViewed = recentlyViewedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  // Frequently Bought Together Bundle: pair with first related product
  const bundleAddon = relatedProducts[0];
  const bundleCombinedPrice = bundleAddon ? currentPrice + bundleAddon.price : currentPrice;
  const bundleSavings = bundleAddon ? Math.round(bundleCombinedPrice * 0.1) : 0;
  const bundleFinalPrice = bundleCombinedPrice - bundleSavings;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product.id, selectedVariant?.id, quantity, true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product.id, selectedVariant?.id, quantity, false);
    navigate('/checkout');
  };

  const handleAddBundleToCart = () => {
    addItem(product.id, selectedVariant?.id, 1, false);
    if (bundleAddon) {
      addItem(bundleAddon.id, undefined, 1, true);
    }
    showToast(`Added duo bundle to your basket!`);
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError('');
    const validation = pincodeLookupSchema.safeParse(pincode);
    if (!validation.success) {
      setPincodeError('Please enter a valid 6-digit Indian postal code');
      setDeliveryEstimate(null);
      return;
    }
    const estimate = getEstimatedDeliveryDate(pincode);
    setDeliveryEstimate(estimate);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Product link copied to clipboard');
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewTitle.trim() || !newReviewComment.trim()) {
      showToast('Please complete all review fields', 'error');
      return;
    }

    const created = await reviewService.addReview({
      productId: product.id,
      author: newReviewAuthor.trim(),
      location: 'Verified Customer',
      rating: newReviewRating,
      title: newReviewTitle.trim(),
      comment: newReviewComment.trim(),
      verifiedBuyer: true,
    });

    setReviews([created, ...reviews]);
    setShowReviewForm(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    showToast('Thank you for sharing your experience!');
  };

  // Schema.org JSON-LD string
  const jsonLd = generateProductJsonLd(product, typeof window !== 'undefined' ? window.location.href : '');

  return (
    <div className="pb-24 lg:pb-16">
      {/* Product JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs
          items={[
            { label: 'Shop', href: '/shop' },
            { label: product.category, href: `/categories/${product.category}` },
            { label: product.name },
          ]}
        />

        {/* ABOVE THE FOLD SECTION */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Gallery & Thumbnails */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#F2ECE3] relative border border-[#E8E2D8]">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => toggleWishlist(product.id)}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#FAF7F2]/90 backdrop-blur-xs flex items-center justify-center border border-[#E8E2D8] hover:text-[#A35843] transition-colors shadow-xs"
              >
                <Heart
                  size={18}
                  className={isFavorited ? 'fill-[#A35843] text-[#A35843]' : 'text-[#635F59]'}
                />
              </button>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#434D3D] shadow-xs'
                        : 'border-[#E8E2D8] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Purchase Panel & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-[#8E8A83] uppercase tracking-wider font-medium mb-1">
                <span>{product.category} · {product.productType}</span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-[#635F59] hover:text-[#23201D] capitalize"
                >
                  <Share2 size={13} />
                  <span>Share</span>
                </button>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D] leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#635F59] mt-2.5 leading-relaxed font-light">
                {product.shortDescription}
              </p>

              {/* Rating */}
              <div className="mt-3 flex items-center gap-3">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
                <span className="text-[#D5CCC0]" aria-hidden="true">·</span>
                <span className="text-xs text-[#434D3D] font-medium">Verified Botanical Monograph</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-[#F4EFEB] rounded-xl border border-[#E8E2D8] space-y-2">
              <div className="flex items-baseline justify-between">
                <PriceTag
                  price={currentPrice}
                  compareAtPrice={currentCompareAt}
                  size="xl"
                />
                <span className="text-xs text-[#8E8A83]">
                  Net Vol: {selectedVariant ? selectedVariant.size : product.size}
                </span>
              </div>
              <p className="text-[11px] text-[#8E8A83]">
                Inclusive of all taxes · Complimentary shipping on orders over ₹999
              </p>
            </div>

            {/* Variant Selector (if any) */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-2">
                <span className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider block">
                  Select Size
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-lg border text-left text-xs transition-all ${
                        selectedVariant?.id === v.id
                          ? 'border-[#434D3D] bg-[#EBF0E8] font-semibold text-[#434D3D]'
                          : 'border-[#D5CCC0] bg-[#FAF7F2] text-[#23201D] hover:bg-[#F4EFEB]'
                      }`}
                    >
                      <div className="font-medium">{v.size}</div>
                      <div className="text-[11px] text-[#635F59] mt-0.5">{formatPrice(v.price)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Stock */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#23201D]">Quantity:</span>
                <span className={`text-[11px] font-medium ${isOutOfStock ? 'text-[#A35843]' : 'text-[#434D3D]'}`}>
                  {isOutOfStock ? 'Out of stock' : `${availableStock} units ready for dispatch`}
                </span>
              </div>
              <QuantityStepper
                quantity={quantity}
                min={1}
                max={availableStock}
                onChange={setQuantity}
                disabled={isOutOfStock}
              />
            </div>

            {/* CTAs Desktop */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                variant="clay"
                size="lg"
                fullWidth
                disabled={isOutOfStock}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>

            {/* Pincode Delivery Check */}
            <div className="pt-4 border-t border-[#E8E2D8] space-y-2">
              <span className="text-xs font-semibold text-[#23201D] flex items-center gap-1.5">
                <Truck size={14} className="text-[#434D3D]" />
                <span>Estimate Delivery by Pincode</span>
              </span>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode (e.g. 560038)"
                  className="flex-1 bg-[#FAF7F2] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs text-[#23201D] focus:outline-none focus:border-[#434D3D]"
                />
                <Button type="submit" variant="secondary" size="sm">
                  Check
                </Button>
              </form>

              {pincodeError && (
                <p className="text-[11px] text-[#A35843]">{pincodeError}</p>
              )}

              {deliveryEstimate && (
                <div className="p-2.5 bg-[#EBF0E8] border border-[#CDE0C8] rounded-md text-xs text-[#34462E] flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>
                    Estimated express delivery by <strong className="font-semibold">{deliveryEstimate}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Trust highlights */}
            <div className="pt-4 border-t border-[#E8E2D8] grid grid-cols-2 gap-3 text-xs text-[#635F59]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#434D3D]" />
                <span>100% Authentic Botanicals</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#434D3D]" />
                <span>Small Batch Hand-Poured</span>
              </div>
            </div>
          </div>
        </div>

        {/* BELOW THE FOLD DETAILS SECTION */}
        <div className="mt-20 space-y-16 border-t border-[#E8E2D8] pt-12">
          {/* Why You'll Love It & Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
                Formulation Merits
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
                Why You&apos;ll Love It
              </h2>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.benefits.map((benefit, i) => (
                <div key={i} className="p-4 bg-[#F4EFEB] rounded-xl border border-[#E8E2D8] flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#434D3D] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#23201D] leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Ingredients */}
          {product.keyIngredients.length > 0 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
                  Pharmacognosy
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
                  Key Bioactive Ingredients
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.keyIngredients.map((item) => (
                  <div
                    key={item.name}
                    className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex gap-4 items-start"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-[#EBE3D8] shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-[#23201D]">{item.name}</h4>
                        {item.percentage && (
                          <span className="text-[10px] text-[#A35843] font-semibold bg-[#F7EDE9] px-2 py-0.5 rounded-xs">
                            {item.percentage}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#635F59] mt-1.5 leading-relaxed">
                        {item.purpose}
                      </p>
                      <Link
                        href={`/ingredients/${item.slug}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#434D3D] hover:underline mt-2"
                      >
                        <span>View botanical monograph</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How to Use & Routine Context */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 bg-[#F4EFEB] rounded-2xl border border-[#E8E2D8]">
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-medium text-[#23201D]">
                How to Use
              </h3>
              <p className="text-xs text-[#635F59] leading-relaxed">
                {product.howToUse}
              </p>
            </div>

            <div className="space-y-2 border-t md:border-t-0 md:border-l border-[#D5CCC0] pt-4 md:pt-0 md:pl-6">
              <h3 className="font-serif text-xl font-medium text-[#23201D]">
                When to Use
              </h3>
              <p className="text-xs text-[#635F59] leading-relaxed">
                {product.whenToUse}
              </p>
            </div>

            <div className="space-y-2 border-t md:border-t-0 md:border-l border-[#D5CCC0] pt-4 md:pt-0 md:pl-6">
              <h3 className="font-serif text-xl font-medium text-[#23201D]">
                Format &amp; Storage
              </h3>
              <p className="text-xs text-[#635F59] leading-relaxed">
                {product.storageInstructions || 'Store in a cool, dry place away from direct heat.'}
              </p>
            </div>
          </div>

          {/* Regulatory Data & Safety Warnings */}
          <div className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A35843]">
              <AlertCircle size={15} />
              <span>Safety, Usage &amp; Regulatory Specifications</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[#635F59]">
              <div>
                <span className="font-semibold text-[#23201D] block">Classification:</span>
                <span>{product.regulatoryClassification || 'Botanical Cosmetic'}</span>
              </div>
              <div>
                <span className="font-semibold text-[#23201D] block">License:</span>
                <span>{product.licenseNumber || 'AYU-HP-2023-4418'}</span>
              </div>
              <div>
                <span className="font-semibold text-[#23201D] block">Manufacturer:</span>
                <span>{product.manufacturer || 'Sattva Botanical Lab, Solan HP'}</span>
              </div>
              <div>
                <span className="font-semibold text-[#23201D] block">Net Contents:</span>
                <span>{product.size}</span>
              </div>
            </div>

            {product.warnings && (
              <div className="p-3 bg-[#FDF4F2] border border-[#F2C5BD] rounded-md text-xs text-[#8D4733] leading-relaxed">
                <strong className="font-semibold">Precautions: </strong>
                {product.warnings}
              </div>
            )}

            <div className="pt-2 text-[11px] text-[#8E8A83] leading-relaxed">
              <strong>Full INCI Ingredients: </strong>
              {product.ingredients.join(', ')}
            </div>
          </div>

          {/* Frequently Bought Together Bundle */}
          {bundleAddon && (
            <div className="p-6 sm:p-8 bg-[#FAF7F2] border border-[#D5CCC0] rounded-2xl space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
                  Pairing Synergies
                </span>
                <h3 className="font-serif text-2xl font-light text-[#23201D] mt-1">
                  Frequently Bought Together
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-24 rounded-lg bg-[#EBE3D8] overflow-hidden shrink-0">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <Plus size={16} className="text-[#8E8A83]" />
                  <div className="w-20 h-24 rounded-lg bg-[#EBE3D8] overflow-hidden shrink-0">
                    <img src={bundleAddon.images[0]} alt={bundleAddon.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex-1 text-xs">
                  <div className="font-medium text-[#23201D]">
                    This item: {product.name} ({formatPrice(currentPrice)}) + {bundleAddon.name} ({formatPrice(bundleAddon.price)})
                  </div>
                  <div className="font-serif text-xl font-semibold text-[#23201D] mt-1">
                    Combined: {formatPrice(bundleFinalPrice)}{' '}
                    <span className="text-xs text-[#A35843] font-sans font-medium">
                      (Save 10% on duo)
                    </span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddBundleToCart}
                  rightIcon={<ArrowRight size={14} />}
                >
                  Add Both to Cart
                </Button>
              </div>
            </div>
          )}

          {/* Community Reviews Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-end justify-between pb-3 border-b border-[#E8E2D8]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
                  Customer Reflections (Demo Data)
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
                  Reviews &amp; Experiences ({reviews.length})
                </h3>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </Button>
            </div>

            {/* Write a review form */}
            {showReviewForm && (
              <form onSubmit={handleAddReview} className="p-6 bg-[#F4EFEB] rounded-xl border border-[#D5CCC0] space-y-4 max-w-xl">
                <h4 className="text-xs uppercase font-semibold text-[#23201D] tracking-wider">
                  Share Your Experience
                </h4>
                <div>
                  <label className="block text-xs text-[#23201D] font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Priya S."
                    className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#23201D] font-medium mb-1">Rating</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="bg-[#FAF7F2] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs"
                  >
                    <option value={5}>5 Stars - Pure Botanical Harmony</option>
                    <option value={4}>4 Stars - Very Pleased</option>
                    <option value={3}>3 Stars - Average</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#23201D] font-medium mb-1">Headline</label>
                  <input
                    type="text"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    placeholder="e.g. Soothing texture and natural aroma"
                    className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#23201D] font-medium mb-1">Review</label>
                  <textarea
                    rows={3}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Describe how this formulation fit into your routine..."
                    className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs"
                    required
                  />
                </div>
                <Button type="submit" variant="primary" size="sm">
                  Submit Review
                </Button>
              </form>
            )}

            {/* Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] space-y-2">
                  <div className="flex items-center justify-between">
                    <RatingStars rating={rev.rating} size="sm" showCountText={false} />
                    <span className="text-[11px] text-[#8E8A83]">{rev.date}</span>
                  </div>
                  <h4 className="font-serif text-base font-medium text-[#23201D]">
                    {rev.title}
                  </h4>
                  <p className="text-xs text-[#635F59] leading-relaxed">
                    {rev.comment}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-[#8E8A83] border-t border-[#E8E2D8]/60">
                    <span className="font-semibold text-[#23201D]">{rev.author}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#434D3D] bg-[#EBF0E8] px-2 py-0.5 rounded-xs">
                      Verified Buyer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Formulations */}
          {relatedProducts.length > 0 && (
            <div className="space-y-6 pt-4">
              <div className="pb-3 border-b border-[#E8E2D8]">
                <span className="text-xs uppercase tracking-widest text-[#8E8A83] font-semibold">
                  Complementary Care
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#23201D] mt-1">
                  You May Also Like
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div className="space-y-6 pt-4">
              <div className="pb-3 border-b border-[#E8E2D8]">
                <h3 className="font-serif text-2xl font-light text-[#23201D]">
                  Recently Viewed
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recentlyViewed.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR [Add to Cart] [Buy Now] */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2] border-t border-[#D5CCC0] p-3 shadow-lg flex items-center gap-3">
        <div className="shrink-0">
          <div className="text-[10px] text-[#8E8A83] uppercase tracking-wider">Total</div>
          <div className="text-base font-semibold text-[#23201D]">
            {formatPrice(currentPrice * quantity)}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="md"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button
            variant="clay"
            size="md"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

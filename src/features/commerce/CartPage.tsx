import React, { useState } from 'react';
import { Trash2, ArrowRight, ShoppingBag, Sparkles, Tag, X } from 'lucide-react';
import { brandConfig } from '../../config/brand';
import { siteConfig } from '../../config/site';
import { formatPrice } from '../../lib/utils';
import { Link, useRouter } from '../../lib/router';
import { useCartStore } from '../../store/useCartStore';
import { QuantityStepper } from '../../components/ui/QuantityStepper';
import { Button } from '../../components/ui/Button';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { productsData } from '../../data/products';

export const CartPage: React.FC = () => {
  const { navigate } = useRouter();
  const hydratedItems = useCartStore((s) => s.hydratedItems);
  const calculation = useCartStore((s) => s.calculation);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const addItem = useCartStore((s) => s.addItem);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setIsApplying(true);

    const res = await applyCoupon(couponInput.trim());
    setIsApplying(false);

    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Recommendations: products not in cart
  const cartProductIds = new Set(hydratedItems.map((i) => i.product.id));
  const suggestions = productsData
    .filter((p) => !cartProductIds.has(p.id) && p.stock > 0)
    .slice(0, 3);

  if (hydratedItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EBE3D8] text-[#434D3D] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={28} />
        </div>
        <h1 className="font-serif text-3xl font-light text-[#23201D]">
          Your Wellness Basket is Empty
        </h1>
        <p className="text-xs sm:text-sm text-[#635F59] mt-2 max-w-sm mx-auto leading-relaxed">
          Take time to explore our curated botanical formulations for hair, scalp, skin barrier, and restorative sleep.
        </p>
        <div className="mt-8">
          <Button variant="primary" size="lg" onClick={() => navigate('/shop')}>
            Explore Collections
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <Breadcrumbs items={[{ label: 'Wellness Basket' }]} />

      <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D] mt-2 mb-8">
        Your Wellness Basket ({calculation.itemCount} {calculation.itemCount === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Banner */}
          <div className="p-4 bg-[#F4EFEB] rounded-xl border border-[#D5CCC0] flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-[#23201D]">
              <Sparkles size={16} className="text-[#A35843]" />
              {calculation.isFreeShipping ? (
                <span>
                  You have unlocked <strong>Complimentary Domestic Express Delivery</strong>!
                </span>
              ) : (
                <span>
                  Add <strong>{formatPrice(calculation.amountNeededForFreeShipping)}</strong> more to receive free delivery.
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-[#434D3D]">
              Threshold: {formatPrice(brandConfig.shipping.freeThreshold)}
            </span>
          </div>

          {/* Items Table / Cards */}
          <div className="space-y-4">
            {hydratedItems.map((item) => (
              <div
                key={`${item.product.id}-${item.variant?.id || 'standard'}`}
                className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="w-20 h-24 rounded-lg bg-[#EBE3D8] overflow-hidden shrink-0 block"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#8E8A83] font-semibold block">
                      {item.product.category} · {item.product.productType}
                    </span>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-serif text-lg font-medium text-[#23201D] hover:text-[#434D3D] transition-colors block line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <span className="text-xs text-[#635F59] mt-0.5 block">
                      Size: {item.variant ? item.variant.size : item.product.size}
                    </span>
                    <div className="text-xs text-[#23201D] font-medium mt-1">
                      {formatPrice(item.unitPrice)} each
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E8E2D8]">
                  <QuantityStepper
                    quantity={item.quantity}
                    min={1}
                    max={item.variant ? item.variant.stock : item.product.stock}
                    onChange={(q) => updateQuantity(item.product.id, item.variant?.id, q)}
                  />

                  <div className="text-right min-w-[80px]">
                    <div className="font-serif text-lg font-semibold text-[#23201D]">
                      {formatPrice(item.totalPrice)}
                    </div>
                    {item.compareAtUnitPrice && item.compareAtUnitPrice > item.unitPrice && (
                      <span className="text-[11px] text-[#8E8A83] line-through block">
                        {formatPrice(item.compareAtUnitPrice * item.quantity)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id, item.variant?.id)}
                    className="text-[#8E8A83] hover:text-[#A35843] p-1.5 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations in Cart */}
          {suggestions.length > 0 && (
            <div className="pt-8">
              <h3 className="font-serif text-xl font-light text-[#23201D] mb-4">
                Recommended to Complement Your Order
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl flex items-center gap-3"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-14 object-cover rounded-md bg-[#EBE3D8] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-[#23201D] truncate">{p.name}</h4>
                      <span className="text-[11px] text-[#635F59]">{formatPrice(p.price)}</span>
                      <button
                        onClick={() => addItem(p.id, undefined, 1, false)}
                        className="text-[11px] font-semibold text-[#434D3D] hover:underline block mt-1"
                      >
                        + Add to Basket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#D5CCC0] space-y-5">
            <h2 className="font-serif text-xl font-medium text-[#23201D] pb-3 border-b border-[#E8E2D8]">
              Order Summary
            </h2>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#635F59]">
                <span>Original Subtotal</span>
                <span>{formatPrice(calculation.originalSubtotal)}</span>
              </div>

              {calculation.originalSubtotal > calculation.subtotal && (
                <div className="flex justify-between text-[#434D3D]">
                  <span>Catalog Savings</span>
                  <span>-{formatPrice(calculation.originalSubtotal - calculation.subtotal)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#635F59]">
                <span>Subtotal</span>
                <span className="font-medium text-[#23201D]">
                  {formatPrice(calculation.subtotal)}
                </span>
              </div>

              {calculation.discountAmount > 0 && (
                <div className="flex justify-between text-[#A35843] font-medium">
                  <span>Coupon Discount ({calculation.appliedCoupon?.code})</span>
                  <span>-{formatPrice(calculation.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#635F59]">
                <span>Shipping</span>
                <span>
                  {calculation.shippingFee === 0 ? (
                    <span className="text-[#434D3D] font-medium">FREE</span>
                  ) : (
                    formatPrice(calculation.shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-semibold text-[#23201D] pt-3 border-t border-[#E8E2D8]">
                <span>Total Amount</span>
                <span className="font-serif text-2xl font-semibold">
                  {formatPrice(calculation.total)}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="pt-2 border-t border-[#E8E2D8]">
              <span className="text-xs uppercase font-semibold text-[#8E8A83] tracking-wider block mb-2">
                Have a Promo Code?
              </span>

              {calculation.appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#EBF0E8] border border-[#CDE0C8] rounded-md text-xs text-[#34462E]">
                  <div className="flex items-center gap-2">
                    <Tag size={14} />
                    <span>
                      <strong>{calculation.appliedCoupon.code}</strong> applied ({calculation.appliedCoupon.description})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[#635F59] hover:text-[#23201D] p-1"
                    aria-label="Remove coupon"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME10, RITUAL15"
                      className="flex-1 bg-[#F4EFEB] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs uppercase focus:outline-none focus:border-[#434D3D]"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      isLoading={isApplying}
                    >
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-[#A35843]">{couponError}</p>
                  )}
                  <p className="text-[11px] text-[#8E8A83]">
                    Try <strong>WELCOME10</strong> for 10% off or <strong>RITUAL15</strong> on orders above ₹1,800.
                  </p>
                </form>
              )}
            </div>

            {/* Checkout Action */}
            <div className="pt-4">
              <Button
                variant="clay"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                rightIcon={<ArrowRight size={14} />}
              >
                Proceed to Checkout
              </Button>
            </div>

            <p className="text-[10px] text-[#8E8A83] text-center">
              All transactions are encrypted and processed through our verified gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

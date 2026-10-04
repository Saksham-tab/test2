import React, { useEffect } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { brandConfig } from '../../config/brand';
import { formatPrice } from '../../lib/utils';
import { Link, useRouter } from '../../lib/router';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Button } from '../ui/Button';
import { productsData } from '../../data/products';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, closeCart } = useUIStore();
  const { navigate } = useRouter();

  const hydratedItems = useCartStore((s) => s.hydratedItems);
  const calculation = useCartStore((s) => s.calculation);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  // Recommendations: "You may also like"
  const cartProductIds = new Set(hydratedItems.map((i) => i.product.id));
  const suggestions = productsData
    .filter((p) => !cartProductIds.has(p.id) && p.stock > 0)
    .slice(0, 2);

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    navigate('/cart');
  };

  const freeShippingPercent = Math.min(
    100,
    Math.round((calculation.subtotal / brandConfig.shipping.freeThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#434D3D]" />
            <h2 className="font-serif text-xl font-medium text-[#23201D]">
              Your Wellness Basket
            </h2>
            <span className="text-xs text-[#8E8A83] font-medium">
              ({calculation.itemCount} {calculation.itemCount === 1 ? 'item' : 'items'})
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-[#635F59] hover:text-[#23201D] rounded-md transition-colors"
            aria-label="Close basket"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-[#F4EFEB] border-b border-[#E8E2D8]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            {calculation.isFreeShipping ? (
              <span className="text-[#434D3D] font-medium flex items-center gap-1">
                <Sparkles size={13} />
                <span>You qualify for complimentary express delivery!</span>
              </span>
            ) : (
              <span className="text-[#635F59]">
                Add <span className="font-semibold text-[#23201D]">{formatPrice(calculation.amountNeededForFreeShipping)}</span> more for free delivery
              </span>
            )}
            <span className="text-[11px] font-medium text-[#8E8A83]">
              {freeShippingPercent}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#E8E2D8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#434D3D] transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {hydratedItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-full bg-[#EBE3D8] text-[#635F59] flex items-center justify-center mx-auto mb-3">
                <ShoppingBag size={22} />
              </div>
              <h3 className="font-serif text-lg text-[#23201D] mb-1">
                Your basket is empty
              </h3>
              <p className="text-xs text-[#635F59] max-w-xs mx-auto mb-6">
                Explore our restorative botanical formulations crafted for hair, scalp, skin, and sleep.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  closeCart();
                  navigate('/shop');
                }}
              >
                Explore Formulations
              </Button>
            </div>
          ) : (
            hydratedItems.map((item) => (
              <div
                key={`${item.product.id}-${item.variant?.id || 'default'}`}
                className="flex gap-3.5 pb-4 border-b border-[#E8E2D8]/70"
              >
                {/* Thumbnail */}
                <Link
                  href={`/products/${item.product.slug}`}
                  onClick={closeCart}
                  className="w-18 h-22 bg-[#EBE3D8] rounded-md overflow-hidden shrink-0 block"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-[#23201D] hover:text-[#434D3D] line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.product.id, item.variant?.id)}
                        className="text-[#8E8A83] hover:text-[#A35843] p-0.5 transition-colors shrink-0"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#8E8A83] mt-0.5">
                      {item.variant ? item.variant.size : item.product.size}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <QuantityStepper
                      quantity={item.quantity}
                      min={1}
                      max={item.variant ? item.variant.stock : item.product.stock}
                      size="sm"
                      onChange={(q) => updateQuantity(item.product.id, item.variant?.id, q)}
                    />

                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#23201D]">
                        {formatPrice(item.totalPrice)}
                      </span>
                      {item.compareAtUnitPrice && item.compareAtUnitPrice > item.unitPrice && (
                        <div className="text-[10px] text-[#8E8A83] line-through">
                          {formatPrice(item.compareAtUnitPrice * item.quantity)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* "You may also like" suggestions */}
          {hydratedItems.length > 0 && suggestions.length > 0 && (
            <div className="pt-2">
              <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#8E8A83] mb-3">
                Complete Your Ritual
              </h4>
              <div className="space-y-2.5">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-[#E8E2D8] bg-[#F4EFEB]/50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-md bg-[#EBE3D8] shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-medium text-[#23201D] truncate">
                          {p.name}
                        </h5>
                        <span className="text-[11px] text-[#635F59]">
                          {formatPrice(p.price)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => addItem(p.id, undefined, 1, false)}
                      className="shrink-0 text-xs font-semibold text-[#434D3D] hover:underline px-2 py-1"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {hydratedItems.length > 0 && (
          <div className="p-5 border-t border-[#E8E2D8] bg-[#FAF7F2] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#635F59]">
                <span>Subtotal</span>
                <span className="font-medium text-[#23201D]">
                  {formatPrice(calculation.subtotal)}
                </span>
              </div>

              {calculation.discountAmount > 0 && (
                <div className="flex justify-between text-[#A35843]">
                  <span>Discount ({calculation.appliedCoupon?.code})</span>
                  <span>-{formatPrice(calculation.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#635F59]">
                <span>Shipping</span>
                <span>
                  {calculation.shippingFee === 0 ? (
                    <span className="text-[#434D3D] font-medium">Free</span>
                  ) : (
                    formatPrice(calculation.shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-semibold text-[#23201D] pt-2 border-t border-[#E8E2D8]">
                <span>Estimated Total</span>
                <span className="font-serif text-lg">
                  {formatPrice(calculation.total)}
                </span>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2">
              <Button variant="secondary" size="md" onClick={handleViewCart}>
                View Cart
              </Button>
              <Button
                variant="clay"
                size="md"
                onClick={handleCheckout}
                rightIcon={<ArrowRight size={14} />}
              >
                Checkout
              </Button>
            </div>

            <p className="text-[10px] text-[#8E8A83] text-center pt-1">
              Secure checkout · Taxes calculated at payment · 100% vegetarian formulations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

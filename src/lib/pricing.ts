import { brandConfig } from '../config/brand';
import { CartCalculation, CartItemReference, CouponRule, HydratedCartItem } from '../types/cart';
import { Product } from '../types/product';

export function hydrateCartItems(
  items: CartItemReference[],
  catalog: Product[]
): HydratedCartItem[] {
  const catalogMap = new Map(catalog.map((p) => [p.id, p]));
  const hydrated: HydratedCartItem[] = [];

  for (const item of items) {
    const product = catalogMap.get(item.productId);
    if (!product || !product.active || product.stock <= 0) continue;

    let unitPrice = product.price;
    let compareAtUnitPrice = product.compareAtPrice;
    let matchedVariant = undefined;

    if (item.variantId && product.variants) {
      matchedVariant = product.variants.find((v) => v.id === item.variantId);
      if (matchedVariant) {
        unitPrice = matchedVariant.price;
        compareAtUnitPrice = matchedVariant.compareAtPrice;
      }
    }

    hydrated.push({
      product,
      variant: matchedVariant,
      quantity: Math.min(item.quantity, matchedVariant ? matchedVariant.stock : product.stock),
      unitPrice,
      compareAtUnitPrice,
      totalPrice: unitPrice * item.quantity,
    });
  }

  return hydrated;
}

export function calculateCart(
  hydratedItems: HydratedCartItem[],
  appliedCoupon?: CouponRule | null
): CartCalculation {
  const itemCount = hydratedItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = hydratedItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  const originalSubtotal = hydratedItems.reduce(
    (acc, item) => acc + (item.compareAtUnitPrice || item.unitPrice) * item.quantity,
    0
  );

  let discountAmount = 0;
  let isFreeShippingCoupon = false;

  if (appliedCoupon && subtotal > 0) {
    const meetsMin = !appliedCoupon.minSubtotal || subtotal >= appliedCoupon.minSubtotal;

    if (meetsMin) {
      if (appliedCoupon.discountType === 'percentage') {
        discountAmount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      } else if (appliedCoupon.discountType === 'fixed') {
        discountAmount = Math.min(subtotal, appliedCoupon.discountValue);
      }

      if (appliedCoupon.freeShipping) {
        isFreeShippingCoupon = true;
      }
    }
  }

  const freeThreshold = brandConfig.shipping.freeThreshold;
  const isFreeShipping = isFreeShippingCoupon || subtotal >= freeThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeThreshold - subtotal);
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : brandConfig.shipping.standardFee;

  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  return {
    subtotal,
    originalSubtotal,
    discountAmount,
    appliedCoupon: appliedCoupon || undefined,
    shippingFee,
    isFreeShipping,
    amountNeededForFreeShipping,
    total,
    itemCount,
  };
}

import { Product, ProductVariant } from './product';

export interface CartItemReference {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface HydratedCartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  compareAtUnitPrice?: number;
}

export interface CouponRule {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSubtotal?: number;
  description: string;
  freeShipping?: boolean;
}

export interface CartCalculation {
  subtotal: number;
  originalSubtotal: number;
  discountAmount: number;
  appliedCoupon?: CouponRule;
  shippingFee: number;
  isFreeShipping: boolean;
  amountNeededForFreeShipping: number;
  total: number;
  itemCount: number;
}

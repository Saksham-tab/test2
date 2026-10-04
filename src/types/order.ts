import { HydratedCartItem } from './cart';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type PaymentMethodType = 'upi' | 'card' | 'cod' | 'netbanking';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: HydratedCartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'paid' | 'pending_cod' | 'failed';
  fulfillmentStatus: 'processing' | 'confirmed' | 'dispatched' | 'delivered';
  trackingNumber: string;
  estimatedDeliveryDate: string;
}

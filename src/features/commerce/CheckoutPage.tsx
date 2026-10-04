import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from '../../lib/router';
import { useCartStore } from '../../store/useCartStore';
import { useAccountStore } from '../../store/useAccountStore';
import { useUIStore } from '../../store/useUIStore';
import { addressSchema, AddressFormData } from '../../lib/validation';
import { paymentService } from '../../services/paymentService';
import { PaymentMethodType, Order } from '../../types/order';
import { formatPrice, getEstimatedDeliveryDate } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { analytics } from '../../lib/analytics';

export const CheckoutPage: React.FC = () => {
  const { navigate } = useRouter();
  const hydratedItems = useCartStore((s) => s.hydratedItems);
  const calculation = useCartStore((s) => s.calculation);
  const clearCart = useCartStore((s) => s.clearCart);
  const { savedAddresses, addOrder, saveAddress } = useAccountStore();
  const showToast = useUIStore((s) => s.showToast);

  // Address form fields
  const defaultAddr = savedAddresses[0];
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: defaultAddr?.fullName || 'Arya Sharma',
    email: defaultAddr?.email || 'arya.sharma@example.com',
    phone: defaultAddr?.phone || '9876543210',
    addressLine1: defaultAddr?.addressLine1 || 'Flat 402, Lotus Court, 14th Main Road',
    addressLine2: defaultAddr?.addressLine2 || 'Indiranagar',
    city: defaultAddr?.city || 'Bengaluru',
    state: defaultAddr?.state || 'Karnataka',
    pincode: defaultAddr?.pincode || '560038',
    country: 'India',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [upiId, setUpiId] = useState('arya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 8921 4410 7712');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  if (hydratedItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-[#23201D]">No items to checkout</h2>
        <p className="text-xs text-[#635F59] mt-2">
          Your wellness basket is currently empty.
        </p>
        <Button variant="primary" size="md" className="mt-4" onClick={() => navigate('/shop')}>
          Browse Collections
        </Button>
      </div>
    );
  }

  const handleInputChange = (field: keyof AddressFormData, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    // Validate shipping address with Zod
    const validation = addressSchema.safeParse(formData);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0]) {
          errMap[String(issue.path[0])] = issue.message;
        }
      }
      setFormErrors(errMap);
      showToast('Please correct the address details highlighted', 'error');
      return;
    }

    setIsProcessing(true);
    analytics.track('checkout_started', {
      total: calculation.total,
      itemCount: calculation.itemCount,
      paymentMethod,
    });

    try {
      const payRes = await paymentService.processPayment({
        orderId: `ORD-${Date.now()}`,
        amount: calculation.total,
        method: paymentMethod,
        upiId,
        cardNumber,
      });

      if (!payRes.success) {
        setPaymentError(payRes.error || 'Payment authorization failed. Please verify credentials.');
        setIsProcessing(false);
        return;
      }

      // Save order
      const orderNumber = `SAT-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        items: hydratedItems,
        subtotal: calculation.subtotal,
        discount: calculation.discountAmount,
        shipping: calculation.shippingFee,
        total: calculation.total,
        couponCode: calculation.appliedCoupon?.code,
        shippingAddress: formData,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending_cod' : 'paid',
        fulfillmentStatus: 'processing',
        trackingNumber: `EXP-IN-${Date.now().toString().slice(-8)}`,
        estimatedDeliveryDate: getEstimatedDeliveryDate(formData.pincode),
      };

      addOrder(newOrder);
      saveAddress(formData);
      clearCart();

      analytics.track('purchase', {
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        total: newOrder.total,
      });

      navigate(`/order-confirmation?orderId=${newOrder.id}`);
    } catch {
      setPaymentError('An unexpected gateway issue occurred. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <Breadcrumbs
        items={[
          { label: 'Basket', href: '/cart' },
          { label: 'Checkout' },
        ]}
      />

      <div className="mt-4 mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D]">
          Secure Checkout
        </h1>
        <p className="text-xs text-[#635F59] mt-1">
          Review shipping address, select payment method, and complete your order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Form & Payment */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
          {/* Section 1: Contact & Shipping Address */}
          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#D5CCC0] space-y-4">
            <h2 className="font-serif text-xl font-medium text-[#23201D] pb-2 border-b border-[#E8E2D8]">
              1. Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#23201D] font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full bg-[#F4EFEB] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#434D3D]"
                />
                {formErrors.fullName && <p className="text-[11px] text-[#A35843] mt-0.5">{formErrors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs text-[#23201D] font-medium mb-1">Phone Number (10 digits) *</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#F4EFEB] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#434D3D]"
                />
                {formErrors.phone && <p className="text-[11px] text-[#A35843] mt-0.5">{formErrors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#23201D] font-medium mb-1">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-[#F4EFEB] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#434D3D]"
              />
              {formErrors.email && <p className="text-[11px] text-[#A35843] mt-0.5">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs text-[#23201D] font-medium mb-1">Street Address, Flat / House No. *</label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                className="w-full bg-[#F4EFEB] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#434D3D]"
              />
              {formErrors.addressLine1 && <p className="text-[11px] text-[#A35843] mt-0.5">{formErrors.addressLine1}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#23201D] font-medium mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full bg-[#F4EFEB] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#434D3D]"
                />
                {formErrors.city && <p className="text-[11px] text-[#A35843] mt-0.5">{formErrors.city}</p>}
              </div>

              <div>
                <label className="block text-xs text-[#23201D] font-medium mb-1">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full bg-[#F4EFEB] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#434D3D]"
                />
                {formErrors.state && <p className="text-[11px] text-[#A35843] mt-0.5">{formErrors.state}</p>}
              </div>

              <div>
                <label className="block text-xs text-[#23201D] font-medium mb-1">Pincode (6 digits) *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#F4EFEB] border border-[#D5CCC0] rounded-md px-3 py-2 text-xs focus:outline-none focus:border-[#434D3D]"
                />
                {formErrors.pincode && <p className="text-[11px] text-[#A35843] mt-0.5">{formErrors.pincode}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#D5CCC0] space-y-4">
            <h2 className="font-serif text-xl font-medium text-[#23201D] pb-2 border-b border-[#E8E2D8]">
              2. Payment Provider
            </h2>

            <div className="space-y-3">
              {/* UPI Option */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'bg-[#EBF0E8] border-[#434D3D]' : 'bg-[#F4EFEB] border-[#D5CCC0]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="mt-0.5 accent-[#434D3D]"
                />
                <div className="flex-1 text-xs">
                  <span className="font-semibold text-[#23201D] block">UPI / QR (Instant &amp; Zero Surcharge)</span>
                  <span className="text-[#635F59]">Google Pay, PhonePe, Paytm, or BHIM UPI</span>

                  {paymentMethod === 'upi' && (
                    <div className="mt-3 space-y-1">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter UPI VPA (e.g. mobile@upi)"
                        className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-md px-3 py-1.5 text-xs text-[#23201D]"
                      />
                    </div>
                  )}
                </div>
              </label>

              {/* Card Option */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'bg-[#EBF0E8] border-[#434D3D]' : 'bg-[#F4EFEB] border-[#D5CCC0]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-0.5 accent-[#434D3D]"
                />
                <div className="flex-1 text-xs">
                  <span className="font-semibold text-[#23201D] block">Credit / Debit Card (Visa, Mastercard, RuPay)</span>
                  <span className="text-[#635F59]">Encrypted simulated payment gateway</span>

                  {paymentMethod === 'card' && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="16-digit card number"
                        className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded-md px-3 py-1.5 text-xs text-[#23201D]"
                      />
                    </div>
                  )}
                </div>
              </label>

              {/* Cash on Delivery (COD) */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'bg-[#EBF0E8] border-[#434D3D]' : 'bg-[#F4EFEB] border-[#D5CCC0]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-0.5 accent-[#434D3D]"
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#23201D] block">Cash on Delivery (COD)</span>
                  <span className="text-[#635F59]">Pay with cash or UPI upon courier arrival at your doorstep</span>
                </div>
              </label>
            </div>

            {paymentError && (
              <div className="p-3 bg-[#FDF4F2] border border-[#F2C5BD] rounded-md text-xs text-[#8D4733] flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{paymentError}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="clay"
            size="lg"
            fullWidth
            isLoading={isProcessing}
            leftIcon={<Lock size={14} />}
            rightIcon={<ArrowRight size={14} />}
          >
            Place Order ({formatPrice(calculation.total)})
          </Button>
        </form>

        {/* Right Column: Order Summary Preview */}
        <div className="lg:col-span-5 p-6 bg-[#FAF7F2] rounded-2xl border border-[#D5CCC0] space-y-5">
          <h2 className="font-serif text-xl font-medium text-[#23201D] pb-3 border-b border-[#E8E2D8]">
            Items in Order ({calculation.itemCount})
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {hydratedItems.map((item) => (
              <div
                key={`${item.product.id}-${item.variant?.id || 'standard'}`}
                className="flex items-center justify-between text-xs gap-3 pb-3 border-b border-[#E8E2D8]/60"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-10 h-12 rounded object-cover bg-[#EBE3D8] shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-semibold text-[#23201D] block truncate">
                      {item.product.name}
                    </span>
                    <span className="text-[11px] text-[#8E8A83]">
                      Qty: {item.quantity} · {item.variant ? item.variant.size : item.product.size}
                    </span>
                  </div>
                </div>
                <span className="font-medium text-[#23201D] shrink-0">
                  {formatPrice(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="pt-2 border-t border-[#E8E2D8] space-y-1.5 text-xs text-[#635F59]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#23201D] font-medium">{formatPrice(calculation.subtotal)}</span>
            </div>
            {calculation.discountAmount > 0 && (
              <div className="flex justify-between text-[#A35843]">
                <span>Discount ({calculation.appliedCoupon?.code})</span>
                <span>-{formatPrice(calculation.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>
                {calculation.shippingFee === 0 ? (
                  <span className="text-[#434D3D] font-medium">Free</span>
                ) : (
                  formatPrice(calculation.shippingFee)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#23201D] pt-2 border-t border-[#E8E2D8]">
              <span>Final Total</span>
              <span className="font-serif text-2xl">{formatPrice(calculation.total)}</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#8E8A83] space-y-1">
            <p className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#434D3D]" />
              Estimated Delivery: 2–4 Business Days
            </p>
            <p className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#434D3D]" />
              Simulated Razorpay / Mock Gateway Engine
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

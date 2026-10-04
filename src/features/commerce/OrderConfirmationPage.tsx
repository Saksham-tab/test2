import React from 'react';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from '../../lib/router';
import { useAccountStore } from '../../store/useAccountStore';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';

export const OrderConfirmationPage: React.FC = () => {
  const { queryParams, navigate } = useRouter();
  const orderId = queryParams.get('orderId');
  const { getOrderById, orders } = useAccountStore();

  const currentOrder = orderId ? getOrderById(orderId) : orders[0];

  if (!currentOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-[#23201D]">Order Not Found</h2>
        <p className="text-xs text-[#635F59] mt-2">
          We could not locate this order record in your local session.
        </p>
        <Button variant="primary" size="md" className="mt-4" onClick={() => navigate('/shop')}>
          Return to Apothecary
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pb-24">
      {/* Success Badge */}
      <div className="text-center space-y-3 mb-10">
        <div className="w-16 h-16 bg-[#EBF0E8] text-[#434D3D] rounded-full flex items-center justify-center mx-auto shadow-xs border border-[#CDE0C8]">
          <CheckCircle2 size={32} />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#434D3D] font-semibold block">
          Order Successfully Placed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D]">
          Thank you for choosing conscious wellness.
        </h1>
        <p className="text-xs sm:text-sm text-[#635F59] max-w-md mx-auto">
          Order <strong>{currentOrder.orderNumber}</strong> has been logged and is being prepared with small-batch care.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-[#FAF7F2] border border-[#D5CCC0] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
        {/* Status bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
          <div>
            <span className="text-[11px] text-[#8E8A83] uppercase tracking-wider block">Estimated Express Delivery</span>
            <span className="text-sm font-semibold text-[#23201D] flex items-center gap-1.5 mt-0.5">
              <Truck size={15} className="text-[#434D3D]" />
              {currentOrder.estimatedDeliveryDate}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#8E8A83] uppercase tracking-wider block">Tracking Reference</span>
            <span className="text-xs font-mono font-medium text-[#23201D] bg-[#F4EFEB] px-2 py-1 rounded border border-[#E8E2D8]">
              {currentOrder.trackingNumber}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-[#8E8A83] uppercase tracking-wider block">Payment Mode</span>
            <span className="text-xs font-medium text-[#23201D] uppercase">
              {currentOrder.paymentMethod} · {currentOrder.paymentStatus === 'paid' ? 'Paid' : 'Pay on Delivery'}
            </span>
          </div>
        </div>

        {/* Ordered items */}
        <div>
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#8E8A83] mb-4">
            Items in This Dispatch ({currentOrder.items.length})
          </h3>
          <div className="space-y-4">
            {currentOrder.items.map((item) => (
              <div
                key={`${item.product.id}-${item.variant?.id || 'standard'}`}
                className="flex items-center justify-between text-xs gap-4 pb-4 border-b border-[#E8E2D8]/60"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-16 rounded-md object-cover bg-[#EBE3D8] shrink-0"
                  />
                  <div>
                    <h4 className="font-semibold text-[#23201D]">{item.product.name}</h4>
                    <p className="text-[11px] text-[#635F59]">
                      Qty: {item.quantity} · {item.variant ? item.variant.size : item.product.size}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-[#23201D]">{formatPrice(item.totalPrice)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Financial Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
          {/* Shipping Address */}
          <div className="space-y-1.5 text-xs text-[#635F59]">
            <h4 className="uppercase font-semibold text-[#8E8A83] tracking-wider mb-2">
              Shipping Destination
            </h4>
            <p className="font-semibold text-[#23201D]">{currentOrder.shippingAddress.fullName}</p>
            <p>{currentOrder.shippingAddress.addressLine1}</p>
            {currentOrder.shippingAddress.addressLine2 && <p>{currentOrder.shippingAddress.addressLine2}</p>}
            <p>
              {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
            </p>
            <p className="pt-1">Phone: {currentOrder.shippingAddress.phone}</p>
            <p>Email: {currentOrder.shippingAddress.email}</p>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-xs text-[#635F59] p-4 bg-[#F4EFEB] rounded-xl border border-[#E8E2D8]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#23201D] font-medium">{formatPrice(currentOrder.subtotal)}</span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-[#A35843]">
                <span>Coupon Savings ({currentOrder.couponCode})</span>
                <span>-{formatPrice(currentOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Express Delivery</span>
              <span>{currentOrder.shipping === 0 ? 'Free' : formatPrice(currentOrder.shipping)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#23201D] pt-2 border-t border-[#D5CCC0]">
              <span>Grand Total</span>
              <span className="font-serif text-xl">{formatPrice(currentOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8E2D8]">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/account/orders')}
          >
            View In Order History
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/shop')}
            rightIcon={<ArrowRight size={14} />}
          >
            Continue Exploring
          </Button>
        </div>
      </div>
    </div>
  );
};

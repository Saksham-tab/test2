import React, { useState } from 'react';
import { User, Package, MapPin, Heart, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useAccountStore } from '../../store/useAccountStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { Button } from '../../components/ui/Button';
import { formatPrice, formatDate } from '../../lib/utils';
import { Link, useRouter } from '../../lib/router';
import { ShippingAddress } from '../../types/order';

export const AccountPage: React.FC<{ tab?: 'profile' | 'orders' | 'addresses' | 'wishlist' }> = ({
  tab = 'orders',
}) => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>(tab);

  const { profile, orders, savedAddresses, deleteAddress, saveAddress } = useAccountStore();
  const wishlistItems = useWishlistStore((s) => s.wishlistProducts);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState<ShippingAddress>({
    fullName: profile.name,
    email: profile.email,
    phone: profile.phone,
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.addressLine1 || !newAddr.city || !newAddr.pincode) return;
    saveAddress(newAddr);
    setShowAddressForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <Breadcrumbs items={[{ label: 'Account Circle' }]} />

      <div className="mt-2 mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#23201D]">
          Welcome, {profile.name}
        </h1>
        <p className="text-xs text-[#635F59] mt-1">
          Member since {profile.memberSince} · Local simulated account storage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1 bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E2D8]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#434D3D] text-[#FAF7F2]'
                : 'text-[#23201D] hover:bg-[#F4EFEB]'
            }`}
          >
            <Package size={16} />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'addresses'
                ? 'bg-[#434D3D] text-[#FAF7F2]'
                : 'text-[#23201D] hover:bg-[#F4EFEB]'
            }`}
          >
            <MapPin size={16} />
            <span>Saved Addresses ({savedAddresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#434D3D] text-[#FAF7F2]'
                : 'text-[#23201D] hover:bg-[#F4EFEB]'
            }`}
          >
            <User size={16} />
            <span>Personal Profile</span>
          </button>

          <button
            onClick={() => navigate('/wishlist')}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-xs font-medium text-[#23201D] hover:bg-[#F4EFEB] transition-colors"
          >
            <Heart size={16} />
            <span>Wishlist Sanctuary ({wishlistItems.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-light text-[#23201D] pb-3 border-b border-[#E8E2D8]">
                Your Order Dispatches
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-16 bg-[#F4EFEB] rounded-2xl border border-dashed border-[#D5CCC0] p-6">
                  <Package size={32} className="text-[#8E8A83] mx-auto mb-2" />
                  <p className="text-sm font-medium text-[#23201D]">No local orders recorded yet</p>
                  <p className="text-xs text-[#635F59] mt-1">
                    When you place orders through our checkout, they will appear here with live tracking.
                  </p>
                  <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/shop')}>
                    Explore Formulations
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 bg-[#FAF7F2] rounded-xl border border-[#D5CCC0] space-y-4 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E2D8] text-xs">
                        <div>
                          <span className="font-semibold text-[#23201D] text-sm block">
                            Order #{order.orderNumber}
                          </span>
                          <span className="text-[#8E8A83]">Placed on {formatDate(order.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="bg-[#EBF0E8] text-[#34462E] px-2.5 py-1 rounded-full font-medium uppercase text-[10px] tracking-wider">
                            {order.fulfillmentStatus}
                          </span>
                          <span className="font-serif text-lg font-semibold text-[#23201D]">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={`${item.product.id}-${item.variant?.id || 'standard'}`}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-[#23201D]">
                              {item.quantity} &times; {item.product.name}
                            </span>
                            <span className="font-medium text-[#635F59]">
                              {formatPrice(item.totalPrice)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs text-[#8E8A83] border-t border-[#E8E2D8]">
                        <span>Tracking: {order.trackingNumber}</span>
                        <Link
                          href={`/order-confirmation?orderId=${order.id}`}
                          className="font-semibold text-[#434D3D] hover:underline flex items-center gap-1"
                        >
                          <span>Order Details</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                <h2 className="font-serif text-2xl font-light text-[#23201D]">
                  Saved Addresses ({savedAddresses.length})
                </h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  leftIcon={<Plus size={14} />}
                >
                  {showAddressForm ? 'Cancel' : 'Add New Address'}
                </Button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleSaveAddress} className="p-6 bg-[#F4EFEB] rounded-xl border border-[#D5CCC0] space-y-4 max-w-xl">
                  <h3 className="text-xs uppercase font-semibold text-[#23201D] tracking-wider">
                    New Address Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded p-2 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded p-2 text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      value={newAddr.addressLine1}
                      onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded p-2 text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">City</label>
                      <input
                        type="text"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded p-2 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">State</label>
                      <input
                        type="text"
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded p-2 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Pincode</label>
                      <input
                        type="text"
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#D5CCC0] rounded p-2 text-xs"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="primary" size="sm">
                    Save Address
                  </Button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedAddresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex flex-col justify-between space-y-3"
                  >
                    <div className="text-xs text-[#635F59] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#23201D] text-sm">{addr.fullName}</span>
                        {idx === 0 && (
                          <span className="text-[10px] uppercase font-semibold text-[#434D3D] bg-[#EBF0E8] px-2 py-0.5 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="pt-1 text-[#8E8A83]">Phone: {addr.phone}</p>
                    </div>

                    {savedAddresses.length > 1 && (
                      <div className="pt-2 border-t border-[#E8E2D8] flex justify-end">
                        <button
                          onClick={() => deleteAddress(addr.pincode)}
                          className="text-xs text-[#8E8A83] hover:text-[#A35843] flex items-center gap-1"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-light text-[#23201D] pb-3 border-b border-[#E8E2D8]">
                Personal Account Profile
              </h2>

              <div className="p-6 bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] space-y-4 max-w-lg text-xs text-[#23201D]">
                <div>
                  <label className="text-[#8E8A83] block uppercase tracking-wider text-[10px] font-semibold">
                    Full Name
                  </label>
                  <p className="font-medium text-sm mt-0.5">{profile.name}</p>
                </div>

                <div>
                  <label className="text-[#8E8A83] block uppercase tracking-wider text-[10px] font-semibold">
                    Email Address
                  </label>
                  <p className="font-medium text-sm mt-0.5">{profile.email}</p>
                </div>

                <div>
                  <label className="text-[#8E8A83] block uppercase tracking-wider text-[10px] font-semibold">
                    Mobile Phone
                  </label>
                  <p className="font-medium text-sm mt-0.5">+91 {profile.phone}</p>
                </div>

                <div>
                  <label className="text-[#8E8A83] block uppercase tracking-wider text-[10px] font-semibold mb-1">
                    Wellness Focus Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {profile.wellnessInterests.map((interest) => (
                      <span
                        key={interest}
                        className="bg-[#F4EFEB] px-2.5 py-1 rounded-md border border-[#D5CCC0] text-[11px] text-[#635F59]"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

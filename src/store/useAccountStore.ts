import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, ShippingAddress } from '../types/order';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  wellnessInterests: string[];
}

interface AccountState {
  profile: UserProfile;
  savedAddresses: ShippingAddress[];
  orders: Order[];
  updateProfile: (profile: Partial<UserProfile>) => void;
  saveAddress: (address: ShippingAddress) => void;
  deleteAddress: (pincode: string) => void;
  addOrder: (order: Order) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const defaultAddresses: ShippingAddress[] = [
  {
    fullName: 'Arya Sharma',
    email: 'arya.sharma@example.com',
    phone: '9876543210',
    addressLine1: 'Flat 402, Lotus Court, 14th Main Road',
    addressLine2: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India',
  },
];

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      profile: {
        name: 'Arya Sharma',
        email: 'arya.sharma@example.com',
        phone: '9876543210',
        memberSince: 'March 2024',
        wellnessInterests: ['Hair Health', 'Restorative Sleep', 'Botanical Barrier Care'],
      },
      savedAddresses: defaultAddresses,
      orders: [],

      updateProfile: (updated) =>
        set((state) => ({ profile: { ...state.profile, ...updated } })),

      saveAddress: (newAddr) =>
        set((state) => ({
          savedAddresses: [
            newAddr,
            ...state.savedAddresses.filter((a) => a.pincode !== newAddr.pincode || a.addressLine1 !== newAddr.addressLine1),
          ],
        })),

      deleteAddress: (pincode) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.filter((a) => a.pincode !== pincode),
        })),

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id || o.orderNumber === id);
      },
    }),
    {
      name: 'sattva_account_storage',
    }
  )
);

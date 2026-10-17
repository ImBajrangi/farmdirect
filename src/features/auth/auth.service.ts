import { Profile, UserRole, Address } from '../../types';
import { INITIAL_PROFILES } from '../../lib/mockData';

const DEMO_USERS: Record<UserRole, Profile> = {
  customer: INITIAL_PROFILES[2],
  farmer: INITIAL_PROFILES[0],
  admin: INITIAL_PROFILES[3],
};

export const authService = {
  getSavedRole(): UserRole {
    return (localStorage.getItem('farmdirect_active_role') as UserRole) || 'customer';
  },

  setSavedRole(role: UserRole) {
    localStorage.setItem('farmdirect_active_role', role);
  },

  getCurrentUser(role: UserRole): Profile {
    return DEMO_USERS[role] || DEMO_USERS.customer;
  },

  getSavedAddresses(): Address[] {
    const raw = localStorage.getItem('farmdirect_addresses');
    if (raw) return JSON.parse(raw);
    return [
      {
        id: 'addr-1',
        user_id: 'user-customer-1',
        label: 'Home (घर)',
        recipient_name: 'Aarav Sharma',
        phone: '9822099999',
        address_line_1: 'B-402, Green Acres, Gangapur Road',
        landmark: 'Opposite Navshya Ganpati Temple',
        city: 'Nashik',
        district: 'Nashik',
        state: 'Maharashtra',
        pincode: '422002',
        service_area_id: 'sa-nashik',
        is_default: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 'addr-2',
        user_id: 'user-customer-1',
        label: 'Restaurant / Kitchen',
        recipient_name: 'Aarav Sharma (Bhojan Griha)',
        phone: '9822099999',
        address_line_1: 'Shop 12, Baner High Street',
        landmark: 'Near Balewadi Phata',
        city: 'Pune',
        district: 'Pune',
        state: 'Maharashtra',
        pincode: '411045',
        service_area_id: 'sa-pune',
        is_default: false,
        created_at: new Date().toISOString(),
      }
    ];
  },

  saveAddresses(addresses: Address[]) {
    localStorage.setItem('farmdirect_addresses', JSON.stringify(addresses));
  }
};

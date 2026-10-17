import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, FarmerProfile, Address, UserRole } from '../../types';
import { INITIAL_PROFILES, INITIAL_FARMERS } from '../../lib/mockData';
import { marketplaceService } from '../../services/marketplaceService';

interface AuthContextType {
  user: Profile | null;
  farmerProfile: FarmerProfile | null;
  addresses: Address[];
  currentRole: UserRole;
  isAuthenticated: boolean;
  login: (phoneOrEmail: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  addAddress: (address: Omit<Address, 'id' | 'user_id' | 'created_at'>) => Address;
  setDefaultAddress: (addressId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, Profile> = {
  customer: INITIAL_PROFILES[2], // Aarav Sharma
  farmer: INITIAL_PROFILES[0],   // Ramesh Patil
  admin: INITIAL_PROFILES[3],    // Sunita Deshmukh
};

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    user_id: 'user-customer-1',
    label: 'Home (घर)',
    recipient_name: 'Aarav Sharma',
    phone: '9822099999',
    addressLine1: 'B-402, Green Acres, Gangapur Road',
    address_line_1: 'B-402, Green Acres, Gangapur Road',
    landmark: 'Opposite Navshya Ganpati Temple',
    city: 'Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    pincode: '422002',
    service_area_id: 'sa-nashik',
    is_default: true,
    created_at: new Date().toISOString(),
  } as unknown as Address,
  {
    id: 'addr-2',
    user_id: 'user-customer-1',
    label: 'Restaurant / Kitchen',
    recipient_name: 'Aarav Sharma (Bhojan Griha)',
    phone: '9822099999',
    addressLine1: 'Shop 12, Baner High Street',
    address_line_1: 'Shop 12, Baner High Street',
    landmark: 'Near Balewadi Phata',
    city: 'Pune',
    district: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    service_area_id: 'sa-pune',
    is_default: false,
    created_at: new Date().toISOString(),
  } as unknown as Address
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('farmdirect_active_role') as UserRole) || 'customer';
  });

  const [user, setUser] = useState<Profile | null>(() => {
    const savedRole = (localStorage.getItem('farmdirect_active_role') as UserRole) || 'customer';
    return DEMO_USERS[savedRole] || DEMO_USERS.customer;
  });

  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const raw = localStorage.getItem('farmdirect_addresses');
    return raw ? JSON.parse(raw) : INITIAL_ADDRESSES;
  });

  useEffect(() => {
    if (user?.role === 'farmer') {
      marketplaceService.getFarmers().then(farmers => {
        const found = farmers.find(f => f.user_id === user.id) || INITIAL_FARMERS[0];
        setFarmerProfile(found);
      });
    } else {
      setFarmerProfile(null);
    }
  }, [user]);

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const targetUser = DEMO_USERS[newRole];
    setUser(targetUser);
    localStorage.setItem('farmdirect_active_role', newRole);
  };

  const login = async (phoneOrEmail: string, role: UserRole = 'customer') => {
    const target = DEMO_USERS[role];
    const loggedUser: Profile = {
      ...target,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : target.email,
      phone: !phoneOrEmail.includes('@') ? phoneOrEmail : target.phone,
    };
    setUser(loggedUser);
    setCurrentRole(role);
    localStorage.setItem('farmdirect_active_role', role);
  };

  const logout = () => {
    setUser(null);
    setFarmerProfile(null);
    localStorage.removeItem('farmdirect_active_role');
  };

  const addAddress = (addrInput: Omit<Address, 'id' | 'user_id' | 'created_at'>): Address => {
    const newAddress: Address = {
      ...addrInput,
      id: `addr-${Date.now()}`,
      user_id: user?.id || 'guest',
      created_at: new Date().toISOString(),
      is_default: addresses.length === 0 || addrInput.is_default,
    };
    const updated = addrInput.is_default
      ? addresses.map(a => ({ ...a, is_default: false })).concat(newAddress)
      : [...addresses, newAddress];

    setAddresses(updated);
    localStorage.setItem('farmdirect_addresses', JSON.stringify(updated));
    return newAddress;
  };

  const setDefaultAddress = (addressId: string) => {
    const updated = addresses.map(a => ({
      ...a,
      is_default: a.id === addressId,
    }));
    setAddresses(updated);
    localStorage.setItem('farmdirect_addresses', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        farmerProfile,
        addresses,
        currentRole,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        addAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

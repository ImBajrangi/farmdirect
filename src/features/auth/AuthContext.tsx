import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Profile, FarmerProfile, Address, UserRole } from '../../types';
import { marketplaceService } from '../../services/marketplaceService';
import { getActiveDbClient, supabase } from '../../lib/supabase/client';

interface AuthContextType {
  user: Profile | null;
  farmerProfile: FarmerProfile | null;
  addresses: Address[];
  currentRole: UserRole;
  isAuthenticated: boolean;
  login: (phoneOrEmail: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  addAddress: (address: Omit<Address, 'id' | 'user_id' | 'created_at'>) => Promise<Address>;
  setDefaultAddress: (addressId: string) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default Seed Profiles synced with Supabase Database
const KNOWN_USERS: Record<UserRole, Profile> = {
  customer: {
    id: 'f1e826ed-4243-4cfe-9dda-d0676582b61f',
    email: 'aarav.customer@farmdirect.in',
    full_name: 'Aarav Sharma',
    phone: '9822099999',
    role: 'customer',
    preferred_language: 'en',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  farmer: {
    id: '1e392454-3a70-44cd-9360-267a50704871',
    email: 'testfarmer@farmdirect.in',
    full_name: 'Sahyadri Organic Farms (Ramesh Patil)',
    phone: '9822011111',
    role: 'farmer',
    preferred_language: 'en',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  admin: {
    id: 'admin-00000000-0000-0000-0000-000000000001',
    email: 'admin@farmdirect.in',
    full_name: 'Platform Operations Admin',
    phone: '9822000000',
    role: 'admin',
    preferred_language: 'en',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return (localStorage.getItem('farmdirect_active_role') as UserRole) || 'customer';
  });

  const [user, setUser] = useState<Profile | null>(() => {
    const savedRole = (localStorage.getItem('farmdirect_active_role') as UserRole) || 'customer';
    return KNOWN_USERS[savedRole] || KNOWN_USERS.customer;
  });

  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);

  // Load User Profile and Farmer Record from Supabase
  const refreshUserData = useCallback(async () => {
    if (!user?.id) return;
    const db = getActiveDbClient();
    if (!db) return;

    try {
      // 1. Fetch live Profile
      const { data: dbProfile } = await db
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (dbProfile) {
        setUser(dbProfile as Profile);
      }

      // 2. Fetch Farmer Profile if applicable
      if (user.role === 'farmer') {
        const { data: dbFarmer } = await db
          .from('farmer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (dbFarmer) {
          setFarmerProfile(dbFarmer as FarmerProfile);
        } else {
          // If no specific farmer profile, find any first farmer for testing
          const farmers = await marketplaceService.getFarmers();
          if (farmers.length > 0) setFarmerProfile(farmers[0]);
        }
      } else {
        setFarmerProfile(null);
      }

      // 3. Fetch User Addresses from Supabase
      const userAddrs = await marketplaceService.getUserAddresses(user.id);
      if (userAddrs.length > 0) {
        setAddresses(userAddrs);
      } else {
        // Fallback to locally cached addresses if DB has none yet
        const rawLocal = localStorage.getItem(`farmdirect_addresses_${user.id}`);
        if (rawLocal) {
          try {
            setAddresses(JSON.parse(rawLocal));
          } catch {
            setAddresses([]);
          }
        }
      }
    } catch (err) {
      console.warn('Error refreshing live user data:', err);
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // Listen to external real-time data changes
  useEffect(() => {
    const handleDataChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ table?: string }>;
      if (customEvent.detail?.table === 'farmer_profiles' || customEvent.detail?.table === 'profiles') {
        refreshUserData();
      }
    };
    window.addEventListener('farmdirect:data-changed', handleDataChange);
    return () => window.removeEventListener('farmdirect:data-changed', handleDataChange);
  }, [refreshUserData]);

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const targetUser = KNOWN_USERS[newRole];
    setUser(targetUser);
    localStorage.setItem('farmdirect_active_role', newRole);
  };

  const login = async (phoneOrEmail: string, role: UserRole = 'customer') => {
    const target = KNOWN_USERS[role];
    const loggedUser: Profile = {
      ...target,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : target.email,
      phone: !phoneOrEmail.includes('@') ? phoneOrEmail : target.phone,
    };

    // Ensure synced in Supabase profiles
    const db = getActiveDbClient();
    if (db) {
      try {
        await db.from('profiles').upsert({
          id: loggedUser.id,
          full_name: loggedUser.full_name,
          phone: loggedUser.phone,
          email: loggedUser.email,
          role: role,
          preferred_language: 'en'
        });
      } catch (err) {
        console.warn('Profile sync on login warning:', err);
      }
    }

    setUser(loggedUser);
    setCurrentRole(role);
    localStorage.setItem('farmdirect_active_role', role);
  };

  const logout = () => {
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
    setFarmerProfile(null);
    localStorage.removeItem('farmdirect_active_role');
  };

  const addAddress = async (addrInput: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<Address> => {
    const userId = user?.id || KNOWN_USERS.customer.id;
    let createdAddr: Address;

    try {
      createdAddr = await marketplaceService.saveUserAddress({
        ...addrInput,
        user_id: userId,
        is_default: addresses.length === 0 || Boolean(addrInput.is_default)
      });
    } catch {
      // Fallback local creation if network offline
      createdAddr = {
        ...addrInput,
        id: `addr-${Date.now()}`,
        user_id: userId,
        created_at: new Date().toISOString(),
        is_default: addresses.length === 0 || Boolean(addrInput.is_default),
      };
    }

    const updated = addrInput.is_default
      ? addresses.map(a => ({ ...a, is_default: false })).concat(createdAddr)
      : [...addresses, createdAddr];

    setAddresses(updated);
    localStorage.setItem(`farmdirect_addresses_${userId}`, JSON.stringify(updated));
    return createdAddr;
  };

  const setDefaultAddress = (addressId: string) => {
    const updated = addresses.map(a => ({
      ...a,
      is_default: a.id === addressId,
    }));
    setAddresses(updated);
    if (user?.id) {
      localStorage.setItem(`farmdirect_addresses_${user.id}`, JSON.stringify(updated));
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) return;
    try {
      const updated = await marketplaceService.updateUserProfile(user.id, updates);
      setUser(updated);
    } catch {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
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
        updateProfile,
        refreshUserData
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

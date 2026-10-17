import { Profile, FarmerProfile, Address, UserRole } from '../../types';

export interface AuthState {
  user: Profile | null;
  farmerProfile: FarmerProfile | null;
  addresses: Address[];
  currentRole: UserRole;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  phoneOrEmail: string;
  role?: UserRole;
}

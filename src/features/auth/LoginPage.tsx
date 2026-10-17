import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';
import { useAuth } from './AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import './auth.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [identifier, setIdentifier] = useState('9822099999');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'farmer') setIdentifier('9822012345');
    else if (role === 'admin') setIdentifier('admin@farmdirect.in');
    else setIdentifier('9822099999');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(identifier, selectedRole);
    setIsLoading(false);

    if (selectedRole === 'farmer') navigate('/farmer/dashboard');
    else if (selectedRole === 'admin') navigate('/admin/dashboard');
    else navigate('/marketplace');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🌱</div>
          <h1 className="heading-3">Sign In to FarmDirect</h1>
          <p className="text-subtle">Choose your marketplace role to proceed</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="auth-role-tabs">
          <button
            type="button"
            onClick={() => handleRoleSelect('customer')}
            className={`auth-role-btn ${selectedRole === 'customer' ? 'active' : ''}`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('farmer')}
            className={`auth-role-btn ${selectedRole === 'farmer' ? 'active' : ''}`}
          >
            Farmer
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`auth-role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Mobile Number or Email"
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading} style={{ marginTop: 8 }}>
            Continue as {selectedRole.toUpperCase()}
          </Button>
        </form>
      </div>
    </div>
  );
};

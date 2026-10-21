import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, Sprout, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';
import { useAuth } from './AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { FruitBasketsLogoIcon } from '../../components/common/FruitBasketsLogoIcon';
import { ImagePlaceholder } from '../../components/common/ImagePlaceholder';
import './auth.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleQuickDemoFill = () => {
    if (selectedRole === 'farmer') {
      setIdentifier('testfarmer@farmdirect.in');
      setPassword('password123');
    } else if (selectedRole === 'admin') {
      setIdentifier('admin@farmdirect.in');
      setPassword('password123');
    } else {
      setIdentifier('aarav.customer@farmdirect.in');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setIsLoading(true);
    await login(identifier, selectedRole);
    setIsLoading(false);

    if (selectedRole === 'farmer') navigate('/farmer/dashboard');
    else if (selectedRole === 'admin') navigate('/admin/dashboard');
    else navigate('/marketplace');
  };

  const getRoleDescription = () => {
    switch (selectedRole) {
      case 'farmer':
        return 'Manage crop listings, monitor harvest dispatches, and receive direct 0% commission payouts';
      case 'admin':
        return 'Access platform governance, Mahabhulekh 7/12 land deed audits, and operational node controls';
      default:
        return 'Order fresh harvests directly from verified farms with next-morning door delivery';
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-card">
        {/* Left Panel: Primary Authentication Form */}
        <div className="auth-form-panel">
          <div className="auth-header">
            <div className="auth-emblem">
              <FruitBasketsLogoIcon size={26} color="#FFFFFF" />
            </div>
            <h1 className="auth-title">Welcome to FarmDirect</h1>
            <p className="auth-subtitle">{getRoleDescription()}</p>
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

          <form onSubmit={handleSubmit} className="auth-form-body">
            <Input
              label="Mobile Number or Email"
              type="text"
              placeholder="e.g. 9876543210 or yourname@gmail.com"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="auth-quick-fill-row">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="auth-quick-fill-btn"
              >
                ✨ Quick-fill demo account ({selectedRole})
              </button>
            </div>

            <Button type="submit" variant="primary" fullWidth isLoading={isLoading} style={{ marginTop: 6 }}>
              Continue as {selectedRole.toUpperCase()} <ArrowRight size={16} />
            </Button>
          </form>

          <div className="auth-footer-note">
            <span>By proceeding, you agree to FarmDirect's verified marketplace protocol and fair trade principles.</span>
          </div>
        </div>

        {/* Right Panel: Agricultural Showcase & Image Placeholder (Desktop/Tablet) */}
        <div className="auth-visual-panel">
          <div className="auth-visual-inner">
            <div className="auth-visual-badge">
              <Sprout size={14} color="#006044" />
              <span>Direct Farm-to-Consumer Network</span>
            </div>

            <h2 className="auth-visual-headline">
              Transparent, Direct Agricultural Commerce
            </h2>
            <p className="auth-visual-subtext">
              Eliminating multi-tiered middlemen markups to empower local producers and deliver field-fresh harvest directly to families.
            </p>

            {/* Dedicated Neutral Grey Image Placeholder */}
            <div className="auth-placeholder-wrapper">
              <ImagePlaceholder
                aspectRatio="16:9"
                label="FarmDirect Platform & Harvest Showcase"
                sublabel="Replace with 1200x675px agricultural photography"
                borderRadius="14px"
              />
            </div>

            <div className="auth-trust-points">
              <div className="auth-trust-item">
                <ShieldCheck size={18} color="#006044" className="auth-trust-icon" />
                <div>
                  <strong>7/12 Land Deed Verified</strong>
                  <p>Every producer is audited with authentic state revenue land records</p>
                </div>
              </div>
              <div className="auth-trust-item">
                <Truck size={18} color="#006044" className="auth-trust-icon" />
                <div>
                  <strong>Next-Morning Harvest Dispatch</strong>
                  <p>Crops harvested at dawn delivered fresh to Nashik & Pune nodes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

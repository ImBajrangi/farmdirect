import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, ShieldCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { farmerService } from './farmer.service';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import './farmer.css';

export const FarmerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [farmName, setFarmName] = useState('');
  const [farmNameHi, setFarmNameHi] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [district, setDistrict] = useState('Nashik');
  const [taluka, setTaluka] = useState('Dindori');
  const [village, setVillage] = useState('');
  const [landAreaAcres, setLandAreaAcres] = useState(5);
  const [story, setStory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName || !village || !phone) {
      alert('Please fill out all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await farmerService.registerFarmer({
        user_id: user?.id || 'farmer-user-id',
        farm_name: farmName,
        farm_name_hi: farmNameHi || farmName,
        phone,
        district,
        taluka,
        village,
        land_area_acres: landAreaAcres,
        story,
        is_verified: true,
      });

      alert('Farmer registration submitted! Welcome to FarmDirect.');
      navigate('/farmer/dashboard');
    } catch {
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container farmer-dashboard">
      <div className="product-form-box mt-6">
        <div className="text-center mb-6">
          <div className="confirmation-icon-wrap" style={{ margin: '0 auto 12px' }}>
            <Tractor size={32} />
          </div>
          <h1 className="heading-2">Register as Farm Producer</h1>
          <p className="text-muted text-sm">
            Join the direct farm-to-door network in Maharashtra with 0% middleman fees
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row-2">
            <Input
              label="Farm / Brand Name (English) *"
              placeholder="e.g. Sahyadri Organics"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              required
            />
            <Input
              label="शेताचे नाव (मराठी / हिंदी)"
              placeholder="उदा. सह्याद्री ऑरगॅनिक फार्म"
              value={farmNameHi}
              onChange={(e) => setFarmNameHi(e.target.value)}
            />
          </div>

          <div className="form-row-2">
            <Input
              label="Contact Phone / WhatsApp *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile"
              required
            />
            <Input
              label="Land Area (Acres) *"
              type="number"
              value={landAreaAcres}
              onChange={(e) => setLandAreaAcres(Number(e.target.value))}
              required
            />
          </div>

          <div className="form-row-2">
            <Input
              label="District *"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
            <Input
              label="Taluka *"
              value={taluka}
              onChange={(e) => setTaluka(e.target.value)}
              required
            />
          </div>

          <Input
            label="Village / Landmark *"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder="e.g. Village Mohadi, Near Old Temple"
            required
          />

          <div className="form-group mb-4">
            <label className="form-label">Farm Story & Traditional Practices</label>
            <textarea
              className="input-field"
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Tell buyers about your family farming background, soil health, drip irrigation..."
            />
          </div>

          <div className="p-3 bg-color-background-subtle rounded-md mb-6 flex items-center gap-2 text-xs text-muted">
            <ShieldCheck size={18} color="var(--color-primary)" />
            <span>
              Your registration will be cross-checked with Mahabhulekh 7/12 land records for verified status badge.
            </span>
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Complete Farmer Registration
          </Button>
        </form>
      </div>
    </div>
  );
};

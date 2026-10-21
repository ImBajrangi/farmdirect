import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, ShieldCheck, MapPin, Building2, BookOpen } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { farmerService } from './farmer.service';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ImagePlaceholder } from '../../components/common/ImagePlaceholder';
import './farmer.css';

export const FarmerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [farmName, setFarmName] = useState('');
  const [farmNameHi, setFarmNameHi] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [state, setState] = useState('');
  const [village, setVillage] = useState('');
  const [landAreaAcres, setLandAreaAcres] = useState(5);
  const [story, setStory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName || !village || !phone || !district) {
      alert('Please fill out all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await farmerService.registerFarmer({
        user_id: user?.id,
        farm_name: farmName,
        farm_name_hi: farmNameHi || farmName,
        phone,
        district,
        taluka,
        village,
        state: state || 'Maharashtra',
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
          {/* Section 1: Producer & Brand Identity */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-title">
                <Building2 size={16} color="var(--brand-forest, #006044)" />
                <span>1. Producer & Farm Identity</span>
              </div>
              <p className="form-section-desc">Primary name and contact details displayed to prospective buyers</p>
            </div>

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

            <Input
              label="Contact Phone / WhatsApp *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              required
            />
          </div>

          {/* Section 2: Landholding & Location Geometry */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-title">
                <MapPin size={16} color="var(--brand-forest, #006044)" />
                <span>2. Landholding & Regional Location</span>
              </div>
              <p className="form-section-desc">Enables local cluster grouping and delivery route optimization</p>
            </div>

            <div className="form-row-2">
              <Input
                label="Land Area (Acres) *"
                type="number"
                min="0.5"
                step="0.5"
                value={landAreaAcres}
                onChange={(e) => setLandAreaAcres(Number(e.target.value))}
                required
              />
              <Input
                label="State *"
                placeholder="e.g. Maharashtra"
                value={state || 'Maharashtra'}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className="form-row-2">
              <Input
                label="District *"
                placeholder="e.g. Nashik / Pune"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
              <Input
                label="Taluka / Tehsil"
                placeholder="e.g. Dindori / Haveli"
                value={taluka}
                onChange={(e) => setTaluka(e.target.value)}
              />
            </div>

            <Input
              label="Village / Landmark *"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Village Mohadi, Near Old Temple"
              required
            />
          </div>

          {/* Section 3: Agricultural Story & Practices */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-title">
                <BookOpen size={16} color="var(--brand-forest, #006044)" />
                <span>3. Farm Heritage & Cultivation Practice</span>
              </div>
              <p className="form-section-desc">Share your soil care, drip irrigation, or heirloom varieties</p>
            </div>

            <div className="form-group">
              <label className="form-label">Farm Story & Traditional Practices</label>
              <textarea
                className="input-field"
                rows={3}
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Tell buyers about your family farming background, soil health, drip irrigation..."
              />
            </div>
          </div>

          {/* Section 4: Land Record Verification & Deed Preview */}
          <div className="form-section-card">
            <div className="form-section-header">
              <div className="form-section-title">
                <ShieldCheck size={16} color="var(--brand-forest, #006044)" />
                <span>4. Mahabhulekh 7/12 Land Record Verification</span>
              </div>
              <p className="form-section-desc">Upload or scan your authentic land revenue extract for verified producer eligibility</p>
            </div>

            <ImagePlaceholder
              aspectRatio="21:9"
              height={120}
              label="Mahabhulekh 7/12 Land Deed Document Scan (Preview)"
              sublabel="Accepts PDF, PNG, or JPG land revenue extract (Node #FD-VERIFY)"
              borderRadius="12px"
            />

            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              <span>Verified producers receive priority marketplace placement, next-morning collection routes, and direct 0% commission payouts.</span>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Complete Farmer Registration
          </Button>
        </form>
      </div>
    </div>
  );
};

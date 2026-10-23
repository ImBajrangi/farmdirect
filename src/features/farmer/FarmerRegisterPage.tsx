import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, ShieldCheck, MapPin, Building2, BookOpen, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { farmerService } from './farmer.service';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ImagePlaceholder } from '../../components/common/ImagePlaceholder';
import './farmer.css';

export const FarmerRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Identity
  const [farmName, setFarmName] = useState('');
  const [farmNameHi, setFarmNameHi] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');

  // Step 2: Landholding & Location
  const [district, setDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [village, setVillage] = useState('');
  const [landAreaAcres, setLandAreaAcres] = useState(5);
  const [story, setStory] = useState('');

  // Step 3: Documents
  const [fileName, setFileName] = useState<string>('');

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!farmName.trim()) errs.farmName = 'Farm name is required';
    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.trim().replace(/\D/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!district.trim()) errs.district = 'District is required (e.g. Nashik, Pune)';
    if (!village.trim()) errs.village = 'Village / Landmark is required';
    if (!landAreaAcres || landAreaAcres <= 0) errs.landAreaAcres = 'Valid land acreage is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setErrors({});
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1() || !validateStep2()) {
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

      navigate('/farmer/dashboard');
    } catch {
      setErrors({ form: 'Registration failed. Please check network and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container farmer-onboarding-page">
      <div className="onboarding-flow-container">
        {/* Header */}
        <div className="onboarding-header">
          <div className="onboarding-icon-wrap">
            <Tractor size={28} />
          </div>
          <h1 className="onboarding-title">Register as Farm Producer</h1>
          <p className="onboarding-subtitle">
            Three simple stages to connect your harvest directly to Maharashtra consumers
          </p>
        </div>

        {/* Guided 3-Stage Stepper (Wireframe 2) */}
        <div className="onboarding-stepper">
          <div className={`step-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-circle">
              {currentStep > 1 ? <Check size={16} /> : <span>1</span>}
            </div>
            <div className="step-label-group">
              <span className="step-title">Farmer and farm identity</span>
              <span className="step-desc">Name, contact details & farm identity</span>
            </div>
          </div>

          <div className="step-divider" />

          <div className={`step-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-circle">
              {currentStep > 2 ? <Check size={16} /> : <span>2</span>}
            </div>
            <div className="step-label-group">
              <span className="step-title">Landholding and location</span>
              <span className="step-desc">District, village, taluka & land size</span>
            </div>
          </div>

          <div className="step-divider" />

          <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
            <div className="step-circle">
              <span>3</span>
            </div>
            <div className="step-label-group">
              <span className="step-title">Documents and review</span>
              <span className="step-desc">7/12 deed upload & final confirmation</span>
            </div>
          </div>
        </div>

        {/* Split Layout: 60% Form / 40% Context Guidance */}
        <div className="onboarding-split-layout">
          {/* Left Form Area (60%) */}
          <div className="onboarding-form-area">
            <form onSubmit={handleSubmit}>
              {errors.form && (
                <div className="onboarding-form-alert">{errors.form}</div>
              )}

              {/* STAGE 1: Farmer & Farm Identity */}
              {currentStep === 1 && (
                <div className="onboarding-stage-pane">
                  <div className="stage-pane-header">
                    <Building2 size={20} className="text-emerald-700" />
                    <div>
                      <h2 className="stage-heading">Farmer & Farm Identity</h2>
                      <p className="stage-sub">How buyers and logistics partners will identify your harvest</p>
                    </div>
                  </div>

                  <div className="stage-fields-vertical">
                    <div className="form-field-group">
                      <Input
                        label="Farm / Brand Name (English) *"
                        placeholder="e.g. Sahyadri Organic Orchards"
                        value={farmName}
                        onChange={(e) => {
                          setFarmName(e.target.value);
                          if (errors.farmName) setErrors({ ...errors, farmName: '' });
                        }}
                        required
                      />
                      {errors.farmName && (
                        <span className="field-inline-error">{errors.farmName}</span>
                      )}
                    </div>

                    <div className="form-field-group">
                      <Input
                        label="शेताचे नाव (मराठी / हिंदी)"
                        placeholder="उदा. सह्याद्री ऑरगॅनिक फार्म"
                        value={farmNameHi}
                        onChange={(e) => setFarmNameHi(e.target.value)}
                      />
                      <span className="field-hint">Displayed on regional multilingual market listings</span>
                    </div>

                    <div className="form-field-group">
                      <Input
                        label="Contact Phone / WhatsApp *"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        placeholder="10-digit mobile number"
                        type="tel"
                        required
                      />
                      {errors.phone && (
                        <span className="field-inline-error">{errors.phone}</span>
                      )}
                      <span className="field-hint">Used for dispatch confirmation and daily harvest pickup alerts</span>
                    </div>
                  </div>

                  <div className="stage-actions">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={handleNext}
                      className="stage-next-btn"
                    >
                      <span>Continue to Landholding</span>
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              )}

              {/* STAGE 2: Landholding & Regional Location */}
              {currentStep === 2 && (
                <div className="onboarding-stage-pane">
                  <div className="stage-pane-header">
                    <MapPin size={20} className="text-emerald-700" />
                    <div>
                      <h2 className="stage-heading">Landholding & Location</h2>
                      <p className="stage-sub">Coordinates your farm within local cluster pickup zones</p>
                    </div>
                  </div>

                  <div className="stage-fields-vertical">
                    <div className="form-field-group">
                      <Input
                        label="District *"
                        placeholder="e.g. Nashik / Pune / Satara"
                        value={district}
                        onChange={(e) => {
                          setDistrict(e.target.value);
                          if (errors.district) setErrors({ ...errors, district: '' });
                        }}
                        required
                      />
                      {errors.district && (
                        <span className="field-inline-error">{errors.district}</span>
                      )}
                    </div>

                    <div className="form-field-group">
                      <Input
                        label="Taluka / Tehsil"
                        placeholder="e.g. Dindori / Haveli"
                        value={taluka}
                        onChange={(e) => setTaluka(e.target.value)}
                      />
                    </div>

                    <div className="form-field-group">
                      <Input
                        label="Village / Local Landmark *"
                        value={village}
                        onChange={(e) => {
                          setVillage(e.target.value);
                          if (errors.village) setErrors({ ...errors, village: '' });
                        }}
                        placeholder="e.g. Mohadi Village, Near Old Post Office"
                        required
                      />
                      {errors.village && (
                        <span className="field-inline-error">{errors.village}</span>
                      )}
                    </div>

                    <div className="form-field-group">
                      <Input
                        label="Cultivable Land Area (Acres) *"
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={landAreaAcres}
                        onChange={(e) => {
                          setLandAreaAcres(Number(e.target.value));
                          if (errors.landAreaAcres) setErrors({ ...errors, landAreaAcres: '' });
                        }}
                        required
                      />
                      {errors.landAreaAcres && (
                        <span className="field-inline-error">{errors.landAreaAcres}</span>
                      )}
                    </div>

                    <div className="form-field-group">
                      <label className="form-label">Farm Practices & Soil Care (Optional)</label>
                      <textarea
                        className="input-field"
                        rows={3}
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                        placeholder="Describe your irrigation source, soil regeneration, zero-chemical practices..."
                      />
                    </div>
                  </div>

                  <div className="stage-actions split">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleBack}
                    >
                      <ArrowLeft size={16} />
                      <span>Previous</span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={handleNext}
                    >
                      <span>Continue to Documents</span>
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              )}

              {/* STAGE 3: Documents & Final Review */}
              {currentStep === 3 && (
                <div className="onboarding-stage-pane">
                  <div className="stage-pane-header">
                    <ShieldCheck size={20} className="text-emerald-700" />
                    <div>
                      <h2 className="stage-heading">Documents & Final Review</h2>
                      <p className="stage-sub">Verify your information and submit for platform KYC approval</p>
                    </div>
                  </div>

                  <div className="stage-fields-vertical">
                    {/* Document Upload Area */}
                    <div className="upload-requirements-card">
                      <h4 className="upload-req-title">Mahabhulekh 7/12 Land Record Requirements:</h4>
                      <ul className="upload-req-list">
                        <li>Official 7/12 (Saat Bara) or 8-A land extract from Maharashtra Revenue Portal</li>
                        <li>Clear PDF, PNG, or JPG document under 10MB</li>
                        <li>Must display owner name and Gat / Survey number matching this registration</li>
                      </ul>

                      <div className="file-input-wrapper">
                        <label className="custom-file-upload">
                          <input
                            type="file"
                            accept=".pdf,image/png,image/jpeg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) setFileName(file.name);
                            }}
                          />
                          <span>{fileName ? `Selected: ${fileName}` : 'Choose 7/12 Land Document File'}</span>
                        </label>
                      </div>
                    </div>

                    {/* Review Dossier Summary */}
                    <div className="onboarding-review-summary">
                      <h4 className="review-summary-title">Summary of Application Details:</h4>
                      <div className="review-summary-grid">
                        <div className="review-row">
                          <span className="review-label">Producer Farm:</span>
                          <strong className="review-val">{farmName || '—'}</strong>
                        </div>
                        <div className="review-row">
                          <span className="review-label">Contact Phone:</span>
                          <strong className="review-val">{phone || '—'}</strong>
                        </div>
                        <div className="review-row">
                          <span className="review-label">Location:</span>
                          <strong className="review-val">{village}, {taluka ? `${taluka}, ` : ''}{district}</strong>
                        </div>
                        <div className="review-row">
                          <span className="review-label">Cultivable Land:</span>
                          <strong className="review-val">{landAreaAcres} Acres</strong>
                        </div>
                        <div className="review-row">
                          <span className="review-label">Verification State:</span>
                          <span className="review-status-pill">Pending KYC Audit</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="stage-actions split">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleBack}
                    >
                      <ArrowLeft size={16} />
                      <span>Previous</span>
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      className="stage-submit-btn"
                    >
                      <Check size={16} />
                      <span>Submit Farmer Registration</span>
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Context & Preview Panel (40%) */}
          <div className="onboarding-context-panel">
            <div className="context-card">
              <h3 className="context-title">
                {currentStep === 1 && 'Why Direct Producer Registration?'}
                {currentStep === 2 && 'Regional Logistics Clusters'}
                {currentStep === 3 && 'Document Verification Protocol'}
              </h3>

              {currentStep === 1 && (
                <div className="context-content">
                  <p>
                    FarmDirect establishes a direct connection between Maharashtra farmers and urban buyers.
                  </p>
                  <div className="context-badge-item">
                    <span className="context-bullet">✓</span>
                    <span><strong>0% Middleman Fees:</strong> Full customer payment transfers directly to producer accounts.</span>
                  </div>
                  <div className="context-badge-item">
                    <span className="context-bullet">✓</span>
                    <span><strong>Farm Identity:</strong> Your brand and story are showcased on every product card.</span>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="context-content">
                  <p>
                    Accurate village and district coordinates allow FarmDirect logistics partners to schedule morning collection runs.
                  </p>
                  <div className="context-badge-item">
                    <span className="context-bullet">✓</span>
                    <span><strong>Nashik & Pune Corridors:</strong> Fast overnight collection routes to Mumbai & Pune consumption centers.</span>
                  </div>
                  <div className="context-badge-item">
                    <span className="context-bullet">✓</span>
                    <span><strong>Harvest Aggregation:</strong> Scheduled vehicle stops at your farm gate.</span>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="context-content">
                  <p>
                    Verified land documents grant your produce the trusted <strong>Verified 7/12</strong> marketplace badge.
                  </p>
                  <div className="onboarding-doc-placeholder">
                    <ImagePlaceholder
                      aspectRatio="4:3"
                      height={180}
                      label="7/12 Land Document Preview Area"
                      sublabel={fileName ? `Attached: ${fileName}` : 'Awaiting document upload'}
                      borderRadius="12px"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sprout, IndianRupee, Image as ImageIcon, FileText, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { farmerService } from './farmer.service';
import { Category, UnitOfSale } from './farmer.types';
import { useAuth } from '../auth/AuthContext';
import { rupeesToPaise } from '../../utils/currency';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ImagePlaceholder } from '../../components/common/ImagePlaceholder';
import './farmer.css';

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { farmerProfile } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form Fields
  const [name, setName] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [priceRupees, setPriceRupees] = useState<number | ''>(40);
  const [unit, setUnit] = useState<UnitOfSale>('kg');
  const [unitStep, setUnitStep] = useState(1);
  const [minOrderQuantity, setMinOrderQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(100);
  const [shelfLifeDays, setShelfLifeDays] = useState(7);
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80'
  );
  const [isCertifiedOrganic, setIsCertifiedOrganic] = useState(false);

  useEffect(() => {
    farmerService.getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    });
  }, []);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Crop name is required';
    if (!nameHi.trim()) errs.nameHi = 'Regional name is required';
    if (!categoryId) errs.categoryId = 'Please select a category';
    if (!priceRupees || Number(priceRupees) <= 0) errs.price = 'Valid price per unit is required';
    if (!availableQuantity || availableQuantity <= 0) errs.quantity = 'Available harvest quantity is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const farmerId = farmerProfile?.id || 'farmer-1';
      await farmerService.createProduct({
        farmerId,
        categoryId,
        name,
        nameHi,
        description,
        descriptionHi: description,
        pricePaise: rupeesToPaise(Number(priceRupees)),
        unit,
        unitStep,
        minOrderQuantity,
        availableQuantity,
        shelfLifeDays,
        imageUrl,
        isCertifiedOrganic,
      });

      navigate('/farmer/dashboard');
    } catch {
      setErrors({ form: 'Failed to publish produce. Please check connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name || 'Fresh Produce';

  return (
    <div className="page-container add-produce-page">
      {/* Header bar */}
      <div className="add-produce-header">
        <button
          type="button"
          className="checkout-header-back"
          onClick={() => navigate('/farmer/dashboard')}
        >
          <ArrowLeft size={16} /> Back to Workdesk
        </button>
        <div className="add-produce-title-row">
          <h1 className="heading-2">List New Farm Produce</h1>
          <span className="add-produce-status-pill">
            <span className="live-dot" /> Live Catalog Entry
          </span>
        </div>
        <p className="text-muted">
          Add fresh crop harvests directly to the marketplace for nearby consumers
        </p>
      </div>

      {/* Wireframe 3: 60/40 Split Layout */}
      <div className="add-produce-workspace-grid">
        {/* Left Side (60%): Listing Details Form */}
        <div className="add-produce-form-pane">
          <form onSubmit={handleSubmit} className="add-produce-form">
            {errors.form && (
              <div className="add-produce-error-banner">{errors.form}</div>
            )}

            {/* Section 1: Crop Name & Category */}
            <div className="add-produce-section">
              <div className="add-produce-section-heading">
                <Sprout size={16} className="text-emerald-700" />
                <span>Crop Identification & Category</span>
              </div>

              <div className="form-row-2">
                <div className="field-container">
                  <Input
                    label="Crop Name (English) *"
                    placeholder="e.g. Fresh Red Onions"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    required
                  />
                  {errors.name && <span className="field-inline-error">{errors.name}</span>}
                </div>

                <div className="field-container">
                  <Input
                    label="पिकाचे नाव (मराठी / हिंदी) *"
                    placeholder="उदा. लाल कांदा"
                    value={nameHi}
                    onChange={(e) => {
                      setNameHi(e.target.value);
                      if (errors.nameHi) setErrors({ ...errors, nameHi: '' });
                    }}
                    required
                  />
                  {errors.nameHi && <span className="field-inline-error">{errors.nameHi}</span>}
                </div>
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Produce Category *</label>
                <select
                  className="input-field"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.name_hi})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Pricing & Harvest Inventory */}
            <div className="add-produce-section">
              <div className="add-produce-section-heading">
                <IndianRupee size={16} className="text-emerald-700" />
                <span>Pricing & Available Harvest</span>
              </div>

              <div className="form-row-2">
                <div className="field-container">
                  <Input
                    label="Price (₹ per Unit) *"
                    type="number"
                    min="1"
                    value={priceRupees}
                    onChange={(e) => {
                      setPriceRupees(e.target.value === '' ? '' : Number(e.target.value));
                      if (errors.price) setErrors({ ...errors, price: '' });
                    }}
                    required
                  />
                  {errors.price && <span className="field-inline-error">{errors.price}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Unit of Sale *</label>
                  <select
                    className="input-field"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitOfSale)}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="gram">Gram (g)</option>
                    <option value="piece">Piece (नग)</option>
                    <option value="dozen">Dozen (डझन)</option>
                    <option value="crate">Crate (क्रेट)</option>
                    <option value="quintal">Quintal (क्विंटल)</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="field-container">
                  <Input
                    label="Available Quantity *"
                    type="number"
                    min="1"
                    value={availableQuantity}
                    onChange={(e) => {
                      setAvailableQuantity(Number(e.target.value));
                      if (errors.quantity) setErrors({ ...errors, quantity: '' });
                    }}
                    required
                  />
                  {errors.quantity && <span className="field-inline-error">{errors.quantity}</span>}
                </div>

                <Input
                  label="Minimum Order Quantity *"
                  type="number"
                  min="1"
                  value={minOrderQuantity}
                  onChange={(e) => setMinOrderQuantity(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Section 3: Image URL input */}
            <div className="add-produce-section">
              <div className="add-produce-section-heading">
                <ImageIcon size={16} className="text-emerald-700" />
                <span>Crop Photo URL</span>
              </div>

              <Input
                label="Product Image URL (Optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
              <span className="field-hint">Photo previews dynamically on the right-hand panel</span>
            </div>

            {/* Section 4: Harvest / Availability notes */}
            <div className="add-produce-section">
              <div className="add-produce-section-heading">
                <FileText size={16} className="text-emerald-700" />
                <span>Harvest & Farming Details</span>
              </div>

              <div className="form-group">
                <label className="form-label">Harvest Notes & Freshness Guarantee</label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Harvested fresh at morning sunrise, drip-irrigated heirloom variety..."
                />
              </div>

              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={isCertifiedOrganic}
                  onChange={(e) => setIsCertifiedOrganic(e.target.checked)}
                />
                <span>Certified Organic / Natural Produce (जैविक प्रमाणित / विषमुक्त)</span>
              </label>
            </div>

            {/* Actions */}
            <div className="add-produce-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/farmer/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="add-produce-submit-btn"
              >
                <CheckCircle2 size={16} />
                <span>Save Listing</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Right Side (40%): Live Image Preview (Wireframe 3) */}
        <div className="add-produce-preview-pane">
          <div className="add-produce-preview-sticky">
            <div className="preview-pane-header">
              <span className="preview-eyebrow">Listing Preview</span>
              <span className="preview-badge">Live Buyer View</span>
            </div>

            {/* Grey Replaceable Image Placeholder or Live Image */}
            <div className="add-produce-image-frame">
              {imageUrl ? (
                <div className="live-preview-image-container">
                  <img
                    src={imageUrl}
                    alt={name || 'Produce Preview'}
                    className="live-preview-img"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <ImagePlaceholder
                  aspectRatio="1:1"
                  height={220}
                  label="Crop Photo Placeholder (1:1)"
                  sublabel="Stable aspect ratio for marketplace display"
                  borderRadius="12px"
                />
              )}
            </div>

            {/* Isolated Read-only Summary (DOES NOT TOUCH PRODUCTCARD.TSX) */}
            <div className="add-produce-summary-card">
              <div className="summary-crop-header">
                <div>
                  <h3 className="summary-crop-title">{name || 'Your Crop Name'}</h3>
                  <span className="summary-crop-hi">{nameHi || 'पिकाचे नाव'}</span>
                </div>
                {isCertifiedOrganic && (
                  <span className="summary-organic-tag">Organic</span>
                )}
              </div>

              <div className="summary-details-row">
                <div className="summary-price-box">
                  <span className="summary-price-amount">₹{priceRupees || 0}</span>
                  <span className="summary-price-unit">/{unit}</span>
                </div>
                <div className="summary-stock-box">
                  <span className="summary-stock-label">Available Stock:</span>
                  <strong className="summary-stock-val">{availableQuantity} {unit}</strong>
                </div>
              </div>

              <div className="summary-meta-grid">
                <div className="summary-meta-item">
                  <Tag size={13} className="text-emerald-700" />
                  <span>Category: {selectedCategoryName}</span>
                </div>
                <div className="summary-meta-item">
                  <ShieldCheck size={13} className="text-emerald-700" />
                  <span>Direct Farm Gate Settlement</span>
                </div>
              </div>

              {description && (
                <p className="summary-description-text">
                  "{description}"
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

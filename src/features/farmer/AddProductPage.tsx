import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { farmerService } from './farmer.service';
import { Category, UnitOfSale } from './farmer.types';
import { useAuth } from '../auth/AuthContext';
import { rupeesToPaise } from '../../utils/currency';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import './farmer.css';

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { farmerProfile } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nameHi || !categoryId || !priceRupees) {
      alert('Please fill out all required fields');
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
        descriptionHi,
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
      alert('Failed to publish produce');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container farmer-dashboard">
      <div className="mb-4">
        <button
          className="checkout-header-back"
          onClick={() => navigate('/farmer/dashboard')}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h1 className="heading-2">List New Farm Produce</h1>
        <p className="text-muted">
          Add fresh crop harvests directly to the marketplace for nearby customers
        </p>
      </div>

      <div className="product-form-box">
        <form onSubmit={handleSubmit}>
          <div className="form-row-2">
            <Input
              label="Crop Name (English) *"
              placeholder="e.g. Fresh Red Onions"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="पिकाचे नाव (मराठी / हिंदी) *"
              placeholder="उदा. लाल कांदा"
              value={nameHi}
              onChange={(e) => setNameHi(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Category *</label>
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

          <div className="form-row-2">
            <Input
              label="Price (₹ per Unit) *"
              type="number"
              min="1"
              value={priceRupees}
              onChange={(e) =>
                setPriceRupees(e.target.value === '' ? '' : Number(e.target.value))
              }
              required
            />
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
            <Input
              label="Available Harvest Quantity *"
              type="number"
              min="1"
              value={availableQuantity}
              onChange={(e) => setAvailableQuantity(Number(e.target.value))}
              required
            />
            <Input
              label="Minimum Order Quantity *"
              type="number"
              min="1"
              value={minOrderQuantity}
              onChange={(e) => setMinOrderQuantity(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Product Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />

          <div className="form-group mb-4">
            <label className="form-label">Description / Harvest Notes</label>
            <textarea
              className="input-field"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe farming techniques, variety, freshness guarantee..."
            />
          </div>

          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={isCertifiedOrganic}
              onChange={(e) => setIsCertifiedOrganic(e.target.checked)}
            />
            <span>Certified Organic (जैविक प्रमाणित / विषमुक्त)</span>
          </label>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/farmer/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Publish Produce
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

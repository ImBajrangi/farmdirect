import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { marketplaceService } from '../../services/marketplaceService';
import { useAuth } from '../../features/auth/AuthContext';
import { Category, UnitOfSale } from '../../types';
import { rupeesToPaise } from '../../lib/formatting/currency';

export const AddProduct: React.FC = () => {
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
    marketplaceService.getCategories().then((cats) => {
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
      await marketplaceService.createProduct({
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
    } catch (err) {
      alert('Failed to publish produce');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 sm:pb-12">
      <button
        onClick={() => navigate('/farmer/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Farm Portal</span>
      </button>

      <div>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">
          List New Farm Produce
        </h1>
        <p className="text-xs text-stone-500">
          Publish fresh harvest direct to Nashik & Pune local buyers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-earth-200 shadow-soft space-y-4 text-xs">
        {/* Name in English & Hindi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Produce Name (English) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Crisp Dindori Table Grapes"
              className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
            />
          </div>
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Produce Name (Hindi / Marathi) *
            </label>
            <input
              type="text"
              required
              value={nameHi}
              onChange={(e) => setNameHi(e.target.value)}
              placeholder="उदा. दिंडोरी गोड द्राक्षे"
              className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
            />
          </div>
        </div>

        {/* Category & Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.name_hi})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Unit of Sale *</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as UnitOfSale)}
              className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="gram">Gram</option>
              <option value="piece">Piece / जुडी (bundle)</option>
              <option value="dozen">Dozen</option>
              <option value="quintal">Quintal</option>
              <option value="crate">Crate (20kg)</option>
            </select>
          </div>
        </div>

        {/* Pricing in Rupees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Price in INR (₹) *</label>
            <input
              type="number"
              required
              min={1}
              value={priceRupees}
              onChange={(e) => setPriceRupees(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 50"
              className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 font-bold focus:border-agri-600"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Unit Step Increment</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={unitStep}
              onChange={(e) => setUnitStep(Number(e.target.value))}
              className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Initial Stock Available</label>
            <input
              type="number"
              required
              min={1}
              value={availableQuantity}
              onChange={(e) => setAvailableQuantity(Number(e.target.value))}
              className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 font-bold focus:border-agri-600"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-bold text-stone-700 mb-1">Fresh Harvest Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe soil origin, morning harvest time, taste profile..."
            className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
          />
        </div>

        {/* Image URL & Preview */}
        <div>
          <label className="block font-bold text-stone-700 mb-1">Product Image URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
            />
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-earth-300 shrink-0 bg-earth-100">
              <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Organic Certification Checkbox */}
        <div className="bg-earth-50 p-3.5 rounded-2xl border border-earth-200 space-y-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isCertifiedOrganic}
              onChange={(e) => setIsCertifiedOrganic(e.target.checked)}
              className="w-4 h-4 text-agri-600 rounded"
            />
            <span className="font-bold text-stone-800 text-xs">
              Lab-Certified Organic Produce
            </span>
          </label>
          <p className="text-[10px] text-stone-500 pl-6">
            Compliance Note: In accordance with FarmDirect honest product policy, check this only if you hold valid NPOP or state PGS lab verification documents.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm rounded-xl shadow-lifted transition"
        >
          {isSubmitting ? 'Publishing to Marketplace...' : 'Publish Produce to Marketplace'}
        </button>
      </form>
    </div>
  );
};

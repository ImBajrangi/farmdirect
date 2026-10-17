import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

export const FarmerRegister: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const [farmName, setFarmName] = useState('');
  const [village, setVillage] = useState('Dindori');
  const [district, setDistrict] = useState('Nashik');
  const [landAcres, setLandAcres] = useState(5);
  const [idProofType, setIdProofType] = useState('land_7_12');
  const [proofNumber, setProofNumber] = useState('');
  const [story, setStory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 sm:pb-12">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      <div>
        <div className="flex items-center gap-2 text-amber-700">
          <Tractor className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Producer Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-1">
          Join FarmDirect as a Producer Farmer
        </h1>
        <p className="text-xs text-stone-500">
          Connect directly to households, cafes, and bulk buyers in Maharashtra with fair farmgate pricing
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 border border-earth-200 shadow-soft text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Application Submitted!</h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            Our Nashik/Pune field team has received your registration for <strong>{farmName || 'your farm'}</strong>. 
            Verification typically takes 24 hours. You can explore the portal in demo mode now.
          </p>
          <button
            onClick={() => {
              switchRole('farmer');
              navigate('/farmer/dashboard');
            }}
            className="px-6 py-3 bg-agri-700 hover:bg-agri-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Open Farmer Portal (Demo Mode)
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-earth-200 shadow-soft space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Farm / Producer Name *</label>
              <input
                type="text"
                required
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="e.g. Sahyadri Organic Orchards"
                className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Total Cultivated Land (Acres) *</label>
              <input
                type="number"
                required
                min={0.5}
                step={0.5}
                value={landAcres}
                onChange={(e) => setLandAcres(Number(e.target.value))}
                className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Village (गाव) *</label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Dindori / Niphad / Baramati"
                className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">District (जिल्हा) *</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Verification Document Type *</label>
              <select
                value={idProofType}
                onChange={(e) => setIdProofType(e.target.value)}
                className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
              >
                <option value="land_7_12">7/12 Land Record (७/१२ उतारा)</option>
                <option value="kisan_credit_card">Kisan Credit Card (KCC)</option>
                <option value="aadhaar">Aadhaar Card with Agri Land Registry</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Document Reference / Gat Number *</label>
              <input
                type="text"
                required
                value={proofNumber}
                onChange={(e) => setProofNumber(e.target.value)}
                placeholder="e.g. Gat No. 142 / KCC-MH-9842"
                className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Tell Buyers About Your Farming Story</label>
            <textarea
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="What crops do you grow? Do you use natural compost, drip irrigation, or traditional indigenous heirloom seeds?"
              className="w-full bg-white border border-earth-300 rounded-xl p-2.5 text-xs text-stone-900 focus:border-agri-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-agri-700 hover:bg-agri-800 text-white font-bold text-sm rounded-xl shadow-lifted transition"
          >
            Submit Application for Verification
          </button>
        </form>
      )}
    </div>
  );
};

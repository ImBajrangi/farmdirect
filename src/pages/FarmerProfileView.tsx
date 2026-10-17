import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, ArrowLeft, Award, Calendar, MessageCircle } from 'lucide-react';
import { marketplaceService } from '../services/marketplaceService';
import { FarmerProfile, Product } from '../types';
import { ProductCard } from '../components/marketplace/ProductCard';
import { useTranslation } from '../hooks/useTranslation';

export const FarmerProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useTranslation();

  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [farm, prods] = await Promise.all([
          marketplaceService.getFarmerById(id),
          marketplaceService.getFarmerProducts(id),
        ]);
        setFarmer(farm);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load farmer profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="h-60 rounded-3xl bg-earth-200 animate-pulse" />
        <div className="h-40 rounded-3xl bg-earth-200 animate-pulse" />
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-stone-900">Farmer Not Found</h2>
        <button onClick={() => navigate('/marketplace')} className="text-xs font-bold text-agri-700 hover:underline">
          Return to Marketplace
        </button>
      </div>
    );
  }

  const farmName = language === 'hi' && farmer.farm_name_hi ? farmer.farm_name_hi : farmer.farm_name;
  const story = language === 'hi' && farmer.story_hi ? farmer.story_hi : farmer.story;

  const whatsappMessage = encodeURIComponent(`Hello ${farmer.farm_name}, I am contacting you via FarmDirect.`);
  const whatsappUrl = `https://wa.me/91${farmer.user?.phone || '9822012345'}?text=${whatsappMessage}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-24 sm:pb-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Hero Farm Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-earth-200 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-earth-100 overflow-hidden border border-earth-300 shrink-0">
              <img
                src={farmer.user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
                alt={farmer.farm_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-3xl font-black text-stone-900 leading-tight">
                  {farmName}
                </h1>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>7/12 Verified Producer</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-agri-600 shrink-0" />
                <span>{farmer.village}, {farmer.district}, {farmer.state}</span>
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-stone-600 font-semibold">
                <span className="bg-earth-100 px-2.5 py-1 rounded-lg">Land: {farmer.land_area_acres} Acres</span>
                <span className="bg-earth-100 px-2.5 py-1 rounded-lg">Rating: ★ {farmer.rating}</span>
                <span className="bg-earth-100 px-2.5 py-1 rounded-lg">{products.length} Active Listings</span>
              </div>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Inquire on WhatsApp</span>
          </a>
        </div>

        {/* Farmer Story */}
        <div className="border-t border-earth-100 pt-4 space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">About the Farm & Practices</h3>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{story}</p>
        </div>
      </div>

      {/* Produce Catalog for this Farmer */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Current Farm Harvest ({products.length})
          </h2>
          <p className="text-xs text-stone-500">Pick-to-order direct from {farmer.farm_name}</p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-xs text-stone-400 border border-earth-200">
            No active produce listed by this farm at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

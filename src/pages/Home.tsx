import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  Scale, 
  HeartHandshake, 
  MapPin, 
  CheckCircle,
  Tractor
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { marketplaceService } from '../services/marketplaceService';
import { Product, Category, FarmerProfile } from '../types';
import { ProductCard } from '../components/marketplace/ProductCard';
import { CategoryBar } from '../components/marketplace/CategoryBar';

export const Home: React.FC = () => {
  const { t, language } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodList, catList, farmList] = await Promise.all([
          marketplaceService.getProducts(),
          marketplaceService.getCategories(),
          marketplaceService.getFarmers(),
        ]);
        setProducts(prodList);
        setCategories(catList);
        setFarmers(farmList);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-agri-950 via-agri-900 to-agri-800 text-white pt-8 pb-14 px-4 sm:px-6 rounded-b-[2.5rem] shadow-soft">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl space-y-4">
            {/* Service Area Pill */}
            <div className="inline-flex items-center gap-2 bg-agri-800/80 border border-agri-600/60 px-3 py-1 rounded-full text-xs font-semibold text-agri-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{t.home.serviceAreaBadge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t.home.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-agri-100/90 leading-relaxed max-w-xl">
              {t.home.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/marketplace"
                className="px-6 py-3.5 rounded-xl bg-saffron-600 hover:bg-saffron-500 active:scale-95 text-white font-bold text-sm shadow-lifted flex items-center gap-2 transition"
              >
                <span>{t.home.exploreMarket}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/farmer/register"
                className="px-5 py-3.5 rounded-xl bg-agri-800/80 hover:bg-agri-700 active:scale-95 text-agri-100 border border-agri-600/70 font-semibold text-sm flex items-center gap-2 transition"
              >
                <Tractor className="w-4 h-4 text-agri-300" />
                <span>{t.home.farmerRegister}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Ambient Farm Motif glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Categories Strip */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              {t.home.categoriesTitle}
            </h2>
            <Link to="/marketplace" className="text-xs font-bold text-agri-700 hover:underline">
              {t.common.viewAll} →
            </Link>
          </div>
          <CategoryBar
            categories={categories}
            onSelectCategory={(catId) => {
              window.location.href = `/marketplace?category=${catId}`;
            }}
          />
        </section>

        {/* Fresh Today Highlights */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <span>{t.home.freshArrivals}</span>
                <span className="text-xs font-semibold bg-saffron-100 text-saffron-800 px-2 py-0.5 rounded-full">
                  Harvested Today
                </span>
              </h2>
              <p className="text-xs text-stone-500">Pick-to-order from Dindori & Niphad farms</p>
            </div>
            <Link to="/marketplace" className="text-xs font-bold text-agri-700 hover:underline">
              {t.common.viewAll} →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-earth-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Why Choose FarmDirect (Value Proposition) */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-earth-200 shadow-soft">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {t.home.whyDirectTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Engineered for true farmer empowerment and genuine consumer freshness in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-earth-50 border border-earth-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-700 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">{t.home.whyDirect1Title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t.home.whyDirect1Desc}</p>
            </div>

            <div className="p-5 rounded-2xl bg-earth-50 border border-earth-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">{t.home.whyDirect2Title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t.home.whyDirect2Desc}</p>
            </div>

            <div className="p-5 rounded-2xl bg-earth-50 border border-earth-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-stone-900">{t.home.whyDirect3Title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t.home.whyDirect3Desc}</p>
            </div>
          </div>
        </section>

        {/* Meet Verified Farmers */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                {t.home.topFarmers}
              </h2>
              <p className="text-xs text-stone-500">7/12 Land Verified agricultural producers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {farmers.map((farmer) => (
              <Link
                key={farmer.id}
                to={`/farmer/${farmer.id}`}
                className="bg-white rounded-2xl p-5 border border-earth-200 hover:border-agri-400 hover:shadow-lifted transition-all flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-earth-100 overflow-hidden shrink-0 border border-earth-300">
                  <img
                    src={farmer.user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                    alt={farmer.farm_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-sm text-stone-900 truncate">
                      {language === 'hi' && farmer.farm_name_hi ? farmer.farm_name_hi : farmer.farm_name}
                    </h3>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>{t.common.verifiedFarmer}</span>
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-agri-600" />
                    <span>{farmer.village}, {farmer.district} • {farmer.land_area_acres} Acres</span>
                  </p>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                    {language === 'hi' && farmer.story_hi ? farmer.story_hi : farmer.story}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, ArrowLeft, MessageCircle } from 'lucide-react';
import { farmerService } from './farmer.service';
import { FarmerProfile, Product } from './farmer.types';
import { ProductCard } from '../products/ProductCard';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import './farmer.css';

export const FarmerPublicProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [farm, prods] = await Promise.all([
          farmerService.getFarmerProfile(id),
          farmerService.getFarmerProducts(id),
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
      <div className="page-container flex justify-center py-12">
        <Loader size="lg" text="Loading farm producer profile..." />
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="page-container py-12 text-center">
        <h2 className="heading-2 mb-2">Farmer Profile Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Explore Marketplace
        </Button>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello ${farmer.farm_name}, I saw your harvest listings on FarmDirect.`
  );

  return (
    <div className="page-container farmer-dashboard">
      <button className="checkout-header-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Farm Banner */}
      <div className="farmer-hero-card">
        <div>
          <h1 className="farmer-hero-title">{farmer.farm_name}</h1>
          <p className="farmer-hero-subtitle flex items-center gap-1 mt-1">
            <MapPin size={14} /> {farmer.village}, {farmer.taluka || farmer.taluka_or_tehsil || 'Nashik'}, {farmer.district} (
            {farmer.land_area_acres} Acres)
          </p>
          {farmer.story && <p className="text-sm mt-3 text-white/90">{farmer.story}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <span className="farmer-verification-tag">
            <ShieldCheck size={16} /> 7/12 Land Record Verified
          </span>
          <a
            href={`https://wa.me/91${farmer.phone || farmer.user?.phone || '9822012345'}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="accent" size="sm">
              <MessageCircle size={14} /> WhatsApp Farmer
            </Button>
          </a>
        </div>
      </div>

      <h2 className="heading-3 mb-4">Fresh Harvests by {farmer.farm_name} ({products.length})</h2>
      <div className="grid-products">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

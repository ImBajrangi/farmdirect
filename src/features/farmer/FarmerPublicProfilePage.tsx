import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  ArrowLeft,
  MessageCircle,
  Star,
  Share2,
  Check,
} from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

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

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

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

  const farmerName = farmer.user?.full_name || 'Ramesh Patil';
  const whatsappMessage = encodeURIComponent(
    `Hello ${farmer.farm_name}, I saw your listings on FarmDirect and would like to place an order.`
  );

  // Clean deduplicated location string: avoids "Dindori, Dindori, Nashik"
  const locationParts = [farmer.village, farmer.taluka || farmer.taluka_or_tehsil, farmer.district]
    .filter(Boolean)
    .filter((val, idx, arr) => arr.indexOf(val) === idx);
  const locationString = locationParts.join(', ');

  // Get initials for brand mark
  const initials = farmer.farm_name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="page-container farmer-profile-view">
      {/* Back Navigation */}
      <button
        type="button"
        className="farmer-nav-back"
        onClick={() => navigate('/products')}
      >
        <ArrowLeft size={14} /> <span>Back to Marketplace</span>
      </button>

      {/* Clean White SaaS Profile Card */}
      <div className="producer-profile-card">
        {/* Top Header Row: Identity + Action Buttons */}
        <div className="producer-header-row">
          <div className="producer-identity">
            {/* Brand Mark Emblem */}
            <div className="producer-brand-mark" aria-hidden="true">
              {farmer.user?.avatar_url ? (
                <img
                  src={farmer.user.avatar_url}
                  alt={farmer.farm_name}
                  className="producer-avatar-img"
                />
              ) : (
                <span className="brand-initials">{initials || 'FD'}</span>
              )}
            </div>

            {/* Core Details */}
            <div className="producer-details">
              <h1 className="producer-title">{farmer.farm_name}</h1>
              <p className="producer-grower-line">
                Cultivated by <strong>{farmerName} &amp; Family</strong>
              </p>

              <div className="producer-meta-row">
                <span className="meta-item">
                  <MapPin size={13} className="text-emerald-700" />
                  <span>{locationString} • {farmer.land_area_acres || 8.5} Acres</span>
                </span>
                <span className="meta-divider">•</span>
                <span className="meta-item rating">
                  <Star size={13} className="fill-amber-500 text-amber-500" />
                  <span>4.9 (48 orders)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Group */}
          <div className="producer-actions-group">
            <a
              href={`https://wa.me/91${farmer.phone || farmer.user?.phone || '9822012345'}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="producer-btn-primary"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Producer</span>
            </a>
            <button
              type="button"
              onClick={handleShare}
              className="producer-btn-secondary"
              title="Share producer profile"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
              <span>{copied ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Bio / Story (Integrated cleanly beneath divider) */}
        {farmer.story && (
          <div className="producer-bio-wrapper">
            <p className="producer-bio">{farmer.story}</p>
          </div>
        )}
      </div>

      {/* Produce Listings Section */}
      <section className="producer-products-section">
        <div className="producer-section-head">
          <h2 className="producer-section-title">
            Harvest Produce ({products.length})
          </h2>
        </div>

        <div className="producer-products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

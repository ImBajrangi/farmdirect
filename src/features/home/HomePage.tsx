import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ShoppingBag,
  Tractor,
  ThermometerSnowflake,
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  Play,
} from 'lucide-react';
import { productService } from '../products/product.service';
import { Product } from '../products/product.types';
import './home.css';

// Official Fruit Baskets vector icon (seed sprout droplet + 4 radiating citrus slices)
export const FruitBasketsLogoIcon: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 32,
  className = '',
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={Math.round(size * (148.378 / 173))}
    viewBox="0 0 173 148.378"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    aria-label="Fruit Baskets Logo"
  >
    <g id="Fresh_x5F_Fruit_x5F_Baskets">
      <g>
        {/* Top seed sprout droplet */}
        <path
          style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
          d="M86.408,49.213c-4.261-6.951-8.876-15.481-12.353-23.866c-1.653-3.986-3.883-9.299-2.279-14.631C73.398,5.328,79.34-0.55,87.128,0.041c7.96,0.604,14.392,6.463,14.392,14.871c0,3.421-1.482,6.834-2.638,9.714C95.415,33.262,90.84,41.753,86.408,49.213z"
        />
        {/* Top right citrus wedge */}
        <path
          style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
          d="M131.142,65.643c7.914-0.188,16.659-0.247,24.466-0.12c4.662,0.076,9.021-0.06,12.113,1.679c2.565,1.442,5.207,4.257,5.277,8.395c0.067,3.963-1.283,7.699-2.279,11.034c-1.948,6.524-4.617,12.876-7.915,18.589c-1.672,2.897-3.509,6.224-5.397,7.795c-3.277,2.727-8.71,2.952-12.593,0.479c-2.126-1.354-3.757-3.799-5.517-5.396c-5.592-5.078-10.818-10.672-16.191-16.191c-5.354-5.499-10.652-10.456-16.31-16.19c-1.727-1.751-4.391-4.018-4.078-6.716c0.241-2.074,2.892-3.155,5.396-3.358C115.515,65.044,124.473,65.801,131.142,65.643z"
        />
        {/* Top left citrus wedge */}
        <path
          style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
          d="M10.492,65.763c4.746-0.258,10.552-0.322,15.951-0.12c4.802,0.18,10.063-0.157,15.711,0c4.521,0.126,9.157,0.053,14.751,0.12c3.158,0.038,11.906-1.191,12.952,2.758c0.847,3.194-2.379,5.857-3.598,7.076c-9.161,9.162-18.103,17.566-27.344,27.224c-1.763,1.843-3.667,3.539-5.396,5.517c-1.652,1.888-3.623,4.288-5.517,5.397c-4.42,2.588-10.545,1.596-13.552-1.679c-1.686-1.837-3.211-5.043-4.677-7.676c-2.918-5.242-5.296-11.124-7.315-17.27c-1.112-3.383-2.792-7.846-2.399-12.232C0.518,69.747,5.048,66.059,10.492,65.763z"
        />
        {/* Bottom left citrus wedge */}
        <path
          style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
          d="M77.533,77.996c5.1-0.854,4.493,6.099,4.437,10.074c-0.095,6.797,0.053,13.052,0.12,20.748c0.046,5.223-0.091,10.191,0,14.991c0.091,4.777,0.423,9.546,0,14.392c-0.407,4.667-3.809,9.47-8.515,10.074c-3.776,0.485-7.783-0.84-11.394-1.799c-6.699-1.78-13.516-4.83-19.069-8.035c-3.119-1.801-7.204-4.04-8.755-6.477c-2.461-3.865-1.559-9.879,0.72-12.952c1.457-1.965,3.433-3.544,5.157-5.277c8.664-8.71,16.925-16.996,25.785-26.145c1.605-1.658,3.302-3.446,5.277-5.157C72.92,81.027,75.1,78.403,77.533,77.996z"
        />
        {/* Bottom right citrus wedge */}
        <path
          style={{ fillRule: 'evenodd', clipRule: 'evenodd' }}
          d="M93.724,77.996c3.348-0.71,5.297,2.566,7.436,4.317c2.128,1.743,3.763,3.523,5.396,5.157c8.703,8.704,17.759,17.782,26.385,26.385c3.338,3.33,9.782,8.939,6.476,16.431c-1.491,3.378-5.306,5.61-8.755,7.555c-5.875,3.314-12.198,6.252-19.188,8.395c-6.113,1.874-13.58,3.6-17.75-0.84c-1.569-1.671-2.741-4.222-2.998-7.436c-0.388-4.839-0.117-9.627-0.12-13.912c-0.005-7.552,0-17.538,0-26.625c0-4.437-0.419-9.451,0-14.152C90.814,80.944,91.55,78.457,93.724,77.996z"
        />
      </g>
    </g>
  </svg>
);

// Backward compatibility alias
export const XFarmLogoIcon = FruitBasketsLogoIcon;

interface ProduceCurationItem {
  origin: string;
  desc: string;
  image: string;
}

const PRODUCE_CURATION: Record<string, ProduceCurationItem> = {
  'prod-onion-1': {
    origin: 'Nashik · Ramesh Patil',
    desc: 'Crisp, pungent winter-harvested red onions naturally cured under shade.',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=700&q=80',
  },
  'prod-grapes-1': {
    origin: 'Dindori · Patil Agro',
    desc: 'Sweet, thin-skinned table grapes plucked fresh with zero synthetic chemicals.',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=700&q=80',
  },
  'prod-spinach-1': {
    origin: 'Niphad · Shinde Farm',
    desc: 'Tender dark green spinach leaves harvested with roots intact for peak crispness.',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=80',
  },
  'prod-wheat-1': {
    origin: 'Niphad Women Collective',
    desc: 'Unpolished golden grain Lokwan wheat, stone-cleaned for ultra-soft rotis.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=700&q=80',
  },
  'prod-ghee-1': {
    origin: 'Grass-Fed Gir Sanctuary',
    desc: 'Traditional wood-churned curd bilona ghee with rich golden granular texture.',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=700&q=80',
  },
  'prod-tomato-1': {
    origin: 'Godavari River Basin',
    desc: 'Tangy, juicy field tomatoes with authentic tart sweetness ripened naturally on vines.',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80',
  },
};

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeNav, setActiveNav] = useState<'harvest' | 'baskets' | 'farms' | 'coldchain' | 'trust'>('harvest');
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [tonnageIndex, setTonnageIndex] = useState<number>(0);
  const tonnages = [120, 240, 360, 480];

  useEffect(() => {
    async function loadData() {
      try {
        const prodList = await productService.getProducts();
        setProducts(prodList);
      } catch (err) {
        console.error('Failed to load home products', err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="xfarm-page-wrapper">
      <div className="xfarm-master-card">
        {/* ─── 1. Header Navigation ───────────────────────────────────────── */}
        <header className="xfarm-header-nav">
          <Link to="/" className="xfarm-brand-lockup">
            <FruitBasketsLogoIcon size={34} color="#0F2E22" />
            <span className="xfarm-brand-text">Fruit Baskets</span>
          </Link>

          {/* Center Floating Segmented Theme-Relatable Pill Nav */}
          <nav className="xfarm-pill-nav" aria-label="Main Navigation">
            <Link
              to="/marketplace"
              className={`xfarm-nav-link ${activeNav === 'harvest' ? 'active-lime' : ''}`}
              onClick={() => setActiveNav('harvest')}
            >
              <Sprout size={15} />
              <span>Fresh Harvest</span>
            </Link>
            <Link
              to="/marketplace?category=fruits"
              className={`xfarm-nav-link ${activeNav === 'baskets' ? 'active-lime' : ''}`}
              onClick={() => setActiveNav('baskets')}
            >
              <ShoppingBag size={15} />
              <span>Fruit Baskets</span>
            </Link>
            <Link
              to="/farmers"
              className={`xfarm-nav-link ${activeNav === 'farms' ? 'active' : ''}`}
              onClick={() => setActiveNav('farms')}
            >
              <Tractor size={15} />
              <span>Verified Farms</span>
            </Link>
            <a
              href="#cold-chain"
              className={`xfarm-nav-link ${activeNav === 'coldchain' ? 'active' : ''}`}
              onClick={() => setActiveNav('coldchain')}
            >
              <ThermometerSnowflake size={15} />
              <span>24h Cold-Chain</span>
            </a>
            <Link
              to="/platform"
              className={`xfarm-nav-link ${activeNav === 'trust' ? 'active' : ''}`}
              onClick={() => setActiveNav('trust')}
            >
              <ShieldCheck size={15} />
              <span>7/12 Land Verified</span>
            </Link>
          </nav>

          {/* Right Action CTA */}
          <Link to="/marketplace" className="xfarm-header-cta">
            <span>Order Farm Fresh</span>
          </Link>
        </header>

        {/* ─── 2. Hero Headline: "What Is Our Success?" ────────────────────── */}
        <div className="xfarm-hero-heading-row">
          <h1 className="xfarm-main-title">What Is Our Success?</h1>
          <Link to="/about" className="xfarm-learn-more-link">
            <span>Learn More</span>
            <span>⟶</span>
          </Link>
        </div>

        {/* ─── 3. Two-Column Hero Showcase Grid ───────────────────────────── */}
        <div className="xfarm-showcase-grid">
          {/* ─── Column 1: Left Carrot Harvest Impact Card ────────────────── */}
          <div className="xfarm-harvest-card">
            {/* Top Text & Badges */}
            <div className="xfarm-card-top-header">
              <h2 className="xfarm-card-title">
                New Opportunities For <br />
                <span className="agricultural-pill">Agricultural</span> Production
              </h2>

              <div className="xfarm-floating-tags-col">
                <div className="xfarm-pill-badge">
                  <span className="xfarm-mini-thumb">🌱</span>
                  <span>Direct Farmgate · 2026</span>
                </div>
              </div>
            </div>

            {/* High-Resolution Carrots Background Image */}
            <img
              src="/images/carrots_harvest.jpg"
              alt="Fresh organic carrot harvest"
              className="xfarm-harvest-img-bg"
              loading="eager"
            />
            {/* Seamless Luxury Scrim Overlay */}
            <div className="xfarm-harvest-scrim" />

            {/* Bottom Row: Metric Card & Controls */}
            <div className="xfarm-bottom-metric-row">
              <div className="xfarm-metric-card-white">
                <div className="xfarm-metric-kicker-row">
                  <span className="xfarm-live-dot" />
                  <span className="xfarm-metric-kicker-text">Live Farmgate Volume</span>
                </div>

                <div className="xfarm-metric-value-row">
                  <span className="xfarm-metric-num">{tonnages[tonnageIndex]}</span>
                  <span className="xfarm-metric-unit">tons / mo</span>
                </div>

                <div className="xfarm-metric-progress-track">
                  <div className="xfarm-metric-progress-fill" style={{ width: '84%' }} />
                </div>

                <p className="xfarm-metric-desc">
                  Direct farmgate yields dispatched to verified regional fruit baskets
                </p>
              </div>

              {/* Unified Floating Action Controls */}
              <div className="xfarm-floating-actions">
                <Link
                  to="/marketplace"
                  className="xfarm-hero-explore-btn"
                  title="Explore Fresh Produce"
                >
                  <span>Explore Produce</span>
                  <ArrowRight size={15} />
                </Link>

                <a
                  href="#bento-ecosystem"
                  className="xfarm-hero-scroll-btn"
                  title="Scroll to Ecosystem"
                  aria-label="Scroll Down"
                >
                  <ArrowDown size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* ─── Column 2: Right Lime Card with Smartphone Mockup ─────────── */}
          <div className="xfarm-innovation-card">
            <div className="xfarm-polka-bg" />

            <div className="xfarm-phone-frame">
              {/* Speaker Notch */}
              <div className="xfarm-phone-notch" />

              <h3 className="xfarm-phone-header-title">
                Innovations In<br />Vertical Farming!
              </h3>

              {/* Segmented slider track with play arrow */}
              <div className="xfarm-phone-slider-track">
                <span
                  onClick={() => setActiveSlide(0)}
                  className={`xfarm-slider-dash ${activeSlide === 0 ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                />
                <span
                  onClick={() => setActiveSlide(1)}
                  className={`xfarm-slider-dash ${activeSlide === 1 ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                />
                <div className="xfarm-slider-play-arrow">
                  <Play size={10} fill="#B8D72E" color="#B8D72E" />
                </div>
                <span
                  onClick={() => setActiveSlide(2)}
                  className={`xfarm-slider-dash ${activeSlide === 2 ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                />
                <span
                  onClick={() => setActiveSlide(3)}
                  className={`xfarm-slider-dash ${activeSlide === 3 ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              {/* Two Vertical Feature Cards with Transparent Food Pics */}
              <div className="xfarm-phone-dual-cards">
                {/* Card 1: Periwinkle Sky Blue with Transparent Potato Chaat Bowl */}
                <Link to="/marketplace" className="xfarm-mini-feature-card sky">
                  <h4 className="xfarm-mini-card-headline">
                    Farm-to-Table<br />Pure Delights
                  </h4>

                  <div className="xfarm-mini-card-img-wrap transparent-bg">
                    <img
                      src="/images/foody/potato_bowl.png"
                      alt="Artisanal Potato Chaat Bowl"
                      className="xfarm-mini-card-food-img"
                    />
                    <span className="xfarm-mini-pill-btn">
                      <span>Explore</span>
                      <span style={{ fontSize: '7px' }}>•</span>
                    </span>
                  </div>

                  <p className="xfarm-mini-card-footer-text">
                    Pure Spices & Fresh Roots
                  </p>
                </Link>

                {/* Card 2: Deep Pine Forest Green with Transparent Vegetable Biryani */}
                <Link to="/marketplace" className="xfarm-mini-feature-card forest">
                  <h4 className="xfarm-mini-card-headline light">
                    Wood-Fired<br />Pure Harvest
                  </h4>

                  <div className="xfarm-mini-card-img-wrap transparent-bg">
                    <img
                      src="/images/foody/veggie_biryani.png"
                      alt="Antique Copper Bowl of Vegetable Biryani"
                      className="xfarm-mini-card-food-img"
                    />
                    <span className="xfarm-mini-pill-btn">
                      <span>More</span>
                      <span style={{ fontSize: '7px' }}>•</span>
                    </span>
                  </div>

                  <p className="xfarm-mini-card-footer-text" style={{ color: '#E0F2E9' }}>
                    100% Farm-Direct Grains
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 4. Brand Ecosystem Bento Grid ──────────────────────────────── */}
        <section id="bento-ecosystem" className="xfarm-bento-section">
          <div className="xfarm-section-header">
            <div>
              <span className="xfarm-section-eyebrow">Design System & Philosophy</span>
              <h2 className="xfarm-section-title">From The Field To The Sky</h2>
            </div>
            <Link to="/marketplace" className="xfarm-learn-more-link">
              <span>View All Produce</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="xfarm-bento-grid">
            {/* Tile 1: Giant Lime Banner Card */}
            <div className="xfarm-bento-lime-banner">
              <div className="xfarm-lime-brand-top">
                <FruitBasketsLogoIcon size={46} color="#0F2E22" />
                <div>
                  <h3 className="xfarm-lime-brand-title">Fruit Baskets</h3>
                  <div className="xfarm-lime-brand-sub">pure farmgate produce</div>
                </div>
              </div>

              <div className="xfarm-lime-banner-footer">
                <div className="xfarm-font-specimen">
                  <span>ABC</span>
                  <span className="xfarm-specimen-pill">Mazzard Light</span>
                </div>
                <span className="xfarm-sprouts-tagline">seed sprout + citrus slices</span>
              </div>
            </div>

            {/* Tile 2: Transparent Food Spotlight: Matar Paneer */}
            <div className="xfarm-bento-food-spotlight">
              <img
                src="/images/foody/matar_paneer.png"
                alt="Matar Paneer in Ornate Copper Bowl"
                className="xfarm-floating-food-img"
                loading="lazy"
              />
              <div>
                <h4 className="xfarm-food-spotlight-title">Matar Paneer Curry</h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#536F61' }}>
                  Farm cottage cheese & sweet peas in &lt; 18h
                </p>
              </div>
            </div>

            {/* Tile 3: Stacked Cards with Slogan Pill */}
            <div className="xfarm-bento-field-card">
              <div className="xfarm-scattered-cards-bg">
                <div className="xfarm-scatter-card blue">
                  <span style={{ fontSize: '0.625rem', opacity: 0.7 }}>DIRECT</span>
                  <div style={{ marginTop: '16px' }}>Fruit Baskets</div>
                </div>
                <div className="xfarm-scatter-card forest">
                  <FruitBasketsLogoIcon size={20} color="#FFFFFF" />
                  <div style={{ marginTop: '14px', fontSize: '0.625rem' }}>100% Farmgate</div>
                </div>
                <div className="xfarm-scatter-card forest-alt">
                  <span style={{ fontSize: '0.625rem', opacity: 0.8 }}>ZERO MIDDLEMEN</span>
                </div>
              </div>
              <div className="xfarm-floating-slogan-pill">
                From the field to your table!
              </div>
            </div>

            {/* Tile 4: Transparent Chaat Bowl Spotlight */}
            <div className="xfarm-bento-chaat-card">
              <img
                src="/images/foody/potato_bowl.png"
                alt="Vibrant Garnished Potato Chaat Bowl"
                className="xfarm-floating-food-img"
                style={{ maxHeight: '110px' }}
                loading="lazy"
              />
              <h4 className="xfarm-food-spotlight-title" style={{ fontSize: '1rem', marginTop: '8px' }}>
                Artisanal Chaat Bowl
              </h4>
            </div>

            {/* Tile 5: 75 Tons Deep Forest Card */}
            <div className="xfarm-bento-forest-card">
              <div className="xfarm-forest-top-row">
                <p className="xfarm-forest-sub">
                  direct farmgate harvest dispatched monthly
                </p>
                <FruitBasketsLogoIcon size={26} color="rgba(255, 255, 255, 0.7)" />
              </div>
              <div className="xfarm-forest-num-row">
                <span className="xfarm-forest-huge-num">75</span>
                <span className="xfarm-forest-huge-unit">tons</span>
              </div>
            </div>

            {/* Tile 6: Blueprint Construction Card */}
            <div className="xfarm-bento-blueprint-card">
              <div className="xfarm-blueprint-grid">
                <FruitBasketsLogoIcon size={38} color="#FFFFFF" />
                <span className="xfarm-blueprint-text">Fruit Baskets</span>
              </div>
            </div>

            {/* Tile 7: Transparent Terracotta Rasgulla Card */}
            <div className="xfarm-bento-rasgulla-card">
              <img
                src="/images/foody/terracotta_rasgulla.png"
                alt="Terracotta Bowl of Garnished Rasgulla"
                className="xfarm-floating-food-img"
                style={{ maxHeight: '95px' }}
                loading="lazy"
              />
              <h4 className="xfarm-food-spotlight-title" style={{ fontSize: '0.9375rem', marginTop: '6px' }}>
                Terracotta Rasgulla
              </h4>
            </div>

            {/* Tile 8: Transparent Food Spotlight: Heritage Biryani Feast */}
            <Link to="/marketplace" className="xfarm-bento-feast-card">
              <div className="xfarm-feast-text-col">
                <h4 className="xfarm-feast-title">Vegetable Biryani</h4>
                <p className="xfarm-feast-desc">
                  Farm vegetables, saffron &amp; heritage basmati
                </p>
                <span className="xfarm-feast-link">
                  <span>Explore Dish</span>
                  <ArrowRight size={13} />
                </span>
              </div>
              <div className="xfarm-feast-img-wrap">
                <img
                  src="/images/foody/veggie_biryani.png"
                  alt="Antique Copper Bowl of Vegetable Biryani"
                  className="xfarm-floating-feast-img"
                  loading="lazy"
                />
              </div>
            </Link>
          </div>
        </section>

        {/* ─── 5. Featured Fresh Crops Catalog Strip ───────────────────────── */}
        <section className="xfarm-produce-section">
          <div className="xfarm-section-header">
            <div>
              <span className="xfarm-section-eyebrow">Direct Farmgate Sourcing</span>
              <h2 className="xfarm-section-title">Fresh Harvest Ready For Dispatch</h2>
            </div>
            <Link to="/marketplace" className="xfarm-learn-more-link">
              <span>Open Catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="xfarm-produce-grid">
            {products.slice(0, 6).map((product) => {
              const curation = PRODUCE_CURATION[product.id] || {
                origin: 'Verified Regional Farm',
                desc: product.description || 'Pure farmgate produce directly from verified growers.',
                image: product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
              };

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.slug || product.id}`}
                  className="xfarm-produce-card"
                >
                  <div className="xfarm-produce-img-wrap">
                    <img
                      src={curation.image}
                      alt={product.name}
                      className="xfarm-produce-img"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="xfarm-produce-name">{product.name}</h4>
                  <p className="xfarm-produce-meta">
                    <span className="xfarm-produce-price">₹{Math.round(product.price_paise / 100)}</span>
                    <span className="xfarm-produce-unit">/ {product.unit || 'kg'}</span>
                    <span className="xfarm-produce-dot">·</span>
                    <span>{curation.origin}</span>
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ─── 6. Master CTA Band ─────────────────────────────────────────── */}
        <section className="xfarm-master-cta-band">
          <div>
            <h3 className="xfarm-cta-band-title">
              Experience Pure Farmgate Produce.
            </h3>
            <p className="xfarm-cta-band-desc">
              Direct from verified growers with zero middlemen, algorithmic cold-chain routing, and 100% direct UPI settlement.
            </p>
          </div>

          <div className="xfarm-cta-band-buttons">
            <Link to="/marketplace" className="xfarm-btn-lime">
              <span>Explore Marketplace</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/farmer/register" className="xfarm-btn-outline-white">
              <span>Sell as Producer</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

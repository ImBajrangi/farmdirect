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
  Pause,
} from 'lucide-react';
import { productService } from '../products/product.service';
import { Product } from '../products/product.types';
import { FruitBasketsLogoIcon } from '../../components/common/FruitBasketsLogoIcon';
import './home.css';

export { FruitBasketsLogoIcon };

// Backward compatibility alias
export const XFarmLogoIcon = FruitBasketsLogoIcon;

interface ProduceCurationItem {
  origin: string;
  desc: string;
  image: string;
  fallbackImage: string;
}

const PRODUCE_CURATION: Record<string, ProduceCurationItem> = {
  'prod-onion-1': {
    origin: 'Nashik · Ramesh Patil',
    desc: 'Crisp, pungent winter-harvested red onions naturally cured under shade.',
    image: '/images/bell_peppers.png',
    fallbackImage: '/images/bell_peppers.png',
  },
  'prod-grapes-1': {
    origin: 'Dindori · Patil Agro',
    desc: 'Sweet, thin-skinned table grapes plucked fresh with zero synthetic chemicals.',
    image: '/images/fresh_apples.png',
    fallbackImage: '/images/fresh_apples.png',
  },
  'prod-spinach-1': {
    origin: 'Niphad · Shinde Farm',
    desc: 'Tender dark green spinach leaves harvested with roots intact for peak crispness.',
    image: '/images/hydroponic_greens.png',
    fallbackImage: '/images/hydroponic_greens.png',
  },
  'prod-wheat-1': {
    origin: 'Niphad Women Collective',
    desc: 'Unpolished golden grain Lokwan wheat, stone-cleaned for ultra-soft rotis.',
    image: '/images/harvest_basket.png',
    fallbackImage: '/images/harvest_basket.png',
  },
  'prod-ghee-1': {
    origin: 'Grass-Fed Gir Sanctuary',
    desc: 'Traditional wood-churned curd bilona ghee with rich golden granular texture.',
    image: '/images/aromatic_basil.png',
    fallbackImage: '/images/carrots_harvest.jpg',
  },
  'prod-tomato-1': {
    origin: 'Godavari River Basin',
    desc: 'Tangy, juicy field tomatoes with authentic tart sweetness ripened naturally on vines.',
    image: '/images/vine_tomatoes.png',
    fallbackImage: '/images/vine_tomatoes.png',
  },
};

interface SlideCard {
  title: string;
  image: string;
  alt: string;
  footer: string;
  themeClass: 'sky' | 'forest';
}

interface VerticalFarmingSlide {
  kicker: string;
  card1: SlideCard;
  card2: SlideCard;
}

const VERTICAL_FARMING_SLIDES: VerticalFarmingSlide[] = [
  {
    kicker: 'Section 01 · Micro-Farming',
    card1: {
      title: 'Nutrient-Dense\nMicrogreens',
      image: '/images/microgreens.png',
      alt: 'Living Root Organic Microgreens',
      footer: 'Living roots · Harvested daily',
      themeClass: 'sky',
    },
    card2: {
      title: 'Aeroponic\nStrawberries',
      image: '/images/strawberries.png',
      alt: 'Aeroponic Red Strawberries',
      footer: 'Mist-grown · Sweet sun-ripened',
      themeClass: 'forest',
    },
  },
  {
    kicker: 'Section 02 · Hydroponic Greens',
    card1: {
      title: 'Hydroponic\nGreens',
      image: '/images/hydroponic_greens.png',
      alt: 'Fresh Hydroponic Leafy Greens',
      footer: 'Soil-free · 95% less water',
      themeClass: 'sky',
    },
    card2: {
      title: 'Vine-Ripened\nCrops',
      image: '/images/vine_tomatoes.png',
      alt: 'Vine-Ripened Farm Tomatoes',
      footer: 'Zero pesticide · Natural sun',
      themeClass: 'forest',
    },
  },
  {
    kicker: 'Section 03 · Climate-Controlled Herbs',
    card1: {
      title: 'Dutch Sweet\nBell Peppers',
      image: '/images/bell_peppers.png',
      alt: 'Dutch Sweet Bell Peppers',
      footer: 'Zero residue · Crisp & sweet',
      themeClass: 'forest',
    },
    card2: {
      title: 'Aromatic Herb\nClusters',
      image: '/images/aromatic_basil.png',
      alt: 'Fresh Italian Sweet Basil',
      footer: 'Pure sweet basil · High aroma',
      themeClass: 'sky',
    },
  },
  {
    kicker: 'Section 04 · Orchard & Field Fresh',
    card1: {
      title: 'Field Crisp\nAsparagus',
      image: '/images/fresh_asparagus.png',
      alt: 'Crisp Green Asparagus Spears',
      footer: 'Morning cut · <18h delivery',
      themeClass: 'sky',
    },
    card2: {
      title: 'Royal Orchard\nApples',
      image: '/images/fresh_apples.png',
      alt: 'Royal Crisp Orchard Apples',
      footer: 'Direct orchard · Wax-free crisp',
      themeClass: 'forest',
    },
  },
];

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeNav, setActiveNav] = useState<'harvest' | 'baskets' | 'farms' | 'coldchain' | 'trust'>('harvest');
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [tonnageIndex, setTonnageIndex] = useState<number>(0);
  const tonnages = [120, 240, 360, 480];

  // Auto-advance vertical farming carousel every 3.8s when playing and not hovered
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % VERTICAL_FARMING_SLIDES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered]);

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

    // Live Database Sync Listener: automatically refresh when DB changes
    const handleDataChanged = () => {
      loadData();
    };
    window.addEventListener('farmdirect:data-changed', handleDataChanged);
    return () => window.removeEventListener('farmdirect:data-changed', handleDataChanged);
  }, []);

  const currentSlide = VERTICAL_FARMING_SLIDES[activeSlide] || VERTICAL_FARMING_SLIDES[0];

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

        {/* ─── Mobile Horizontal Scrollable Chip Rail ──────────────────────── */}
        <nav className="xfarm-mobile-chips-wrapper" aria-label="Mobile Sections">
          <div className="xfarm-mobile-chips-track">
            <Link
              to="/marketplace"
              className={`xfarm-chip-pill ${activeNav === 'harvest' ? 'active' : ''}`}
              onClick={() => setActiveNav('harvest')}
            >
              <Sprout size={13} />
              <span>Fresh Harvest</span>
            </Link>
            <Link
              to="/marketplace?category=fruits"
              className={`xfarm-chip-pill ${activeNav === 'baskets' ? 'active' : ''}`}
              onClick={() => setActiveNav('baskets')}
            >
              <ShoppingBag size={13} />
              <span>Fruit Baskets</span>
            </Link>
            <Link
              to="/farmers"
              className={`xfarm-chip-pill ${activeNav === 'farms' ? 'active' : ''}`}
              onClick={() => setActiveNav('farms')}
            >
              <Tractor size={13} />
              <span>Verified Farms</span>
            </Link>
            <a
              href="#cold-chain"
              className={`xfarm-chip-pill ${activeNav === 'coldchain' ? 'active' : ''}`}
              onClick={() => setActiveNav('coldchain')}
            >
              <ThermometerSnowflake size={13} />
              <span>24h Cold-Chain</span>
            </a>
            <Link
              to="/platform"
              className={`xfarm-chip-pill ${activeNav === 'trust' ? 'active' : ''}`}
              onClick={() => setActiveNav('trust')}
            >
              <ShieldCheck size={13} />
              <span>7/12 Land Verified</span>
            </Link>
          </div>
        </nav>

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

            <div
              className="xfarm-phone-frame"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Speaker Notch */}
              <div className="xfarm-phone-notch" />

              <h3 className="xfarm-phone-header-title">
                Innovations In<br />Vertical Farming!
              </h3>

              {/* Segmented slider track with play/pause arrow */}
              <div className="xfarm-phone-slider-track">
                <button
                  type="button"
                  onClick={() => setActiveSlide(0)}
                  className={`xfarm-slider-dash ${activeSlide === 0 ? 'active' : ''}`}
                  aria-label="Section 1: Microgreens and Strawberries"
                  title="Section 1: Microgreens & Strawberries"
                />
                <button
                  type="button"
                  onClick={() => setActiveSlide(1)}
                  className={`xfarm-slider-dash ${activeSlide === 1 ? 'active' : ''}`}
                  aria-label="Section 2: Hydroponic Greens and Vine Tomatoes"
                  title="Section 2: Hydroponics & Vine-Ripened"
                />
                <button
                  type="button"
                  className="xfarm-slider-play-arrow"
                  onClick={() => setIsPlaying((p) => !p)}
                  title={isPlaying ? 'Pause Auto-slide' : 'Resume Auto-slide'}
                  aria-label={isPlaying ? 'Pause Auto-slide' : 'Resume Auto-slide'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  {isPlaying ? (
                    <Pause size={10} fill="#B8D72E" color="#B8D72E" />
                  ) : (
                    <Play size={10} fill="#B8D72E" color="#B8D72E" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide(2)}
                  className={`xfarm-slider-dash ${activeSlide === 2 ? 'active' : ''}`}
                  aria-label="Section 3: Bell Peppers and Basil Herbs"
                  title="Section 3: Bell Peppers & Basil Herbs"
                />
                <button
                  type="button"
                  onClick={() => setActiveSlide(3)}
                  className={`xfarm-slider-dash ${activeSlide === 3 ? 'active' : ''}`}
                  aria-label="Section 4: Field Asparagus and Orchard Apples"
                  title="Section 4: Field Asparagus & Apples"
                />
              </div>

              {/* Dynamic Vertical Feature Cards with Smooth Fade Transition */}
              <div key={activeSlide} className="xfarm-phone-dual-cards">
                {/* Card 1 */}
                <Link to="/marketplace" className={`xfarm-mini-feature-card ${currentSlide.card1.themeClass}`}>
                  <h4 className="xfarm-mini-card-headline">
                    {currentSlide.card1.title}
                  </h4>

                  <div className="xfarm-mini-card-img-wrap transparent-bg">
                    <img
                      src={currentSlide.card1.image}
                      alt={currentSlide.card1.alt}
                      className="xfarm-mini-card-food-img"
                    />
                  </div>

                  <p className="xfarm-mini-card-footer-text">
                    {currentSlide.card1.footer}
                  </p>
                </Link>

                {/* Card 2 */}
                <Link to="/marketplace" className={`xfarm-mini-feature-card ${currentSlide.card2.themeClass}`}>
                  <h4 className="xfarm-mini-card-headline">
                    {currentSlide.card2.title}
                  </h4>

                  <div className="xfarm-mini-card-img-wrap transparent-bg">
                    <img
                      src={currentSlide.card2.image}
                      alt={currentSlide.card2.alt}
                      className="xfarm-mini-card-food-img"
                    />
                  </div>

                  <p className="xfarm-mini-card-footer-text">
                    {currentSlide.card2.footer}
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
                  <span>DAILY</span>
                  <span className="xfarm-specimen-pill">Fresh Harvest</span>
                </div>
                <span className="xfarm-sprouts-tagline">crisp leafy greens + seasonal vegetables</span>
              </div>
            </div>

            {/* Tile 2: Fresh Produce Spotlight: Dutch Bell Peppers */}
            <div className="xfarm-bento-food-spotlight">
              <img
                src="/images/bell_peppers.png"
                alt="Crisp Dutch Bell Peppers"
                className="xfarm-floating-food-img"
                loading="lazy"
              />
              <div>
                <h4 className="xfarm-food-spotlight-title">Dutch Bell Peppers</h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#536F61' }}>
                  Crisp, sweet &amp; zero pesticide residue
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

            {/* Tile 4: Royal Orchard Apples Spotlight */}
            <div className="xfarm-bento-chaat-card">
              <img
                src="/images/fresh_apples.png"
                alt="Royal Crisp Orchard Apples"
                className="xfarm-floating-food-img"
                style={{ maxHeight: '110px' }}
                loading="lazy"
              />
              <div>
                <h4 className="xfarm-food-spotlight-title" style={{ fontSize: '1rem', marginTop: '5px' }}>
                  Royal Orchard Apples
                </h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#536F61' }}>
                  Wax-free, crisp &amp; sweet
                </p>
              </div>
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

            {/* Tile 6: Botanical Emblem Card */}
            <div className="xfarm-bento-blueprint-card">
              <div className="xfarm-blueprint-grid">
                <FruitBasketsLogoIcon size={38} color="#006044" />
                <span className="xfarm-blueprint-text">Fruit Baskets</span>
              </div>
            </div>

            {/* Tile 7: Aeroponic Strawberries Card */}
            <div className="xfarm-bento-rasgulla-card">
              <img
                src="/images/strawberries.png"
                alt="Sweet Aeroponic Strawberries"
                className="xfarm-floating-food-img"
                style={{ maxHeight: '95px' }}
                loading="lazy"
              />
              <div>
                <h4 className="xfarm-food-spotlight-title" style={{ fontSize: '0.9375rem', marginTop: '6px' }}>
                  Aeroponic Strawberries
                </h4>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#536F61' }}>
                  Mist-grown &amp; sweet
                </p>
              </div>
            </div>

            {/* Tile 8: Curated Seasonal Veggie Basket Spotlight */}
            <Link to="/marketplace" className="xfarm-bento-feast-card">
              <div className="xfarm-feast-img-wrap">
                <img
                  src="/images/harvest_basket.png"
                  alt="Farmgate Fresh Harvest Basket"
                  className="xfarm-floating-feast-img"
                  loading="lazy"
                />
              </div>
              <div className="xfarm-feast-text-col">
                <span className="xfarm-feast-badge">CURATED BASKET</span>
                <h4 className="xfarm-feast-title">Seasonal Veggie Basket</h4>
                <p className="xfarm-feast-desc">
                  Crisp root crops, fresh leafy greens &amp; orchard yields in &lt; 18h
                </p>
                <span className="xfarm-feast-link">
                  <span>Explore Baskets</span>
                  <ArrowRight size={13} />
                </span>
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
              const curation: ProduceCurationItem = PRODUCE_CURATION[product.id] || {
                origin: product.farmer?.farm_name || 'Verified Regional Farm',
                desc: product.description || 'Pure farmgate produce directly from verified growers.',
                image: product.images?.[0]?.image_url || '/images/bell_peppers.png',
                fallbackImage: '/images/bell_peppers.png',
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
                      loading="eager"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        const fallback = curation.fallbackImage || '/images/bell_peppers.png';
                        if (!target.src.endsWith(fallback)) {
                          target.src = fallback;
                        }
                      }}
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

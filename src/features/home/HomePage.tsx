import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Tractor,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Layers,
  ThermometerSnowflake,
  Clock,
  Coins,
} from 'lucide-react';
import { productService } from '../products/product.service';
import { Product } from '../products/product.types';
import { ProductCard } from '../products/ProductCard';
import { Button } from '../../components/common/Button';
import './home.css';

// Demo Example Tab Definitions (Section 6.4)
interface DemoExample {
  id: string;
  category: 'HARVEST' | 'LOGISTICS' | 'BULK';
  title: string;
  location: string;
  metric1: { label: string; value: string };
  metric2: { label: string; value: string };
  metric3: { label: string; value: string };
  caption: string;
}

const DEMO_EXAMPLES: DemoExample[] = [
  {
    id: 'ex-1',
    category: 'HARVEST',
    title: 'Dawn Field Harvest & Sorting',
    location: 'Pimpalgaon Baswant · Nashik District',
    metric1: { label: 'Harvest Age', value: '4.5 hrs' },
    metric2: { label: 'Direct Producer', value: '100% Payout' },
    metric3: { label: 'Cold-Chain Lock', value: '4.2°C' },
    caption: 'Verified grower crop picked at 5:30 AM, graded at farmgate shed with Mahabhulekh 7/12 authenticated tag.',
  },
  {
    id: 'ex-2',
    category: 'HARVEST',
    title: 'GI-Tagged Nashik Grapes Dispatch',
    location: 'Dindori Valley · Export Quality',
    metric1: { label: 'Brix Sugar Index', value: '18.5°' },
    metric2: { label: 'Pesticide Residue', value: '0.00 ppm' },
    metric3: { label: 'Farmgate Margin', value: '+34%' },
    caption: 'Direct orchard crates aggregated with automated digital weighment and instant UPI settlement.',
  },
  {
    id: 'ex-3',
    category: 'LOGISTICS',
    title: 'Nashik–Pune Reefer Corridor Transit',
    location: 'NH-60 Agro Cold-Chain Transit',
    metric1: { label: 'Transit Duration', value: '3 hrs 40 m' },
    metric2: { label: 'Reefer Temp', value: '3.8°C' },
    metric3: { label: 'Wastage Rate', value: '0.2%' },
    caption: 'Pre-cooled GPS-monitored vehicle dispatched straight to Western Pune distribution hubs without mandi halts.',
  },
  {
    id: 'ex-4',
    category: 'LOGISTICS',
    title: 'Hyperlocal Last-Mile Route Clustering',
    location: 'Kothrud & Baner Delivery Cluster',
    metric1: { label: 'Drop Efficiency', value: '98.6%' },
    metric2: { label: 'Carbon Offset', value: '-42%' },
    metric3: { label: 'Delivery Window', value: '< 24 hrs' },
    caption: 'Algorithmic route bundling batches neighbourhood orders into reusable insulated crates.',
  },
  {
    id: 'ex-5',
    category: 'BULK',
    title: 'Commercial Restaurant Sourcing',
    location: 'Pune Hospitality Supply Hub',
    metric1: { label: 'Order Lead Time', value: '18 hrs' },
    metric2: { label: 'Price vs Mandi', value: '-18%' },
    metric3: { label: 'GST Compliance', value: 'Instant' },
    caption: 'Bulk container lots of onions, tomatoes, and greens supplied directly to verified commercial kitchens.',
  },
];

// Department / Category Definitions (Section 6.9 & 6.10: 1:1 Aspect Ratio)
interface DepartmentItem {
  id: string;
  categoryParam: string;
  emoji: string;
  title: string;
  titleNative: string;
  description: string;
  spec: string;
}

const DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'dep-veg',
    categoryParam: 'cat-veg',
    emoji: '🥬',
    title: 'Organic Vegetables',
    titleNative: 'सेंद्रिय भाजीपाला',
    description: 'Harvested at dawn along Godavari riverbeds with verified PGS-India certification.',
    spec: 'Same-day cold dispatch',
  },
  {
    id: 'dep-fruit',
    categoryParam: 'cat-fruit',
    emoji: '🍇',
    title: 'Orchard Fresh Fruits',
    titleNative: 'बागेतील ताजी फळे',
    description: 'GI-tagged Nashik grapes, Junnar pomegranates, and Konkan mangoes direct from trees.',
    spec: 'Natural tree-ripened only',
  },
  {
    id: 'dep-grain',
    categoryParam: 'cat-grains',
    emoji: '🌾',
    title: 'Native Grains & Pulses',
    titleNative: 'देशी धान्य व कडधान्ये',
    description: 'Direct mill-unpolished Indrayani rice, Bhalia wheat, and desi unpolished tur dal.',
    spec: 'Stone ground & unpolished',
  },
  {
    id: 'dep-dairy',
    categoryParam: 'cat-dairy',
    emoji: '🥛',
    title: 'Farm Dairy & Cold-Pressed',
    titleNative: 'दुग्ध व घाण्याचे तेल',
    description: 'Pure Gir cow A2 milk and traditional wood-churned cold-pressed oils.',
    spec: 'Zero synthetic preservatives',
  },
  {
    id: 'dep-bulk',
    categoryParam: 'cat-bulk',
    emoji: '📦',
    title: 'Bulk Commercial Supply',
    titleNative: 'होलसेल खरेदी',
    description: 'Crate and container-grade agricultural sourcing for restaurants, canteens, and retailers.',
    spec: 'Mandi parity + GST invoices',
  },
];

// Use-Case Carousel Slides (Section 6.7)
interface UseCaseSlide {
  title: string;
  subtitle: string;
  description: string;
  metrics: string;
  linkText: string;
}

const USE_CASE_SLIDES: UseCaseSlide[] = [
  {
    title: 'Households & Apartment Societies',
    subtitle: 'Daily Farmgate Crates',
    description: 'Receive morning harvested greens and fresh kitchen staples before 7 AM with zero plastic wrapping and 100% farm source traceability.',
    metrics: 'Save 22% compared to supermarket markups',
    linkText: 'Explore Home Delivery →',
  },
  {
    title: 'Restaurants & Cloud Kitchens',
    subtitle: 'High-Volume Commercial Supply',
    description: 'Consistent grading, daily scheduled delivery slots, and automated GST billing that eliminates early-morning mandi bidding hassle.',
    metrics: 'Average ₹24,000 monthly procurement savings',
    linkText: 'Schedule Commercial Walkthrough →',
  },
  {
    title: 'Retail Grocers & FPO Aggregators',
    subtitle: 'Direct Cold-Chain Bulk Logistics',
    description: 'Pool demand with regional farmer-producer organisations to receive pre-graded crates directly into your storeroom without weight shrinkage.',
    metrics: '< 1% sorting loss vs 15% mandi shrinkage',
    linkText: 'Join Aggregator Network →',
  },
];

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>('ex-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isSlidePlaying, setIsSlidePlaying] = useState<boolean>(true);
  const [manifestoStep, setManifestoStep] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const prodList = await productService.getProducts();
        setProducts(prodList);
      } catch (err) {
        console.error('Failed to load home data', err);
      }
    }
    loadData();
  }, []);

  // Autoplay for Use-Case Carousel (Section 6.7 - WCAG User stoppable)
  useEffect(() => {
    if (!isSlidePlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % USE_CASE_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isSlidePlaying]);

  const selectedExample = DEMO_EXAMPLES.find((e) => e.id === activeTab) || DEMO_EXAMPLES[0];

  return (
    <div>
      {/* ─── 1. Dayos Hero Section ─────────────────────────────────────────── */}
      <section className="dayos-hero">
        <div className="page-container">
          <div className="hero-eyebrow-wrapper">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>Platform · Direct farm-to-table supply network</span>
            </div>
          </div>

          <h1 className="dayos-hero-title">
            DIRECT FROM THE SOIL.<br />
            NOT PASSED THROUGH 5 MIDDLEMEN.
          </h1>

          <p className="dayos-hero-desc">
            Connecting Maharashtra farmers directly with households, restaurants, and retail stores with guaranteed 24-hour harvest freshness and zero commission deductions.
          </p>

          <div className="dayos-proof-line">
            <span>Harvested in &lt;18 hours</span>
            <span>·</span>
            <span>0% middleman commission</span>
            <span>·</span>
            <span>1,200+ verified growers</span>
          </div>

          <div className="dayos-hero-actions">
            <Link to="/marketplace">
              <Button variant="primary" size="lg">
                Explore Marketplace <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/farmer/register" className="link-arrow">
              <Tractor size={16} />
              <span>Sell as Producer →</span>
            </Link>
          </div>

          {/* ─── 2. Hero Interactive Demo Player (Section 6.3) ─────────────── */}
          <div className="hero-player-container">
            <div className="player-top-bar">
              <div className="player-label">
                <span className="eyebrow-dot" />
                <span>{selectedExample.location}</span>
              </div>
              <div className="player-controls">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="player-btn"
                  aria-label={isPlaying ? 'Pause Demo' : 'Play Demo'}
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed === 1.0 ? 1.5 : 1.0)}
                  className={`player-btn ${playbackSpeed === 1.5 ? 'active' : ''}`}
                  aria-label="Toggle 1.5x Playback"
                >
                  <span>{playbackSpeed}×</span>
                </button>
              </div>
            </div>

            <div className="player-screen">
              <div className="player-grid-simulation">
                <div className="player-metric-card">
                  <div className="player-metric-val flex-row items-center gap-2">
                    <Clock size={20} />
                    <span>{selectedExample.metric1.value}</span>
                  </div>
                  <div className="player-metric-lbl">{selectedExample.metric1.label}</div>
                </div>

                <div className="player-metric-card">
                  <div className="player-metric-val flex-row items-center gap-2">
                    <Coins size={20} />
                    <span>{selectedExample.metric2.value}</span>
                  </div>
                  <div className="player-metric-lbl">{selectedExample.metric2.label}</div>
                </div>

                <div className="player-metric-card">
                  <div className="player-metric-val flex-row items-center gap-2">
                    <ThermometerSnowflake size={20} />
                    <span>{selectedExample.metric3.value}</span>
                  </div>
                  <div className="player-metric-lbl">{selectedExample.metric3.label}</div>
                </div>
              </div>
            </div>

            <div className="player-caption-bar">
              <span>{selectedExample.caption}</span>
              <span className="badge badge-popular" style={{ fontSize: '0.6875rem' }}>
                Live Corridor
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Demo Example Tabs (Section 6.4) ─────────────────────────────── */}
      <section className="demo-tabs-section">
        <div className="page-container">
          <div className="demo-tabs-list" role="tablist" aria-label="Demo showcases">
            {DEMO_EXAMPLES.map((example) => {
              const isActive = example.id === activeTab;
              return (
                <button
                  key={example.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`demo-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(example.id)}
                >
                  <span>{example.category}</span>
                  <span className="demo-tab-badge">{example.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 4. Partnered With Strip (Section 6.8 & 4) ──────────────────────── */}
      <section className="partner-strip">
        <div className="page-container">
          <div className="partner-strip-title">
            Integrated With Regional Agri-Infrastructure & Verified FPO Networks
          </div>
          <div className="partner-logo-row">
            <span className="partner-badge">Sahyadri Farms FPO</span>
            <span className="partner-badge">MahaFPO Federation</span>
            <span className="partner-badge">NABARD AgriTech</span>
            <span className="partner-badge">Nashik APMC Gateway</span>
            <span className="partner-badge">Pune ColdGrid Hub</span>
            <span className="partner-badge">Mahabhulekh 7/12 Direct</span>
          </div>
        </div>
      </section>

      {/* ─── 5. Triptych: DIRECT. / TRANSPARENT. / FRESH. (Section 6.5) ────── */}
      <section className="triptych-section">
        <div className="page-container">
          <div className="triptych-grid">
            <div className="triptych-card">
              <div>
                <div className="triptych-title">DIRECT.</div>
                <p className="triptych-body">
                  Bypass speculative commission agents and multi-tier traders. Connect directly with authentic growers verified through official 7/12 land records.
                </p>
              </div>
              <div className="triptych-footer">
                <CheckCircle2 size={14} />
                <span>Zero Intermediary Exploitation</span>
              </div>
            </div>

            <div className="triptych-card">
              <div>
                <div className="triptych-title">FAIR.</div>
                <p className="triptych-body">
                  Every rupee paid goes straight into the farmer's bank account via instant UPI. Integer-paise financial precision with zero hidden deductions.
                </p>
              </div>
              <div className="triptych-footer">
                <Coins size={14} />
                <span>100% Farmgate Value Retention</span>
              </div>
            </div>

            <div className="triptych-card">
              <div>
                <div className="triptych-title">FRESH.</div>
                <p className="triptych-body">
                  Produce is harvested only upon confirmed demand and routed through active cold-chain logistics in under 24 hours, not weeks on mandi floors.
                </p>
              </div>
              <div className="triptych-footer">
                <Truck size={14} />
                <span>Harvest to Door in &lt; 24 Hrs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Manifesto Block + Looping Flywheel Film (Section 6.6) ──────── */}
      <section className="manifesto-section">
        <div className="page-container">
          <div className="manifesto-grid">
            <div>
              <h2 className="heading-2 mb-6">
                WE'RE REVOLUTIONIZING THE FRESH PRODUCE CORRIDOR.
              </h2>
              <div className="manifesto-statements">
                <div
                  className={`manifesto-item ${manifestoStep === 0 ? 'active' : ''}`}
                  onClick={() => setManifestoStep(0)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="manifesto-number">01 / THE BREAKDOWN</div>
                  <div className="manifesto-text">
                    Traditional wholesale mandi chains lose 35% of harvest value to transit decay and multi-stage handling before reaching city consumers.
                  </div>
                </div>

                <div
                  className={`manifesto-item ${manifestoStep === 1 ? 'active' : ''}`}
                  onClick={() => setManifestoStep(1)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="manifesto-number">02 / THE GAP</div>
                  <div className="manifesto-text">
                    Intermediate cartels inflate retail prices by 250% while growers receive pennies and households get week-old wilted vegetables.
                  </div>
                </div>

                <div
                  className={`manifesto-item ${manifestoStep === 2 ? 'active' : ''}`}
                  onClick={() => setManifestoStep(2)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="manifesto-number">03 / THE SOLUTION</div>
                  <div className="manifesto-text">
                    FarmDirect replaces speculation with direct algorithmic logistics, dynamic harvest pooling, and certified farmgate origin.
                  </div>
                </div>
              </div>
            </div>

            <div className="flywheel-card">
              <div className="flywheel-orb">
                <Sparkles size={36} style={{ color: 'var(--accent)' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: '#ffffff', marginBottom: 6 }}>
                Direct Farm Flywheel
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', maxWidth: 280 }}>
                Fair prices empower growers → higher yield quality → freshest food for households at lower cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Use-Case Carousel (Section 6.7) ─────────────────────────────── */}
      <section className="carousel-section">
        <div className="page-container">
          <div className="carousel-header">
            <div>
              <h2 className="heading-2">SUPERCHARGE YOUR FRESH SUPPLY.</h2>
              <p className="text-lead" style={{ marginTop: 8 }}>
                Engineered for households, commercial kitchens, and regional FPO aggregators.
              </p>
            </div>
            <div className="carousel-controls">
              <button
                onClick={() => setIsSlidePlaying(!isSlidePlaying)}
                className="btn btn-pill-soft btn-sm"
                aria-label={isSlidePlaying ? 'Pause autoplay' : 'Start autoplay'}
              >
                {isSlidePlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isSlidePlaying ? 'Pause' : 'Autoplay'}</span>
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? USE_CASE_SLIDES.length - 1 : prev - 1))}
                className="btn btn-pill-soft btn-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % USE_CASE_SLIDES.length)}
                className="btn btn-pill-soft btn-sm"
                aria-label="Next slide"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="carousel-card">
            <div className="flex-row items-center justify-between">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                <span>{USE_CASE_SLIDES[currentSlide].subtitle}</span>
              </span>
              <div className="flex-row gap-2">
                {USE_CASE_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <h3 className="heading-2" style={{ textTransform: 'none', fontSize: '1.75rem' }}>
              {USE_CASE_SLIDES[currentSlide].title}
            </h3>

            <p style={{ fontSize: '1.0625rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {USE_CASE_SLIDES[currentSlide].description}
            </p>

            <div className="flex-row items-center justify-between mt-4 flex-wrap gap-3">
              <span className="badge badge-accent" style={{ fontSize: '0.8125rem' }}>
                {USE_CASE_SLIDES[currentSlide].metrics}
              </span>
              <Link to="/marketplace" className="link-arrow">
                <span>{USE_CASE_SLIDES[currentSlide].linkText}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Infinite Logo Marquee (Section 6.8) ─────────────────────────── */}
      <section style={{ padding: 'var(--space-xl) 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="page-container" style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>
          <h2 className="heading-3" style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-muted)' }}>
            FINALLY, SUPPLY INFRASTRUCTURE THAT UNDERSTANDS INDIAN AGRICULTURE
          </h2>
        </div>
        <div className="marquee-container">
          <div className="marquee-content">
            <span className="partner-badge">Nashik APMC Hub</span>
            <span className="partner-badge">Sahyadri Farmers FPO</span>
            <span className="partner-badge">Pune ColdGrid Reefer</span>
            <span className="partner-badge">Mahabhulekh 7/12 Land Registry</span>
            <span className="partner-badge">NPCI / UPI Instant Payout</span>
            <span className="partner-badge">FSSAI Certified Hubs</span>
            <span className="partner-badge">PGS-India Organic</span>
            <span className="partner-badge">NPOP India Export Standard</span>
            {/* Duplicate for seamless infinite loop */}
            <span className="partner-badge">Nashik APMC Hub</span>
            <span className="partner-badge">Sahyadri Farmers FPO</span>
            <span className="partner-badge">Pune ColdGrid Reefer</span>
            <span className="partner-badge">Mahabhulekh 7/12 Land Registry</span>
            <span className="partner-badge">NPCI / UPI Instant Payout</span>
            <span className="partner-badge">FSSAI Certified Hubs</span>
            <span className="partner-badge">PGS-India Organic</span>
            <span className="partner-badge">NPOP India Export Standard</span>
          </div>
        </div>
      </section>

      {/* ─── 9. Department Image Carousel (Square 1:1 Aspect Ratio) ─────────── */}
      <section className="department-section">
        <div className="page-container">
          <div className="flex-row items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="heading-2">RUN A BETTER BUSINESS.</h2>
              <p className="text-lead" style={{ marginTop: 4 }}>
                Explore authentic farm supply categories sourced straight from regional growers.
              </p>
            </div>
            <Link to="/marketplace">
              <Button variant="outline" size="sm">
                View All Categories <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          <div className="department-grid">
            {DEPARTMENTS.map((dep) => (
              <Link
                key={dep.id}
                to={`/marketplace?category=${dep.categoryParam}`}
                className="department-card"
              >
                <div className="department-image-frame aspect-square">
                  <span>{dep.emoji}</span>
                </div>
                <div className="department-info">
                  <div className="department-title">{dep.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500 }}>
                    {dep.titleNative}
                  </div>
                  <p className="department-desc">{dep.description}</p>
                  <div className="link-arrow" style={{ fontSize: '0.8125rem' }}>
                    <span>More details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. Department List Version (Section 6.10) ─────────────────────── */}
      <section className="department-list-section">
        <div className="page-container">
          <div className="department-list-row">
            {DEPARTMENTS.map((dep) => (
              <Link
                key={dep.id}
                to={`/marketplace?category=${dep.categoryParam}`}
                className="department-list-item"
              >
                <div className="flex-row items-center gap-3">
                  <span style={{ fontSize: '1.25rem' }}>{dep.emoji}</span>
                  <div>
                    <span className="department-title">{dep.title}</span>
                    <span className="text-caption ml-2" style={{ marginLeft: 8 }}>
                      ({dep.titleNative})
                    </span>
                  </div>
                </div>
                <div className="flex-row items-center gap-4">
                  <span className="text-caption" style={{ display: 'none' }} id={`spec-${dep.id}`}>
                    {dep.spec}
                  </span>
                  <span className="link-arrow">More details →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Live Today's Harvests Grid ────────────────────────────────────── */}
      {products.length > 0 && (
        <section style={{ padding: 'var(--space-section) 0', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="page-container">
            <div className="flex-row items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="heading-2">TODAY'S VERIFIED HARVESTS</h2>
                <p className="text-lead" style={{ marginTop: 4 }}>
                  Real inventory dispatched straight from local farms with active temperature tracking.
                </p>
              </div>
              <Link to="/marketplace">
                <Button variant="outline" size="sm">
                  View Full Catalog ({products.length} items) <ArrowRight size={14} />
                </Button>
              </Link>
            </div>

            <div className="grid-products">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 11. CTA Band (Section 6.10 & 2) ─────────────────────────────────── */}
      <div className="page-container">
        <div className="dayos-cta-band">
          <div>
            <h2 className="cta-band-title">
              LET'S TRANSFORM THE WAY FRESH PRODUCE REACHES YOUR DOOR.
            </h2>
            <p className="cta-band-desc">
              Book a supply walkthrough to see our direct sourcing in action, or join 1,200+ local growers and start ordering today.
            </p>
          </div>
          <div className="cta-band-actions">
            <Link to="/marketplace">
              <Button variant="primary" size="lg">
                Explore Marketplace <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                About Our Infrastructure →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

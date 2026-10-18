import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Phone,
  ShoppingBag,
  Moon,
  Sun,
  X,
  CheckCircle2,
  ArrowRight,
  BatteryCharging,
  Gauge,
  Zap,
} from 'lucide-react';
import './skot.css';

interface MopedModel {
  id: string;
  code: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  specs: {
    power: string;
    range: string;
    chargeTime: string;
    speed: string;
  };
}

const MODELS: Record<string, MopedModel> = {
  c45: {
    id: 'c45',
    code: 'C45',
    name: 'Classic Model',
    tagline: "Officially the UK's No.1 selling moped.",
    description: 'This 50cc Panther moped is agile and ready to strike.',
    image: '/images/skot_scooter_transparent.png',
    specs: {
      power: '3.6 kW Peak',
      range: '95 km',
      chargeTime: '1.8 hrs',
      speed: '65 km/h',
    },
  },
  db50qt: {
    id: 'db50qt',
    code: 'DB50QT',
    name: 'Panther Moped',
    tagline: 'Stealth Black Performance Edition.',
    description: 'Engineered for aggressive city sprints, twin hydraulic discs, and intelligent kinetic regeneration.',
    image: '/images/skot_black_moped.jpg',
    specs: {
      power: '4.8 kW Peak',
      range: '110 km',
      chargeTime: '1.5 hrs',
      speed: '75 km/h',
    },
  },
};

export const SkotHeroPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<'c45' | 'db50qt'>('c45');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showSpecHotspot, setShowSpecHotspot] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentModel = MODELS[selectedModel];
  const alternateModelKey = selectedModel === 'c45' ? 'db50qt' : 'c45';
  const alternateModel = MODELS[alternateModelKey];

  const handleToggleModel = () => {
    setSelectedModel(alternateModelKey);
    setShowSpecHotspot(false);
  };

  return (
    <div className={`skot-hero-wrapper ${isDarkMode ? 'dark' : ''}`}>
      <div className="skot-hero-frame">
        {/* ─── 1. Navigation Header ───────────────────────────────────────── */}
        <header className="skot-header">
          {/* Left: Search button + Nav Links */}
          <div className="skot-header-left">
            <button
              onClick={() => setShowSearchModal(true)}
              className="skot-search-btn"
              aria-label="Search models"
            >
              <Search size={18} />
            </button>

            <nav className="skot-nav-links">
              <a href="#about" className="skot-nav-link">About</a>
              <a href="#collections" className="skot-nav-link">Collections</a>
              <a href="#services" className="skot-nav-link">Services</a>
              <a href="#options" className="skot-nav-link">Options</a>
            </nav>
          </div>

          {/* Center: Brand Logo "Skot." */}
          <div className="skot-brand" onClick={() => setSelectedModel('c45')}>
            <img
              src="/images/skot_logo_mark.png"
              alt="Skot logo"
              className="skot-logo-img"
            />
            <span className="skot-brand-title">Skot.</span>
          </div>

          {/* Right: Theme Toggle, Contact Us Pill, Cart Pill */}
          <div className="skot-header-right">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="skot-theme-toggle"
              aria-label="Toggle dark mode"
              title={isDarkMode ? 'Switch to light canvas' : 'Switch to dark canvas'}
            >
              <div className="skot-theme-dots-wrap">
                <span className="skot-theme-crescent" />
                <span className="skot-theme-center-dot" />
              </div>
            </button>

            <button
              onClick={() => setShowContactModal(true)}
              className="skot-contact-btn"
            >
              <span>Contact us</span>
              <Phone size={13} />
            </button>

            <button
              onClick={() => setCartCount((prev) => prev + 1)}
              className="skot-cart-btn"
              title="View Cart"
            >
              <span>Cart</span>
              <div className="skot-cart-icon-circle">
                <ShoppingBag size={13} />
              </div>
            </button>
          </div>
        </header>

        {/* ─── 2. Hero Body & Layered Background Cutouts ─────────────────── */}
        <div className="skot-hero-body">
          {/* Layer 1: Background Horizontal Rounded Pill Card */}
          <div className="skot-backdrop-layer-horizontal" />

          {/* Layer 2: Background Right Rounded Organic Panel */}
          <div className="skot-backdrop-layer-right" />

          {/* Top Row: Headline (Left) & Reviews Social Proof (Right) */}
          <div className="skot-hero-top-row">
            <h1 className="skot-headline">
              Super fast{' '}
              <span className="skot-headline-badges">
                <span className="badge-planet" title="Planetary mobility">
                  <img
                    src="/images/badge_planet.png"
                    alt="Planet badge"
                    className="badge-icon-img"
                  />
                </span>
                <span className="badge-bolt" title="Electric instant torque">
                  <img
                    src="/images/badge_bolt.png"
                    alt="Lightning badge"
                    className="badge-icon-img"
                  />
                </span>
              </span>
              <br />
              electric Moped
            </h1>

            {/* Top Right Reviews Badge */}
            <div className="skot-reviews-badge">
              <div className="skot-avatars-cluster">
                <img
                  src="/images/skot_avatars_crop.png"
                  alt="Customer reviews"
                  className="skot-avatars-cluster-img"
                />
              </div>

              <div className="skot-reviews-text">
                <div className="skot-reviews-line1">10k+ positive reviews we</div>
                <div className="skot-reviews-line2">
                  <span>achieved</span>
                  <span className="skot-stars">★★★★</span>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 3: Center Photorealistic Moped Stage */}
          <div className="skot-moped-stage">
            <div className="skot-moped-img-container">
              <img
                src={currentModel.image}
                alt={`${currentModel.code} ${currentModel.name}`}
                className="skot-moped-img"
              />

              {/* Floating Red Spec Hotspot Badge 1 */}
              <button
                onClick={() => setShowSpecHotspot(!showSpecHotspot)}
                className="skot-red-badge-hotspot"
                title="Click to view mechanical telemetry"
                aria-label="Inspect vehicle telemetry"
              >
                <span>1</span>
              </button>

              {/* Spec Hotspot Interactive Popover */}
              {showSpecHotspot && (
                <div className="skot-spec-popover">
                  <div className="skot-popover-title">
                    <span>{currentModel.code} Telemetry</span>
                    <button
                      onClick={() => setShowSpecHotspot(false)}
                      className="skot-popover-close"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--skot-ink-muted)', lineHeight: 1.5, marginBottom: 8 }}>
                    Red inner wheel rim with dual-piston ventilated hydraulic braking & regenerative dynamo.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, borderTop: '1px solid var(--skot-border)', paddingTop: 8 }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--skot-ink-faint)' }}>0-45 KM/H</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--skot-ink)' }}>3.4 sec</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--skot-ink-faint)' }}>BATTERY</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--skot-red)' }}>2.4 kWh</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: C45 Card Left & DB50QT Model Switcher Right */}
          <div className="skot-hero-bottom-row">
            {/* C45 Model Description (Clean, minimalist typography sitting on canvas) */}
            <div className="skot-c45-block">
              <div className="skot-c45-title">{currentModel.code}</div>
              <div className="skot-c45-model-tag">{currentModel.name}</div>
              <p className="skot-c45-desc">
                {currentModel.tagline} {currentModel.description}
              </p>
            </div>

            {/* DB50QT Model Switcher Floating Pill Card */}
            <div
              className="skot-model-switcher-card"
              onClick={handleToggleModel}
              title={`Switch to ${alternateModel.code} ${alternateModel.name}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleToggleModel()}
            >
              <div className="skot-model-thumb-frame">
                <img
                  src={selectedModel === 'c45' ? '/images/db50qt_thumb.png' : '/images/skot_scooter_transparent.png'}
                  alt={alternateModel.name}
                  className="skot-model-thumb-img"
                />
              </div>

              <div className="skot-model-info">
                <span className="skot-model-code">{alternateModel.code}</span>
                <span className="skot-model-name">{alternateModel.name}</span>
              </div>

              {/* Vertical Progress / Switcher Bar with knob */}
              <div className="skot-model-progress-bar">
                <div
                  className="skot-model-progress-fill"
                  style={{ top: selectedModel === 'c45' ? '45%' : '15%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. Bottom Corridor Bar ──────────────────────────────────────── */}
        <div className="skot-bottom-corridor-bar">
          <Link to="/marketplace" className="skot-marketplace-link">
            <span>🌾 Switch to FarmDirect Agriculture Market</span>
            <ArrowRight size={14} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--skot-ink-faint)' }}>
              Model: {currentModel.code} • In Stock ({cartCount} configured)
            </span>
            <button
              onClick={() => alert(`Order placed for Skot ${currentModel.code} ${currentModel.name}! Our concierge will contact you for test ride.`)}
              className="skot-order-cta-btn"
            >
              Pre-Order {currentModel.code} →
            </button>
          </div>
        </div>
      </div>

      {/* ─── Search Modal ─────────────────────────────────────────────────── */}
      {showSearchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onClick={() => setShowSearchModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--skot-white)',
              borderRadius: 24,
              padding: 28,
              maxWidth: 480,
              width: '100%',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--skot-ink)' }}>
                Search Skot Mopeds
              </h3>
              <button
                onClick={() => setShowSearchModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skot-ink-muted)' }}
              >
                <X size={18} />
              </button>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search C45, DB50QT, accessories, or range specs..."
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid var(--skot-border)',
                backgroundColor: 'var(--skot-canvas)',
                color: 'var(--skot-ink)',
                fontSize: '0.9375rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              autoFocus
            />
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span
                onClick={() => { setSelectedModel('c45'); setShowSearchModal(false); }}
                style={{ fontSize: '0.75rem', background: 'var(--skot-canvas-card)', padding: '4px 12px', borderRadius: 9999, cursor: 'pointer', color: 'var(--skot-ink)' }}
              >
                C45 Classic
              </span>
              <span
                onClick={() => { setSelectedModel('db50qt'); setShowSearchModal(false); }}
                style={{ fontSize: '0.75rem', background: 'var(--skot-canvas-card)', padding: '4px 12px', borderRadius: 9999, cursor: 'pointer', color: 'var(--skot-ink)' }}
              >
                DB50QT Panther
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Contact Modal ────────────────────────────────────────────────── */}
      {showContactModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onClick={() => setShowContactModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--skot-white)',
              borderRadius: 24,
              padding: 28,
              maxWidth: 440,
              width: '100%',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--skot-ink)' }}>
                Skot Concierge
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skot-ink-muted)' }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--skot-ink-muted)', lineHeight: 1.5, marginBottom: 16 }}>
              Schedule a private home test ride for the <strong>{currentModel.code} {currentModel.name}</strong> or enquire about fleet leasing.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skot-ink)' }}>
                📞 Direct Line: +44 (0) 20 7946 0991
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--skot-ink-muted)' }}>
                ✉️ concierge@skot-mopeds.com
              </div>
              <button
                onClick={() => { alert('Test ride booking received!'); setShowContactModal(false); }}
                className="skot-order-cta-btn"
                style={{ marginTop: 12 }}
              >
                Book 24-Hour Test Ride
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

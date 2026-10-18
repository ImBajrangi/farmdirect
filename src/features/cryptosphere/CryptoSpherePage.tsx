import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Menu,
  X,
  Check,
  TrendingUp,
  Shield,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
} from 'lucide-react';
import './cryptosphere.css';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar: string;
  color: 'white' | 'lime';
  positionClass: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Алексей М.',
    role: 'Junior Trader',
    text: 'Курс помог мне начать карьеру!',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    color: 'white',
    positionClass: 'crypto-bubble-1',
  },
  {
    id: '2',
    name: 'Елена С.',
    role: 'Инвестор',
    text: 'Прекрасные материалы и поддержка. Я в восторге!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    color: 'lime',
    positionClass: 'crypto-bubble-2',
  },
  {
    id: '3',
    name: 'Дмитрий К.',
    role: 'Crypto Analyst',
    text: 'Рекомендую всем, кто решил начать!',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    color: 'white',
    positionClass: 'crypto-bubble-3',
  },
  {
    id: '4',
    name: 'Анна В.',
    role: 'Студент',
    text: 'Все доступно и понятно',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    color: 'white',
    positionClass: 'crypto-bubble-4',
  },
  {
    id: '5',
    name: 'Михаил Т.',
    role: 'Web3 разработчик',
    text: 'Курс превзошел мои ожидания. Много полезной информации!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    color: 'lime',
    positionClass: 'crypto-bubble-5',
  },
];

export const CryptoSpherePage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('Премиум');
  const [showEnrollModal, setShowEnrollModal] = useState<boolean>(false);
  const [showTrialModal, setShowTrialModal] = useState<boolean>(false);
  const [enrolledSuccess, setEnrolledSuccess] = useState<boolean>(false);
  const [chartTimeframe, setChartTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');

  // Registration Form State (Cached locally)
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
  });

  const handleEnrollClick = (planName: string) => {
    setSelectedPlan(planName);
    setShowEnrollModal(true);
    setEnrolledSuccess(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) {
      alert('Пожалуйста, укажите имя и телефон или Telegram');
      return;
    }
    // Save to localStorage for instant return
    localStorage.setItem('cryptosphere_user', JSON.stringify({ ...formData, plan: selectedPlan }));
    setEnrolledSuccess(true);
  };

  return (
    <div className="crypto-page-wrapper">
      {/* ─── 1. Navigation Header ───────────────────────────────────────── */}
      <header className="crypto-header">
        <div className="crypto-container crypto-header-inner">
          {/* Brand Logo */}
          <a href="#hero" className="crypto-logo">
            <span className="crypto-logo-lime">Crypto</span>
            <span className="crypto-logo-white">Sphere</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="crypto-nav">
            <a href="#program" className="crypto-nav-link">Программа</a>
            <a href="#reviews" className="crypto-nav-link">Отзывы</a>
            <a href="#tariffs" className="crypto-nav-link">Контакты</a>
          </nav>

          {/* Header Actions */}
          <div className="crypto-header-actions">
            <button
              onClick={() => setShowTrialModal(true)}
              className="crypto-btn-trial"
            >
              Попробовать бесплатно
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="crypto-mobile-toggle"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#15171e',
              borderBottom: '1px solid var(--crypto-border-dark)',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <a
              href="#program"
              onClick={() => setMobileMenuOpen(false)}
              className="crypto-nav-link"
              style={{ fontSize: '1.1rem' }}
            >
              Программа
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="crypto-nav-link"
              style={{ fontSize: '1.1rem' }}
            >
              Отзывы
            </a>
            <a
              href="#tariffs"
              onClick={() => setMobileMenuOpen(false)}
              className="crypto-nav-link"
              style={{ fontSize: '1.1rem' }}
            >
              Тарифы & Контакты
            </a>
          </div>
        )}
      </header>

      {/* ─── 2. Hero Section ────────────────────────────────────────────── */}
      <section id="hero" className="crypto-hero-section">
        <div className="crypto-hero-bg-layer" />

        <div className="crypto-container crypto-hero-grid">
          {/* Left: Headline */}
          <div>
            <h1 className="crypto-hero-title">
              Обучение <br />
              <span className="crypto-lime-text">криптовалюте</span> <br />
              с нуля
            </h1>
          </div>

          {/* Right: Social proof & Big CTA Button */}
          <div className="crypto-hero-right">
            <div className="crypto-hero-social-cluster">
              <div className="crypto-hero-avatars">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Student 1"
                  className="crypto-hero-avatar-img"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Student 2"
                  className="crypto-hero-avatar-img"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                  alt="Student 3"
                  className="crypto-hero-avatar-img"
                />
              </div>
              <span className="crypto-hero-count-badge">100k</span>
            </div>

            <p className="crypto-hero-social-text">
              Тысячи людей уже прошли обучение у нас
            </p>

            <button
              onClick={() => handleEnrollClick('Премиум')}
              className="crypto-hero-cta-btn"
            >
              <span>Записаться</span>
              <div className="crypto-hero-cta-icon">
                <ArrowUpRight size={18} />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ─── 3. Floating Notch & Bento Section ───────────────────────────── */}
      <section id="program" className="crypto-bento-section">
        <div className="crypto-container">
          {/* Bento Grid */}
          <div className="crypto-bento-grid">
            {/* Top Bento Card: Large White Card with Integrated Smooth SVG Notch Crest */}
            <div className="crypto-bento-white-card">
              {/* Continuous SVG Notch Crest with Organic C2 Bezier Fillets */}
              <div className="crypto-notch-crest-container">
                <svg
                  viewBox="0 0 240 64"
                  className="crypto-notch-crest-svg"
                  preserveAspectRatio="xMidYMin meet"
                  aria-hidden="true"
                >
                  {/* Continuous white crest tab with smooth organic C2 Bezier fillets */}
                  <path
                    d="M 0,54 L 20,54 C 50,54 65,40 76,28 C 87,16 102,4 120,4 C 138,4 153,16 164,28 C 175,40 190,54 220,54 L 240,54 L 240,64 L 0,64 Z"
                    fill="#ffffff"
                  />
                  {/* Central Black Circle for Bitcoin symbol */}
                  <circle
                    cx="120"
                    cy="29"
                    r="21"
                    fill="#0c0d11"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x="120"
                    y="36.5"
                    fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    fontSize="20"
                    fontWeight="800"
                    fill="#c2f418"
                    textAnchor="middle"
                  >
                    ₿
                  </text>
                </svg>
              </div>

              <div className="crypto-student-photo-frame">
                <img
                  src="/images/crypto_student_pro.jpg"
                  alt="Student with laptop"
                  className="crypto-student-photo-img"
                />
              </div>

              <div className="crypto-bento-white-content">
                <span className="crypto-pill-tag">О курсе</span>
                <h2 className="crypto-bento-white-title">
                  Станьте экспертом в области цифровых финансов
                </h2>
                <p className="crypto-bento-white-desc">
                  Вы познакомитесь с основами криптовалют, освоите успешные инвестиционные стратегии
                  и получите знания о том, как защитить свои активы, научитесь анализировать
                  рыночные тенденции и принимать обоснованные финансовые решения.
                </p>
              </div>
            </div>

            {/* Bottom Bento Row: Split 2 Cards (Dark & Lime) */}
            <div className="crypto-bento-split-row">
              {/* Left Dark Card */}
              <div className="crypto-bento-dark-card">
                <div className="crypto-dark-block-top">
                  <span className="crypto-dark-label">Темы уроков</span>
                  <h3 className="crypto-dark-value">Актуальные и полезные</h3>
                </div>

                <div className="crypto-dark-divider" />

                <div className="crypto-dark-block-bottom">
                  <h3 className="crypto-dark-value">Практика в основе курса</h3>
                  <p className="crypto-dark-subdesc">
                    Используем практический подход: более 50% времени обучения — практика.
                  </p>
                </div>
              </div>

              {/* Right Neon Lime Card with Floating Sticker Pills */}
              <div className="crypto-bento-lime-card">
                <div className="crypto-lime-header">
                  <span className="crypto-lime-label">Все очень подробно</span>
                  <h3 className="crypto-lime-title">Можно с нуля</h3>
                </div>

                {/* Scattered Floating Sticker Pills */}
                <div className="crypto-stickers-cluster">
                  <div className="crypto-sticker black" style={{ transform: 'rotate(-4deg)' }}>
                    Чат с наставником
                  </div>
                  <div className="crypto-sticker white" style={{ transform: 'rotate(5deg)' }}>
                    Быстрый рост
                  </div>
                  <div className="crypto-sticker black" style={{ transform: 'rotate(-7deg)' }}>
                    Доступ навсегда
                  </div>
                  <div className="crypto-sticker white" style={{ transform: 'rotate(6deg)' }}>
                    Обучение с нуля
                  </div>
                  <div className="crypto-sticker white" style={{ transform: 'rotate(-3deg)' }}>
                    Сертификат
                  </div>
                  <div className="crypto-sticker black" style={{ transform: 'rotate(5deg)' }}>
                    Высокий доход
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Reviews & Live Portfolio Phone Showcase ─────────────────── */}
      <section id="reviews" className="crypto-reviews-showcase-section">
        <div className="crypto-container">
          <div className="crypto-reviews-header">
            <h2 className="crypto-reviews-title">
              Вот что говорят о нас <br />
              наши ученики
            </h2>
            <p className="crypto-reviews-subtitle">
              или почему стоит доверить свое обучение нам
            </p>
          </div>

          {/* Showcase Stage with Floating Bubbles and Phone */}
          <div className="crypto-showcase-stage">
            {/* Decorative 3D Elements */}
            <div className="crypto-deco-knot">
              <img src="/images/crypto_3d_knot.png" alt="3D Knot" style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="crypto-deco-orb">
              <img src="/images/crypto_3d_orb.png" alt="3D Orb" style={{ width: '100%', height: '100%' }} />
            </div>

            {/* Floating Speech Bubbles with Smooth SVG Chat Tails */}
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className={`crypto-bubble ${item.color} ${item.positionClass}`}
              >
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="crypto-bubble-avatar"
                />
                <span>{item.text}</span>
                {/* Organic SVG Speech Bubble Tail */}
                <svg
                  className="crypto-bubble-tail-svg"
                  viewBox="0 0 14 10"
                  width="14"
                  height="10"
                  aria-hidden="true"
                >
                  <path
                    d="M 0,0 C 4,0 7,4 14,10 C 8,8 4,5 0,0 Z"
                    fill={item.color === 'lime' ? 'var(--crypto-lime)' : '#ffffff'}
                  />
                </svg>
              </div>
            ))}

            {/* Central Titanium iPhone 15 Mockup Frame */}
            <div className="crypto-iphone-frame">
              {/* Dynamic Island Notch */}
              <div className="crypto-iphone-notch" />

              <div className="crypto-iphone-screen">
                {/* Status bar */}
                <div className="crypto-iphone-status">
                  <span>9:41</span>
                  <span>5G • 100%</span>
                </div>

                {/* Portfolio Info */}
                <div>
                  <div className="crypto-iphone-investing">Investing</div>
                  <div className="crypto-iphone-balance">$50,906.27</div>
                  <div className="crypto-iphone-gain">
                    <TrendingUp size={12} />
                    <span>+$6,420.15 (14.8%) Today</span>
                  </div>
                </div>

                {/* Timeframe Selector */}
                <div style={{ display: 'flex', gap: 6, margin: '6px 0' }}>
                  {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setChartTimeframe(tf)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 6,
                        border: 'none',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        backgroundColor: chartTimeframe === tf ? 'var(--crypto-lime)' : 'rgba(255,255,255,0.08)',
                        color: chartTimeframe === tf ? '#111' : '#8e93a0',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                {/* Glowing Green Trendline Chart with Smooth Cubic Beziers */}
                <svg className="crypto-iphone-chart-svg" viewBox="0 0 200 80">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c2f418" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#c2f418" stopOpacity="0" />
                    </linearGradient>
                    <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <path
                    d="M 0,65 C 25,62 48,56 72,58 C 96,60 114,40 136,32 C 158,24 174,28 200,8 L 200,80 L 0,80 Z"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M 0,65 C 25,62 48,56 72,58 C 96,60 114,40 136,32 C 158,24 174,28 200,8"
                    fill="none"
                    stroke="#c2f418"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    filter="url(#chartGlow)"
                  />
                  <circle cx="200" cy="8" r="3.5" fill="#ffffff" stroke="#c2f418" strokeWidth="2" />
                </svg>

                {/* Mini Crypto Holdings Row */}
                <div className="crypto-iphone-assets-list">
                  <div className="crypto-asset-row">
                    <span style={{ fontWeight: 600, color: '#fff' }}>Bitcoin (BTC)</span>
                    <span style={{ color: 'var(--crypto-lime)', fontWeight: 700 }}>$68,410.20</span>
                  </div>
                  <div className="crypto-asset-row">
                    <span style={{ fontWeight: 600, color: '#fff' }}>Ethereum (ETH)</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>$3,540.80</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. Tariffs / Pricing Section ───────────────────────────────── */}
      <section id="tariffs" className="crypto-pricing-section">
        <div className="crypto-container">
          <div className="crypto-pricing-header">
            <h2 className="crypto-pricing-title">
              Обучение для всех: тарифы для новичков, <br />
              исследователей и экспертов!
            </h2>
          </div>

          <div className="crypto-pricing-grid">
            {/* Card 1: Базовый */}
            <div className="crypto-price-card white">
              <div className="crypto-price-card-header">
                <div className="crypto-plan-name">Базовый</div>
                <h3 className="crypto-plan-price">от 3000₽/мес.</h3>
              </div>

              <ul className="crypto-plan-features">
                <li className="crypto-plan-feature-item">
                  <Check size={14} style={{ color: '#111', flexShrink: 0, marginTop: 2 }} />
                  <span>Доступ к основным урокам</span>
                </li>
                <li className="crypto-plan-feature-item">
                  <Check size={14} style={{ color: '#111', flexShrink: 0, marginTop: 2 }} />
                  <span>Участие в форуме для обсуждения</span>
                </li>
                <li className="crypto-plan-feature-item">
                  <Check size={14} style={{ color: '#111', flexShrink: 0, marginTop: 2 }} />
                  <span>Справочные материалы</span>
                </li>
              </ul>

              <button
                onClick={() => handleEnrollClick('Базовый')}
                className="crypto-plan-btn"
              >
                Оплатить тариф
              </button>
            </div>

            {/* Card 2: Премиум (Recommended Featured Card) */}
            <div className="crypto-price-card lime">
              <div className="crypto-badge-recommended">
                Рекомендуют
              </div>

              <div className="crypto-price-card-header">
                <div className="crypto-plan-name">Премиум</div>
                <h3 className="crypto-plan-price">от 5000₽/мес.</h3>
              </div>

              <ul className="crypto-plan-features">
                <li className="crypto-plan-feature-item">
                  <Check size={14} style={{ color: '#111', flexShrink: 0, marginTop: 2 }} />
                  <span>Все из стандартного тарифа</span>
                </li>
                <li className="crypto-plan-feature-item">
                  <Check size={14} style={{ color: '#111', flexShrink: 0, marginTop: 2 }} />
                  <span>Индивидуальные консультации</span>
                </li>
                <li className="crypto-plan-feature-item">
                  <Check size={14} style={{ color: '#111', flexShrink: 0, marginTop: 2 }} />
                  <span>Доступ к эксклюзивным материалам</span>
                </li>
                <li className="crypto-plan-feature-item">
                  <Check size={14} style={{ color: '#111', flexShrink: 0, marginTop: 2 }} />
                  <span>Сертификат после окончания курса</span>
                </li>
              </ul>

              <button
                onClick={() => handleEnrollClick('Премиум')}
                className="crypto-plan-btn"
                style={{ backgroundColor: '#111216', color: '#ffffff' }}
              >
                Оплатить тариф
              </button>
            </div>

            {/* Card 3: Стандартный */}
            <div className="crypto-price-card white">
              <div className="crypto-price-card-header">
                <div className="crypto-plan-name">Стандартный</div>
                <h3 className="crypto-plan-price">от 4000₽/мес.</h3>
              </div>

              <ul className="crypto-plan-features">
                <li className="crypto-plan-feature-item">
                  <Check size={14} style={{ color: '#111', flexShrink: 0, marginTop: 2 }} />
                  <span>Все из базового тарифа</span>
                </li>
                <li className="crypto-plan-feature-item">
                  <Check size={14} style={{ color: '#111', flexShrink: 0, marginTop: 2 }} />
                  <span>Дополнительные уроки</span>
                </li>
                <li className="crypto-plan-feature-item">
                  <Check size={14} style={{ color: '#111', flexShrink: 0, marginTop: 2 }} />
                  <span>Доступ к вебинарам с экспертами</span>
                </li>
                <li className="crypto-plan-feature-item">
                  <Check size={14} style={{ color: '#111', flexShrink: 0, marginTop: 2 }} />
                  <span>Поддержка в чате на время курса</span>
                </li>
              </ul>

              <button
                onClick={() => handleEnrollClick('Стандартный')}
                className="crypto-plan-btn"
              >
                Оплатить тариф
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Footer & Navigation Corridor ────────────────────────────── */}
      <footer className="crypto-footer">
        <div className="crypto-container crypto-footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 800, color: '#fff' }}>CryptoSphere © 2026</span>
            <span style={{ color: 'var(--crypto-text-faint)' }}>• Образовательная онлайн-платформа</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link to="/skot" className="crypto-return-link">
              <span>🛵 Перейти в Skot Moped Hero</span>
              <ArrowUpRight size={14} />
            </Link>
            <Link to="/marketplace" className="crypto-return-link">
              <span>🌱 FarmDirect Маркет</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </footer>

      {/* ─── Enrollment Modal ───────────────────────────────────────────── */}
      {showEnrollModal && (
        <div
          className="crypto-modal-backdrop"
          onClick={() => setShowEnrollModal(false)}
        >
          <div
            className="crypto-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEnrollModal(false)}
              className="crypto-modal-close"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>

            {enrolledSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(194, 244, 24, 0.15)',
                    color: 'var(--crypto-lime)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
                  Заявка принята!
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--crypto-text-muted)', lineHeight: 1.5 }}>
                  Вы записались на тариф <strong>{selectedPlan}</strong>. Наш куратор свяжется с вами в Telegram в течение 10 минут.
                </p>
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="crypto-hero-cta-btn"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
                >
                  Отлично
                </button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px' }}>
                  Запись на обучение
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--crypto-text-muted)', margin: '0 0 20px' }}>
                  Тариф: <strong style={{ color: 'var(--crypto-lime)' }}>{selectedPlan}</strong>
                </p>

                <form onSubmit={handleFormSubmit}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--crypto-text-muted)', display: 'block', marginBottom: 4 }}>
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например, Александр"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="crypto-input"
                  />

                  <label style={{ fontSize: '0.75rem', color: 'var(--crypto-text-muted)', display: 'block', marginBottom: 4 }}>
                    Telegram или Телефон
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@username или +7 (999) 000-00-00"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="crypto-input"
                  />

                  <button
                    type="submit"
                    className="crypto-hero-cta-btn"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                  >
                    Подтвердить запись →
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Free Trial Modal ───────────────────────────────────────────── */}
      {showTrialModal && (
        <div
          className="crypto-modal-backdrop"
          onClick={() => setShowTrialModal(false)}
        >
          <div
            className="crypto-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrialModal(false)}
              className="crypto-modal-close"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(194, 244, 24, 0.15)',
                  color: 'var(--crypto-lime)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>
                Бесплатный вводный урок
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--crypto-text-muted)', lineHeight: 1.5, marginBottom: 20 }}>
                Вам открыт доступ к уроку <strong>«Анатомия Блокчейна и Безопасные Кошельки»</strong>.
              </p>
              <button
                onClick={() => {
                  alert('Вводный видеоурок открыт! Приятного просмотра.');
                  setShowTrialModal(false);
                }}
                className="crypto-hero-cta-btn"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Смотреть урок (42 мин)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CryptoSpherePage;

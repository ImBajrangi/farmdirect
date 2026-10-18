import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import './creatix.css';

const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75c-.97 0-1.76.78-1.76 1.75s.79 1.76 1.76 1.76m1.39 9.74v-8.37H5.07v8.37h2.78Z" />
  </svg>
);

const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const DribbbleIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" />
    <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
    <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
  </svg>
);

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
  </svg>
);

// Team members specification
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  category: 'Design' | 'Engineering' | 'Leadership';
  avatarEmoji: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: 'John Smith',
    role: 'CEO & Co-Founder',
    bio: '10+ years experience in digital consulting. Passionate about transforming brands into scalable market leaders.',
    category: 'Leadership',
    avatarEmoji: '👨‍💼',
  },
  {
    id: 'm2',
    name: 'Sarah Miller',
    role: 'Creative Director',
    bio: 'Award-winning visual visionary. Leading brand identity, design systems, and art direction across global campaigns.',
    category: 'Leadership',
    avatarEmoji: '👩‍🎨',
  },
  {
    id: 'm3',
    name: 'Alex Vance',
    role: 'Senior UI Designer',
    bio: 'Specialist in high-conversion design systems, micro-interactions, and accessibility across multi-platform products.',
    category: 'Design',
    avatarEmoji: '🧑‍💻',
  },
  {
    id: 'm4',
    name: 'Emily Watson',
    role: 'Lead Full-Stack Dev',
    bio: 'Architecting ultra-fast, robust digital engines with React, TypeScript, and modern headless web infrastructure.',
    category: 'Engineering',
    avatarEmoji: '👩‍💻',
  },
  {
    id: 'm5',
    name: 'David Chen',
    role: '3D & Motion Artist',
    bio: 'Crafting mesmerizing procedural animations, claymation styles, and interactive WebGL 3D product visualisations.',
    category: 'Design',
    avatarEmoji: '👨‍🎨',
  },
  {
    id: 'm6',
    name: 'Sophia Patel',
    role: 'Brand & Growth Strategist',
    bio: 'Driving data-backed positioning, messaging frameworks, and user research to ensure design converts at scale.',
    category: 'Leadership',
    avatarEmoji: '👩‍💼',
  },
];

// Testimonials data
interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote: 'Working with Creatix has been an incredible experience. They understood our needs and delivered a stunning design that exceeded our expectations. We couldn\'t be happier with the final product!',
    author: 'Alan Baker',
    role: 'Managing Partner',
    company: 'Redline Company',
  },
  {
    id: 't2',
    quote: 'From discovery to delivery, the team brought uncompromised creative energy and technical precision. Our conversion rates jumped 140% post-launch, establishing a world-class market standard.',
    author: 'Theresa May',
    role: 'VP of Product',
    company: 'FinPulse Global',
  },
  {
    id: 't3',
    quote: 'Creatix crafts experiences that feel vibrant and human. Their execution speed, aesthetic sensibility, and attention to micro-details set them leagues apart from traditional agencies.',
    author: 'Marcus Brody',
    role: 'Founder',
    company: 'Aether Studios',
  },
];

export const CreatixPage: React.FC = () => {
  const [activeService, setActiveService] = useState<number>(0);
  const [teamCategory, setTeamCategory] = useState<string>('All');
  const [testimonialIndex, setTestimonialIndex] = useState<number>(0);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState<boolean>(false);
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  const services = [
    {
      num: '01',
      title: 'UI/UX Design',
      desc: 'Crafting intuitive user interfaces, comprehensive design systems, and frictionless conversion flows grounded in deep user research.',
    },
    {
      num: '02',
      title: 'Web Development',
      desc: 'Building lightning-fast, responsive web applications with TypeScript, modern frameworks, and smooth fluid animations.',
    },
    {
      num: '03',
      title: '3D Designs',
      desc: 'Developing stunning 3D product models, claymation renders, and interactive spatial assets that captivate modern audiences.',
    },
    {
      num: '04',
      title: 'Motion Graphics',
      desc: 'Delivering dynamic micro-animations, expressive video storyboards, and brand kinetic typography that elevate user delight.',
    },
  ];

  const filteredTeam =
    teamCategory === 'All'
      ? TEAM_MEMBERS
      : TEAM_MEMBERS.filter((m) => m.category === teamCategory);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setTimeout(() => setNewsletterSubmitted(false), 4000);
      setNewsletterEmail('');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactEmail.trim()) {
      setContactSubmitted(true);
      setTimeout(() => setContactSubmitted(false), 4000);
      setContactEmail('');
    }
  };

  return (
    <div className="creatix-page">
      {/* ─── Mode Switcher Floating Badge ─────────────────────────────────── */}
      <div className="creatix-mode-switcher">
        <Link to="/marketplace" title="Jump to FarmDirect Marketplace Catalog">
          <span>🌾 FarmDirect Market</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* ─── 1. Floating Nav Island (Exact Match to Screenshot) ─────────────── */}
      <div className="creatix-nav-container">
        <nav className="creatix-nav-island">
          <a href="#about" className="creatix-nav-link">
            About Us
          </a>
          <a href="#services" className="creatix-nav-link">
            Services
          </a>

          {/* Center Brand Lockup */}
          <Link to="/" className="creatix-brand-logo">
            <span className="creatix-sunburst-icon">
              {/* 8-pointed starburst icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="3" />
                <path
                  d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span>Creatix</span>
          </Link>

          <a href="#projects" className="creatix-nav-link">
            Projects
          </a>
          <a href="#reviews" className="creatix-nav-link">
            Reviews
          </a>
        </nav>
      </div>

      {/* ─── 2. Hero Section (White Canvas with Scoop Bottom) ──────────────── */}
      <section className="creatix-hero-section" id="about">
        <div className="creatix-hero-inner">
          {/* Top-Left Sparkle / Sunburst */}
          <div className="creatix-hero-sparkle-left">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
                fill="#8cf828"
              />
              <path
                d="M12 4v12M4 10h12"
                stroke="#8cf828"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Main Headline */}
          <h1 className="creatix-hero-headline">
            Empowering Brands<br />
            Through Creative Solutions
            <span className="creatix-accent-bracket">‹</span>
          </h1>

          {/* 3-Column Hero Grid */}
          <div className="creatix-hero-grid">
            {/* Left Column */}
            <div className="creatix-hero-left">
              <div className="creatix-hero-arrow-badge">↳</div>
              <p>
                From web development to branding, we deliver innovative strategies that elevate your brand and drive growth. Let's create something exceptional together.
              </p>
              <a href="#services" className="btn-hero-outline">
                Innovate Your Brand
              </a>
            </div>

            {/* Center Visual with Woman Celebrating & Overlapping Dual Pill CTA */}
            <div className="creatix-hero-center">
              {/* Hand-drawn swirl doodle SVG in background */}
              <svg className="creatix-doodle-swirl" viewBox="0 0 300 300" fill="none">
                <path
                  d="M40,150 C30,70 120,40 180,60 C240,80 270,160 230,220 C190,270 90,260 70,200 C50,140 140,110 180,140 C220,170 200,220 160,220"
                  stroke="#111111"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />
              </svg>

              <div className="creatix-hero-portrait-frame">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                  alt="Creative Leader celebrating success"
                  className="creatix-hero-portrait-img"
                />
              </div>

              {/* Floating Dual Pill CTA */}
              <div className="creatix-hero-dual-cta">
                <a href="#contact" className="btn-neon-pill">
                  Start Your Project
                </a>
                <a href="#services" className="btn-dark-pill">
                  Let's Collaborate
                </a>
              </div>
            </div>

            {/* Right Column: 5 Stars + 10 Years Experience */}
            <div className="creatix-hero-right">
              <div className="creatix-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#8cf828" stroke="#8cf828" />
                ))}
              </div>
              <div className="creatix-hero-exp-number">10 Years</div>
              <div className="creatix-hero-exp-label">Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. Stats Strip (Dark Canvas) ─────────────────────────────────── */}
      <section className="creatix-stats-section">
        <div className="creatix-stats-grid">
          <div className="creatix-stat-item">
            <div className="creatix-stat-val">2000+</div>
            <div className="creatix-stat-lbl">Company</div>
          </div>
          <div className="creatix-stat-item">
            <div className="creatix-stat-val">10+</div>
            <div className="creatix-stat-lbl">Years Exp.</div>
          </div>
          <div className="creatix-stat-item">
            <div className="creatix-stat-val">800+</div>
            <div className="creatix-stat-lbl">Hours of Digital</div>
          </div>
          <div className="creatix-stat-item">
            <div className="creatix-stat-val">150M+</div>
            <div className="creatix-stat-lbl">In Tracked Revenue</div>
          </div>
        </div>
      </section>

      {/* ─── 4. "Turning Ideas Into Masterpieces" Section ──────────────────── */}
      <section className="creatix-masterpiece-section" id="projects">
        <div className="creatix-masterpiece-header">
          <h2 className="creatix-masterpiece-title">
            <span className="creatix-green-star">✦</span>
            <span>Turning Ideas Into Masterpieces</span>
          </h2>
          <p className="creatix-masterpiece-desc">
            We may be a compact team, but our creativity knows no bounds. By staying agile and working hand-in-hand with our clients, we transform ideas into cutting-edge designs that make a lasting impression.
          </p>
        </div>

        <div className="creatix-masterpiece-cards">
          {/* Left Card: Office team with neon badge */}
          <div className="creatix-card-left">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Design team collaborating"
              className="creatix-card-img"
            />
            <div className="creatix-agency-pill-badge">
              <span>A CREATIVE DESIGN AGENCY</span>
              <div className="creatix-barcode-bars">
                <span style={{ height: '14px' }} />
                <span style={{ height: '8px' }} />
                <span style={{ height: '14px' }} />
                <span style={{ height: '10px' }} />
                <span style={{ height: '14px' }} />
              </div>
            </div>
          </div>

          {/* Right Card: Woman with lightbulb doodle above head */}
          <div className="creatix-card-right">
            {/* Glowing Hand-Drawn Lightbulb Doodle SVG */}
            <div className="creatix-lightbulb-doodle">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18h6M10 22h4M12 2v2M4.93 4.93l1.41 1.41M2 12h2M4.93 19.07l1.41-1.41M19.07 4.93l-1.41 1.41M22 12h-2M17.66 17.66l1.41 1.41"
                  stroke="#ff5e57"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M12 6a6 6 0 0 0-6 6c0 2.22 1.21 4.16 3 5.2V18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-.8c1.79-1.04 3-2.98 3-5.2a6 6 0 0 0-6-6Z"
                  stroke="#ff5e57"
                  strokeWidth="1.8"
                  fill="rgba(255, 94, 87, 0.25)"
                />
              </svg>
            </div>
            <img
              src="https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=80"
              alt="Creative ideation and visionary thinking"
              className="creatix-card-img"
            />
          </div>
        </div>
      </section>

      {/* ─── 5. "Our Services" Section with Side Sticker ──────────────────── */}
      <section className="creatix-services-section" id="services">
        {/* Left Vertical Side Sticker: WHAT WE DO */}
        <div className="creatix-side-sticker">WHAT WE DO</div>

        <div className="creatix-services-header">
          <h2 className="creatix-services-title">
            <span>Our</span>
            <span className="pill-highlight-green">Services</span>
          </h2>
          <p className="creatix-services-subtitle">
            We offer a range of creative and digital services designed to help your brand stand out.
          </p>
        </div>

        <div className="creatix-services-grid">
          {/* Left: Service Pill Rows */}
          <div className="creatix-services-list">
            {services.map((item, idx) => {
              const isActive = activeService === idx;
              return (
                <div
                  key={item.num}
                  className={`creatix-service-row ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveService(idx)}
                >
                  <div className="creatix-service-name">
                    <span className="creatix-service-num">{item.num}</span>
                    <span>{item.title}</span>
                  </div>
                  <ArrowRight size={18} className="creatix-service-arrow" />
                </div>
              );
            })}

            {/* Active Service Detailed Expansion */}
            <div
              style={{
                backgroundColor: 'var(--creatix-dark-card)',
                border: '1px solid var(--creatix-dark-border)',
                borderRadius: '20px',
                padding: '20px 24px',
                marginTop: '8px',
              }}
            >
              <div style={{ color: 'var(--creatix-neon-green)', fontWeight: 700, fontSize: '0.875rem', marginBottom: 4 }}>
                {services[activeService].num} // {services[activeService].title} Execution
              </div>
              <p style={{ color: 'var(--creatix-gray)', fontSize: '0.875rem', lineHeight: 1.55 }}>
                {services[activeService].desc}
              </p>
            </div>
          </div>

          {/* Right: Media Showcase Card */}
          <div className="creatix-service-media-card">
            <img
              src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
              alt="Designer crafting digital product"
              className="creatix-card-img"
            />

            {/* Rotating Circular Typography Watermark */}
            <div className="creatix-watermark-wheel">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <path
                  id="textPath-circle"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text fill="#ffffff" fontSize="9" fontWeight="700" letterSpacing="2">
                  <textPath href="#textPath-circle">
                    • DIGITAL DESIGN • CREATIVE MAGIC
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Floating Top Dark Badge */}
            <a href="#about" className="floating-badge-top-dark">
              <span>Ever wondered how design magic happens?</span>
              <span style={{ fontWeight: 700, color: 'var(--creatix-neon-green)' }}>
                See how we work ↗
              </span>
            </a>

            {/* Floating Bottom Neon Badge */}
            <a href="#contact" className="floating-badge-bottom-neon">
              <span>Looking for design experts who can bring your vision to life?</span>
              <span className="circle-arrow-btn">
                <ArrowUpRight size={13} />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 6. Big Typography Ticker Banner ──────────────────────────────── */}
      <section className="creatix-ticker-banner">
        <div className="creatix-ticker-text">
          Innovate + Inspire + Create
        </div>
        <div className="creatix-ticker-star">✦</div>
      </section>

      {/* ─── 7. "Meet the Team" Section ───────────────────────────────────── */}
      <section className="creatix-team-section">
        <div className="creatix-team-header">
          <h2 className="creatix-team-title">
            <span>Meet</span>
            <span className="pill-highlight-green">the Team</span>
          </h2>

          {/* Interactive Category Filter Switch */}
          <div className="creatix-toggle-pill">
            {['All', 'Leadership', 'Design', 'Engineering'].map((cat) => (
              <button
                key={cat}
                className={`creatix-toggle-btn ${teamCategory === cat ? 'active' : ''}`}
                onClick={() => setTeamCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="creatix-team-grid">
          {filteredTeam.map((member) => (
            <div key={member.id} className="creatix-team-card">
              <div className="creatix-team-card-top">
                <div className="creatix-avatar-squircle">
                  <span>{member.avatarEmoji}</span>
                </div>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="creatix-team-social"
                  aria-label={`LinkedIn for ${member.name}`}
                >
                  <LinkedInIcon size={15} />
                </a>
              </div>
              <div className="creatix-team-name">{member.name}</div>
              <div className="creatix-team-role">{member.role}</div>
              <p className="creatix-team-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. Testimonials Section ──────────────────────────────────────── */}
      <section className="creatix-reviews-section" id="reviews">
        <div className="creatix-reviews-grid">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.id}
              className="creatix-review-card"
              style={{ display: idx === testimonialIndex || idx === (testimonialIndex + 1) % TESTIMONIALS.length ? 'flex' : 'none' }}
            >
              <div>
                <div className="creatix-quote-icon">“</div>
                <p className="creatix-review-text">{t.quote}</p>
              </div>
              <div className="creatix-review-author">
                <div className="creatix-author-info">
                  <span className="creatix-author-name">{t.author}</span>
                  <span className="creatix-author-role">
                    {t.role}, {t.company}
                  </span>
                </div>
                <div className="creatix-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#8cf828" stroke="#8cf828" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Prev/Next Navigation Controls */}
        <div className="creatix-reviews-nav">
          <button
            onClick={() =>
              setTestimonialIndex(
                (prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1)
              )
            }
            className="circle-nav-btn"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() =>
              setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)
            }
            className="circle-nav-btn"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ─── 9. Infinite Marquee Ribbon Tape ──────────────────────────────── */}
      <div className="creatix-marquee-ribbon">
        <div className="creatix-ribbon-track">
          <div className="creatix-ribbon-item">
            <span>UI/UX Design</span>
            <span className="ribbon-star">✦</span>
            <span>App Design</span>
            <span className="ribbon-star">✦</span>
            <span>Dashboard</span>
            <span className="ribbon-star">✦</span>
            <span>Wireframe</span>
            <span className="ribbon-star">✦</span>
            <span>User Research</span>
            <span className="ribbon-star">✦</span>
            <span>3D Rendering</span>
            <span className="ribbon-star">✦</span>
            <span>Brand Identity</span>
            <span className="ribbon-star">✦</span>
            <span>Motion Graphics</span>
            <span className="ribbon-star">✦</span>
          </div>
          {/* Duplicate track for seamless infinite marquee loop */}
          <div className="creatix-ribbon-item">
            <span>UI/UX Design</span>
            <span className="ribbon-star">✦</span>
            <span>App Design</span>
            <span className="ribbon-star">✦</span>
            <span>Dashboard</span>
            <span className="ribbon-star">✦</span>
            <span>Wireframe</span>
            <span className="ribbon-star">✦</span>
            <span>User Research</span>
            <span className="ribbon-star">✦</span>
            <span>3D Rendering</span>
            <span className="ribbon-star">✦</span>
            <span>Brand Identity</span>
            <span className="ribbon-star">✦</span>
            <span>Motion Graphics</span>
            <span className="ribbon-star">✦</span>
          </div>
        </div>
      </div>

      {/* ─── 10. "Get in Touch Today!" CTA Section ────────────────────────── */}
      <section className="creatix-contact-section" id="contact">
        <div className="creatix-contact-card">
          <div className="creatix-contact-left">
            <h2 className="creatix-contact-title">Get in Touch Today!</h2>
            <p className="creatix-contact-desc">
              Let's transform your ideas into exceptional digital experiences, whether you're looking for a complete rebrand or stunning digital products.
            </p>

            <form onSubmit={handleContactSubmit} className="creatix-contact-form">
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="creatix-contact-input"
              />
              <button type="submit" className="btn-neon-pill">
                Submit ↗
              </button>
            </form>

            {contactSubmitted && (
              <div style={{ color: 'var(--creatix-neon-green)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <CheckCircle2 size={16} />
                <span>Thank you! Our creative director will reach out within 2 hours.</span>
              </div>
            )}
          </div>

          <div className="creatix-contact-right">
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"
              alt="Creatix Creative Consultant"
              className="creatix-contact-img"
            />
          </div>
        </div>
      </section>

      {/* ─── 11. Footer (Full Neon Lime Green Card) ───────────────────────── */}
      <div className="creatix-footer-wrapper">
        <footer className="creatix-neon-footer">
          <div className="creatix-footer-grid">
            {/* Brand Column */}
            <div className="creatix-footer-brand">
              <div className="creatix-footer-logo">Creatix</div>
              <p className="creatix-footer-tagline">
                Empowering world-class brands through human-centered digital strategies, bold identities, and creative engineering.
              </p>
            </div>

            {/* Column 1: Company */}
            <div>
              <div className="creatix-footer-col-title">COMPANY</div>
              <div className="creatix-footer-links">
                <a href="#about" className="creatix-footer-link">About Us</a>
                <a href="#services" className="creatix-footer-link">Our Work</a>
                <a href="#contact" className="creatix-footer-link">Careers</a>
                <a href="#contact" className="creatix-footer-link">Contact Us</a>
                <a href="#about" className="creatix-footer-link">Blog & Insights</a>
              </div>
            </div>

            {/* Column 2: Support */}
            <div>
              <div className="creatix-footer-col-title">SUPPORT</div>
              <div className="creatix-footer-links">
                <a href="#contact" className="creatix-footer-link">Getting Started</a>
                <a href="#contact" className="creatix-footer-link">Help Center</a>
                <a href="#contact" className="creatix-footer-link">Server Status</a>
                <a href="#contact" className="creatix-footer-link">Report a Bug</a>
                <a href="#contact" className="creatix-footer-link">Chat Support</a>
              </div>
            </div>

            {/* Column 3: Products */}
            <div>
              <div className="creatix-footer-col-title">PRODUCTS</div>
              <div className="creatix-footer-links">
                <a href="#services" className="creatix-footer-link">Features</a>
                <a href="#services" className="creatix-footer-link">Pricing</a>
                <a href="#services" className="creatix-footer-link">Mobile Apps</a>
                <a href="#services" className="creatix-footer-link">Desktop Apps</a>
                <a href="#services" className="creatix-footer-link">Security Overview</a>
              </div>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <div className="creatix-footer-col-title">SUBSCRIBE TO OUR NEWSLETTER</div>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(12, 13, 17, 0.75)', marginBottom: 12, lineHeight: 1.4 }}>
                Get our weekly design case studies, agency inspirations, and UX breakdowns directly in your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="creatix-newsletter-form">
                <div className="creatix-newsletter-input-pill">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <button type="submit" className="btn-newsletter-subscribe">
                    Subscribe →
                  </button>
                </div>
                {newsletterSubmitted && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#000000' }}>
                    ✓ Subscribed! Welcome to Creatix.
                  </span>
                )}
              </form>
            </div>
          </div>

          {/* Footer Bottom Row */}
          <div className="creatix-footer-bottom">
            <div>© {new Date().getFullYear()} Creatix. All rights reserved.</div>
            <div className="creatix-social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="creatix-social-icon" aria-label="Instagram">
                <InstagramIcon size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="creatix-social-icon" aria-label="Twitter">
                <TwitterIcon size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="creatix-social-icon" aria-label="LinkedIn">
                <LinkedInIcon size={18} />
              </a>
              <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="creatix-social-icon" aria-label="Dribbble">
                <DribbbleIcon size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="creatix-social-icon" aria-label="GitHub">
                <GithubIcon size={18} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

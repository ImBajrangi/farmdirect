import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  PhoneOff,
  Mic,
  Calendar,
  Pill,
  Clock,
  CheckCircle2,
  Check,
  ShieldCheck,
  ArrowRight,
  Zap,
  Sparkles,
} from 'lucide-react';
import SlingButton from '@/components/ui/SlingButton';
import './visualpoetry.css';

export const VisualPoetryPage: React.FC = () => {
  const navigate = useNavigate();

  // Interactive Live Phone Demo State on Landing Page
  const [isDemoCalling, setIsDemoCalling] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<'idle' | 'greeting' | 'replied' | 'confirmed'>('idle');
  const [demoUserChoice, setDemoUserChoice] = useState<string>('');
  const [demoAiResponse, setDemoAiResponse] = useState<string>('');

  const handleStartDemoCall = () => {
    setIsDemoCalling(true);
    setDemoStep('greeting');
    setDemoUserChoice('');
    setDemoAiResponse('');
  };

  const handleEndDemoCall = () => {
    setIsDemoCalling(false);
    setDemoStep('idle');
    setDemoUserChoice('');
    setDemoAiResponse('');
  };

  const handleUserSelectPrompt = (choice: string) => {
    setDemoUserChoice(choice);
    setDemoStep('replied');

    setTimeout(() => {
      if (choice.includes('appointment') || choice.includes('checkup')) {
        setDemoAiResponse(
          'I checked Dr. Vance’s schedule and have an opening this Thursday at 10:30 AM or 3:15 PM. Shall I reserve the 10:30 AM slot for you?'
        );
      } else if (choice.includes('refill')) {
        setDemoAiResponse(
          'I can send an electronic refill request right away. Should we route this to your usual pharmacy on Main St?'
        );
      } else {
        setDemoAiResponse(
          'We are open Monday through Friday from 8:00 AM to 6:00 PM, and we accept Aetna, Blue Cross, Medicare, and UnitedHealthcare.'
        );
      }
    }, 450);
  };

  const handleConfirmBooking = () => {
    setDemoStep('confirmed');
    setDemoAiResponse(
      '✅ You are officially booked for Thursday, Oct 22 at 10:30 AM with Dr. Vance. We just sent an SMS confirmation to your phone!'
    );
  };

  return (
    <div className="vp-page-wrapper">
      {/* ── 1. Top Header Capsule Navbar ──────────────────────────────────── */}
      <header className="oc-header" role="banner">
        <div className="oc-header-inner">
          {/* Brand Identity with Squircle Icon */}
          <div className="oc-brand">
            <Link to="/" className="oc-brand-link" aria-label="OpenCall Home">
              <div className="oc-logo-icon oc-morph-blob">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none" className="oc-logo-svg">
                  <circle cx="16.5" cy="11.5" r="6.2" fill="#0f2e22" />
                  <circle cx="11.5" cy="16.5" r="6.2" stroke="#0f2e22" strokeWidth="2.2" fill="none" />
                </svg>
              </div>
              <span className="oc-brand-name">
                OpenCall<strong>.ai</strong>
              </span>
            </Link>
          </div>

          {/* Center Navigation Capsule Pill */}
          <nav className="oc-nav-pill" aria-label="Primary navigation">
            <a href="#hero" className="oc-nav-item">
              <span>Overview</span>
            </a>
            <a href="#demo" className="oc-nav-item">
              <span>Live Phone Demo</span>
            </a>
            <a href="#how-it-works" className="oc-nav-item">
              <span>How It Works</span>
            </a>
            <a href="#pricing" className="oc-nav-item">
              <span>Pricing</span>
            </a>
          </nav>

          {/* Right Action Header Buttons */}
          <div className="oc-header-actions">
            <Link to="/app" className="oc-sales-btn" aria-label="Launch SaaS Platform">
              <span>Launch App</span>
              <span className="oc-signin-arrow">&gt;</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── 2. Master Hero Section (Signature OpenCall Showcase) ──────────── */}
      <section className="oc-hero-section" id="hero">
        <div className="oc-hero-inner">
          {/* Headline with animated entrance & lime underline */}
          <div className="oc-hero-centered-header">
            <div style={{ marginBottom: '14px' }}>
              <span className="oc-section-eyebrow">
                AI CLINICAL VOICE RECEPTIONIST
              </span>
            </div>
            <h1 className="oc-hero-main-title">
              <span className="oc-title-word">AI</span>{' '}
              <span className="oc-title-word">that</span>{' '}
              <span className="oc-title-word">talks,</span>{' '}
              <span className="oc-title-word">texts</span>{' '}
              <span className="oc-title-word">and</span>{' '}
              <span className="oc-title-highlight">
                <span className="oc-highlight-text">gets it done</span>
                <svg className="oc-title-underline-svg" viewBox="0 0 240 12" fill="none" preserveAspectRatio="none">
                  <path d="M4 8 C 65 2, 175 10, 236 5" stroke="#d9f758" strokeWidth="4.5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="oc-hero-subtitle">
              OpenCall answers every clinic phone call within 1 second, books patients directly into your schedule, and eliminates front-desk hold times 24/7.
            </p>
          </div>

          {/* Main 2-Column Split Stage */}
          <div className="oc-hero-grid">
            {/* Left Card: The Bottleneck Breaker */}
            <div className="oc-bottleneck-card">
              <h2 className="oc-card-headline">
                You know the bottleneck.{' '}
                <span className="oc-highlight-pill">Let's break it.</span>
              </h2>
              <p className="oc-card-desc">
                Missed calls and long phone trees frustrate patients and overwhelm clinic staff. OpenCall answers instantly, verifies insurance, and confirms appointments directly in your calendar.
              </p>

              <div className="oc-feature-pills">
                <div className="oc-feature-pill">
                  <span className="oc-check-circle">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>Zero patient hold time — answers in 1s</span>
                </div>
                <div className="oc-feature-pill">
                  <span className="oc-check-circle">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>Automatic two-way calendar & EHR sync</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3 Key Practice Metrics */}
            <div className="oc-stats-col">
              <div className="oc-stats-eyebrow">
                CLINIC IMPACT WITH OPENCALL
              </div>

              <div className="oc-metric-rows">
                <div className="oc-metric-row">
                  <div className="oc-metric-num">100%</div>
                  <div className="oc-metric-body">
                    <div className="oc-metric-head">
                      <span className="oc-metric-title">Zero missed patient calls</span>
                      <span className="oc-metric-idx">01</span>
                    </div>
                    <p className="oc-metric-desc">
                      Every caller reaches a warm, intelligent assistant instead of a voicemail box.
                    </p>
                  </div>
                </div>

                <div className="oc-metric-row">
                  <div className="oc-metric-num">0 sec</div>
                  <div className="oc-metric-body">
                    <div className="oc-metric-head">
                      <span className="oc-metric-title">Average patient wait time</span>
                      <span className="oc-metric-idx">02</span>
                    </div>
                    <p className="oc-metric-desc">
                      Instant pickup removes front-desk phone fatigue and keeps patients loyal.
                    </p>
                  </div>
                </div>

                <div className="oc-metric-row">
                  <div className="oc-metric-num">$20k</div>
                  <div className="oc-metric-body">
                    <div className="oc-metric-head">
                      <span className="oc-metric-title">Monthly recovered care per clinic</span>
                      <span className="oc-metric-idx">03</span>
                    </div>
                    <p className="oc-metric-desc">
                      Uncaptured appointments converted into confirmed visits on your calendar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Interactive Mascot Pill */}
              <div className="oc-mascot-wrapper">
                <a
                  href="#demo"
                  className="oc-mascot-bubble"
                  title="Try interactive AI voice demo"
                >
                  <Mic size={14} strokeWidth={2.4} />
                  <span>Try it live!</span>
                </a>

                <div className="oc-mascot-face">
                  <div className="oc-mascot-eye eye-left" />
                  <div className="oc-mascot-eye eye-right" />
                  <div className="oc-mascot-slingshot">
                    <SlingButton
                      size={34}
                      strokeWidth={1.5}
                      padColor="#d9f758"
                      iconColor="#0f2e22"
                      wellColor="rgba(217, 247, 88, 0.25)"
                      bandColor="rgba(217, 247, 88, 0.6)"
                      accentColor="#d9f758"
                      onSend={() => navigate('/app')}
                      ariaLabel="Launch AI Demo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Live Phone Sandbox on Landing Page ─────────────── */}
      <section className="oc-landing-section" id="demo">
        <div className="oc-landing-container">
          <div className="oc-section-header">
            <span className="oc-section-eyebrow">Interactive Live Sandbox</span>
            <h2 className="oc-section-title">Hear OpenCall in Action</h2>
            <p className="oc-section-desc">
              Test how natural, fast, and helpful your AI receptionist is. Click below to simulate a real patient calling your clinic.
            </p>
          </div>

          <div className="oc-live-demo-card">
            {/* Left side: Context & CTA */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className="oc-green-pulse" />
                <span style={{ fontSize: '0.84375rem', fontWeight: 800, color: '#0f2e22' }}>
                  St. Jude Clinic Demo Phone Line
                </span>
              </div>

              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f2e22', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                {isDemoCalling ? 'Call Connected with Sarah (AI)' : 'Ready to Test Call'}
              </h3>
              <p style={{ color: '#4a6356', fontSize: '0.9375rem', lineHeight: 1.5, margin: '0 0 24px' }}>
                OpenCall speaks with natural human cadence, understands clinical context, answers insurance questions, and books appointments into your calendar in under 30 seconds.
              </p>

              {!isDemoCalling ? (
                <button
                  onClick={handleStartDemoCall}
                  className="oc-sim-call-btn start"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: '1rem' }}
                >
                  <Phone size={18} />
                  <span>Call Receptionist (Live Demo)</span>
                </button>
              ) : (
                <button
                  onClick={handleEndDemoCall}
                  className="oc-sim-call-btn hangup"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: '1rem' }}
                >
                  <PhoneOff size={18} />
                  <span>End Call</span>
                </button>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '20px', fontSize: '0.8125rem', color: '#728a7e', fontWeight: 600 }}>
                <span>⚡ Sub-second response</span>
                <span>•</span>
                <span>📅 Live calendar booking</span>
                <span>•</span>
                <span>🔒 HIPAA safe</span>
              </div>
            </div>

            {/* Right side: Virtual Phone Mockup */}
            <div className="oc-demo-phone-mockup">
              <div className="oc-demo-phone-header">
                <span style={{ fontSize: '0.78125rem', fontWeight: 700, color: '#1f6443' }}>
                  {isDemoCalling ? '● LIVE CALL IN PROGRESS' : '● SIMULATOR READY'}
                </span>
                <span style={{ fontSize: '0.78125rem', color: '#728a7e' }}>Line: (555) 019-8821</span>
              </div>

              <div className="oc-demo-phone-screen">
                {!isDemoCalling ? (
                  <div style={{ textAlign: 'center', padding: '40px 16px', color: '#728a7e' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#d9f758', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <Phone size={22} color="#0f2e22" />
                    </div>
                    <h4 style={{ margin: '0 0 6px', color: '#0f2e22', fontSize: '1rem', fontWeight: 800 }}>
                      Test the Phone Experience
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.84375rem', lineHeight: 1.4 }}>
                      Click "Call Receptionist" on the left to experience an incoming clinical call.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Turn 1: Agent Greeting */}
                    <div className="oc-demo-chat-turn">
                      <div style={{ fontSize: '0.7rem', color: '#1f6443', fontWeight: 700, marginBottom: '4px' }}>
                        Sarah (OpenCall AI) • 0:01
                      </div>
                      <div className="oc-demo-bubble agent">
                        Hello, thank you for calling St. Jude Clinic! I'm Sarah, your automated receptionist. How can I help you today?
                      </div>
                    </div>

                    {/* Turn 2: User Prompt if selected */}
                    {demoUserChoice && (
                      <div className="oc-demo-chat-turn" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: '0.7rem', color: '#728a7e', fontWeight: 700, marginBottom: '4px' }}>
                          You (Caller)
                        </div>
                        <div className="oc-demo-bubble user">
                          "{demoUserChoice}"
                        </div>
                      </div>
                    )}

                    {/* Turn 3: AI Response */}
                    {demoAiResponse && (
                      <div className="oc-demo-chat-turn">
                        <div style={{ fontSize: '0.7rem', color: '#1f6443', fontWeight: 700, marginBottom: '4px' }}>
                          Sarah (OpenCall AI) • 210ms
                        </div>
                        <div className="oc-demo-bubble agent" style={{ background: demoStep === 'confirmed' ? '#e2ede5' : '#f3f7f4' }}>
                          {demoAiResponse}
                        </div>

                        {demoStep === 'replied' && demoUserChoice.includes('appointment') && (
                          <div style={{ marginTop: '10px' }}>
                            <button
                              onClick={handleConfirmBooking}
                              style={{
                                background: '#0f2e22',
                                color: '#d9f758',
                                border: 'none',
                                borderRadius: '9999px',
                                padding: '8px 18px',
                                fontSize: '0.8125rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                            >
                              Confirm Thursday 10:30 AM Slot
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Clickable scenario chips */}
                    {demoStep === 'greeting' && (
                      <div className="oc-demo-chips">
                        <span style={{ fontSize: '0.75rem', color: '#728a7e', fontWeight: 700 }}>Choose what to say:</span>
                        <button
                          className="oc-demo-chip-btn"
                          onClick={() => handleUserSelectPrompt('I want to book a checkup with Dr. Vance')}
                        >
                          📅 "I want to book a checkup with Dr. Vance"
                        </button>
                        <button
                          className="oc-demo-chip-btn"
                          onClick={() => handleUserSelectPrompt('Can I get my prescription refilled?')}
                        >
                          💊 "Can I get my prescription refilled?"
                        </button>
                        <button
                          className="oc-demo-chip-btn"
                          onClick={() => handleUserSelectPrompt('What are your clinic hours and insurance plans?')}
                        >
                          ⏰ "What are your clinic hours and insurance plans?"
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. How It Works (3 Dead-Simple Steps) ─────────────────────────── */}
      <section className="oc-landing-section" id="how-it-works" style={{ background: '#ffffff' }}>
        <div className="oc-landing-container">
          <div className="oc-section-header">
            <span className="oc-section-eyebrow">3-Step Implementation</span>
            <h2 className="oc-section-title">How OpenCall Works</h2>
            <p className="oc-section-desc">
              No new phone numbers. No complicated software installations. Up and running for your practice in under 10 minutes.
            </p>
          </div>

          <div className="oc-steps-grid">
            <div className="oc-step-card">
              <div className="oc-step-icon-badge">
                <Phone size={22} />
              </div>
              <h3>1. Keep Your Existing Number</h3>
              <p>
                Simply forward your office phone line to OpenCall when your desk is busy or after-hours. Patients dial the exact same clinic number they have always called.
              </p>
            </div>

            <div className="oc-step-card">
              <div className="oc-step-icon-badge">
                <Zap size={22} />
              </div>
              <h3>2. AI Answers in 1 Second</h3>
              <p>
                Our clinical voice assistant answers immediately with a warm, natural voice. It verifies insurance, checks symptoms, and answers patient questions accurately.
              </p>
            </div>

            <div className="oc-step-card">
              <div className="oc-step-icon-badge">
                <Calendar size={22} />
              </div>
              <h3>3. Appointments Auto-Sync</h3>
              <p>
                Confirmed appointments appear directly in your Google Calendar or EHR (Epic, Athena, Cerner), and the patient receives an instant SMS confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Transparent Simple Pricing ──────────────────────────────────── */}
      <section className="oc-landing-section" id="pricing">
        <div className="oc-landing-container">
          <div className="oc-section-header">
            <span className="oc-section-eyebrow">Simple, Transparent Pricing</span>
            <h2 className="oc-section-title">Choose the Right Plan for Your Clinic</h2>
            <p className="oc-section-desc">
              Cancel or change plans anytime. No hidden setup fees.
            </p>
          </div>

          <div className="oc-pricing-grid">
            {/* Solo Practice */}
            <div className="oc-pricing-card">
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2e22', margin: '0 0 6px' }}>
                  Solo Practice
                </h3>
                <p style={{ color: '#4a6356', fontSize: '0.875rem', margin: 0 }}>
                  For individual practitioners and boutique dental clinics.
                </p>
              </div>

              <div className="oc-pricing-price">
                $49 <span>/ month</span>
              </div>

              <ul className="oc-pricing-features">
                <li><CheckCircle2 size={16} color="#10b981" /> Up to 250 calls included</li>
                <li><CheckCircle2 size={16} color="#10b981" /> 1 Dedicated clinic phone line</li>
                <li><CheckCircle2 size={16} color="#10b981" /> Google & Outlook calendar sync</li>
                <li><CheckCircle2 size={16} color="#10b981" /> Automated SMS appointment confirmations</li>
                <li><CheckCircle2 size={16} color="#10b981" /> Full call audio transcripts & summaries</li>
              </ul>

              <Link to="/app" className="oc-pricing-btn secondary">
                Get Started
              </Link>
            </div>

            {/* Clinic Pro */}
            <div className="oc-pricing-card featured">
              <div className="oc-pricing-badge">MOST POPULAR</div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f2e22', margin: '0 0 6px' }}>
                  Clinic Pro
                </h3>
                <p style={{ color: '#4a6356', fontSize: '0.875rem', margin: 0 }}>
                  For busy multi-provider practices with high call volume.
                </p>
              </div>

              <div className="oc-pricing-price">
                $149 <span>/ month</span>
              </div>

              <ul className="oc-pricing-features">
                <li><CheckCircle2 size={16} color="#10b981" /> Unlimited patient calls</li>
                <li><CheckCircle2 size={16} color="#10b981" /> Up to 5 phone lines & multiple departments</li>
                <li><CheckCircle2 size={16} color="#10b981" /> Direct EHR integration (Athena, Epic, Cerner)</li>
                <li><CheckCircle2 size={16} color="#10b981" /> Urgent clinical triage routing to on-call nurse</li>
                <li><CheckCircle2 size={16} color="#10b981" /> HIPAA Business Associate Agreement (BAA)</li>
              </ul>

              <Link to="/app" className="oc-pricing-btn primary">
                Launch Clinic Pro &gt;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Clean Healthcare Footer ─────────────────────────────────────── */}
      <footer className="oc-footer-clean">
        <div className="oc-footer-inner-clean">
          <div className="oc-footer-top-clean">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="oc-simple-logo" style={{ width: '32px', height: '32px' }}>
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <circle cx="16.5" cy="11.5" r="6.2" fill="#0f2e22" />
                  <circle cx="11.5" cy="16.5" r="6.2" stroke="#0f2e22" strokeWidth="2.2" fill="none" />
                </svg>
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2e22' }}>
                OpenCall<strong>.ai</strong>
              </span>
            </div>

            <div className="oc-footer-trust-strip">
              <span>🛡️ HIPAA Compliant</span>
              <span>⚡ Sub-Second Audio</span>
              <span>🔒 256-Bit SSL</span>
            </div>

            <Link
              to="/app"
              style={{
                background: '#0f2e22',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '9px 20px',
                borderRadius: '9999px',
                fontSize: '0.84375rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Open SaaS Console</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="oc-footer-bottom-clean">
            <span>© 2026 OpenCall.ai Inc. Built for modern medical & dental practices.</span>
            <div style={{ display: 'flex', gap: '18px' }}>
              <a href="#hero" style={{ color: '#728a7e', textDecoration: 'none' }}>Overview</a>
              <a href="#demo" style={{ color: '#728a7e', textDecoration: 'none' }}>Live Demo</a>
              <a href="#pricing" style={{ color: '#728a7e', textDecoration: 'none' }}>Pricing</a>
              <Link to="/app" style={{ color: '#728a7e', textDecoration: 'none' }}>SaaS App</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

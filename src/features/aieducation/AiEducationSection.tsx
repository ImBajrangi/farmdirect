import React, { useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import LaserFlow from '@/components/ui/LaserFlow';
import './aieducation.css';

interface AiEducationSectionProps {
  isDark?: boolean;
}

export const AiEducationSection: React.FC<AiEducationSectionProps> = ({ isDark = false }) => {
  const [activeTag, setActiveTag] = useState('Personalized learning');

  return (
    <section id="ai-education" className={`ai-section-wrapper ${isDark ? "ai-dark-theme" : ""}`}>
      <div className="ai-card-container">
        {/* ─── Editorial Section Kicker Bar ─────────────────────────────── */}
        <div className="ai-section-eyebrow-bar">
          <div className="ai-section-index-pill">
            <span className="ai-index-num">02</span>
            <span className="ai-index-sep">/</span>
            <span className="ai-index-title">AI-DRIVEN ADAPTIVE EDUCATION</span>
          </div>
          <div className="ai-section-status-chip">
            <span className="ai-pulse-dot" />
            <span>Neural Synthesis Engine v4.2 · Live</span>
          </div>
        </div>

        {/* ─── Hero Content Grid ────────────────────────────────────────── */}
        <div className="ai-hero-content-grid">
          {/* Left Main Headline Column */}
          <div className="ai-headline-col">
            <div className="ai-title-line line-1">
              <span className="ai-title-text light">REVOLUTIONIZE</span>
            </div>

            <div className="ai-title-line line-2">
              <span className="ai-title-text bold">LEARNING</span>
              <span className="ai-inline-badge">WITH</span>
            </div>

            <div className="ai-title-line line-3">
              <span className="ai-title-text bold">AI-DRIVEN</span>
            </div>

            <div className="ai-title-line line-4">
              <span className="ai-title-text light">EDUCATION</span>
            </div>
          </div>

          {/* Right Top Card: Dark Holographic Card with Volumetric LaserFlow */}
          <div className="ai-black-card">
            {/* Real-time WebGL Volumetric Laser Beam Flow */}
            <div className="ai-black-card-laser-bg">
              <LaserFlow
                color="#4f46e5"
                beamPosition={0.58}
                surfaceLevel={0.88}
                intensity={1.5}
                beamWidth={1.3}
                fog={0.3}
                dust={1.4}
                speed={1.2}
                mouseInteraction={true}
              />
            </div>
            <div className="ai-black-card-waves" />
            <div className="ai-black-card-header">
              <span className="ai-welcome-pill">Welcome</span>
              <span className="ai-asterisk-star">✱</span>
            </div>
            <p className="ai-black-card-desc">
              Discover a new way of learning with our AI-powered online platform. Achieve your
              goals and succeed with us.
            </p>
          </div>
        </div>

        {/* ─── Middle / Bottom Bento Grid ───────────────────────────────── */}
        <div className="ai-bento-grid">
          {/* Middle Left: Rotating Circular Star Badge & 3D Brain Card */}
          <div className="ai-brain-column">
            {/* Rotating Circular Text Badge */}
            <div className="ai-rotating-badge-wrapper">
              <svg viewBox="0 0 100 100" className="ai-rotating-badge-svg">
                <defs>
                  <path
                    id="ai-badge-circle-path"
                    d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                  />
                </defs>
                <text className="ai-rotating-text">
                  <textPath href="#ai-badge-circle-path" startOffset="0%">
                    DON'T JUST STUDY, EXCEL WITH OUR PERSONALIZED APPROACH •
                  </textPath>
                </text>
              </svg>
              {/* Center 4-Point Star Sparkle */}
              <div className="ai-center-star">
                <Sparkles size={16} fill="#0e0e10" color="#0e0e10" />
              </div>
            </div>

            {/* 3D Neural Brain Hologram Card */}
            <div className="ai-brain-card">
              <img
                src="/images/ai_brain_hd.jpg"
                alt="3D Holographic AI Brain"
                className="ai-brain-img"
              />
            </div>

            {/* Metrics Row (137 Courses + 12k Learners) */}
            <div className="ai-metrics-row">
              {/* White Card: 137 Courses */}
              <div className="ai-stat-card white">
                <span className="ai-stat-number">137</span>
                <span className="ai-stat-label">Courses</span>
              </div>

              {/* Dark Card: 12k Learners */}
              <div className="ai-stat-card dark">
                <span className="ai-stat-number">12k</span>
                <span className="ai-stat-label">Learners</span>
              </div>
            </div>
          </div>

          {/* Right Bento: Featured Electric Lime "Flexible" Card ─────────── */}
          <div className="ai-lime-card">
            {/* Top Interactive Filter Pills */}
            <div className="ai-lime-pills-row">
              <button
                className={`ai-lime-pill ${activeTag === 'Personalized learning' ? 'active' : ''}`}
                onClick={() => setActiveTag('Personalized learning')}
              >
                Personalized learning
              </button>
              <button
                className={`ai-lime-pill ${activeTag === 'Online education' ? 'active' : ''}`}
                onClick={() => setActiveTag('Online education')}
              >
                Online education
              </button>
              <button
                className={`ai-lime-pill ${activeTag === 'AI' ? 'active' : ''}`}
                onClick={() => setActiveTag('AI')}
              >
                AI
              </button>
            </div>

            {/* Large Bold Title */}
            <h3 className="ai-lime-title">Flexible</h3>

            {/* Bottom Row: Description and Large Action Arrow */}
            <div className="ai-lime-bottom-row">
              <p className="ai-lime-description">
                Our cutting-edge technology adapts to your needs and provides a tailored
                curriculum that helps you succeed. Experience the future of education today.
              </p>
              <div className="ai-lime-arrow-btn">
                <ArrowUpRight size={44} strokeWidth={2.6} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

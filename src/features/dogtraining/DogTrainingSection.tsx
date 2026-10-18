import React, { useState } from 'react';
import { Video, Zap, Award, ArrowRight, CheckCircle2, Star, Volume2, Mic, PhoneOff, PawPrint, Heart, BookOpen, Compass } from 'lucide-react';
import './dogtraining.css';

interface DogTrainingSectionProps {
  isDark?: boolean;
}

export const DogTrainingSection: React.FC<DogTrainingSectionProps> = ({ isDark = false }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'puppy' | 'obedience' | 'behavior'>('all');
  const [callActive, setCallActive] = useState<boolean>(true);

  return (
    <section id="dog-training" className={`dog-section-wrapper ${isDark ? "dog-dark-theme" : ""}`}>
      <div className="dog-container">
        {/* ─── Part 1: Hero Top (Light Canvas with Beagle Dog) ──────────────── */}
        <div className="dog-hero-top">
        {/* ─── Editorial Section Kicker Bar ─────────────────────────────── */}
        <div className="dog-section-eyebrow-bar">
          <div className="dog-section-index-pill">
            <span className="dog-index-num">03</span>
            <span className="dog-index-sep">/</span>
            <span className="dog-index-title">CANINE BEHAVIORAL EXCELLENCE</span>
          </div>
          <div className="dog-section-status-chip">
            <PawPrint size={14} className="dog-kicker-paw" />
            <span>Draultrien Certified Coaching · Worldwide</span>
          </div>
        </div>

          {/* Hero Row: Left Text & Right Beagle Portrait */}
          <div className="dog-hero-row">
            {/* Left Headline & Pitch */}
            <div className="dog-hero-left">
              <span className="dog-eyebrow-tag">Smart Online Coaching</span>
              <h2 className="dog-hero-title">
                Train Your <br />
                Dog From <br />
                Home Worldwide.
              </h2>
              <p className="dog-hero-subtitle">
                Professional online dog training courses with certified canine behaviorists
                and trainers. Build lasting trust, obedience, and joy from your living room.
              </p>
              <div className="dog-hero-cta-wrap">
                <button className="dog-cta-primary">
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Right Beagle Dog Hero Image */}
            <div className="dog-hero-right">
              <div className="dog-photo-frame">
                <img
                  src="/images/dog_beagle_hero.jpg"
                  alt="Beagle dog sitting attentively in modern living room"
                  className="dog-hero-img"
                />
                <div className="dog-verified-badge">
                  <CheckCircle2 size={16} className="dog-check-icon" />
                  <span>Certified Behaviorist Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Part 2: Middle Dramatic Dark Organic Section ───────────────── */}
        <div className="dog-dark-card">
          <div className="dog-dark-top-row">
            {/* Left: Free Session CTA */}
            <div className="dog-dark-left">
              <h3 className="dog-dark-title">
                Start Your Dog <br />
                Free Session.
              </h3>
              <p className="dog-dark-desc">
                Connect 1-on-1 with master canine trainers. Experience live real-time feedback,
                habit correction, and step-by-step guidance.
              </p>
              <div className="dog-dark-btns">
                <button className="dog-btn-white">
                  Start Track
                </button>
                <button className="dog-btn-outline">
                  Meet Trainer
                </button>
              </div>
            </div>

            {/* Right: Realistic Laptop Mockup with Live Video Call */}
            <div className="dog-dark-right">
              <div className="dog-laptop-mockup">
                {/* Laptop Lid / Bezel */}
                <div className="dog-laptop-lid">
                  {/* Laptop Camera Dot */}
                  <div className="dog-laptop-cam" />

                  {/* Laptop Screen Content */}
                  <div className="dog-laptop-screen">
                    <img
                      src="/images/dog_trainer_laptop.jpg"
                      alt="Trainer working with dog in video call"
                      className="dog-laptop-stream-img"
                    />

                    {/* In-Call Live Overlay */}
                    <div className="dog-call-overlay-top">
                      <div className="dog-live-indicator">
                        <span className="dog-live-dot" />
                        <span>LIVE 1-ON-1</span>
                      </div>
                      <div className="dog-trainer-tag">
                        <span>Marcus Vance, Senior K9 Coach</span>
                      </div>
                    </div>

                    {/* In-Call Controls Bar */}
                    <div className="dog-call-controls">
                      <div className="dog-call-btn">
                        <Mic size={14} />
                      </div>
                      <div className="dog-call-btn">
                        <Volume2 size={14} />
                      </div>
                      <div className="dog-call-btn end-call">
                        <PhoneOff size={14} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Laptop Base Stand */}
                <div className="dog-laptop-base" />
              </div>
            </div>
          </div>

          {/* ─── Part 3: 3 Bento Feature Cards ─────────────────────────────── */}
          <div className="dog-bento-row">
            {/* Card 1: Live Video Session */}
            <div className="dog-bento-card">
              <div className="dog-bento-icon-badge">
                <Video size={18} />
              </div>
              <h4 className="dog-bento-card-title">Live Video Session.</h4>
              <p className="dog-bento-card-text">
                Interactive real-time video coaching tailored to your dog&rsquo;s temperament and daily routines.
              </p>
            </div>

            {/* Card 2: Interactive Courses */}
            <div className="dog-bento-card">
              <div className="dog-bento-icon-badge">
                <Zap size={18} />
              </div>
              <h4 className="dog-bento-card-title">Interactive Courses.</h4>
              <p className="dog-bento-card-text">
                Self-paced video modules from basic puppy socialization to advanced off-leash obedience.
              </p>
            </div>

            {/* Card 3: Progress Tracking */}
            <div className="dog-bento-card">
              <div className="dog-bento-icon-badge">
                <Award size={18} />
              </div>
              <h4 className="dog-bento-card-title">Progress Tracking.</h4>
              <p className="dog-bento-card-text">
                Track daily behavioral milestones, habit mastery, and unlock trainer-endorsed certificates.
              </p>
            </div>
          </div>

          {/* ─── Part 4: Bottom Testimonial & Social Icon Dock ─────────────── */}
          <div className="dog-dark-footer-row">
            <div className="dog-testimonial-block">
              <span className="dog-test-label">Program Review</span>
              <p className="dog-test-quote">
                &ldquo;Our rescue beagle went from constant barking to completely calm recall in just three weeks. The live trainer feedback made all the difference!&rdquo;
              </p>
              <div className="dog-test-author">
                <div className="dog-stars">
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                </div>
                <span>Sarah Jenkins &mdash; Beagle Parent</span>
              </div>
            </div>

            {/* Icon Pill Dock */}
            <div className="dog-icons-dock">
              <button className="dog-dock-item" title="K9 Training Community" aria-label="Community">
                <Heart size={16} />
              </button>
              <button className="dog-dock-item" title="Canine Curriculum" aria-label="Curriculum">
                <BookOpen size={16} />
              </button>
              <button className="dog-dock-item active" title="Draultrien Certified" aria-label="Certified">
                <PawPrint size={18} />
              </button>
              <button className="dog-dock-item" title="Behavior Exploration" aria-label="Explore">
                <Compass size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

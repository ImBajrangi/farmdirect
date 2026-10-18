import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Scale,
  Award,
  Truck,
  Clock,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Coins
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="lp-page-wrapper">
      <Link to="/" className="lp-back-link">
        <ArrowLeft size={14} />
        <span>Return to Home</span>
      </Link>

      <div className="lp-header centered">
        <div className="lp-kicker-pill">
          <span>🌱</span>
          <span>Our Agricultural Mission</span>
        </div>
        <h1 className="lp-title">
          About FarmDirect
        </h1>
        <p className="lp-subtitle">
          Reinventing farmgate-to-fork commerce for rural farmers and conscious urban households in India.
        </p>
      </div>

      {/* High-Impact Agricultural Metrics Strip */}
      <div className="lp-stats-strip">
        <div className="lp-stat-pill">
          <div className="lp-stat-num">85%+</div>
          <div className="lp-stat-label">Farmgate Share</div>
        </div>
        <div className="lp-stat-pill">
          <div className="lp-stat-num">0</div>
          <div className="lp-stat-label">Mandi Middlemen</div>
        </div>
        <div className="lp-stat-pill">
          <div className="lp-stat-num">&lt;12h</div>
          <div className="lp-stat-label">Harvest to Plate</div>
        </div>
        <div className="lp-stat-pill">
          <div className="lp-stat-num">100%</div>
          <div className="lp-stat-label">7/12 Land Verified</div>
        </div>
      </div>

      {/* Main Document Content Card */}
      <div className="lp-card">
        {/* Section 1: The Problem (Warm Earth Amber Agricultural Theme) */}
        <section className="lp-section">
          <h2 className="lp-section-title">
            The Problem with Traditional Produce Supply Chains
          </h2>
          <p className="lp-text">
            In conventional Indian agriculture, every harvest travels through 4 to 6 tiers of intermediary commission cartels—village brokers, wholesale APMC mandis, transport loaders, secondary city distributors, and roadside cart vendors. By the time it arrives on a customer's plate 48 to 72 hours later:
          </p>

          <div className="lp-grid-3">
            <div className="lp-feature-card problem">
              <div className="lp-icon-squircle amber">
                <Coins size={18} />
              </div>
              <h3 className="lp-feature-title">🌾 APMC Middlemen Margin Loss</h3>
              <p className="lp-feature-desc">
                Growers receive barely ₹20 to ₹35 of every ₹100 paid by consumers. 4 to 6 tiers of commission agents siphon up to 70% of crop value.
              </p>
            </div>

            <div className="lp-feature-card problem">
              <div className="lp-icon-squircle amber">
                <Clock size={18} />
              </div>
              <h3 className="lp-feature-title">⏳ 48–72h Mandi Transit Delay</h3>
              <p className="lp-feature-desc">
                Perishable crops sit for days in humid holding yards and transit trucks, losing natural morning dew crispness and vital nutrition.
              </p>
            </div>

            <div className="lp-feature-card problem">
              <div className="lp-icon-squircle amber">
                <AlertCircle size={18} />
              </div>
              <h3 className="lp-feature-title">⚠️ Unverified 'Organic' Markup</h3>
              <p className="lp-feature-desc">
                Produce is stamped with uncertified 'organic' stickers in city stores with zero authentic lab testing or genuine farm traceability.
              </p>
            </div>
          </div>
        </section>

        <hr className="lp-section-divider" />

        {/* Section 2: FarmDirect Commitment (Lush Farmgate Emerald Green) */}
        <section className="lp-section">
          <h2 className="lp-section-title">
            The FarmDirect Commitment
          </h2>
          <p className="lp-text">
            FarmDirect was established in the fertile agriculture corridor of Maharashtra (Nashik – Pune) to restore direct dignity, honesty, and financial equity to Indian cultivation:
          </p>

          <div className="lp-grid-3">
            <div className="lp-feature-card solution">
              <div className="lp-icon-squircle emerald">
                <CheckCircle2 size={18} />
              </div>
              <h3 className="lp-feature-title">🌱 85%+ Straight to Kisan</h3>
              <p className="lp-feature-desc">
                Customer payments flow directly into verified farmer bank/UPI accounts with transparent, negligible platform overhead.
              </p>
            </div>

            <div className="lp-feature-card solution">
              <div className="lp-icon-squircle emerald">
                <Award size={18} />
              </div>
              <h3 className="lp-feature-title">📜 Authentic 7/12 & Lab Proof</h3>
              <p className="lp-feature-desc">
                We never label produce 'certified organic' without authentic NPOP/PGS lab documents. Farmers verify genuine 7/12 land records.
              </p>
            </div>

            <div className="lp-feature-card solution">
              <div className="lp-icon-squircle emerald">
                <Truck size={18} />
              </div>
              <h3 className="lp-feature-title">🌅 Dawn Harvest Express</h3>
              <p className="lp-feature-desc">
                Crops are harvested at sunrise and dispatched directly to your doorstep in active Maharashtra corridors within 12 hours.
              </p>
            </div>
          </div>

          <div className="lp-trust-box">
            <div className="lp-trust-box-icon">
              <ShieldCheck size={20} />
            </div>
            <div className="lp-trust-box-content">
              <strong>Pilot Agricultural Corridor:</strong> Currently empowering direct grower collectives across Nashik, Sinnar, Niphad, and Western Pune. Every grower is authentic and verifiable under genuine Mahabhulekh 7/12 records.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

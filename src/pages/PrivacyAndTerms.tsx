import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  MapPin,
  UserCheck,
  FileText,
  Award,
  Truck,
  HeartHandshake,
  Clock
} from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="lp-page-wrapper">
      <Link to="/" className="lp-back-link">
        <ArrowLeft size={14} />
        <span>Return to Home</span>
      </Link>

      <div className="lp-header">
        <div className="lp-kicker-pill">
          <span>🛡️</span>
          <span>DPDP Act 2023 Compliant</span>
        </div>
        <h1 className="lp-title">
          Privacy Policy & Data Protection (DPDP)
        </h1>
        <p className="lp-subtitle">
          FarmDirect adheres strictly to India's Digital Personal Data Protection (DPDP) Act 2023. We collect and process only the minimal telemetry necessary to facilitate transparent farmer-to-consumer transactions.
        </p>
      </div>

      <div className="lp-card">
        <section className="lp-section">
          <h2 className="lp-section-title">
            Information We Collect & Purpose of Processing
          </h2>
          <p className="lp-text">
            We respect the privacy of every household and grower. Our data minimization architecture guarantees your personal information is never traded, brokered, or utilized for predatory advertising:
          </p>

          <div className="lp-grid-2">
            <div className="lp-feature-card">
              <div className="lp-icon-squircle">
                <UserCheck size={18} />
              </div>
              <h3 className="lp-feature-title">Contact Details</h3>
              <p className="lp-feature-desc">
                Name and phone number are utilized exclusively for one-time order verification, morning dispatch alerts, and doorstep delivery coordination.
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-icon-squircle">
                <MapPin size={18} />
              </div>
              <h3 className="lp-feature-title">Delivery Address</h3>
              <p className="lp-feature-desc">
                Your pincode and street address are used solely to calculate route serviceability and assign the nearest direct farmgate logistics cluster.
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-icon-squircle">
                <Lock size={18} />
              </div>
              <h3 className="lp-feature-title">Payment Security</h3>
              <p className="lp-feature-desc">
                Handled securely by RBI-licensed payment aggregators (e.g., Razorpay, UPI). We never store raw debit/credit card numbers, CVVs, or UPI PINs.
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-icon-squircle">
                <FileText size={18} />
              </div>
              <h3 className="lp-feature-title">Farmer KYC & 7/12 Records</h3>
              <p className="lp-feature-desc">
                7/12 Land records and Aadhaar verifications are stored with AES-256 encryption at rest, accessible strictly to authorized legal verification officers.
              </p>
            </div>
          </div>

          <div className="lp-trust-box">
            <div className="lp-trust-box-icon">
              <ShieldCheck size={20} />
            </div>
            <div className="lp-trust-box-content">
              <strong>Your Rights Under DPDP 2023:</strong> You hold full statutory rights to access, rectify, or withdraw consent for your personal data. For inquiries, contact our Data Grievance Officer at <a href="mailto:privacy@farmdirect.in" style={{ color: '#15803d', fontWeight: 600 }}>privacy@farmdirect.in</a>.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const Terms: React.FC = () => {
  return (
    <div className="lp-page-wrapper">
      <Link to="/" className="lp-back-link">
        <ArrowLeft size={14} />
        <span>Return to Home</span>
      </Link>

      <div className="lp-header">
        <div className="lp-kicker-pill">
          <span>📜</span>
          <span>Fair Trade Accord</span>
        </div>
        <h1 className="lp-title">
          Marketplace Terms & Conditions
        </h1>
        <p className="lp-subtitle">
          Transparent operational guidelines governing direct farmgate trade, agricultural claim authenticity, and customer consumer rights.
        </p>
      </div>

      <div className="lp-card">
        <section className="lp-section">
          <h2 className="lp-section-title">
            Cultivation Integrity & Seller Standards
          </h2>
          <p className="lp-text">
            FarmDirect is an open, transparent community. To safeguard customers and honest growers, all platform participants agree to the following standards:
          </p>

          <div className="lp-grid-2">
            <div className="lp-feature-card">
              <div className="lp-icon-squircle">
                <Award size={18} />
              </div>
              <h3 className="lp-feature-title">Honest Agricultural Claims</h3>
              <p className="lp-feature-desc">
                Farmers agree never to mark produce as "Certified Organic" without authentic NPOP/PGS documentation. Misleading buyers results in immediate forfeiture of selling rights.
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-icon-squircle">
                <Truck size={18} />
              </div>
              <h3 className="lp-feature-title">Service Corridors</h3>
              <p className="lp-feature-desc">
                Direct dawn delivery is currently restricted to active serviceable pincodes across Maharashtra (Nashik and Western Pune corridors).
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-icon-squircle">
                <Clock size={18} />
              </div>
              <h3 className="lp-feature-title">Perishable Quality Guarantee</h3>
              <p className="lp-feature-desc">
                Customers must inspect produce upon arrival. Issues reported within 4 hours with photo verification qualify for instant replacement or UPI credit.
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-icon-squircle">
                <HeartHandshake size={18} />
              </div>
              <h3 className="lp-feature-title">Direct Escrow Settlement</h3>
              <p className="lp-feature-desc">
                Payments are held in escrow and released directly to the farmer's registered bank/UPI account following verified doorstep fulfillment.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

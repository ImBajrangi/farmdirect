import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  Clock,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const CancellationRefund: React.FC = () => {
  return (
    <div className="lp-page-wrapper">
      <Link to="/" className="lp-back-link">
        <ArrowLeft size={14} />
        <span>Return to Home</span>
      </Link>

      <div className="lp-header">
        <div className="lp-kicker-pill">
          <span>🔄</span>
          <span>Customer Freshness Assurance</span>
        </div>
        <h1 className="lp-title">
          Cancellation & Refund Policy
        </h1>
        <p className="lp-subtitle">
          Because Indian farmgate produce is picked and packed directly upon your order, our policies balance customer convenience with farmer harvest security.
        </p>
      </div>

      <div className="lp-card">
        <section className="lp-section">
          <h2 className="lp-section-title">
            Order Lifecycle & Cancellation Guidelines
          </h2>
          <p className="lp-text">
            Every farm sub-order is processed directly by the respective grower. Please note the following fulfillment milestones:
          </p>

          <div className="lp-grid-3">
            <div className="lp-feature-card">
              <div className="lp-icon-squircle">
                <Clock size={18} />
              </div>
              <h3 className="lp-feature-title">1. Pre-Harvest Cancellation</h3>
              <p className="lp-feature-desc">
                Orders can be freely cancelled while in <strong>"Pending Confirmation"</strong> status before the farmer begins sunrise packaging in the field.
              </p>
            </div>

            <div className="lp-feature-card destructive">
              <div className="lp-icon-squircle red">
                <AlertCircle size={18} />
              </div>
              <h3 className="lp-feature-title">2. Segregated Produce</h3>
              <p className="lp-feature-desc">
                Once marked <strong>"Preparing"</strong> or <strong>"Out for Delivery"</strong>, cancellation cannot be accommodated as perishable crops are already harvested.
              </p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-icon-squircle">
                <Sparkles size={18} />
              </div>
              <h3 className="lp-feature-title">3. 4-Hour Freshness Warranty</h3>
              <p className="lp-feature-desc">
                Inspect crops at doorstep. Any damaged item reported with a photograph within <strong>4 hours</strong> receives an instant replacement or UPI refund.
              </p>
            </div>
          </div>

          <div className="lp-trust-box">
            <div className="lp-trust-box-icon">
              <RefreshCw size={20} />
            </div>
            <div className="lp-trust-box-content">
              <strong>100% Weather & Stock Refund Guarantee:</strong> If severe weather, hail, or unexpected stock depletion prevents a farmer from completing your order, a 100% refund is initiated automatically within 24 to 48 banking hours.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

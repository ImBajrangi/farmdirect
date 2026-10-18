import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const Support: React.FC = () => {
  const faqs = [
    {
      q: 'How does FarmDirect guarantee farmgate freshness?',
      a: 'Farmers do not store produce in prolonged cold storage. Once your order is confirmed, produce is harvested directly from the field and packed within hours for local dispatch.'
    },
    {
      q: 'Can I order from multiple farmers at the same time?',
      a: 'Yes! You can add produce from different farmers into a single basket. At checkout, sub-orders are generated for each individual farmer so each farm can prepare their items fresh.'
    },
    {
      q: 'What is the delivery fee policy?',
      a: 'Orders above ₹500 from a farm qualify for FREE local delivery. Standard delivery is ₹40 for smaller orders, or ₹0 if you choose direct farmgate pickup.'
    },
    {
      q: 'How does FarmDirect verify organic claims?',
      a: 'We never label a product organic without certified lab documentation (NPOP / PGS-India). Farmers who practice natural residue-free farming are labeled "Natural Farmgate" to preserve complete honesty.'
    }
  ];

  return (
    <div className="lp-page-wrapper">
      <Link to="/" className="lp-back-link">
        <ArrowLeft size={14} />
        <span>Return to Home</span>
      </Link>

      <div className="lp-header">
        <div className="lp-kicker-pill">
          <span>💬</span>
          <span>Helpline & Field Desk</span>
        </div>
        <h1 className="lp-title">
          Help Desk & FAQs
        </h1>
        <p className="lp-subtitle">
          Direct assistance for conscious households and rural growers across the Nashik and Western Pune corridors.
        </p>
      </div>

      {/* Support Channels Grid */}
      <div className="lp-grid-2" style={{ marginBottom: 28 }}>
        <div className="lp-feature-card" style={{ padding: 24 }}>
          <div className="lp-icon-squircle">
            <MessageCircle size={20} />
          </div>
          <h3 className="lp-feature-title">WhatsApp Help Desk</h3>
          <p className="lp-feature-desc">
            Fast assistance for live order tracking, farmer inquiries, and doorstep freshness replacement.
          </p>
          <a
            href="https://wa.me/9199XXXXXXXXX?text=Hello%20FarmDirect%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="lp-feature-link"
          >
            <span>Chat on WhatsApp (+91 9XXXX XXXXX)</span>
            <ArrowRight size={13} />
          </a>
        </div>

        <div className="lp-feature-card" style={{ padding: 24 }}>
          <div className="lp-icon-squircle blue">
            <Phone size={20} />
          </div>
          <h3 className="lp-feature-title">Voice Support Desk</h3>
          <p className="lp-feature-desc">
            Direct farmer and consumer phone line. Operational 7:00 AM – 8:00 PM IST (All 7 days).
          </p>
          <a
            href="tel:+919XXXXXXXXX"
            className="lp-feature-link"
            style={{ color: '#2563eb' }}
          >
            <span>Call (+91 9XXXXXXXXX)</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* FAQ Accordion Card */}
      <div className="lp-card">
        <h2 className="lp-section-title">
          Frequently Asked Questions
        </h2>
        <p className="lp-text">
          Everything you need to know about farmgate orders, direct payments, and transparent fulfillment:
        </p>

        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="lp-faq-item">
              <h4 className="lp-faq-question">
                <HelpCircle size={16} color="#15803d" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{faq.q}</span>
              </h4>
              <p className="lp-faq-answer">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Heart, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import './layout.css';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="app-footer">
      <div className="page-container">
        <div className="footer-grid">
          {/* Brand & Mission */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="flex-row items-center gap-2">
              <span style={{ fontSize: '1.5rem' }}>🌱</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>FarmDirect</span>
            </div>
            <p className="text-subtle" style={{ color: '#a8a29e' }}>
              Bridging the gap between hardworking Indian farmers and mindful buyers. 
              Fresh harvest at fair farmgate rates with zero predatory middlemen.
            </p>
            <div className="flex-row items-center gap-2" style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Pilot Corridor: Nashik & Western Pune</span>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 className="heading-4" style={{ color: '#ffffff', marginBottom: 12, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Marketplace
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/marketplace" className="footer-link">Browse All Produce</Link>
              <Link to="/marketplace?category=cat-veg" className="footer-link">Fresh Vegetables</Link>
              <Link to="/marketplace?category=cat-fruit" className="footer-link">Orchard Fruits</Link>
              <Link to="/marketplace?category=cat-grains" className="footer-link">Native Grains & Cereals</Link>
              <Link to="/farmer/register" className="footer-link" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
                Producer Registration (शेतकरी नोंदणी)
              </Link>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h4 className="heading-4" style={{ color: '#ffffff', marginBottom: 12, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Trust & Policies
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/about" className="footer-link">About FarmDirect</Link>
              <Link to="/cancellation-refund" className="footer-link">Cancellation & Refunds</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy (DPDP)</Link>
              <Link to="/terms" className="footer-link">Terms & Conditions</Link>
              <Link to="/support" className="footer-link">Help & FAQs</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="heading-4" style={{ color: '#ffffff', marginBottom: 12, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              Farmer Helpline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="text-subtle" style={{ color: '#a8a29e' }}>Support & Field Operations:</span>
              <div className="flex-row items-center gap-2" style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.8125rem' }}>
                <Phone size={16} style={{ color: '#4ade80' }} />
                <span>+91 98220 00000 (7 AM - 8 PM)</span>
              </div>
              <div className="card" style={{ padding: 12, backgroundColor: '#292524', borderColor: '#44403c', marginTop: 8 }}>
                <div className="flex-row items-center gap-1" style={{ color: '#4ade80', fontSize: '0.6875rem', fontWeight: 700, marginBottom: 4 }}>
                  <CheckCircle2 size={13} />
                  <span>Honest Product Guarantee</span>
                </div>
                <p style={{ fontSize: '0.6875rem', color: '#d6d3d1' }}>
                  Products are certified organic only when proven by NPOP / PGS-India laboratory documentation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div style={{ paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.75rem', color: '#78716c' }}>
          <p>© {new Date().getFullYear()} FarmDirect. Built for Indian Farmers & Mindful Consumers.</p>
          <p className="flex-row items-center gap-1">
            <span>Crafted for rural empowerment in Maharashtra</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

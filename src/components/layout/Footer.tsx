import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, ArrowUp, MessageSquare } from 'lucide-react';
import './layout.css';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer">
      <div className="page-container">
        <div className="footer-grid">
          {/* Brand & Wordmark */}
          <div className="flex-col gap-2">
            <div className="footer-wordmark">FarmDirect.</div>
            <p className="footer-tagline">
              Born for the direct agriculture era. Not bolted onto legacy middlemen cartels.
              Direct farm-to-table supply network with 100% fair farmgate pricing and verified harvest integrity.
            </p>
            <div className="flex-row items-center gap-2 mt-2" style={{ color: 'var(--text)', fontSize: '0.8125rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--accent)' }} />
              <span>Pilot Corridor: Nashik & Western Pune</span>
            </div>
            <div className="flex-row items-center gap-2 mt-2">
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-pill-soft btn-sm"
                style={{ fontSize: '0.75rem', gap: 6 }}
              >
                <MessageSquare size={13} style={{ color: 'var(--accent)' }} />
                <span>Join Grower Community</span>
              </a>
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div>
            <div className="footer-col-title">Marketplace</div>
            <div className="flex-col gap-2">
              <Link to="/marketplace" className="footer-link">Browse All Produce</Link>
              <Link to="/marketplace?category=cat-veg" className="footer-link">Fresh Vegetables</Link>
              <Link to="/marketplace?category=cat-fruit" className="footer-link">Orchard Fruits</Link>
              <Link to="/marketplace?category=cat-grains" className="footer-link">Native Grains & Cereals</Link>
              <Link to="/farmer/register" className="footer-link" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Producer Registration (शेतकरी नोंदणी) →
              </Link>
            </div>
          </div>

          {/* Column 2: Trust & Policies */}
          <div>
            <div className="footer-col-title">Platform & Trust</div>
            <div className="flex-col gap-2">
              <Link to="/about" className="footer-link">About FarmDirect</Link>
              <Link to="/cancellation-refund" className="footer-link">Cancellation & Refunds</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy (DPDP)</Link>
              <Link to="/terms" className="footer-link">Terms & Conditions</Link>
              <Link to="/support" className="footer-link">Help & FAQs</Link>
            </div>
          </div>

          {/* Column 3: Field Operations */}
          <div>
            <div className="footer-col-title">Helpline & Field Hub</div>
            <div className="flex-col gap-2">
              <span className="text-caption" style={{ color: 'var(--text-faint)' }}>Direct Farmer Line:</span>
              <div className="flex-row items-center gap-2" style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.875rem' }}>
                <Phone size={15} style={{ color: 'var(--accent)' }} />
                <span>+91 9XXXX XXXXX</span>
              </div>
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: 8,
                }}
              >
                <div style={{ color: 'var(--text)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
                  NPOP / PGS-India Verified
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Organic produce is certified strictly against authenticated Mahabhulekh 7/12 land records and laboratory reports.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="footer-bottom-credits">
          <p>© {new Date().getFullYear()} FarmDirect Inc. Built for Indian Agriculture.</p>
          <p>Nashik–Pune Regional Agricultural Gateway</p>
          <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Back to top">
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

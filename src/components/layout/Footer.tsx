import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, ArrowUp } from 'lucide-react';
import { FruitBasketsLogoIcon } from '../common/FruitBasketsLogoIcon';
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
            <div className="footer-brand-lockup">
              <FruitBasketsLogoIcon size={32} color="#0F2E22" />
              <span className="footer-wordmark">Fruit Baskets</span>
            </div>
            <p className="footer-tagline">
              Direct farmgate harvests and fresh fruit baskets delivered from verified regional growers across Nashik and Pune.
            </p>
            <div className="flex-row items-center gap-2 mt-2" style={{ color: 'var(--text-muted, #536F61)', fontSize: '0.8125rem' }}>
              <ShieldCheck size={15} style={{ color: '#006044' }} />
              <span>Nashik &amp; Western Pune Corridor</span>
            </div>
          </div>

          {/* Column 1: Available Produce */}
          <div>
            <div className="footer-col-title">Available Produce</div>
            <div className="flex-col gap-2">
              <Link to="/marketplace" className="footer-link">Fresh Harvest (All)</Link>
              <Link to="/marketplace?category=fruits" className="footer-link">Curated Fruit Baskets</Link>
              <Link to="/marketplace?category=vegetables" className="footer-link">Farm Vegetables</Link>
              <Link to="/marketplace?category=grains" className="footer-link">Native Grains &amp; Cereals</Link>
              <Link to="/farmers" className="footer-link">Verified Regional Farms</Link>
            </div>
          </div>

          {/* Column 2: Platform & Trust */}
          <div>
            <div className="footer-col-title">Platform &amp; Trust</div>
            <div className="flex-col gap-2">
              <Link to="/about" className="footer-link">About Fruit Baskets</Link>
              <Link to="/farmers" className="footer-link">Our Growers</Link>
              <Link to="/cancellation-refund" className="footer-link">Cancellation &amp; Refunds</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms &amp; Conditions</Link>
            </div>
          </div>

          {/* Column 3: Field Operations */}
          <div>
            <div className="footer-col-title">Helpline &amp; Support</div>
            <div className="flex-col gap-2">
              <div className="flex-row items-center gap-2" style={{ color: 'var(--text, #0F2E22)', fontWeight: 600, fontSize: '0.875rem' }}>
                <Phone size={15} style={{ color: '#006044' }} />
                <span>+91 9XXXX XXXXX</span>
              </div>
              <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted, #536F61)', lineHeight: 1.45, marginTop: 4 }}>
                Direct support for daily harvest dispatches, fruit baskets, and farmgate orders.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="footer-bottom-credits">
          <p>© {new Date().getFullYear()} Fruit Baskets / FarmDirect. Built for Direct Agriculture.</p>
          <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Back to top">
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

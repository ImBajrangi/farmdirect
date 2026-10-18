import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Wifi } from 'lucide-react';
import './layout.css';

export const SoftwareStatusBar: React.FC = () => {
  return (
    <footer className="software-status-bar">
      <div className="status-bar-container">
        <div className="status-bar-left">
          <span className="status-indicator">
            <span className="status-dot-live" />
            <span className="status-text font-bold">FarmDirect OS</span>
            <span className="status-version">v2.4.0</span>
          </span>
          <span className="status-divider">·</span>
          <span className="status-metric">
            <Zap size={12} style={{ color: 'var(--accent)' }} />
            <span>Edge Microcache: 0ms</span>
          </span>
          <span className="status-divider status-hide-mobile">·</span>
          <span className="status-metric status-hide-mobile">
            <Wifi size={12} style={{ color: 'var(--accent)' }} />
            <span>Nashik–Pune Gateway Node</span>
          </span>
        </div>

        <div className="status-bar-right">
          <span className="status-metric">
            <ShieldCheck size={13} style={{ color: 'var(--accent)' }} />
            <span>PGS Natural Verified</span>
          </span>
          <span className="status-divider">·</span>
          <Link to="/marketplace" className="status-link">Catalog</Link>
          <Link to="/orders" className="status-link">Orders</Link>
          <Link to="/support" className="status-link">Help</Link>
          <Link to="/privacy" className="status-link">Privacy</Link>
        </div>
      </div>
    </footer>
  );
};

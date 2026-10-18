import React, { useState } from 'react';
import { Database, Activity, Cloud, Layers, Radio, PhoneCall, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { IntegrationConnector } from '../types';

interface IntegrationsViewProps {
  integrations: IntegrationConnector[];
  onToggleIntegration: (id: string) => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ integrations, onToggleIntegration }) => {
  const [filter, setFilter] = useState<string>('all');

  const filtered = integrations.filter(
    (item) => filter === 'all' || item.category === filter
  );

  return (
    <div>
      <div className="oc-view-header">
        <div className="oc-view-title-group">
          <h1>Clinical Integrations & EHR Sync</h1>
          <p className="oc-view-subtitle">
            Direct FHIR API connectors for electronic medical records, patient portals, and healthcare CRM infrastructure.
          </p>
        </div>
      </div>

      <div className="oc-table-filters" style={{ marginBottom: '20px' }}>
        {['all', 'EHR/EMR', 'CRM', 'Telephony'].map((cat) => (
          <button
            key={cat}
            className={`oc-filter-chip ${filter === cat ? 'is-active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? 'All Integrations' : cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map((item) => (
          <div key={item.id} className="oc-metric-card" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="oc-metric-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="oc-metric-icon-wrap">
                    <Database size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--oc-forest)', letterSpacing: '-0.02em' }}>{item.name}</h3>
                    <span style={{ fontSize: '0.78125rem', color: '#1f6443', fontWeight: 700 }}>{item.category}</span>
                  </div>
                </div>
                <span className={`oc-badge ${item.status}`}>{item.status}</span>
              </div>

              <p style={{ fontSize: '0.84375rem', color: 'var(--oc-text-secondary)', lineHeight: 1.5, margin: '14px 0 12px' }}>
                {item.description}
              </p>

              <div style={{ fontSize: '0.75rem', color: 'var(--oc-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <RefreshCw size={13} />
                <span>Last Sync: {item.lastSync || 'Never'}</span>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(15, 46, 34, 0.08)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => onToggleIntegration(item.id)}
                style={{
                  background: item.status === 'connected' ? '#fee2e2' : 'var(--oc-forest)',
                  border: item.status === 'connected' ? '1px solid #fca5a5' : 'none',
                  color: item.status === 'connected' ? '#b91c1c' : 'var(--oc-lime)',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: item.status === 'connected' ? 'none' : '0 4px 12px rgba(15, 46, 34, 0.15)',
                }}
              >
                {item.status === 'connected' ? 'Disconnect' : 'Connect Integration'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

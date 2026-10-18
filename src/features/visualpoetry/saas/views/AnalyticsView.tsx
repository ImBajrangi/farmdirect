import React from 'react';
import { Activity, Clock, ShieldCheck, DollarSign, TrendingUp, Users, Zap, CheckCircle2 } from 'lucide-react';
import { SaaSUsageStats } from '../types';

interface AnalyticsViewProps {
  stats: SaaSUsageStats;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats }) => {
  return (
    <div>
      <div className="oc-view-header">
        <div className="oc-view-title-group">
          <h1>SaaS Telephony & Intelligence Analytics</h1>
          <p className="oc-view-subtitle">
            Real-time telemetry, conversational containment, clinical routing accuracy, and ROI metrics.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="oc-metrics-grid">
        <div className="oc-metric-card">
          <div className="oc-metric-top">
            <span className="oc-metric-label">Automated Containment</span>
            <div className="oc-metric-icon-wrap">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="oc-metric-val">{stats.avgContainmentRate}%</div>
          <div className="oc-metric-trend oc-trend-up">
            <TrendingUp size={14} />
            <span>+3.4% this month</span>
            <span className="oc-trend-note">vs human front desk</span>
          </div>
        </div>

        <div className="oc-metric-card">
          <div className="oc-metric-top">
            <span className="oc-metric-label">Voice Latency (p95)</span>
            <div className="oc-metric-icon-wrap">
              <Zap size={18} />
            </div>
          </div>
          <div className="oc-metric-val">{stats.avgLatencyMs}ms</div>
          <div className="oc-metric-trend oc-trend-up">
            <TrendingUp size={14} />
            <span>Ultra-low subsecond response</span>
          </div>
        </div>

        <div className="oc-metric-card">
          <div className="oc-metric-top">
            <span className="oc-metric-label">Total Handled Minutes</span>
            <div className="oc-metric-icon-wrap">
              <Clock size={18} />
            </div>
          </div>
          <div className="oc-metric-val">{(stats.minutesUsed).toLocaleString()} min</div>
          <div className="oc-metric-trend">
            <span style={{ color: '#9aa0b4' }}>
              Quota: {((stats.minutesUsed / stats.minutesLimit) * 100).toFixed(0)}% of {(stats.minutesLimit).toLocaleString()} min
            </span>
          </div>
        </div>

        <div className="oc-metric-card">
          <div className="oc-metric-top">
            <span className="oc-metric-label">Calculated Labor Savings</span>
            <div className="oc-metric-icon-wrap">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="oc-metric-val">${stats.costSavingsEstimate.toLocaleString()}</div>
          <div className="oc-metric-trend oc-trend-up">
            <span>ROI: 8.4x over SaaS billing</span>
          </div>
        </div>
      </div>

      {/* Hourly Call Volume Simulation Chart */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--oc-border-subtle)', padding: '28px', marginBottom: '32px', boxShadow: 'var(--oc-shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800, color: 'var(--oc-forest)', letterSpacing: '-0.02em' }}>Today's Real-Time Call Volume Curve</h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--oc-text-secondary)' }}>Distributed patient call load across all clinics (24 Hour Cycle)</span>
          </div>
          <span style={{ fontSize: '0.8125rem', color: '#1f6443', fontWeight: 800, background: '#ebf3ee', padding: '6px 14px', borderRadius: '9999px', border: '1px solid rgba(15, 46, 34, 0.08)' }}>
            ● Peak: 10:00 AM - 11:30 AM
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '180px', padding: '10px 0', borderBottom: '1px solid var(--oc-border-subtle)' }}>
          {[
            { hour: '6 AM', val: 12 },
            { hour: '7 AM', val: 24 },
            { hour: '8 AM', val: 56 },
            { hour: '9 AM', val: 82 },
            { hour: '10 AM', val: 98 },
            { hour: '11 AM', val: 94 },
            { hour: '12 PM', val: 68 },
            { hour: '1 PM', val: 72 },
            { hour: '2 PM', val: 88 },
            { hour: '3 PM', val: 79 },
            { hour: '4 PM', val: 64 },
            { hour: '5 PM', val: 45 },
            { hour: '6 PM', val: 32 },
            { hour: '7 PM', val: 22 },
          ].map((item, idx) => (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '8px' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '38px',
                  height: `${item.val}%`,
                  backgroundColor: item.val > 80 ? 'var(--oc-forest)' : '#cff774',
                  borderRadius: '8px 8px 0 0',
                  transition: 'height 0.4s ease',
                  boxShadow: item.val > 80 ? '0 4px 12px rgba(15, 46, 34, 0.2)' : 'none',
                }}
              />
              <span style={{ fontSize: '0.6875rem', color: 'var(--oc-text-muted)', fontWeight: 600 }}>{item.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Specialty Distribution Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--oc-border-subtle)', padding: '26px', boxShadow: 'var(--oc-shadow-soft)' }}>
          <h4 style={{ margin: '0 0 18px', fontSize: '1.05rem', fontWeight: 800, color: 'var(--oc-forest)', letterSpacing: '-0.02em' }}>Top Medical Specialties Handled</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { name: 'Primary Care Scheduling', pct: 42, color: 'var(--oc-forest)' },
              { name: 'Cardiology Triage', pct: 26, color: '#059669' },
              { name: 'Rx Refill & Pharmacy', pct: 18, color: '#3b82f6' },
              { name: 'After-Hours Emergency Screening', pct: 14, color: '#d97706' },
            ].map((sp, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84375rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--oc-forest)', fontWeight: 700 }}>{sp.name}</span>
                  <span style={{ color: sp.color, fontWeight: 800 }}>{sp.pct}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#f3f7f4', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${sp.pct}%`, height: '100%', backgroundColor: sp.color, borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--oc-border-subtle)', padding: '26px', boxShadow: 'var(--oc-shadow-soft)' }}>
          <h4 style={{ margin: '0 0 18px', fontSize: '1.05rem', fontWeight: 800, color: 'var(--oc-forest)', letterSpacing: '-0.02em' }}>HIPAA & Security Compliance Telemetry</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'End-to-End Voice Encryption (TLS 1.3 / SRTP)', status: 'Active', ok: true },
              { label: 'Automated PII / PHI Redaction in Transcripts', status: 'Enforced', ok: true },
              { label: 'SOC2 Type II Audit Logging', status: 'Compliant', ok: true },
              { label: 'Business Associate Agreement (BAA)', status: 'Signed', ok: true },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f7faf8', borderRadius: '14px', border: '1px solid rgba(15, 46, 34, 0.05)' }}>
                <span style={{ fontSize: '0.84375rem', color: 'var(--oc-forest)', fontWeight: 600 }}>{row.label}</span>
                <span style={{ fontSize: '0.78125rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={15} /> {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

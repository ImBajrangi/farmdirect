import React from 'react';
import { CreditCard, Check, Zap, Sparkles, Shield, ArrowUpRight } from 'lucide-react';
import { SaaSUsageStats } from '../types';

interface BillingViewProps {
  stats: SaaSUsageStats;
}

export const BillingView: React.FC<BillingViewProps> = ({ stats }) => {
  const plans = [
    {
      name: 'Starter Clinic',
      price: '$199',
      period: '/month',
      desc: 'Ideal for independent practices and single-specialty clinical offices.',
      features: [
        'Up to 3,000 Voice Minutes / mo',
        '3 Active Clinical Voice Agents',
        'Standard AthenaHealth / CSV Export',
        'Sub-400ms Voice Latency',
        'Standard Email Support',
      ],
      current: false,
    },
    {
      name: 'Growth Health System',
      price: '$599',
      period: '/month',
      desc: 'Designed for high-volume multispecialty hospitals & 24/7 triage networks.',
      features: [
        'Up to 25,000 Voice Minutes / mo',
        'Unlimited Clinical Voice Agents',
        'Direct Epic & Cerner FHIR Bi-directional Sync',
        'Ultra-low 220ms Gemini Live Engine',
        'HIPAA BAA & Dedicated Account Executive',
        'Custom Virtual Phone Numbers Included',
      ],
      current: true,
      popular: true,
    },
    {
      name: 'Enterprise Care Network',
      price: 'Custom',
      period: '',
      desc: 'Bespoke AI voice telephony architecture for enterprise HMOs and national health systems.',
      features: [
        'Unlimited Voice Minutes & Channels',
        'On-Prem / Private VPC Deployment',
        'Custom Fine-Tuned Voice Models',
        '99.99% Uptime Telephony SLA',
        '24/7 Clinical Nurse Triage Routing Integration',
      ],
      current: false,
    },
  ];

  return (
    <div>
      <div className="oc-view-header">
        <div className="oc-view-title-group">
          <h1>SaaS Subscription & Quota Usage</h1>
          <p className="oc-view-subtitle">
            Manage your clinical plan, monitor live concurrent telephony channels, and review minute allowances.
          </p>
        </div>
      </div>

      {/* Usage Progress Meter */}
      <div style={{ backgroundColor: 'var(--oc-bg-card)', borderRadius: '16px', border: '1px solid var(--oc-border-subtle)', padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Active Monthly Minute Allowance</h3>
            <span style={{ fontSize: '0.8125rem', color: '#9aa0b4' }}>Growth Plan • Billing cycle renews on November 1, 2026</span>
          </div>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--oc-lime)' }}>
            {(stats.minutesUsed).toLocaleString()} / {(stats.minutesLimit).toLocaleString()} min ({((stats.minutesUsed / stats.minutesLimit) * 100).toFixed(1)}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${(stats.minutesUsed / stats.minutesLimit) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #b8db3b 0%, var(--oc-lime) 100%)',
              borderRadius: '999px',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--oc-border-subtle)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--oc-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Concurrent Lines In Use</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--oc-forest)' }}>{stats.concurrentLines} / {stats.concurrentLimit} Lines</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--oc-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Current Estimated Savings</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>${stats.costSavingsEstimate.toLocaleString()}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--oc-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Payment Method</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--oc-forest)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <CreditCard size={16} color="var(--oc-forest)" />
              •••• 4242 (Visa)
            </span>
          </div>
        </div>
      </div>

      {/* Plans Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {plans.map((plan, i) => (
          <div
            key={i}
            className="oc-metric-card"
            style={{
              border: plan.popular ? '2px solid var(--oc-forest)' : '1px solid var(--oc-border-subtle)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '32px 28px',
              borderRadius: '24px',
              boxShadow: plan.popular ? 'var(--oc-shadow-card)' : 'var(--oc-shadow-soft)',
            }}
          >
            {plan.popular && (
              <span
                style={{
                  position: 'absolute',
                  top: '-13px',
                  right: '24px',
                  background: 'var(--oc-lime)',
                  color: 'var(--oc-forest)',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 2px 8px rgba(217, 247, 88, 0.4)',
                }}
              >
                Current Active Plan
              </span>
            )}

            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--oc-forest)', letterSpacing: '-0.02em' }}>{plan.name}</h3>
              <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: 'var(--oc-text-secondary)', lineHeight: 1.5 }}>{plan.desc}</p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '24px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--oc-forest)', letterSpacing: '-0.03em' }}>{plan.price}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--oc-text-muted)', fontWeight: 600 }}>{plan.period}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {plan.features.map((feat, fi) => (
                  <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--oc-forest)', fontWeight: 500 }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ebf3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={12} color="#059669" strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                border: plan.current ? '1.5px solid rgba(15, 46, 34, 0.15)' : 'none',
                background: plan.current ? '#ffffff' : 'var(--oc-forest)',
                color: plan.current ? 'var(--oc-forest)' : 'var(--oc-lime)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: plan.current ? '0 2px 6px rgba(15, 46, 34, 0.04)' : '0 4px 14px rgba(15, 46, 34, 0.15)',
              }}
            >
              {plan.current ? 'Manage Billing' : 'Upgrade Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

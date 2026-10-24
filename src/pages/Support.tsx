import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BotAvatar,
  BotAvatarType,
  BotAvatarFace,
  BotAvatarState,
  BotAvatarShading,
  BotAvatarHat,
  BotAvatarGlasses
} from 'bot-avatars';
import { Liquid } from 'liquid-gooey';
import { BorderBeam, BorderBeamSize, BorderBeamColorVariant, BorderBeamTheme } from 'border-beam';
import { BotAvatarRoster, FARM_DIRECT_AGENTS, FarmAgent } from '../components/common/BotAvatarRoster';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Package,
  Sliders,
  Bot,
  UserCheck
} from 'lucide-react';

export const Support: React.FC = () => {
  const [supportBotState, setSupportBotState] = useState<'default' | 'working' | 'sleeping'>('default');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [beamSize, setBeamSize] = useState<BorderBeamSize>('md');
  const [beamColor, setBeamColor] = useState<BorderBeamColorVariant>('colorful');
  const [beamStrength, setBeamStrength] = useState<number>(0.7);
  const [beamActive, setBeamActive] = useState<boolean>(true);
  const [beamTheme, setBeamTheme] = useState<BorderBeamTheme>('light');
  const [gooBlur, setGooBlur] = useState<number>(6);
  const [gooContrast, setGooContrast] = useState<number>(18);
  const [gooFill, setGooFill] = useState<string>('#202020');
  const [gooTransition, setGooTransition] = useState<'bouncy' | 'snappy' | 'smooth'>('bouncy');
  const [gooEffect, setGooEffect] = useState<'morph' | 'move' | 'bend'>('morph');
  const [gooOpen, setGooOpen] = useState<boolean>(true);

  // Bot Avatar Customizer Studio State
  const [studioType, setStudioType] = useState<BotAvatarType>('clover');
  const [studioFace, setStudioFace] = useState<BotAvatarFace>('mouth');
  const [studioState, setStudioState] = useState<BotAvatarState>('default');
  const [studioShading, setStudioShading] = useState<BotAvatarShading>('fabric');
  const [studioHat, setStudioHat] = useState<BotAvatarHat>('crown');
  const [studioGlasses, setStudioGlasses] = useState<BotAvatarGlasses>('round');
  const [studioHeadphones, setStudioHeadphones] = useState<boolean>(false);
  const [studioBowTie, setStudioBowTie] = useState<boolean>(true);
  const [studioWhirl, setStudioWhirl] = useState<number>(0);
  const [selectedRosterAgent, setSelectedRosterAgent] = useState<FarmAgent>(FARM_DIRECT_AGENTS[0]);
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

      {/* Interactive AI Assistant & Liquid Speed Dial Feature with BorderBeam */}
      <BorderBeam size="md" colorVariant="forest" strength={0.7} theme="light" borderRadius={24}>
        <div className="lp-card" style={{ marginBottom: 0, background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)', border: '1px solid #BBF7D0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            {/* Left: Bot Showcase */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ background: '#FFFFFF', padding: 8, borderRadius: 24, boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.2)', border: '1px solid #E5E7EB' }}>
                <BotAvatar type="ghost" size={96} state={supportBotState} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="lp-badge green">Autonomous Support AI</span>
                  <span style={{ fontSize: 11, color: '#166534', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Zap size={12} /> Cache Active
                  </span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0F2E22', margin: '0 0 6px' }}>
                  Kisan AI Assistant
                </h3>
                <p style={{ fontSize: 13, color: '#4B5563', margin: '0 0 12px', maxWidth: 360, lineHeight: 1.5 }}>
                  24/7 intelligent companion answering harvest times, farmgate pricing transparency, and order status.
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['default', 'working', 'sleeping'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setSupportBotState(st)}
                      style={{
                        border: '1px solid #D1D5DB',
                        background: supportBotState === st ? '#0F2E22' : '#FFFFFF',
                        color: supportBotState === st ? '#FFFFFF' : '#374151',
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Embedded Liquid Gooey Interactive Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#FFFFFF', padding: '16px 24px', borderRadius: 20, border: '1px solid #E5E7EB' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                Liquid Speed Dial
              </span>
              <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Liquid blur={6} contrast={18} fill="#202020">
                  <Liquid.Item
                    effect="morph"
                    x={previewOpen ? -54 : 0}
                    y={previewOpen ? -34 : 0}
                    transition="bouncy"
                  >
                    <button
                      className="round-btn round-btn-sub"
                      style={{ width: 40, height: 40 }}
                      title="Track Orders"
                    >
                      <Package size={16} color="#6EE7B7" />
                    </button>
                  </Liquid.Item>
                  <Liquid.Item
                    effect="morph"
                    x={0}
                    y={previewOpen ? -64 : 0}
                    transition="bouncy"
                    delay={40}
                  >
                    <button
                      className="round-btn round-btn-sub"
                      style={{ width: 40, height: 40 }}
                      title="Ask AI"
                    >
                      <Sparkles size={16} color="#FBBF24" />
                    </button>
                  </Liquid.Item>
                  <Liquid.Item effect="morph">
                    <button
                      className="round-btn round-btn-main"
                      style={{ width: 48, height: 48, fontSize: 18 }}
                      onClick={() => setPreviewOpen(!previewOpen)}
                      title="Toggle Preview"
                    >
                      {previewOpen ? '✕' : '+'}
                    </button>
                  </Liquid.Item>
                </Liquid>
              </div>
              <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>
                Click '+' to morph
              </span>
            </div>
          </div>
        </div>
      </BorderBeam>

      {/* ── BorderBeam Interactive Controls Playground ── */}
      <div className="lp-card" style={{ marginTop: 24, marginBottom: 28, border: '1px solid #E5E7EB', background: '#FAFAFA' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sliders size={18} color="#0F2E22" />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0F2E22' }}>
              BorderBeam Live Effect Controls
            </h3>
          </div>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
            Libraries.dev Animated Border Glow
          </span>
        </div>

        {/* Live Wrapped Preview Target */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0 24px' }}>
          <BorderBeam
            size={beamSize}
            colorVariant={beamColor}
            strength={beamStrength}
            active={beamActive}
            theme={beamTheme}
            borderRadius={20}
          >
            <div
              style={{
                padding: '24px 32px',
                borderRadius: 20,
                background: beamTheme === 'dark' ? '#18221C' : '#FFFFFF',
                color: beamTheme === 'dark' ? '#F9FAFB' : '#111827',
                textAlign: 'center',
                minWidth: 260,
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <BotAvatar type="ghost" size={64} state={beamActive ? 'working' : 'sleeping'} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                Active Beam Target
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                size: <code>{beamSize}</code> · color: <code>{beamColor}</code> · strength: <code>{beamStrength.toFixed(1)}</code>
              </div>
            </div>
          </BorderBeam>
        </div>

        {/* Props Controls Toolbar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
          {/* Size */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase' }}>
              size:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {(['md', 'sm', 'line', 'pulse-inner', 'pulse-outside'] as BorderBeamSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setBeamSize(s)}
                  style={{
                    border: '1px solid #D1D5DB',
                    background: beamSize === s ? '#0F2E22' : '#FFFFFF',
                    color: beamSize === s ? '#FFFFFF' : '#374151',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Variant */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase' }}>
              colorVariant:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {(['colorful', 'sunset', 'ocean', 'forest', 'mono'] as BorderBeamColorVariant[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setBeamColor(c)}
                  style={{
                    border: '1px solid #D1D5DB',
                    background: beamColor === c ? '#0F2E22' : '#FFFFFF',
                    color: beamColor === c ? '#FFFFFF' : '#374151',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Strength Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>
                strength:
              </label>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#166534' }}>
                {beamStrength.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={beamStrength}
              onChange={(e) => setBeamStrength(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#10B981' }}
            />
          </div>

          {/* Active & Theme Toggles */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase' }}>
              theme & status:
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setBeamActive(!beamActive)}
                style={{
                  border: '1px solid #D1D5DB',
                  background: beamActive ? '#10B981' : '#F3F4F6',
                  color: beamActive ? '#FFFFFF' : '#4B5563',
                  padding: '4px 12px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {beamActive ? 'Active: On' : 'Paused'}
              </button>
              <button
                onClick={() => setBeamTheme(beamTheme === 'light' ? 'dark' : 'light')}
                style={{
                  border: '1px solid #D1D5DB',
                  background: beamTheme === 'dark' ? '#18221C' : '#FFFFFF',
                  color: beamTheme === 'dark' ? '#FFFFFF' : '#1F2937',
                  padding: '4px 12px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Theme: {beamTheme}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Gooey Effect Studio & Playground ── */}
      <div className="lp-card" style={{ marginBottom: 28, border: '1px solid #E5E7EB', background: '#FAFAFA' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="#0F2E22" />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#0F2E22' }}>
              Liquid Gooey Live Effect Studio
            </h3>
          </div>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
            Libraries.dev Metaball Liquid Merge
          </span>
        </div>

        <p style={{ fontSize: 13, color: '#4B5563', margin: '0 0 16px', lineHeight: 1.5 }}>
          Touching items melt into each other while their text stays crisp. Cross-browser, Safari included, with zero runtime dependencies.
        </p>

        {/* Live Gooey Preview Stage */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180, background: gooFill === '#FFFFFF' ? '#111827' : '#FFFFFF', borderRadius: 20, padding: 32, margin: '8px 0 24px', border: '1px solid #E5E7EB' }}>
          <div style={{ position: 'relative', width: 220, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Liquid blur={gooBlur} contrast={gooContrast} fill={gooFill} shadow="0 8px 30px rgba(0,0,0,0.25)">
              {/* Item Left */}
              <Liquid.Item
                effect={gooEffect}
                x={gooOpen ? -60 : 0}
                y={gooOpen ? -20 : 0}
                transition={gooTransition}
              >
                <button
                  className="round-btn round-btn-sub"
                  style={{
                    background: gooFill,
                    color: gooFill === '#FFFFFF' ? '#111827' : '#FFFFFF',
                    width: 50,
                    height: 50,
                    fontWeight: 700,
                    fontSize: 12
                  }}
                  title="Produce Leaf"
                >
                  🌿 Farm
                </button>
              </Liquid.Item>

              {/* Item Right */}
              <Liquid.Item
                effect={gooEffect}
                x={gooOpen ? 60 : 0}
                y={gooOpen ? -20 : 0}
                transition={gooTransition}
                delay={30}
              >
                <button
                  className="round-btn round-btn-sub"
                  style={{
                    background: gooFill,
                    color: gooFill === '#FFFFFF' ? '#111827' : '#FFFFFF',
                    width: 50,
                    height: 50,
                    fontWeight: 700,
                    fontSize: 12
                  }}
                  title="Basket Fresh"
                >
                  🧺 Gate
                </button>
              </Liquid.Item>

              {/* Center Trigger Item */}
              <Liquid.Item effect={gooEffect}>
                <button
                  className="round-btn round-btn-main"
                  style={{
                    background: gooFill,
                    color: gooFill === '#FFFFFF' ? '#111827' : '#FFFFFF',
                    width: 60,
                    height: 60,
                    fontSize: 18,
                    fontWeight: 700
                  }}
                  onClick={() => setGooOpen(!gooOpen)}
                  title="Toggle Merge & Melt"
                >
                  {gooOpen ? 'Melt' : 'Split'}
                </button>
              </Liquid.Item>
            </Liquid>
          </div>
          <span style={{ fontSize: 12, color: gooFill === '#FFFFFF' ? '#D1D5DB' : '#6B7280', marginTop: 12 }}>
            Click button to toggle liquid morph ({gooOpen ? 'expanded' : 'melted into one drop'})
          </span>
        </div>

        {/* Gooey Props Controls Toolbar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
          {/* Blur (Goo Softness) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>
                blur (goo softness):
              </label>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#166534' }}>
                {gooBlur}px
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="14"
              step="1"
              value={gooBlur}
              onChange={(e) => setGooBlur(parseInt(e.target.value, 10))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#10B981' }}
            />
          </div>

          {/* Contrast (Edge Tightness) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>
                contrast (edge tightness):
              </label>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#166534' }}>
                {gooContrast}
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="28"
              step="1"
              value={gooContrast}
              onChange={(e) => setGooContrast(parseInt(e.target.value, 10))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#10B981' }}
            />
          </div>

          {/* Fill Color */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase' }}>
              fill:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { name: 'Dark #202020', val: '#202020' },
                { name: 'Forest #0F2E22', val: '#0F2E22' },
                { name: 'Emerald #10B981', val: '#10B981' },
                { name: 'White #fff', val: '#FFFFFF' }
              ].map((f) => (
                <button
                  key={f.val}
                  onClick={() => setGooFill(f.val)}
                  style={{
                    border: '1px solid #D1D5DB',
                    background: gooFill === f.val ? '#0F2E22' : '#FFFFFF',
                    color: gooFill === f.val ? '#FFFFFF' : '#374151',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Transition & Effect */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase' }}>
              transition & effect:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['bouncy', 'snappy', 'smooth'] as const).map((tr) => (
                  <button
                    key={tr}
                    onClick={() => setGooTransition(tr)}
                    style={{
                      border: '1px solid #D1D5DB',
                      background: gooTransition === tr ? '#0F2E22' : '#FFFFFF',
                      color: gooTransition === tr ? '#FFFFFF' : '#374151',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tr}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['morph', 'move', 'bend'] as const).map((ef) => (
                  <button
                    key={ef}
                    onClick={() => setGooEffect(ef)}
                    style={{
                      border: '1px solid #D1D5DB',
                      background: gooEffect === ef ? '#10B981' : '#FFFFFF',
                      color: gooEffect === ef ? '#FFFFFF' : '#374151',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {ef}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FarmDirect AI Agent Roster ── */}
      <div className="lp-card" style={{ marginBottom: 28, border: '1px solid #D1FAE5', background: 'linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserCheck size={18} color="#0F2E22" />
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#0F2E22' }}>
              FarmDirect Multi-Agent Roster
            </h3>
          </div>
          <span className="lp-badge green">Each Agent With Its Own Shape</span>
        </div>

        <p style={{ fontSize: 13, color: '#4B5563', margin: '0 0 16px', lineHeight: 1.5 }}>
          Autonomous 3D character avatars with unique personas, roles, and outfits assisting farmgate operations. Click any agent to preview their greeting.
        </p>

        {/* Multi-Agent Grid */}
        <BotAvatarRoster
          selectedAgentId={selectedRosterAgent.id}
          onSelectAgent={(ag) => setSelectedRosterAgent(ag)}
          size={58}
        />

        {/* Active Agent Dialogue Quote */}
        <div style={{ marginTop: 16, padding: '14px 18px', background: '#FFFFFF', borderRadius: 16, border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 14 }}>
          <BotAvatar
            type={selectedRosterAgent.type}
            face={selectedRosterAgent.face}
            hat={selectedRosterAgent.hat}
            glasses={selectedRosterAgent.glasses}
            headphones={selectedRosterAgent.headphones}
            bowTie={selectedRosterAgent.bowTie}
            shading={selectedRosterAgent.shading}
            size={40}
            state="working"
          />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F2E22' }}>
              {selectedRosterAgent.name} ({selectedRosterAgent.badge}):
            </div>
            <div style={{ fontSize: 12.5, color: '#4B5563', fontStyle: 'italic', marginTop: 2 }}>
              "{selectedRosterAgent.greeting}"
            </div>
          </div>
        </div>
      </div>

      {/* ── Bot Avatar 3D Studio & Shape Gallery ── */}
      <div className="lp-card" style={{ marginBottom: 28, border: '1px solid #E5E7EB', background: '#FAFAFA' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bot size={18} color="#0F2E22" />
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#0F2E22' }}>
              Bot Avatar 3D Studio & Shape Gallery
            </h3>
          </div>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>
            Libraries.dev 18 Shapes & 2D Canvas Rig
          </span>
        </div>

        <p style={{ fontSize: 13, color: '#4B5563', margin: '0 0 16px', lineHeight: 1.5 }}>
          Click the avatar to trigger a hop and 360° spin! The eyes and face track nearby cursor movement automatically.
        </p>

        {/* Studio Canvas Showcase & Live Customizer */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 32, padding: '24px 20px', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E5E7EB', margin: '8px 0 20px' }}>
          {/* Main Avatar Stage */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)', padding: 12, borderRadius: 32 }}>
              <BotAvatar
                type={studioType}
                face={studioFace}
                state={studioState}
                shading={studioShading}
                hat={studioHat}
                glasses={studioGlasses}
                headphones={studioHeadphones}
                bowTie={studioBowTie}
                whirl={studioWhirl}
                size={104}
                interactive={true}
              />
            </div>
            <span style={{ fontSize: 11, color: '#6B7280', marginTop: 8, fontWeight: 600 }}>
              Click to hop · Move pointer to turn
            </span>
          </div>

          {/* Quick Config Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 220 }}>
            <div style={{ fontSize: 12, color: '#374151', display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#F9FAFB', borderRadius: 8 }}>
              <strong>Type:</strong> <code>{studioType}</code>
            </div>
            <div style={{ fontSize: 12, color: '#374151', display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#F9FAFB', borderRadius: 8 }}>
              <strong>Shading:</strong> <code>{studioShading}</code>
            </div>
            <div style={{ fontSize: 12, color: '#374151', display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#F9FAFB', borderRadius: 8 }}>
              <strong>Outfit:</strong> <code>{studioHat} / {studioGlasses}</code>
            </div>
            <div style={{ fontSize: 12, color: '#374151', display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#F9FAFB', borderRadius: 8 }}>
              <strong>State:</strong> <code>{studioState}</code>
            </div>
          </div>
        </div>

        {/* 18 Shapes Selector Row */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase' }}>
            18 Body Shapes:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {([
              'clover', 'flower', 'triangle', 'square', 'blob', 'ghost',
              'circle', 'drop', 'star', 'droid', 'mech', 'alien',
              'hexagon', 'cat', 'cloud', 'pill', 'pebble', 'puddle'
            ] as BotAvatarType[]).map((shape) => (
              <button
                key={shape}
                onClick={() => setStudioType(shape)}
                style={{
                  border: '1px solid #D1D5DB',
                  background: studioType === shape ? '#0F2E22' : '#FFFFFF',
                  color: studioType === shape ? '#FFFFFF' : '#374151',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {/* Props Controls Toolbar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, paddingTop: 16, borderTop: '1px solid #E5E7EB' }}>
          {/* State */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase' }}>
              state:
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['default', 'working', 'sleeping'] as BotAvatarState[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setStudioState(st)}
                  style={{
                    border: '1px solid #D1D5DB',
                    background: studioState === st ? '#0F2E22' : '#FFFFFF',
                    color: studioState === st ? '#FFFFFF' : '#374151',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Shading */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase' }}>
              shading:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {(['fabric', 'plastic', 'crisp', 'smooth', 'flat'] as BotAvatarShading[]).map((sh) => (
                <button
                  key={sh}
                  onClick={() => setStudioShading(sh)}
                  style={{
                    border: '1px solid #D1D5DB',
                    background: studioShading === sh ? '#0F2E22' : '#FFFFFF',
                    color: studioShading === sh ? '#FFFFFF' : '#374151',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {sh}
                </button>
              ))}
            </div>
          </div>

          {/* Hat */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase' }}>
              hat:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {(['none', 'crown', 'beanie', 'beret', 'party'] as BotAvatarHat[]).map((h) => (
                <button
                  key={h}
                  onClick={() => setStudioHat(h)}
                  style={{
                    border: '1px solid #D1D5DB',
                    background: studioHat === h ? '#0F2E22' : '#FFFFFF',
                    color: studioHat === h ? '#FFFFFF' : '#374151',
                    padding: '3px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Glasses & Accessories */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4B5563', marginBottom: 6, textTransform: 'uppercase' }}>
              accessories:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {(['none', 'round', 'square', 'shades'] as BotAvatarGlasses[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setStudioGlasses(g)}
                  style={{
                    border: '1px solid #D1D5DB',
                    background: studioGlasses === g ? '#0F2E22' : '#FFFFFF',
                    color: studioGlasses === g ? '#FFFFFF' : '#374151',
                    padding: '3px 6px',
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {g}
                </button>
              ))}
              <button
                onClick={() => setStudioHeadphones(!studioHeadphones)}
                style={{
                  border: '1px solid #D1D5DB',
                  background: studioHeadphones ? '#10B981' : '#FFFFFF',
                  color: studioHeadphones ? '#FFFFFF' : '#374151',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🎧 Phones
              </button>
              <button
                onClick={() => setStudioBowTie(!studioBowTie)}
                style={{
                  border: '1px solid #D1D5DB',
                  background: studioBowTie ? '#10B981' : '#FFFFFF',
                  color: studioBowTie ? '#FFFFFF' : '#374151',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🎀 Bow
              </button>
              <button
                onClick={() => setStudioFace(studioFace === 'eyes' ? 'mouth' : 'eyes')}
                style={{
                  border: '1px solid #D1D5DB',
                  background: studioFace === 'mouth' ? '#10B981' : '#FFFFFF',
                  color: studioFace === 'mouth' ? '#FFFFFF' : '#374151',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Face: {studioFace}
              </button>
            </div>
          </div>
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

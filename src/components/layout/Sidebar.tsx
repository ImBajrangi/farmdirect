import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Store, ShoppingBag, PackageCheck, Tractor, ShieldCheck, Sparkles, X, MessageSquare, Activity, ChevronRight } from 'lucide-react';
import { BotAvatar } from 'bot-avatars';
import { ThinkingOrb, OrbState } from 'thinking-orbs';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../features/cart/CartContext';
import { useAuth } from '../../features/auth/AuthContext';
import { FARM_DIRECT_AGENTS, FarmAgent } from '../common/BotAvatarRoster';
import './layout.css';

type AgentState = 'default' | 'working' | 'sleeping';

const AGENT_ORB_STATES: Record<string, OrbState> = {
  kisan: 'solving',
  pushpa: 'breathing',
  suraj: 'searching',
  jaggu: 'working',
  bhootiya: 'searching',
  sheru: 'listening',
  chintu: 'shaping',
  heera: 'solving',
  bheem: 'connecting',
  trishul: 'weaving',
  guddu: 'breathing',
  boond: 'composing',
};

const AGENT_ACTIVITIES: Record<string, Record<AgentState, string>> = {
  kisan: {
    working: 'Auditing dawn harvest lots in Nashik & Niphad orchards',
    default: 'Standing by for harvest scheduling & crop inquiries',
    sleeping: 'Off-hours rest between morning harvest dispatches',
  },
  sita: {
    working: 'Verifying zero-residue test certificates & soil audits',
    default: 'Ready to inspect lab passes & organic compliance',
    sleeping: 'Lab diagnostic sensors cycling in maintenance mode',
  },
  shetty: {
    working: 'Calculating real-time mandi arbitrage & fair farmer rates',
    default: 'Standing by with live wholesale pricing benchmarks',
    sleeping: 'Mandi trading desk closed for the night',
  },
  raju: {
    working: 'Tracking cold-chain temperatures on Pune express route',
    default: 'Dispatch queue clear, fleet vehicles on standby',
    sleeping: 'Refrigerated transit bay docked for sterilization',
  },
  tara: {
    working: 'Scouting crop yield maps via automated drone telemetry',
    default: 'Instant inquiry desk online & answering queries',
    sleeping: 'Drone battery charging on field station dock',
  },
  moti: {
    working: 'Patrolling organic perimeter gates against stray animals',
    default: 'Field guard observant & alert on farm gate perimeter',
    sleeping: 'Resting by the farmhouse porch after sunrise round',
  },
  chintu: {
    working: 'Packing assorted ripe Alphonso mangos & seasonal fruit hampers',
    default: 'Ready to assemble custom farmgate gift baskets',
    sleeping: 'Fruit sorting line docked for sanitization',
  },
  heera: {
    working: 'Transmitting live soil moisture, pH & microclimate telemetry',
    default: 'IoT wireless sensors pinging farm field gateway',
    sleeping: 'Solar telemetry nodes cycling in low-power rest',
  },
  bheem: {
    working: 'Stacking crush-resistant corrugated crates for transit',
    default: 'Packaging bay stocked with biodegradable cartons',
    sleeping: 'Warehouse dispatch bay quiet until dawn harvest',
  },
  trishul: {
    working: 'Running automated solar drip cycles on vineyard block 4',
    default: 'Solar battery fully charged, pump standing by',
    sleeping: 'Irrigation valves closed for nocturnal root rest',
  },
  guddu: {
    working: 'Fermenting organic neem & cow dung bio-fertilizer',
    default: 'Organic compost temperature optimal at 55°C',
    sleeping: 'Bio-reactors cycling in anaerobic maturation',
  },
  boond: {
    working: 'Regulating sub-surface micro-drip flow rate',
    default: 'Zero leakage detected across 12 km farm pipe grid',
    sleeping: 'Nighttime pressure equalization in main line',
  },
};

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { itemCount } = useCart();
  const { currentRole } = useAuth();

  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Each agent's status tracked dynamically across all 12 autonomous fleet members
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentState>>({
    kisan: 'working',
    sita: 'working',
    shetty: 'default',
    raju: 'default',
    tara: 'working',
    moti: 'sleeping',
    chintu: 'working',
    heera: 'working',
    bheem: 'default',
    trishul: 'working',
    guddu: 'default',
    boond: 'working',
  });

  // Dynamic Shading state: plastic or fabric for each character
  const [agentShadings, setAgentShadings] = useState<Record<string, 'plastic' | 'fabric'>>(() => {
    const map: Record<string, 'plastic' | 'fabric'> = {};
    FARM_DIRECT_AGENTS.forEach((a) => {
      map[a.id] = (a.shading as 'plastic' | 'fabric') || 'plastic';
    });
    return map;
  });

  const toggleAgentShading = (agentId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAgentShadings((prev) => ({
      ...prev,
      [agentId]: prev[agentId] === 'fabric' ? 'plastic' : 'fabric',
    }));
  };

  const setAllShading = (shading: 'plastic' | 'fabric') => {
    const updated: Record<string, 'plastic' | 'fabric'> = {};
    FARM_DIRECT_AGENTS.forEach((a) => {
      updated[a.id] = shading;
    });
    setAgentShadings(updated);
  };

  // Cycle an agent's status: working -> default -> sleeping -> working
  const cycleStatus = (agentId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAgentStatuses((prev) => {
      const current = prev[agentId] || 'default';
      const next: AgentState =
        current === 'working' ? 'default' : current === 'default' ? 'sleeping' : 'working';
      return { ...prev, [agentId]: next };
    });
  };

  // Dispatch open assistant event for specified agent
  const openAgentChat = (agent: FarmAgent, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDesktopOpen(false);
    setMobileSheetOpen(false);
    window.dispatchEvent(
      new CustomEvent('open-farm-assistant', {
        detail: { agentId: agent.id },
      })
    );
  };

  // Listen for open-agent-fleet event dispatched from speed dial
  React.useEffect(() => {
    const handleOpenFleet = () => {
      if (window.innerWidth < 640) {
        setMobileSheetOpen((prev) => !prev);
      } else {
        setDesktopOpen((prev) => !prev);
      }
    };
    window.addEventListener('open-agent-fleet', handleOpenFleet);
    return () => window.removeEventListener('open-agent-fleet', handleOpenFleet);
  }, []);

  const activeCount = Object.values(agentStatuses).filter((s) => s === 'working').length;

  const renderAgentCard = (agent: FarmAgent) => {
    const status = agentStatuses[agent.id] || 'default';
    const activityText = AGENT_ACTIVITIES[agent.id]?.[status] || agent.greeting;

    return (
      <div key={agent.id} className="farm-agent-sidebar-card">
        <div className="farm-agent-card-top-row">
          <div
            className="farm-agent-avatar-box"
            onClick={(e) => cycleStatus(agent.id, e)}
            title="Click to cycle agent status"
            style={{ cursor: 'pointer' }}
          >
            <BotAvatar
              type={agent.type}
              face={agent.face}
              hat={agent.hat}
              glasses={agent.glasses}
              headphones={agent.headphones}
              bowTie={agent.bowTie}
              shading={agentShadings[agent.id] || agent.shading}
              size={34}
              state={status}
            />
          </div>

          <div className="farm-agent-meta">
            <div className="farm-agent-name-row">
              <span className="farm-agent-name">{agent.name}</span>
              <span className="farm-agent-badge">{agent.badge}</span>
            </div>
            <p className="farm-agent-role">{agent.role}</p>
          </div>
        </div>

        <div className="farm-agent-activity-note">
          {activityText}
        </div>

        <div className="farm-agent-actions-row">
          <button
            className={`farm-agent-status-pill ${status}`}
            onClick={(e) => cycleStatus(agent.id, e)}
            title="Click to cycle status: working ⇄ ready ⇄ sleeping"
          >
            {status === 'working' ? (
              <ThinkingOrb
                state={AGENT_ORB_STATES[agent.id] || 'working'}
                size={20}
                color="#047857"
              />
            ) : (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: status === 'default' ? '#059669' : '#D97706',
                  display: 'inline-block',
                }}
              />
            )}
            {status === 'working' ? 'Working' : status === 'default' ? 'Ready' : 'Sleeping'}
          </button>

          {/* Shading Toggle Pill: Plastic <-> Fabric */}
          <button
            className="farm-agent-shading-btn"
            onClick={(e) => toggleAgentShading(agent.id, e)}
            title={`Toggle shading for ${agent.name} (currently ${agentShadings[agent.id] || agent.shading})`}
            type="button"
          >
            {(agentShadings[agent.id] || agent.shading) === 'fabric' ? '🧸 Fabric' : '✨ Plastic'}
          </button>

          <button
            className="farm-agent-chat-trigger-btn"
            onClick={(e) => openAgentChat(agent, e)}
            title={`Ask ${agent.name}`}
          >
            <MessageSquare size={12} />
            <span>Ask</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ── 1. Desktop Floating Agent Fleet Dock (Opened directly via Speed Dial) ── */}
      {desktopOpen && (
        <div className="farm-desktop-sidebar-dock" role="region" aria-label="Autonomous Agent Fleet">
          <div className="farm-agent-sidebar-panel" role="dialog" aria-label="FarmDirect AI Fleet">
            <div className="farm-agent-sidebar-header">
              <div className="farm-agent-sidebar-title-group">
                <span className="farm-agent-sidebar-title">
                  <Sparkles size={15} color="#15803D" />
                  FarmDirect Agent Fleet
                </span>
                <span className="farm-agent-sidebar-subtitle">
                  {activeCount} of {FARM_DIRECT_AGENTS.length} agents actively working
                </span>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setAllShading('plastic')}
                    className="farm-shading-preset-btn"
                    title="Set all agents to smooth glossy Plastic shading"
                  >
                    ✨ All Plastic
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllShading('fabric')}
                    className="farm-shading-preset-btn"
                    title="Set all agents to soft textured Fabric shading"
                  >
                    🧸 All Fabric
                  </button>
                </div>
              </div>
              <button
                className="farm-agent-sidebar-close-btn"
                onClick={() => setDesktopOpen(false)}
                aria-label="Close Fleet Sidebar"
              >
                <X size={16} />
              </button>
            </div>

            <div className="farm-agent-sidebar-scroll">
              {FARM_DIRECT_AGENTS.map((agent) => renderAgentCard(agent))}
            </div>

            <div className="farm-agent-sidebar-footer">
              <span>Click avatar or status pill to toggle state</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>• 12 Agents</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Mobile Agent Bottom Sheet ── */}
      {mobileSheetOpen && (
        <div
          className="farm-mobile-agent-sheet-overlay"
          onClick={() => setMobileSheetOpen(false)}
        >
          <div
            className="farm-mobile-agent-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="farm-agent-sidebar-header">
              <div className="farm-agent-sidebar-title-group">
                <span className="farm-agent-sidebar-title">
                  <Sparkles size={15} color="#15803D" />
                  FarmDirect Agent Fleet
                </span>
                <span className="farm-agent-sidebar-subtitle">
                  12 characters with interactive Plastic & Fabric textures
                </span>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setAllShading('plastic')}
                    className="farm-shading-preset-btn"
                  >
                    ✨ All Plastic
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllShading('fabric')}
                    className="farm-shading-preset-btn"
                  >
                    🧸 All Fabric
                  </button>
                </div>
              </div>
              <button
                className="farm-agent-sidebar-close-btn"
                onClick={() => setMobileSheetOpen(false)}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="farm-agent-sidebar-scroll" style={{ maxHeight: '60vh' }}>
              {FARM_DIRECT_AGENTS.map((agent) => renderAgentCard(agent))}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Mobile Bottom Navigation Bar (< 640px) ── */}
      <nav className="bottom-nav">
        <div className="bottom-nav-container">
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>{t.nav.home}</span>
          </NavLink>

          {/* Marketplace */}
          <NavLink
            to="/marketplace"
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Store size={20} />
            <span>{t.nav.marketplace}</span>
          </NavLink>

          {/* AI Agents Fleet Trigger */}
          <button
            className="bottom-nav-item bottom-nav-agents-btn"
            onClick={() => setMobileSheetOpen(true)}
            aria-label="View Farm Agents"
          >
            <div className="bottom-nav-avatar-wrap">
              <BotAvatar
                type={FARM_DIRECT_AGENTS[0].type}
                face={FARM_DIRECT_AGENTS[0].face}
                hat={FARM_DIRECT_AGENTS[0].hat}
                shading="fabric"
                size={22}
                state={agentStatuses.kisan}
              />
              <span className={`bottom-nav-status-dot ${agentStatuses.kisan === 'working' ? 'working' : ''}`} />
            </div>
            <span>Agents</span>
          </button>

          {/* Cart */}
          <NavLink
            to="/cart"
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && <span className="cart-button-badge">{itemCount}</span>}
            <span>{t.nav.cart}</span>
          </NavLink>

          {/* Orders */}
          <NavLink
            to="/orders"
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <PackageCheck size={20} />
            <span>{t.nav.orders}</span>
          </NavLink>

          {/* Role Portal: Farmer */}
          {currentRole === 'farmer' && (
            <NavLink
              to="/farmer/dashboard"
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
              style={{ color: 'var(--color-accent)' }}
            >
              <Tractor size={20} />
              <span>Farm Hub</span>
            </NavLink>
          )}

          {/* Role Portal: Admin */}
          {currentRole === 'admin' && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
              style={{ color: '#7e22ce' }}
            >
              <ShieldCheck size={20} />
              <span>Admin</span>
            </NavLink>
          )}
        </div>
      </nav>
    </>
  );
};


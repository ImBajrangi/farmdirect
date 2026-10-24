import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Store, ShoppingBag, PackageCheck, Tractor, ShieldCheck, Sparkles, X, MessageSquare, Activity, ChevronRight } from 'lucide-react';
import { BotAvatar } from 'bot-avatars';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../features/cart/CartContext';
import { useAuth } from '../../features/auth/AuthContext';
import { FARM_DIRECT_AGENTS, FarmAgent } from '../common/BotAvatarRoster';
import './layout.css';

type AgentState = 'default' | 'working' | 'sleeping';

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
};

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { itemCount } = useCart();
  const { currentRole } = useAuth();

  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Each agent's status tracked dynamically
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentState>>({
    kisan: 'working',
    sita: 'working',
    shetty: 'default',
    raju: 'default',
    tara: 'working',
    moti: 'sleeping',
  });

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
              shading={agent.shading}
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
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor:
                  status === 'working'
                    ? '#10B981'
                    : status === 'default'
                    ? '#059669'
                    : '#D97706',
                display: 'inline-block',
              }}
            />
            {status === 'working' ? 'Working' : status === 'default' ? 'Ready' : 'Sleeping'}
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
      {/* ── 1. Desktop Floating Agent Fleet Dock ── */}
      <div className="farm-desktop-sidebar-dock" role="region" aria-label="Autonomous Agent Fleet">
        {!desktopOpen ? (
          <button
            className="farm-sidebar-dock-trigger"
            onClick={() => setDesktopOpen(true)}
            aria-expanded={false}
            title="Open Autonomous Farm Agents Roster"
          >
            <div style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BotAvatar
                type={FARM_DIRECT_AGENTS[0].type}
                face={FARM_DIRECT_AGENTS[0].face}
                hat={FARM_DIRECT_AGENTS[0].hat}
                shading="fabric"
                size={26}
                state={agentStatuses.kisan}
              />
            </div>
            <span className="farm-sidebar-dock-label">Agent Fleet</span>
            <span className="farm-sidebar-dock-badge">{activeCount} Working</span>
          </button>
        ) : (
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
              <span style={{ color: '#059669', fontWeight: 600 }}>• 60 FPS</span>
            </div>
          </div>
        )}
      </div>

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
                  Each avatar follows its real-time operational status
                </span>
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


import React, { useState } from 'react';
import {
  BotAvatar,
  BotAvatarType,
  BotAvatarFace,
  BotAvatarState,
  BotAvatarShading,
  BotAvatarHat,
  BotAvatarGlasses
} from 'bot-avatars';
import { Sparkles, Check, Headphones, Glasses, Crown } from 'lucide-react';

export interface FarmAgent {
  id: string;
  name: string;
  role: string;
  type: BotAvatarType;
  face: BotAvatarFace;
  hat: BotAvatarHat;
  glasses: BotAvatarGlasses;
  headphones: boolean;
  bowTie: boolean;
  shading: BotAvatarShading;
  greeting: string;
  badge: string;
}

export const FARM_DIRECT_AGENTS: FarmAgent[] = [
  {
    id: 'kisan',
    name: 'Kisan',
    role: 'Morning Harvest Advisor',
    type: 'clover',
    face: 'mouth',
    hat: 'beanie',
    glasses: 'none',
    headphones: false,
    bowTie: false,
    shading: 'fabric',
    greeting: 'Namaste! I track dawn harvest timings across Nashik orchards and field lots.',
    badge: 'Harvest AI',
  },
  {
    id: 'sita',
    name: 'Sita',
    role: 'Residue & Organic Testing',
    type: 'flower',
    face: 'mouth',
    hat: 'crown',
    glasses: 'none',
    headphones: false,
    bowTie: false,
    shading: 'fabric',
    greeting: 'Hello! I audit soil quality, PGS-India certs, and zero-pesticide lab passes.',
    badge: 'Lab Verified',
  },
  {
    id: 'shetty',
    name: 'Shetty',
    role: 'Fair Price & Mandi Analyst',
    type: 'star',
    face: 'eyes',
    hat: 'none',
    glasses: 'round',
    headphones: false,
    bowTie: true,
    shading: 'plastic',
    greeting: 'Direct farmer pricing ensures 75%+ returns to cultivators vs wholesale mandis.',
    badge: 'Mandi Rates',
  },
  {
    id: 'raju',
    name: 'Raju',
    role: 'Cold-Chain Dispatch Monitor',
    type: 'mech',
    face: 'eyes',
    hat: 'none',
    glasses: 'none',
    headphones: true,
    bowTie: false,
    shading: 'plastic',
    greeting: 'Tracking temperature-controlled crates and express direct doorstep routes.',
    badge: 'Dispatch Bot',
  },
  {
    id: 'tara',
    name: 'Tara',
    role: 'Instant Help & Drone Scout',
    type: 'ghost',
    face: 'mouth',
    hat: 'none',
    glasses: 'shades',
    headphones: false,
    bowTie: false,
    shading: 'fabric',
    greeting: 'Looking for prompt farmgate assistance? I can resolve order queries in seconds!',
    badge: 'Instant Desk',
  },
  {
    id: 'moti',
    name: 'Moti',
    role: 'Farmgate Guardian',
    type: 'cat',
    face: 'mouth',
    hat: 'beret',
    glasses: 'none',
    headphones: false,
    bowTie: false,
    shading: 'fabric',
    greeting: 'Guarding fresh organic orchards and ensuring zero transit adulteration!',
    badge: 'Field Guard',
  },
  {
    id: 'chintu',
    name: 'Chintu',
    role: 'Fresh Basket Curator',
    type: 'circle',
    face: 'eyes',
    hat: 'party',
    glasses: 'none',
    headphones: false,
    bowTie: false,
    shading: 'plastic',
    greeting: 'Handpicking ripe Alphonso mangos and farm-fresh seasonal fruit hampers!',
    badge: 'Fruit Baskets',
  },
  {
    id: 'heera',
    name: 'Heera',
    role: 'Soil & Climate IoT Sensor',
    type: 'hexagon',
    face: 'eyes',
    hat: 'none',
    glasses: 'round',
    headphones: false,
    bowTie: false,
    shading: 'plastic',
    greeting: 'Calibrating N-P-K nutrient sensors, soil pH, and microclimate telemetry.',
    badge: 'Soil Intel',
  },
  {
    id: 'bheem',
    name: 'Bheem',
    role: 'Eco Crate & Cargo Lead',
    type: 'square',
    face: 'mouth',
    hat: 'beanie',
    glasses: 'none',
    headphones: false,
    bowTie: false,
    shading: 'plastic',
    greeting: 'Ensuring biodegradable cushioned crates protect delicate fruits on highways.',
    badge: 'Transit Pack',
  },
  {
    id: 'trishul',
    name: 'Trishul',
    role: 'Solar Pump & Irrigation',
    type: 'triangle',
    face: 'eyes',
    hat: 'crown',
    glasses: 'none',
    headphones: false,
    bowTie: false,
    shading: 'plastic',
    greeting: 'Powering automated solar drip lines during peak sunlight hours.',
    badge: 'Solar Irrigation',
  },
  {
    id: 'guddu',
    name: 'Guddu',
    role: 'Jeevamrit & Organic Brew',
    type: 'blob',
    face: 'mouth',
    hat: 'none',
    glasses: 'shades',
    headphones: false,
    bowTie: true,
    shading: 'fabric',
    greeting: 'Brewing native cow dung jeevamrit, neem extracts, and rich compost cultures.',
    badge: 'Bio Feeds',
  },
  {
    id: 'boond',
    name: 'Boond',
    role: 'Micro-Drip Conservation',
    type: 'drop',
    face: 'mouth',
    hat: 'beret',
    glasses: 'none',
    headphones: true,
    bowTie: false,
    shading: 'fabric',
    greeting: 'Preserving water drop by drop across 12 km of vineyard drip lines.',
    badge: 'Water Saver',
  },
];

interface BotAvatarRosterProps {
  selectedAgentId?: string;
  onSelectAgent?: (agent: FarmAgent) => void;
  size?: number;
  shading?: BotAvatarShading;
}

export const BotAvatarRoster: React.FC<BotAvatarRosterProps> = ({
  selectedAgentId,
  onSelectAgent,
  size = 64,
  shading,
}) => {
  const [activeId, setActiveId] = useState<string>(selectedAgentId || FARM_DIRECT_AGENTS[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [agentShadings, setAgentShadings] = useState<Record<string, BotAvatarShading>>(() => {
    const map: Record<string, BotAvatarShading> = {};
    FARM_DIRECT_AGENTS.forEach((a) => {
      map[a.id] = a.shading;
    });
    return map;
  });

  const toggleShading = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAgentShadings((prev) => ({
      ...prev,
      [agentId]: prev[agentId] === 'fabric' ? 'plastic' : 'fabric',
    }));
  };

  const handleSelect = (agent: FarmAgent) => {
    setActiveId(agent.id);
    onSelectAgent?.({ ...agent, shading: agentShadings[agent.id] || agent.shading });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
      {FARM_DIRECT_AGENTS.map((agent) => {
        const isSelected = activeId === agent.id;
        const isHovered = hoveredId === agent.id;
        const currentState: BotAvatarState = isHovered ? 'working' : isSelected ? 'default' : 'default';

        return (
          <div
            key={agent.id}
            onClick={() => handleSelect(agent)}
            onMouseEnter={() => setHoveredId(agent.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              padding: '16px 12px',
              borderRadius: 20,
              background: isSelected ? '#F0FDF4' : '#FFFFFF',
              border: isSelected ? '2px solid #10B981' : '1px solid #E5E7EB',
              boxShadow: isSelected
                ? '0 10px 25px -4px rgba(16, 185, 129, 0.25)'
                : '0 2px 8px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            {/* Active Checkmark Pill */}
            {isSelected && (
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#10B981',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                }}
              >
                <Check size={11} strokeWidth={3} />
              </span>
            )}

            {/* Rendered 2D Canvas Bot Avatar */}
            <div style={{ marginBottom: 8 }}>
              <BotAvatar
                type={agent.type}
                face={agent.face}
                state={currentState}
                hat={agent.hat}
                glasses={agent.glasses}
                headphones={agent.headphones}
                bowTie={agent.bowTie}
                shading={shading || agentShadings[agent.id] || agent.shading}
                size={size}
              />
            </div>

            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F2E22', marginBottom: 2 }}>
              {agent.name}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: isSelected ? '#047857' : '#6B7280',
                  background: isSelected ? '#DCFCE7' : '#F3F4F6',
                  padding: '2px 7px',
                  borderRadius: 100,
                  letterSpacing: 0.3,
                }}
              >
                {agent.badge}
              </span>

              {/* Shading Toggle Pill: Plastic <-> Fabric */}
              <button
                type="button"
                onClick={(e) => toggleShading(agent.id, e)}
                title="Click to toggle between Plastic and Fabric shading"
                style={{
                  fontSize: 9.5,
                  fontWeight: 650,
                  color: (shading || agentShadings[agent.id] || agent.shading) === 'fabric' ? '#92400E' : '#1E40AF',
                  background: (shading || agentShadings[agent.id] || agent.shading) === 'fabric' ? '#FEF3C7' : '#DBEAFE',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  padding: '1px 6px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                {(shading || agentShadings[agent.id] || agent.shading) === 'fabric' ? '🧸 Fabric' : '✨ Plastic'}
              </button>
            </div>

            <span style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.3 }}>
              {agent.role}
            </span>
          </div>
        );
      })}
    </div>
  );
};

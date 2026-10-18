import React, { useState } from 'react';
import { Plus, Mic, Settings, Sliders, CheckCircle, Play, Sparkles, Activity, Edit3, Trash2 } from 'lucide-react';
import { VoiceAgent } from '../types';

interface AgentStudioViewProps {
  agents: VoiceAgent[];
  onSaveAgent: (agent: VoiceAgent) => void;
}

export const AgentStudioView: React.FC<AgentStudioViewProps> = ({ agents, onSaveAgent }) => {
  const [selectedAgent, setSelectedAgent] = useState<VoiceAgent | null>(agents[0] || null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');
  const [voiceModel, setVoiceModel] = useState<any>('Gemini 3.8 Live');
  const [voiceId, setVoiceId] = useState<any>('aura');
  const [latencyMs, setLatencyMs] = useState<number>(220);
  const [systemPrompt, setSystemPrompt] = useState<string>('');

  const handleEdit = (agent: VoiceAgent) => {
    setSelectedAgent(agent);
    setName(agent.name);
    setSpecialty(agent.specialty);
    setVoiceModel(agent.voiceModel);
    setVoiceId(agent.voiceId);
    setLatencyMs(agent.latencyMs);
    setSystemPrompt(agent.systemPrompt);
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    const newAgent: VoiceAgent = {
      id: `agent-${Date.now()}`,
      name: 'New Clinical Intake Agent',
      specialty: 'Patient Intake',
      voiceModel: 'Gemini 3.8 Live',
      voiceId: 'aura',
      latencyMs: 220,
      temperature: 0.2,
      systemPrompt: 'You are an AI medical intake coordinator. Gather patient demographic info, reason for visit, and insurance carrier with extreme accuracy.',
      status: 'active',
      containmentRate: 95.0,
      totalCalls: 0,
      avgDurationSec: 90,
      updatedAt: 'Just now',
    };
    handleEdit(newAgent);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;

    const updated: VoiceAgent = {
      ...selectedAgent,
      name,
      specialty,
      voiceModel,
      voiceId,
      latencyMs,
      systemPrompt,
      updatedAt: 'Just now',
    };

    onSaveAgent(updated);
    setSelectedAgent(updated);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="oc-view-header">
        <div className="oc-view-title-group">
          <h1>Voice AI Agent Studio</h1>
          <p className="oc-view-subtitle">
            Configure clinical voice personas, conversational workflows, and ultra-low latency voice models.
          </p>
        </div>
        <div className="oc-view-header-actions">
          <button className="oc-primary-action-btn" onClick={handleCreateNew}>
            <Plus size={16} />
            <span>Create New Agent</span>
          </button>
        </div>
      </div>

      {/* Grid of Agents */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="oc-metric-card"
            style={{
              cursor: 'pointer',
              border: selectedAgent?.id === agent.id ? '2px solid var(--oc-forest)' : '1px solid var(--oc-border-subtle)',
              backgroundColor: selectedAgent?.id === agent.id ? '#ffffff' : '#ffffff',
            }}
            onClick={() => handleEdit(agent)}
          >
            <div className="oc-metric-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="oc-metric-icon-wrap">
                  <Mic size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--oc-forest)' }}>{agent.name}</h3>
                  <span style={{ fontSize: '0.78125rem', color: '#1f6443', fontWeight: 700 }}>{agent.specialty}</span>
                </div>
              </div>
              <span className={`oc-badge ${agent.status}`}>{agent.status}</span>
            </div>

            <p style={{ fontSize: '0.84375rem', color: 'var(--oc-text-secondary)', lineHeight: 1.5, margin: '10px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {agent.systemPrompt}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(15, 46, 34, 0.08)' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--oc-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Latency</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#059669' }}>{agent.latencyMs}ms</span>
              </div>
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--oc-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Containment</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--oc-forest)' }}>{agent.containmentRate}%</span>
              </div>
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--oc-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Calls</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--oc-forest)' }}>{agent.totalCalls.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Editor Drawer */}
      {isEditing && selectedAgent && (
        <div className="oc-drawer-backdrop" onClick={() => setIsEditing(false)}>
          <div className="oc-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="oc-drawer-header">
              <h3>Configure Voice Agent</h3>
              <button className="oc-drawer-close" onClick={() => setIsEditing(false)}>✕</button>
            </div>

            <form onSubmit={handleSave} className="oc-drawer-body">
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9aa0b4', textTransform: 'uppercase' }}>Agent Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="oc-sim-input"
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9aa0b4', textTransform: 'uppercase' }}>Specialty / Domain</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="oc-sim-input"
                  style={{ width: '100%', marginTop: '6px' }}
                  placeholder="e.g. Cardiology, Billing, Primary Care"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9aa0b4', textTransform: 'uppercase' }}>Voice AI Model</label>
                  <select
                    value={voiceModel}
                    onChange={(e) => setVoiceModel(e.target.value as any)}
                    className="oc-sim-input"
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    <option value="Gemini 3.8 Live">Gemini 3.8 Live (Recommended)</option>
                    <option value="Gemini 2.5 Flash">Gemini 2.5 Flash Voice</option>
                    <option value="ElevenLabs Nova">ElevenLabs Nova Engine</option>
                    <option value="Whisper Voice 2">Whisper Voice 2</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9aa0b4', textTransform: 'uppercase' }}>Voice Persona</label>
                  <select
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value as any)}
                    className="oc-sim-input"
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    <option value="aura">Aura (Empathetic / Warm)</option>
                    <option value="zephyr">Zephyr (Professional / Crisp)</option>
                    <option value="orion">Orion (Authoritative / Clear)</option>
                    <option value="sol">Sol (Friendly / Energetic)</option>
                    <option value="celeste">Celeste (Calm Clinical)</option>
                  </select>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9aa0b4', textTransform: 'uppercase' }}>Target Latency Threshold</label>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--oc-lime)', fontWeight: 700 }}>{latencyMs}ms</span>
                </div>
                <input
                  type="range"
                  min="160"
                  max="450"
                  step="10"
                  value={latencyMs}
                  onChange={(e) => setLatencyMs(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '8px', accentColor: 'var(--oc-lime)' }}
                />
                <span style={{ fontSize: '0.6875rem', color: '#646b82' }}>Lower latency delivers sub-second conversational speech interruptions.</span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9aa0b4', textTransform: 'uppercase' }}>Clinical System Instruction Prompt</label>
                <textarea
                  rows={6}
                  required
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="oc-sim-input"
                  style={{ width: '100%', marginTop: '6px', resize: 'vertical', lineHeight: 1.45 }}
                  placeholder="Define role, conversational guidelines, triage protocols, and tone..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="submit" className="oc-primary-action-btn" style={{ flex: 1, justifyContent: 'center' }}>
                  Save & Deploy Agent
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                    padding: '9px 18px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

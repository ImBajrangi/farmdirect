import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  PhoneOff,
  Mic,
  Calendar,
  Pill,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  MessageSquare,
  Users,
  Settings,
  X,
  Stethoscope,
  Smile,
  Heart,
  Dog,
} from 'lucide-react';
import { practicePersonas, PracticePersonaData } from './agenticConfig';
import './saas.css';

export const OpenCallApp: React.FC = () => {
  // 1. Personalized Practice Persona Selector
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<string>('primary_care');
  const persona: PracticePersonaData = practicePersonas[selectedPersonaKey] || practicePersonas.primary_care;

  // 2. Interactive Simulator State
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<
    { agent: string; action: string; time: string; latency: string; icon: string }[]
  >([]);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  // Call duration counter
  useEffect(() => {
    let timer: any;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  // Reset simulation when persona changes
  useEffect(() => {
    setIsCalling(false);
    setActiveScenarioIdx(null);
    setWorkflowSteps([]);
  }, [selectedPersonaKey]);

  // Handle Start Simulated Call
  const handleStartCall = () => {
    setIsCalling(true);
    setActiveScenarioIdx(null);
    setWorkflowSteps([
      {
        agent: persona.agents[0].name,
        action: 'Inbound line connected in 0.8s. Streaming natural greeting to caller.',
        time: 'Just now',
        latency: '180ms',
        icon: 'phone',
      },
    ]);
  };

  // Handle End Call
  const handleEndCall = () => {
    setIsCalling(false);
  };

  // Trigger Autonomous Multi-Agent Hand-off Scenario
  const handleSelectScenario = (idx: number) => {
    setActiveScenarioIdx(idx);
    const scenario = persona.scenarios[idx];

    // Real-time Agentic Autonomous Hand-off Simulation
    const step1 = {
      agent: persona.agents[0].name + ' (Voice)',
      action: `Transcribed caller audio: "${scenario.callerText}"`,
      time: '0:03',
      latency: '210ms',
      icon: 'phone',
    };

    const step2 = {
      agent: persona.agents[1].name + ' (Triage)',
      action: `Assessed clinical urgency: ${scenario.triageAssessment}`,
      time: '0:05',
      latency: '120ms',
      icon: 'shield',
    };

    const step3 = {
      agent: persona.agents[2].name + ' (Scheduler)',
      action: `Matched EHR schedule & reserved: ${scenario.bookedSlot}`,
      time: '0:07',
      latency: '150ms',
      icon: 'calendar',
    };

    const step4 = {
      agent: persona.agents[3].name + ' (SMS)',
      action: `Dispatched SMS pass: "${scenario.smsText}"`,
      time: '0:09',
      latency: '95ms',
      icon: 'message',
    };

    setWorkflowSteps([step1]);

    setTimeout(() => {
      setWorkflowSteps((prev) => [...prev, step2]);
    }, 450);

    setTimeout(() => {
      setWorkflowSteps((prev) => [...prev, step3]);
    }, 900);

    setTimeout(() => {
      setWorkflowSteps((prev) => [...prev, step4]);
    }, 1350);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="oc-simple-root">
      {/* ── 1. Top Header with 1-Click Practice Personalization ────────────── */}
      <header className="oc-simple-header">
        <div className="oc-simple-header-inner">
          {/* Brand Logo */}
          <Link to="/" className="oc-simple-brand">
            <div className="oc-simple-logo">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <circle cx="16.5" cy="11.5" r="6.2" fill="#0f2e22" />
                <circle cx="11.5" cy="16.5" r="6.2" stroke="#0f2e22" strokeWidth="2.2" fill="none" />
              </svg>
            </div>
            <span className="oc-simple-brand-text">
              OpenCall<strong>.ai</strong>
            </span>
          </Link>

          {/* Practice Personalization Switcher */}
          <div className="oc-persona-switcher" title="Select practice type to personalize your autonomous agent team">
            <button
              className={`oc-persona-btn ${selectedPersonaKey === 'primary_care' ? 'is-active' : ''}`}
              onClick={() => setSelectedPersonaKey('primary_care')}
            >
              <Stethoscope size={14} />
              <span>Primary Care</span>
              <span className="oc-persona-dot" />
            </button>

            <button
              className={`oc-persona-btn ${selectedPersonaKey === 'dental' ? 'is-active' : ''}`}
              onClick={() => setSelectedPersonaKey('dental')}
            >
              <Smile size={14} />
              <span>Dental Studio</span>
              <span className="oc-persona-dot" />
            </button>

            <button
              className={`oc-persona-btn ${selectedPersonaKey === 'dermatology' ? 'is-active' : ''}`}
              onClick={() => setSelectedPersonaKey('dermatology')}
            >
              <Sparkles size={14} />
              <span>Dermatology</span>
              <span className="oc-persona-dot" />
            </button>

            <button
              className={`oc-persona-btn ${selectedPersonaKey === 'veterinary' ? 'is-active' : ''}`}
              onClick={() => setSelectedPersonaKey('veterinary')}
            >
              <Dog size={14} />
              <span>Veterinary</span>
              <span className="oc-persona-dot" />
            </button>
          </div>

          {/* Right Header: Active Status & Back Link */}
          <div className="oc-simple-header-actions">
            <div className="oc-clinic-status-badge">
              <span className="oc-green-pulse" />
              <span>4 Agents Coordinated</span>
            </div>

            <Link to="/" className="oc-simple-back-btn">
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── 2. Master Workspace ────────────────────────────────────────────── */}
      <main className="oc-simple-main">
        {/* Practice Overview Strip */}
        <section className="oc-welcome-strip">
          <div className="oc-welcome-text">
            <h2>{persona.name}</h2>
            <p>
              Lead Clinician: <strong>{persona.doctor}</strong> · Active Line: <strong>{persona.phone}</strong>
              <br />
              All patient phone calls, symptom assessments, and calendar bookings are handled autonomously.
            </p>
          </div>

          <div className="oc-stats-pills">
            <div className="oc-quick-stat">
              <span className="oc-qs-num">142</span>
              <span className="oc-qs-label">Calls Answered Today</span>
            </div>
            <div className="oc-quick-stat">
              <span className="oc-qs-num">0 sec</span>
              <span className="oc-qs-label">Patient Hold Time</span>
            </div>
            <div className="oc-quick-stat">
              <span className="oc-qs-num">98.6%</span>
              <span className="oc-qs-label">Autonomous Resolution</span>
            </div>
          </div>
        </section>

        {/* ── 3. Autonomous Agent Fleet Grid (Organized Role Delegation) ──────── */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--oc-forest)' }}>
              Your Autonomous Practice Agent Crew
            </h3>
            <span style={{ fontSize: '0.78125rem', color: '#1f6443', fontWeight: 700 }}>
              ● All 4 Agents Synchronized & Operating in Parallel
            </span>
          </div>

          <div className="oc-agent-fleet-grid">
            {persona.agents.map((agent) => (
              <div key={agent.id} className="oc-agent-fleet-card">
                <div className="oc-agent-fleet-top">
                  <div className="oc-agent-icon-wrap">
                    {agent.role === 'voice' ? (
                      <Phone size={18} />
                    ) : agent.role === 'triage' ? (
                      <ShieldAlert size={18} />
                    ) : agent.role === 'scheduler' ? (
                      <Calendar size={18} />
                    ) : (
                      <MessageSquare size={18} />
                    )}
                  </div>
                  <span className="oc-agent-autonomy-badge">
                    <Zap size={10} />
                    {agent.autonomyLevel}
                  </span>
                </div>

                <div className="oc-agent-fleet-title">
                  <h4>{agent.name}</h4>
                  <span>{agent.title}</span>
                </div>

                <p className="oc-agent-fleet-desc">{agent.description}</p>

                <div className="oc-agent-fleet-footer">
                  <span>Tasks Completed</span>
                  <strong style={{ color: 'var(--oc-forest)' }}>{agent.tasksToday} today</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. The Centerpiece: Agentic Collaboration Sandbox (2 Columns) ──── */}
        <div className="oc-agentic-sandbox-grid">
          {/* Left Column: Interactive Virtual Phone Tester */}
          <div className="oc-simulator-drawer" style={{ marginBottom: 0 }}>
            <div className="oc-simulator-top">
              <div className="oc-simulator-agent-tag">
                <div className="oc-sim-agent-avatar">
                  <Mic size={20} />
                </div>
                <div className="oc-sim-agent-details">
                  <h4>Live Patient Phone Simulator</h4>
                  <span>{isCalling ? `LIVE CALL IN PROGRESS (${formatTimer(callDuration)})` : 'READY TO DIAL'}</span>
                </div>
              </div>

              {!isCalling ? (
                <button className="oc-sim-call-btn start" onClick={handleStartCall}>
                  <Phone size={16} />
                  <span>Dial Practice Line</span>
                </button>
              ) : (
                <button className="oc-sim-call-btn hangup" onClick={handleEndCall}>
                  <PhoneOff size={16} />
                  <span>Hang Up</span>
                </button>
              )}
            </div>

            {/* Audio Waveform when call active */}
            {isCalling && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#f0f6f2', borderRadius: '14px', marginBottom: '16px', border: '1px solid rgba(15, 46, 34, 0.08)' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1f6443', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} color="#10b981" />
                  Voice Speech Latency: 190ms (Sub-second)
                </span>
                <div className="oc-soundwave-bars">
                  {[6, 16, 28, 14, 34, 18, 10, 26, 12].map((h, i) => (
                    <div
                      key={i}
                      className="oc-sound-bar is-pulsing"
                      style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Feed */}
            <div className="oc-sim-transcript-feed" style={{ minHeight: '190px' }}>
              {!isCalling ? (
                <div style={{ textAlign: 'center', color: '#586f63', padding: '36px 14px', fontSize: '0.875rem' }}>
                  Click <strong>"Dial Practice Line"</strong> to test how your autonomous agent team coordinates in real-time.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Turn 1: Greeting */}
                  <div className="oc-sim-turn agent">
                    <div className="oc-sim-speaker-tag">{persona.agents[0].name} (Voice Agent) • 0:01</div>
                    <div className="oc-sim-bubble">{persona.greeting}</div>
                  </div>

                  {/* Turn 2: Caller response if scenario clicked */}
                  {activeScenarioIdx !== null && (
                    <>
                      <div className="oc-sim-turn caller">
                        <div className="oc-sim-speaker-tag">Patient (Caller) • 0:03</div>
                        <div className="oc-sim-bubble">"{persona.scenarios[activeScenarioIdx].callerText}"</div>
                      </div>

                      <div className="oc-sim-turn agent">
                        <div className="oc-sim-speaker-tag">{persona.agents[0].name} (Voice Agent) • 210ms</div>
                        <div className="oc-sim-bubble">{persona.scenarios[activeScenarioIdx].agentReply}</div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Quick 1-Click Scenario Trigger Chips */}
            {isCalling && (
              <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '0.78125rem', color: '#586f63', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  Choose a caller scenario to watch agents hand off tasks:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {persona.scenarios.map((sc, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectScenario(i)}
                      style={{
                        background: activeScenarioIdx === i ? '#d9f758' : '#f3f7f4',
                        border: '1px solid rgba(15, 46, 34, 0.12)',
                        borderRadius: '9999px',
                        padding: '9px 16px',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: 'var(--oc-forest)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Autonomous Workflow Stream (Multi-Agent Coordination) */}
          <div className="oc-workflow-box">
            <div className="oc-workflow-header">
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--oc-forest)' }}>
                  Autonomous Agent Execution Log
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#1f6443', fontWeight: 600 }}>
                  Live Step-by-Step Multi-Agent Collaboration
                </span>
              </div>
              <span className="oc-agent-autonomy-badge">
                <Zap size={10} />
                Live Stream
              </span>
            </div>

            <div className="oc-workflow-stream">
              {workflowSteps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: '#728a7e' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#e2ede5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--oc-forest)' }}>
                    <Sparkles size={20} />
                  </div>
                  <h5 style={{ margin: '0 0 6px', fontSize: '0.9375rem', color: 'var(--oc-forest)', fontWeight: 800 }}>
                    Awaiting Inbound Call
                  </h5>
                  <p style={{ margin: 0, fontSize: '0.8125rem', lineHeight: 1.45 }}>
                    When a patient speaks, you will see your Voice, Triage, Scheduling, and SMS agents collaborate autonomously.
                  </p>
                </div>
              ) : (
                workflowSteps.map((step, idx) => (
                  <div key={idx} className="oc-workflow-step-card">
                    <div className="oc-workflow-step-icon">
                      {step.icon === 'phone' ? (
                        <Phone size={15} />
                      ) : step.icon === 'shield' ? (
                        <ShieldAlert size={15} color="#059669" />
                      ) : step.icon === 'calendar' ? (
                        <Calendar size={15} color="#0f2e22" />
                      ) : (
                        <MessageSquare size={15} color="#1f6443" />
                      )}
                    </div>
                    <div className="oc-workflow-step-body">
                      <div className="oc-workflow-step-head">
                        <span className="oc-workflow-step-agent">{step.agent}</span>
                        <span className="oc-workflow-step-latency">{step.latency}</span>
                      </div>
                      <p className="oc-workflow-step-text">{step.action}</p>
                    </div>
                  </div>
                ))
              )}

              {/* Confirmed Result Banner */}
              {activeScenarioIdx !== null && workflowSteps.length >= 4 && (
                <div className="oc-confirmed-result-card">
                  <CheckCircle2 size={22} color="#10b981" />
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: '#0f2e22', display: 'block' }}>
                      Task Completed Autonomously
                    </strong>
                    <span style={{ fontSize: '0.8125rem', color: '#1f6443' }}>
                      {persona.scenarios[activeScenarioIdx].bookedSlot}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 5. Recent Autonomous Activity (Clean Cards) ──────────────────── */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--oc-forest)' }}>
                Today's Autonomous Clinical Activity
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.84375rem', color: '#4a6356' }}>
                Every patient interaction is automatically transcribed, summarized, and verified.
              </p>
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#1f6443', fontWeight: 700 }}>
              {persona.recentActivity.length} Recent Tasks Logged
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {persona.recentActivity.map((act) => (
              <div
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(15, 46, 34, 0.08)',
                  borderRadius: '18px',
                  padding: '20px',
                  boxShadow: '0 4px 16px -4px rgba(15, 46, 34, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: 'var(--oc-forest)', fontSize: '0.98rem' }}>
                    {act.callerName}
                  </span>
                  <span className={`oc-badge ${act.status}`}>
                    {act.status}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.84375rem', color: '#4a6356', lineHeight: 1.45 }}>
                  {act.summary}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(15, 46, 34, 0.06)', fontSize: '0.75rem', color: '#728a7e' }}>
                  <span>{act.time}</span>
                  <span style={{ color: '#1f6443', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{act.agentName}</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── 6. Transcript Detail Modal ────────────────────────────────────── */}
      {selectedActivity && (
        <div className="oc-drawer-backdrop" onClick={() => setSelectedActivity(null)}>
          <div className="oc-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="oc-drawer-header">
              <div>
                <h3 style={{ margin: 0 }}>Encounter #{selectedActivity.id}</h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--oc-text-secondary)', fontWeight: 600 }}>
                  {selectedActivity.callerName} · {selectedActivity.time}
                </span>
              </div>
              <button className="oc-drawer-close" onClick={() => setSelectedActivity(null)}>✕</button>
            </div>

            <div className="oc-drawer-body">
              <div style={{ backgroundColor: '#f3f7f4', borderRadius: '16px', padding: '18px', border: '1px solid rgba(15, 46, 34, 0.08)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1f6443', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Autonomous Clinical Summary
                </span>
                <p style={{ margin: '6px 0 0', fontSize: '0.90625rem', color: 'var(--oc-forest)', lineHeight: 1.5, fontWeight: 500 }}>
                  {selectedActivity.summary}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--oc-text-muted)', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.06em' }}>
                  Verbatim Multi-Agent Dialogue
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedActivity.transcript.map((turn: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '14px',
                        background: turn.speaker === 'Caller' ? '#ffffff' : '#f3f7f4',
                        border: '1px solid rgba(15, 46, 34, 0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <span style={{ color: turn.speaker === 'Caller' ? 'var(--oc-forest)' : '#1f6443' }}>
                          {turn.speaker}
                        </span>
                        <span style={{ color: 'var(--oc-text-muted)' }}>{turn.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--oc-forest)', lineHeight: 1.45 }}>
                        {turn.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

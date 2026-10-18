import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, Volume2, Sparkles, AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';
import { VoiceAgent, CallRecord, CallTurn } from '../types';
import { CacheService } from '../cacheService';

interface LiveCallSimulatorProps {
  agents: VoiceAgent[];
  onCallEnded: (record: CallRecord) => void;
}

export const LiveCallSimulator: React.FC<LiveCallSimulatorProps> = ({ agents, onCallEnded }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'agent-cardiology');
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [transcript, setTranscript] = useState<CallTurn[]>([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [simulatedLatency, setSimulatedLatency] = useState<number>(210);

  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];
  const timerRef = useRef<any>(null);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll transcript
  useEffect(() => {
    if (transcriptBottomRef.current) {
      transcriptBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript, isAiSpeaking]);

  // Duration Timer
  useEffect(() => {
    if (isCalling) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCalling]);

  const startCall = () => {
    setIsCalling(true);
    setTranscript([]);
    setIsAiSpeaking(true);
    setSimulatedLatency(activeAgent?.latencyMs || 220);

    // Initial greeting from agent
    setTimeout(() => {
      const greeting: CallTurn = {
        speaker: 'agent',
        text: `Hello, thank you for calling ${activeAgent?.specialty || 'Clinic'}. I am your automated clinical assistant powered by OpenCall.ai. How can I help you today?`,
        timestamp: '0:01',
        latencyMs: activeAgent?.latencyMs || 210,
      };
      setTranscript([greeting]);
      setIsAiSpeaking(false);
    }, 800);
  };

  const endCall = () => {
    if (!isCalling) return;
    setIsCalling(false);
    setIsAiSpeaking(false);

    // Create Call Record and save to cache
    const finalRecord: CallRecord = {
      id: `call-${Date.now().toString().slice(-5)}`,
      callerNumber: '+1 (555) 019-8821',
      callerName: 'Test Patient (Sandbox)',
      agentId: activeAgent?.id || 'agent-cardiology',
      agentName: activeAgent?.name || 'Voice Agent',
      specialty: activeAgent?.specialty || 'General',
      status: 'completed',
      sentiment: 'positive',
      durationSec: Math.max(8, callDuration),
      cost: Number((Math.max(8, callDuration) * 0.0012).toFixed(2)),
      startedAt: 'Just now',
      summary: `Test simulator session with ${activeAgent?.name}. ${transcript.length} dialogue turns processed.`,
      transcript: transcript,
    };

    onCallEnded(finalRecord);
  };

  const handleSendResponse = (presetText?: string) => {
    const textToSend = presetText || userInput.trim();
    if (!textToSend || !isCalling) return;

    const callerTurn: CallTurn = {
      speaker: 'caller',
      text: textToSend,
      timestamp: formatTime(callDuration),
    };

    setTranscript(prev => [...prev, callerTurn]);
    setUserInput('');
    setIsAiSpeaking(true);

    // Simulated AI response generation with low-latency calculation
    const latency = Math.floor(190 + Math.random() * 60);
    setSimulatedLatency(latency);

    setTimeout(() => {
      let reply = "I have noted that in your clinical chart. Is there anything else you need assistance with today?";
      const lower = textToSend.toLowerCase();

      if (lower.includes('schedule') || lower.includes('appointment')) {
        reply = "I checked our live schedule and found slots available with Dr. Vance this Thursday at 10:30 AM or 3:15 PM. Would either work for you?";
      } else if (lower.includes('refill') || lower.includes('prescription')) {
        reply = "I can submit an electronic refill request right away. Please confirm your pharmacy branch, or should we send it to your usual CVS on Main St?";
      } else if (lower.includes('chest') || lower.includes('pain') || lower.includes('dizzy') || lower.includes('emergency')) {
        reply = "Your safety is our priority. Based on your symptoms, I am immediately routing your call to our On-Call Triage Nurse. Please stay connected.";
      }

      const agentTurn: CallTurn = {
        speaker: 'agent',
        text: reply,
        timestamp: formatTime(callDuration + 2),
        latencyMs: latency,
      };

      setTranscript(prev => [...prev, agentTurn]);
      setIsAiSpeaking(false);
    }, 700);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="oc-simulator-drawer">
      {/* Top Header */}
      <div className="oc-simulator-top">
        <div className="oc-simulator-agent-tag">
          <div className="oc-sim-agent-avatar">
            <Mic size={20} />
          </div>
          <div className="oc-sim-agent-details">
            <h4>Live Voice Agent Testing Sandbox</h4>
            <span>{isCalling ? `LIVE CALL IN PROGRESS (${formatTime(callDuration)})` : 'READY TO DIAL'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Agent Picker */}
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            disabled={isCalling}
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid rgba(15, 46, 34, 0.12)',
              borderRadius: '9999px',
              color: 'var(--oc-forest)',
              padding: '8px 16px',
              fontSize: '0.84375rem',
              fontWeight: 700,
              outline: 'none',
              cursor: isCalling ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(15, 46, 34, 0.04)',
            }}
          >
            {agents.map(a => (
              <option key={a.id} value={a.id} style={{ background: '#ffffff', color: '#0f2e22' }}>
                {a.name} ({a.specialty})
              </option>
            ))}
          </select>

          {/* Call / Hangup CTA */}
          {!isCalling ? (
            <button className="oc-sim-call-btn start" onClick={startCall}>
              <Phone size={16} />
              <span>Start Test Call</span>
            </button>
          ) : (
            <button className="oc-sim-call-btn hangup" onClick={endCall}>
              <PhoneOff size={16} />
              <span>End Call</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Audio Waveform & Status Strip */}
      {isCalling && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', background: '#f0f6f2', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(15, 46, 34, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--oc-forest)' }}>
            <Zap size={15} color="#10b981" />
            <span>Voice Latency: {simulatedLatency}ms (Sub-second Live Speech)</span>
          </div>

          {/* Sound wave bars */}
          <div className="oc-soundwave-bars">
            {[4, 12, 28, 16, 32, 20, 10, 24, 36, 18, 8].map((h, i) => (
              <div
                key={i}
                className={`oc-sound-bar ${isAiSpeaking ? 'is-pulsing' : ''}`}
                style={{
                  height: isAiSpeaking ? `${h}px` : '6px',
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: '0.8125rem', color: isAiSpeaking ? '#059669' : '#586f63', fontWeight: 700 }}>
            {isAiSpeaking ? '● AI Speaking...' : '● Listening to caller...'}
          </div>
        </div>
      )}

      {/* Transcript Feed */}
      <div className="oc-sim-transcript-feed">
        {transcript.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#586f63', padding: '36px 14px', fontSize: '0.90625rem' }}>
            Click <strong>"Start Test Call"</strong> to simulate an incoming clinical phone call with ultra-low latency conversational AI.
          </div>
        ) : (
          transcript.map((turn, idx) => (
            <div key={idx} className={`oc-sim-turn ${turn.speaker}`}>
              <div className="oc-sim-speaker-tag">
                {turn.speaker === 'agent' ? `${activeAgent?.name} (${turn.latencyMs || 220}ms)` : 'You (Caller)'} • {turn.timestamp}
              </div>
              <div className="oc-sim-bubble">{turn.text}</div>
            </div>
          ))
        )}
        <div ref={transcriptBottomRef} />
      </div>

      {/* Quick Prompts & Interactive Input */}
      {isCalling && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78125rem', color: '#586f63', alignSelf: 'center', fontWeight: 600 }}>Try scenario:</span>
            {[
              'I need to schedule an appointment with Dr. Vance',
              'Can I get my blood pressure medication refilled?',
              'I am having chest tightness and severe shortness of breath',
            ].map((preset, i) => (
              <button
                key={i}
                onClick={() => handleSendResponse(preset)}
                style={{
                  background: '#f3f7f4',
                  border: '1px solid rgba(15, 46, 34, 0.12)',
                  borderRadius: '9999px',
                  color: 'var(--oc-forest)',
                  padding: '6px 14px',
                  fontSize: '0.78125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                "{preset}"
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendResponse();
            }}
            className="oc-sim-input-row"
          >
            <input
              type="text"
              className="oc-sim-input"
              placeholder="Speak or type caller response to test agent logic..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={!userInput.trim()}
              className="oc-primary-action-btn"
              style={{ opacity: userInput.trim() ? 1 : 0.5 }}
            >
              Reply
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

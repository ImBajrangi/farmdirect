import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Liquid } from 'liquid-gooey';
import { BotAvatar } from 'bot-avatars';
import { BorderBeam } from 'border-beam';
import { ThinkingOrb } from 'thinking-orbs';
import { MessageSquare, Package, PhoneCall, Sparkles, X, Send, Zap, Users } from 'lucide-react';
import { assistantCache } from '../../services/assistantCache';
import { FARM_DIRECT_AGENTS, FarmAgent } from './BotAvatarRoster';
import './LiquidBotSpeedDial.css';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_ANSWERS: Record<string, string> = {
  harvest: 'All produce on FarmDirect is plucked fresh at dawn directly by local growers in Nashik, Niphad, and Pune! We ship within 4-6 hours of harvest to keep nutrients and crispness intact.',
  track: 'You can track your harvest order anytime by visiting the Orders tab or entering your Order ID. Each batch includes real-time harvest dispatch timestamps.',
  organic: 'FarmDirect enforces rigorous lab verification. Produce marked Organic is certified under NPOP / PGS-India. Our "Natural Farmgate" crops are 100% residue-free and grown using jeevamrit and neem formulations.',
  pricing: 'By connecting you directly to the farmer, we eliminate 3 to 5 middlemen. Farmers get up to 78% of the consumer rupee, compared to only 28-35% in traditional wholesale mandis.',
};

export const LiquidBotSpeedDial: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [botState, setBotState] = useState<'default' | 'working' | 'sleeping'>('default');
  const [currentAgent, setCurrentAgent] = useState<FarmAgent>(FARM_DIRECT_AGENTS[0]);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: FARM_DIRECT_AGENTS[0].greeting,
      timestamp: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const navigate = useNavigate();
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const streamingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll on new messages or streaming chunk updates
  useEffect(() => {
    if (modalOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, modalOpen, streamingText]);

  // Clean up streaming timer on unmount
  useEffect(() => {
    return () => {
      if (streamingTimerRef.current) clearInterval(streamingTimerRef.current);
    };
  }, []);

  // Listen for open-farm-assistant event dispatched from sidebar or other components
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ agentId?: string }>;
      setModalOpen(true);
      if (customEvent.detail?.agentId) {
        const found = FARM_DIRECT_AGENTS.find((a) => a.id === customEvent.detail?.agentId);
        if (found) {
          setCurrentAgent(found);
          setBotState('default');
        }
      }
    };
    window.addEventListener('open-farm-assistant', handleOpen);
    return () => window.removeEventListener('open-farm-assistant', handleOpen);
  }, []);

  const switchAgent = (agent: FarmAgent) => {
    setCurrentAgent(agent);
    setMessages((prev) => [
      ...prev,
      {
        id: `agent-switch-${Date.now()}`,
        sender: 'assistant',
        text: `Switched to ${agent.name} (${agent.role}): "${agent.greeting}"`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Handle speed dial item actions
  const handleAction = (type: 'chat' | 'orders' | 'whatsapp') => {
    setOpen(false);
    if (type === 'chat') {
      setModalOpen(true);
      setBotState('default');
    } else if (type === 'orders') {
      navigate('/orders');
    } else if (type === 'whatsapp') {
      window.open('https://wa.me/919900000000?text=Hello%20FarmDirect%20Team!%20I%20need%20assistance.', '_blank');
    }
  };

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);
    setBotState('working');
    setStreamingText('');

    // 1. Determine answer text (checking cache or smart rule)
    const cachedResponse = assistantCache.get<string>(q);
    let fullResponse = cachedResponse || '';
    let isFromCache = false;

    if (cachedResponse) {
      isFromCache = true;
    } else {
      const lower = q.toLowerCase();
      if (lower.includes('harvest') || lower.includes('fresh') || lower.includes('today')) {
        fullResponse = PRESET_ANSWERS.harvest;
      } else if (lower.includes('track') || lower.includes('order') || lower.includes('status')) {
        fullResponse = PRESET_ANSWERS.track;
      } else if (lower.includes('organic') || lower.includes('pesticide') || lower.includes('verify')) {
        fullResponse = PRESET_ANSWERS.organic;
      } else if (lower.includes('price') || lower.includes('rate') || lower.includes('cost') || lower.includes('farmer')) {
        fullResponse = PRESET_ANSWERS.pricing;
      } else {
        fullResponse = `Thanks for asking about "${q}". Our farmgate network directly syncs verified farmer lots with fair price standards. Our harvest desk is ready to help!`;
      }
      assistantCache.set(q, fullResponse);
    }

    // 2. Stream the response word by word while ThinkingOrb and BorderBeam are active
    const words = fullResponse.split(' ');
    let currentIdx = 0;
    const intervalTime = isFromCache ? 25 : 35; // Fast responsive stream

    if (streamingTimerRef.current) clearInterval(streamingTimerRef.current);

    streamingTimerRef.current = setInterval(() => {
      currentIdx++;
      if (currentIdx <= words.length) {
        setStreamingText(words.slice(0, currentIdx).join(' '));
      } else {
        if (streamingTimerRef.current) clearInterval(streamingTimerRef.current);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'assistant',
            text: fullResponse,
            timestamp: isFromCache ? 'Instant (Cached)' : 'Just now',
          },
        ]);
        setIsTyping(false);
        setStreamingText('');
        setBotState('default');
      }
    }, intervalTime);
  };

  return (
    <>
      {/* ── Liquid Gooey Floating Speed Dial ── */}
      <div className="liquid-speed-dial-anchor" role="region" aria-label="Interactive Farm Assistant">
        <Liquid
          fill="#202020"
          style={{ width: 140, height: 140, position: 'relative', pointerEvents: 'none' }}
        >
          {/* Action 1: Order Tracking */}
          <Liquid.Item
            style={{ position: 'absolute', right: 12, bottom: 12, pointerEvents: open ? 'auto' : 'none' }}
            x={open ? -54 : 0}
            y={open ? -34 : 0}
            transition={{ duration: open ? 290 : 210, ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <button
              className="round-btn"
              onClick={() => handleAction('orders')}
              aria-label="Track Orders"
              data-label="Track Order"
              tabIndex={open ? 0 : -1}
            >
              <Package size={20} color="#6EE7B7" />
            </button>
          </Liquid.Item>

          {/* Action 2: AI Kisan Assistant Chat */}
          <Liquid.Item
            style={{ position: 'absolute', right: 12, bottom: 12, pointerEvents: open ? 'auto' : 'none' }}
            x={0}
            y={open ? -64 : 0}
            transition={{ duration: open ? 290 : 210, ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            delay={open ? 22 : 0}
          >
            <button
              className="round-btn"
              onClick={() => handleAction('chat')}
              aria-label="Ask Kisan AI Assistant"
              data-label="Ask Kisan AI"
              tabIndex={open ? 0 : -1}
            >
              <Sparkles size={20} color="#FBBF24" />
            </button>
          </Liquid.Item>

          {/* Main Primary Toggle Item with Character Mascot */}
          <Liquid.Item style={{ position: 'absolute', right: 12, bottom: 12, pointerEvents: 'auto' }}>
            <button
              className="round-btn round-btn-main"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? (
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 22,
                    fontWeight: 400,
                    lineHeight: 1,
                    color: '#FFFFFF',
                    transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  ✕
                </span>
              ) : (
                <BotAvatar
                  type={currentAgent.type}
                  face={currentAgent.face}
                  hat={currentAgent.hat}
                  glasses={currentAgent.glasses}
                  headphones={currentAgent.headphones}
                  bowTie={currentAgent.bowTie}
                  shading={currentAgent.shading}
                  size={38}
                  state="default"
                />
              )}
            </button>
          </Liquid.Item>
        </Liquid>
      </div>

      {/* ── Kisan AI Assistant Interactive Modal Drawer ── */}
      {modalOpen && (
        <div className="bot-assistant-overlay" onClick={() => setModalOpen(false)}>
          <BorderBeam size="md" colorVariant="forest" strength={0.75} theme="light" borderRadius={28}>
            <div
              className="bot-assistant-card"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="bot-assistant-title"
            >
            {/* Header with Bot Avatar Spotlight */}
            <div className="bot-assistant-header">
              <div className="bot-avatar-hero-container">
                <BotAvatar
                  type={currentAgent.type}
                  face={currentAgent.face}
                  hat={currentAgent.hat}
                  glasses={currentAgent.glasses}
                  headphones={currentAgent.headphones}
                  bowTie={currentAgent.bowTie}
                  shading={currentAgent.shading}
                  size={96}
                  state={botState}
                  className="bot-avatar-hero-canvas"
                />
              </div>

              <div className="bot-header-meta">
                <div className="bot-header-title-row">
                  <h3 id="bot-assistant-title" className="bot-header-title">
                    {currentAgent.name}
                  </h3>
                  <span className={`bot-state-indicator-badge ${botState}`}>
                    {currentAgent.badge}
                  </span>
                </div>
                <p className="bot-header-subtitle">
                  {currentAgent.role}
                </p>
              </div>

              <button
                className="bot-close-btn"
                onClick={() => setModalOpen(false)}
                aria-label="Close Assistant"
              >
                <X size={18} />
              </button>
            </div>

            {/* Specialist AI Agent Switcher Bar */}
            <div className="bot-state-bar">
              <div className="bot-state-tabs" style={{ overflowX: 'auto', maxWidth: '78%' }}>
                {FARM_DIRECT_AGENTS.map((ag) => (
                  <button
                    key={ag.id}
                    className={`bot-state-tab-btn ${currentAgent.id === ag.id ? 'active' : ''}`}
                    onClick={() => switchAgent(ag)}
                    title={ag.role}
                  >
                    {ag.name}
                  </button>
                ))}
              </div>

              <div className="bot-cache-indicator" title="Fast local response caching active">
                <Zap size={11} />
                <span>Cached L1</span>
              </div>
            </div>

            {/* Chat Messages Feed */}
            <div className="bot-chat-feed">
              {messages.map((msg) => (
                <div key={msg.id} className={`bot-message-row ${msg.sender}`}>
                  {msg.sender === 'assistant' && (
                    <BotAvatar
                      type={currentAgent.type}
                      face={currentAgent.face}
                      hat={currentAgent.hat}
                      glasses={currentAgent.glasses}
                      headphones={currentAgent.headphones}
                      bowTie={currentAgent.bowTie}
                      shading={currentAgent.shading}
                      size={28}
                      state="default"
                    />
                  )}
                  <div className={`bot-message-bubble ${msg.sender}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="bot-message-row assistant">
                  <BotAvatar
                    type={currentAgent.type}
                    face={currentAgent.face}
                    hat={currentAgent.hat}
                    glasses={currentAgent.glasses}
                    headphones={currentAgent.headphones}
                    bowTie={currentAgent.bowTie}
                    shading={currentAgent.shading}
                    size={28}
                    state="working"
                  />
                  <div className="bot-message-bubble assistant bot-streaming-bubble">
                    <div className="bot-streaming-header">
                      <ThinkingOrb state="working" size={20} color="#16a34a" />
                      <span className="bot-streaming-agent-name">{currentAgent.name}</span>
                      <span className="bot-streaming-pill">Generating</span>
                    </div>
                    <div className="bot-streaming-content">
                      {streamingText || <span className="bot-streaming-placeholder">Analyzing harvest telemetry...</span>}
                      <span className="bot-streaming-cursor" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="bot-suggestions-scroll">
              <button
                className="bot-suggestion-chip"
                onClick={() => handleSend('When is produce harvested?')}
              >
                🌱 Today's Harvest
              </button>
              <button
                className="bot-suggestion-chip"
                onClick={() => handleSend('How do I track my order?')}
              >
                📦 Track My Order
              </button>
              <button
                className="bot-suggestion-chip"
                onClick={() => handleSend('Are crops 100% pesticide free?')}
              >
                🛡️ Organic Testing
              </button>
              <button
                className="bot-suggestion-chip"
                onClick={() => handleSend('How does direct farmer pricing work?')}
              >
                👨‍🌾 Farmer Payouts
              </button>
            </div>

            {/* Chat Input Bar Wrapped in BorderBeam While Generating */}
            <div className="bot-chat-input-wrapper">
              <BorderBeam
                size="line"
                colorVariant="forest"
                strength={0.85}
                active={isTyping}
                borderRadius={18}
                theme="light"
              >
                <div className={`bot-chat-input-bar ${isTyping ? 'is-generating' : ''}`}>
                  <input
                    type="text"
                    className="bot-input-field"
                    placeholder={
                      isTyping
                        ? `${currentAgent.name} is streaming response...`
                        : "Ask about crops, orders, or harvests..."
                    }
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isTyping}
                  />
                  <button
                    className="bot-send-btn"
                    onClick={() => handleSend()}
                    disabled={!inputQuery.trim() || isTyping}
                    aria-label="Send query"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </BorderBeam>
            </div>
          </div>
        </BorderBeam>
      </div>
    )}
    </>
  );
};




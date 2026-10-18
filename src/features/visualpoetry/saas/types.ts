export type AgentStatus = 'active' | 'draft' | 'testing';

export interface VoiceAgent {
  id: string;
  name: string;
  specialty: string;
  voiceModel: 'Gemini 2.5 Flash' | 'Gemini 3.8 Live' | 'ElevenLabs Nova' | 'Whisper Voice 2';
  voiceId: 'aura' | 'zephyr' | 'orion' | 'sol' | 'celeste';
  latencyMs: number;
  temperature: number;
  systemPrompt: string;
  status: AgentStatus;
  containmentRate: number;
  totalCalls: number;
  avgDurationSec: number;
  updatedAt: string;
}

export type CallStatus = 'completed' | 'in-progress' | 'transferred' | 'voicemail' | 'failed';
export type CallSentiment = 'positive' | 'neutral' | 'urgent' | 'frustrated';

export interface CallTurn {
  speaker: 'agent' | 'caller';
  text: string;
  timestamp: string;
  latencyMs?: number;
}

export interface CallRecord {
  id: string;
  callerNumber: string;
  callerName: string;
  agentId: string;
  agentName: string;
  specialty: string;
  status: CallStatus;
  sentiment: CallSentiment;
  durationSec: number;
  cost: number;
  startedAt: string;
  summary: string;
  transcript: CallTurn[];
}

export interface PhoneNumberRecord {
  id: string;
  number: string;
  label: string;
  assignedAgentId: string;
  country: string;
  status: 'active' | 'suspended';
  monthlyCost: number;
  emergencyFallback: string;
}

export interface IntegrationConnector {
  id: string;
  name: string;
  category: 'EHR/EMR' | 'CRM' | 'Telephony' | 'Billing';
  description: string;
  status: 'connected' | 'disconnected' | 'configuring';
  lastSync?: string;
  icon: string;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string;
  permissions: 'full' | 'read_only' | 'calls_only';
}

export interface SaaSUsageStats {
  minutesUsed: number;
  minutesLimit: number;
  concurrentLines: number;
  concurrentLimit: number;
  activeAgents: number;
  costSavingsEstimate: number;
  avgContainmentRate: number;
  avgLatencyMs: number;
  totalCallsToday: number;
}

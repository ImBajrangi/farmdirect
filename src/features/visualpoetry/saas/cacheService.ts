import { VoiceAgent, CallRecord, PhoneNumberRecord, IntegrationConnector, ApiKeyRecord, SaaSUsageStats } from './types';

// In-memory hot cache for instant 0ms access without hitting storage on low-end devices
const memoryCache = new Map<string, { value: any; expiry: number }>();

export class CacheService {
  private static prefix = 'opencall_saas_';

  static get<T>(key: string, defaultValue: T): T {
    try {
      // 1. Hot memory check (instant)
      const mem = memoryCache.get(key);
      if (mem && mem.expiry > Date.now()) {
        return mem.value as T;
      }

      // 2. LocalStorage fallback
      const stored = localStorage.getItem(this.prefix + key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.expiry && parsed.expiry > Date.now()) {
          memoryCache.set(key, { value: parsed.data, expiry: parsed.expiry });
          return parsed.data as T;
        }
      }
    } catch {
      // safe fallback if storage disabled/quota exceeded
    }
    return defaultValue;
  }

  static set<T>(key: string, value: T, ttlMs: number = 1000 * 60 * 60 * 24): void {
    const expiry = Date.now() + ttlMs;
    // Update hot memory
    memoryCache.set(key, { value, expiry });

    // Persist to storage
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify({ data: value, expiry }));
    } catch (e) {
      console.warn('Storage quota reached, serving from in-memory cache', e);
    }
  }

  static remove(key: string): void {
    memoryCache.delete(key);
    try {
      localStorage.removeItem(this.prefix + key);
    } catch {
      // safe
    }
  }
}

// Default Seed Data to bootstrap SaaS immediately
export const initialAgents: VoiceAgent[] = [
  {
    id: 'agent-cardiology',
    name: 'Cardiology Intake & Triage Bot',
    specialty: 'Cardiology',
    voiceModel: 'Gemini 3.8 Live',
    voiceId: 'aura',
    latencyMs: 240,
    temperature: 0.3,
    systemPrompt: 'You are an intelligent clinical voice receptionist for St. Jude Cardiology. Accurately verify patient ID, assess urgent symptoms like chest tightness, and schedule follow-ups with Dr. Vance.',
    status: 'active',
    containmentRate: 94.2,
    totalCalls: 3410,
    avgDurationSec: 135,
    updatedAt: '2026-10-17 14:22',
  },
  {
    id: 'agent-scheduling',
    name: 'Unified Patient Scheduler',
    specialty: 'Primary Care',
    voiceModel: 'Gemini 2.5 Flash',
    voiceId: 'zephyr',
    latencyMs: 210,
    temperature: 0.2,
    systemPrompt: 'You are a warm, courteous scheduling coordinator. Check real-time clinic slot availability across Epic EMR, verify insurance coverage, and send SMS appointment confirmations.',
    status: 'active',
    containmentRate: 98.7,
    totalCalls: 8940,
    avgDurationSec: 110,
    updatedAt: '2026-10-18 09:15',
  },
  {
    id: 'agent-refills',
    name: 'Rx Refill & Pharmacy Dispatcher',
    specialty: 'Pharmacy',
    voiceModel: 'Gemini 2.5 Flash',
    voiceId: 'sol',
    latencyMs: 260,
    temperature: 0.1,
    systemPrompt: 'Handle automated prescription refill queries. Check patient date of birth, medication name, dosage, and preferred pharmacy location before submitting e-refill approval.',
    status: 'active',
    containmentRate: 96.1,
    totalCalls: 2450,
    avgDurationSec: 92,
    updatedAt: '2026-10-16 18:40',
  },
  {
    id: 'agent-afterhours',
    name: 'After-Hours Emergency Screening',
    specialty: 'Emergency Medicine',
    voiceModel: 'Gemini 3.8 Live',
    voiceId: 'celeste',
    latencyMs: 180,
    temperature: 0.1,
    systemPrompt: 'Critical symptom detection system. Immediately flag acute coronary distress, stroke signs, or severe respiratory depression and patch the call to the on-call physician within 4 seconds.',
    status: 'active',
    containmentRate: 88.4,
    totalCalls: 1240,
    avgDurationSec: 165,
    updatedAt: '2026-10-17 22:04',
  },
];

export const initialCallRecords: CallRecord[] = [
  {
    id: 'call-98214',
    callerNumber: '+1 (415) 890-2134',
    callerName: 'Elena Rostova',
    agentId: 'agent-scheduling',
    agentName: 'Unified Patient Scheduler',
    specialty: 'Primary Care',
    status: 'completed',
    sentiment: 'positive',
    durationSec: 124,
    cost: 0.14,
    startedAt: 'Just now (10:24 AM)',
    summary: 'Scheduled routine annual check-up with Dr. Harrison for Thursday 2:00 PM. Insurance verified with BlueCross.',
    transcript: [
      { speaker: 'agent', text: 'Thank you for calling St. Jude Health. I am your AI assistant. How can I help you today?', timestamp: '0:01', latencyMs: 210 },
      { speaker: 'caller', text: 'Hi, I need to schedule an appointment with Dr. Harrison sometime this Thursday afternoon.', timestamp: '0:06' },
      { speaker: 'agent', text: 'I would be happy to help you with that, Elena. Dr. Harrison has an opening at 2:00 PM or 4:15 PM this Thursday. Which works best?', timestamp: '0:11', latencyMs: 220 },
      { speaker: 'caller', text: '2:00 PM is perfect, thank you.', timestamp: '0:15' },
      { speaker: 'agent', text: 'Excellent! Your appointment is confirmed for Thursday at 2:00 PM. A calendar invite has been sent to your phone.', timestamp: '0:20', latencyMs: 205 },
    ],
  },
  {
    id: 'call-98213',
    callerNumber: '+1 (212) 555-8910',
    callerName: 'Michael Chang',
    agentId: 'agent-refills',
    agentName: 'Rx Refill & Pharmacy Dispatcher',
    specialty: 'Pharmacy',
    status: 'completed',
    sentiment: 'neutral',
    durationSec: 88,
    cost: 0.09,
    startedAt: '6 mins ago (10:18 AM)',
    summary: 'Submitted 90-day refill request for Atorvastatin 20mg to Walgreens on 5th Ave.',
    transcript: [
      { speaker: 'agent', text: 'St. Jude Pharmacy Refill line. Please state your name and date of birth.', timestamp: '0:01', latencyMs: 240 },
      { speaker: 'caller', text: 'Michael Chang, March 14, 1982.', timestamp: '0:06' },
      { speaker: 'agent', text: 'Thank you Mr. Chang. I see your active prescription for Atorvastatin 20mg. Would you like me to request a 90-day refill to Walgreens?', timestamp: '0:12', latencyMs: 230 },
      { speaker: 'caller', text: 'Yes please.', timestamp: '0:15' },
      { speaker: 'agent', text: 'Your refill request has been transmitted. Your pharmacy will notify you when it is ready for pickup.', timestamp: '0:20', latencyMs: 215 },
    ],
  },
  {
    id: 'call-98212',
    callerNumber: '+1 (312) 441-9922',
    callerName: 'Sarah Jenkins',
    agentId: 'agent-cardiology',
    agentName: 'Cardiology Intake & Triage Bot',
    specialty: 'Cardiology',
    status: 'transferred',
    sentiment: 'urgent',
    durationSec: 154,
    cost: 0.18,
    startedAt: '18 mins ago (10:06 AM)',
    summary: 'Patient reported palpitations with lightheadedness. Protocol triggered automated warm transfer to On-Call Nurse triage line.',
    transcript: [
      { speaker: 'agent', text: 'Heart & Vascular Clinic. How may I direct your call?', timestamp: '0:01', latencyMs: 210 },
      { speaker: 'caller', text: 'I had a stent placed two months ago, and I am feeling rapid palpitations and dizziness right now.', timestamp: '0:08' },
      { speaker: 'agent', text: 'I understand this is concerning, Sarah. I am initiating an immediate warm transfer to Nurse Supervisor Rebecca on our clinical emergency desk right now. Please stay on the line.', timestamp: '0:14', latencyMs: 190 },
    ],
  },
  {
    id: 'call-98211',
    callerNumber: '+1 (702) 881-0019',
    callerName: 'David Miller',
    agentId: 'agent-afterhours',
    agentName: 'After-Hours Emergency Screening',
    specialty: 'Emergency Medicine',
    status: 'completed',
    sentiment: 'positive',
    durationSec: 102,
    cost: 0.12,
    startedAt: '34 mins ago (09:50 AM)',
    summary: 'Post-op wound check query. Provided wound care guidance and confirmed 10:00 AM clinic callback for suture removal.',
    transcript: [
      { speaker: 'agent', text: 'After-Hours Care Line. How can I assist you?', timestamp: '0:01', latencyMs: 190 },
      { speaker: 'caller', text: 'I had outpatient surgery yesterday. The bandage is dry, but I wanted to make sure if I can shower today.', timestamp: '0:09' },
      { speaker: 'agent', text: 'Based on your post-op chart, you may take a brief shower after 24 hours, but please do not submerge the incision in water. I will have our coordinator ring you at 10 AM to confirm your follow-up.', timestamp: '0:16', latencyMs: 200 },
    ],
  },
];

export const initialPhoneNumbers: PhoneNumberRecord[] = [
  {
    id: 'num-1',
    number: '+1 (800) 412-CALL',
    label: 'Main Patient Dispatcher (Toll-Free)',
    assignedAgentId: 'agent-scheduling',
    country: 'US',
    status: 'active',
    monthlyCost: 15,
    emergencyFallback: '+1 (800) 999-HELP',
  },
  {
    id: 'num-2',
    number: '+1 (415) 320-CARD',
    label: 'San Francisco Cardiology Center',
    assignedAgentId: 'agent-cardiology',
    country: 'US',
    status: 'active',
    monthlyCost: 8,
    emergencyFallback: '+1 (415) 555-0911',
  },
  {
    id: 'num-3',
    number: '+1 (212) 740-PHRM',
    label: 'Manhattan 24/7 Rx Refill Desk',
    assignedAgentId: 'agent-refills',
    country: 'US',
    status: 'active',
    monthlyCost: 8,
    emergencyFallback: '+1 (212) 555-3344',
  },
];

export const initialIntegrations: IntegrationConnector[] = [
  {
    id: 'epic',
    name: 'Epic Systems EMR',
    category: 'EHR/EMR',
    description: 'Bi-directional patient appointments, insurance verification, and chart notes synchronization via FHIR API.',
    status: 'connected',
    lastSync: '2 minutes ago',
    icon: 'Activity',
  },
  {
    id: 'cerner',
    name: 'Oracle Cerner Health',
    category: 'EHR/EMR',
    description: 'Direct provider schedule lookup and automated clinical triage encounter documentation.',
    status: 'connected',
    lastSync: '14 minutes ago',
    icon: 'Database',
  },
  {
    id: 'athena',
    name: 'AthenaHealth',
    category: 'EHR/EMR',
    description: 'Real-time billing, patient portal intake, and automated copay collection.',
    status: 'configuring',
    lastSync: 'Pending setup',
    icon: 'Layers',
  },
  {
    id: 'salesforce',
    name: 'Salesforce Health Cloud',
    category: 'CRM',
    description: 'Sync patient conversation transcripts, sentiment analysis, and follow-up case tasks.',
    status: 'connected',
    lastSync: '5 minutes ago',
    icon: 'Cloud',
  },
  {
    id: 'twilio',
    name: 'Twilio / SIP Trunk',
    category: 'Telephony',
    description: 'Carrier-grade low-latency telephony infrastructure, WebRTC gateway, and caller ID reputation scoring.',
    status: 'connected',
    lastSync: 'Live streaming',
    icon: 'PhoneCall',
  },
  {
    id: 'webhook',
    name: 'Custom Webhooks & REST',
    category: 'Telephony',
    description: 'Deliver real-time call started, ended, and transcript payloads to internal clinical webhooks.',
    status: 'connected',
    lastSync: 'Active (3 endpoints)',
    icon: 'Radio',
  },
];

export const initialApiKeys: ApiKeyRecord[] = [
  {
    id: 'key-prod',
    name: 'Production Clinical Gateway',
    keyPrefix: 'oc_live_89f029...7b3a',
    createdAt: '2026-09-01',
    lastUsedAt: '12 seconds ago',
    permissions: 'full',
  },
  {
    id: 'key-dev',
    name: 'Staging & Voice Sandbox',
    keyPrefix: 'oc_test_34a112...99ee',
    createdAt: '2026-10-10',
    lastUsedAt: '3 hours ago',
    permissions: 'calls_only',
  },
];

export const initialUsageStats: SaaSUsageStats = {
  minutesUsed: 14820,
  minutesLimit: 25000,
  concurrentLines: 18,
  concurrentLimit: 50,
  activeAgents: 4,
  costSavingsEstimate: 42600,
  avgContainmentRate: 95.8,
  avgLatencyMs: 220,
  totalCallsToday: 412,
};

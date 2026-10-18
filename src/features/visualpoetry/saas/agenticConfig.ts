export interface PracticePersonaData {
  id: 'primary_care' | 'dental' | 'dermatology' | 'veterinary';
  name: string;
  category: string;
  doctor: string;
  phone: string;
  greeting: string;
  agents: {
    id: string;
    role: 'voice' | 'triage' | 'scheduler' | 'sms';
    name: string;
    title: string;
    icon: string;
    status: 'active' | 'standby';
    autonomyLevel: string;
    tasksToday: number;
    description: string;
  }[];
  scenarios: {
    label: string;
    callerText: string;
    triageAssessment: string;
    agentReply: string;
    bookedSlot: string;
    smsText: string;
  }[];
  recentActivity: {
    id: string;
    callerName: string;
    time: string;
    type: 'appointment' | 'refill' | 'urgent_triage' | 'inquiry';
    summary: string;
    agentName: string;
    status: 'confirmed' | 'escalated' | 'completed';
    transcript: { speaker: string; text: string; time: string }[];
  }[];
}

export const practicePersonas: Record<string, PracticePersonaData> = {
  primary_care: {
    id: 'primary_care',
    name: 'St. Jude Primary Care & Family Medicine',
    category: 'Family Medicine',
    doctor: 'Dr. Eleanor Vance, MD',
    phone: '+1 (555) 019-8821',
    greeting: "Hello, thank you for calling St. Jude Family Medicine! I'm Sarah, your autonomous assistant. How can we help you today?",
    agents: [
      {
        id: 'agent-pc-voice',
        role: 'voice',
        name: 'Sarah',
        title: 'Voice Intake Agent',
        icon: 'phone',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 142,
        description: 'Answers all inbound calls in under 1 second in English and Spanish with empathetic human tone.',
      },
      {
        id: 'agent-pc-triage',
        role: 'triage',
        name: 'Dr. Maya',
        title: 'Clinical Triage Agent',
        icon: 'shield',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 89,
        description: 'Evaluates symptom severity against clinical red-flags and routes chest pain/stroke to on-call nurse.',
      },
      {
        id: 'agent-pc-sched',
        role: 'scheduler',
        name: 'Atlas',
        title: 'EHR Scheduling Agent',
        icon: 'calendar',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 38,
        description: 'Connects directly with Epic/Athena to match open doctor slots without double-booking.',
      },
      {
        id: 'agent-pc-sms',
        role: 'sms',
        name: 'Leo',
        title: 'SMS & Recall Agent',
        icon: 'message',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 64,
        description: 'Sends instant SMS appointment passes, digital pre-visit intake links, and prescription tracking.',
      },
    ],
    scenarios: [
      {
        label: '📅 Book Checkup with Dr. Vance',
        callerText: 'Hi, I need to schedule a follow-up visit with Dr. Vance for next week.',
        triageAssessment: 'Routine follow-up for chronic hypertension. Non-acute.',
        agentReply: 'I checked Dr. Vance’s live calendar and have an opening this Thursday at 10:30 AM or Friday at 2:15 PM. Would Thursday at 10:30 AM work for you?',
        bookedSlot: 'Thursday, Oct 22 at 10:30 AM (Dr. Eleanor Vance)',
        smsText: 'St. Jude Clinic: Your visit with Dr. Vance is confirmed for Thu Oct 22 at 10:30 AM. Tap to complete intake: stjude.health/c/7821',
      },
      {
        label: '💊 Prescription Refill Request',
        callerText: 'Can I get my Lisinopril 20mg blood pressure prescription refilled at CVS?',
        triageAssessment: 'Active prescription within 1-year authorization window. Pharmacy match confirmed.',
        agentReply: 'I found your active Lisinopril 20mg order in your chart. I have submitted an electronic 90-day refill request directly to your CVS Pharmacy on Main St.',
        bookedSlot: 'Electronic e-Prescription Dispatched to CVS #4092',
        smsText: 'St. Jude Rx: Refill for Lisinopril 20mg submitted to CVS (Main St). Ready for pickup in ~2 hours.',
      },
      {
        label: '🚨 Urgent Chest Tightness Triage',
        callerText: 'I am having chest tightness and tingling down my left arm for the last 20 minutes.',
        triageAssessment: 'CRITICAL CARDIAC SYMPTOM DETECTED. Immediate clinical escalation triggered.',
        agentReply: 'Your safety is our priority. Based on the symptoms you described, I am immediately patching you through to our On-Call Triage Nurse, and recommend dialing 911 if pain intensifies. Please hold 2 seconds.',
        bookedSlot: 'Warm Escalation to Nurse On-Call (Priority 1)',
        smsText: 'EMERGENCY NOTIFICATION: Patient routed to Triage Nurse desk. Callback recorded on +1(555)019-8821.',
      },
    ],
    recentActivity: [
      {
        id: 'act-101',
        callerName: 'Eleanor Vance',
        time: '10:15 AM',
        type: 'appointment',
        summary: 'Scheduled 30-min annual physical exam with Dr. Vance for Thursday 10:30 AM.',
        agentName: 'Atlas (Scheduler)',
        status: 'confirmed',
        transcript: [
          { speaker: 'Sarah (Voice)', text: 'Thank you for calling St. Jude Clinic! How can I assist you?', time: '10:15:02' },
          { speaker: 'Caller', text: 'I need to book my yearly checkup with Dr. Vance.', time: '10:15:08' },
          { speaker: 'Sarah (Voice)', text: 'Thursday at 10:30 AM is open. Shall I confirm that?', time: '10:15:14' },
          { speaker: 'Caller', text: 'Yes, please!', time: '10:15:18' },
          { speaker: 'Atlas (Scheduler)', text: 'Confirmed in Epic EHR. Slot locked. SMS dispatched.', time: '10:15:21' },
        ],
      },
      {
        id: 'act-102',
        callerName: 'Marcus Brody',
        time: '09:42 AM',
        type: 'refill',
        summary: 'Authorized 90-day Lisinopril refill dispatched to CVS Pharmacy.',
        agentName: 'Sarah (Voice)',
        status: 'completed',
        transcript: [
          { speaker: 'Sarah (Voice)', text: 'St. Jude Clinic, how may I help you today?', time: '09:42:01' },
          { speaker: 'Caller', text: 'Need a refill on my blood pressure pills.', time: '09:42:07' },
          { speaker: 'Dr. Maya (Triage)', text: 'Verified eligible chart record. Doctor authorization on file.', time: '09:42:10' },
          { speaker: 'Sarah (Voice)', text: 'Your refill has been sent to your regular CVS branch.', time: '09:42:15' },
        ],
      },
      {
        id: 'act-103',
        callerName: 'David Chen',
        time: '08:50 AM',
        type: 'inquiry',
        summary: 'Verified in-network coverage for Blue Cross PPO with zero copay for preventive visits.',
        agentName: 'Sarah (Voice)',
        status: 'completed',
        transcript: [
          { speaker: 'Sarah (Voice)', text: 'Good morning! St. Jude Clinic, Sarah speaking.', time: '08:50:02' },
          { speaker: 'Caller', text: 'Do you guys take Blue Cross PPO insurance?', time: '08:50:07' },
          { speaker: 'Sarah (Voice)', text: 'Yes! We are an in-network Tier 1 provider for Blue Cross PPO.', time: '08:50:11' },
        ],
      },
    ],
  },

  dental: {
    id: 'dental',
    name: 'Apex Modern Dental & Orthodontics',
    category: 'Dental & Ortho',
    doctor: 'Dr. Julian Hayes, DDS',
    phone: '+1 (555) 342-9910',
    greeting: "Hi, thanks for calling Apex Modern Dental! I'm Chloe, your autonomous coordinator. Are you calling for routine cleaning or do you have dental discomfort?",
    agents: [
      {
        id: 'agent-dt-voice',
        role: 'voice',
        name: 'Chloe',
        title: 'Dental Reception Concierge',
        icon: 'phone',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 96,
        description: 'Answers dental inquiries, explains insurance copays, and triages emergency tooth pain.',
      },
      {
        id: 'agent-dt-triage',
        role: 'triage',
        name: 'OrthoBot',
        title: 'Dental Urgency Evaluator',
        icon: 'shield',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 42,
        description: 'Categorizes cracked teeth, abscesses, and broken aligners for immediate same-day chair time.',
      },
      {
        id: 'agent-dt-sched',
        role: 'scheduler',
        name: 'ApexSync',
        title: 'Operatory Chair Coordinator',
        icon: 'calendar',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 31,
        description: 'Optimizes hygiene chairs and doctor treatment rooms to prevent dental chair idle time.',
      },
      {
        id: 'agent-dt-sms',
        role: 'sms',
        name: 'SmileCheck',
        title: 'Prophy Recall Dispatcher',
        icon: 'message',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 55,
        description: 'Automatically pings patients overdue for their 6-month cleaning with 1-tap booking.',
      },
    ],
    scenarios: [
      {
        label: '🦷 Severe Cracked Molar Pain',
        callerText: 'I cracked my lower molar biting something hard and it is throbbing with pain.',
        triageAssessment: 'ACUTE DENTAL TRAUMA. Nerve exposure possible. Priority emergency chair allocation.',
        agentReply: 'I am so sorry to hear you are hurting. We keep emergency slots open with Dr. Hayes every day. Can you come in today at 1:45 PM for an emergency evaluation and pain relief?',
        bookedSlot: 'TODAY at 1:45 PM (Emergency Chair #2 - Dr. Julian Hayes)',
        smsText: 'Apex Dental: Emergency chair reserved TODAY at 1:45 PM. Avoid hot/cold liquids. Directions: apexdental.com/map',
      },
      {
        label: '✨ 6-Month Teeth Cleaning & Polish',
        callerText: 'I want to schedule my 6-month dental cleaning and exam with the hygienist.',
        triageAssessment: 'Routine prophylaxis and bitewing X-rays. Operatory Chair 3 available.',
        agentReply: 'We would love to see you! Our hygienist Sarah has an open chair next Tuesday at 9:00 AM or Wednesday at 11:30 AM. Which suits your morning better?',
        bookedSlot: 'Tuesday, Oct 27 at 9:00 AM (Cleaning & Exam - Hygienist Sarah)',
        smsText: 'Apex Dental: Your 6-month cleaning is confirmed for Tue Oct 27 at 9:00 AM. See you soon for a bright smile!',
      },
      {
        label: '🔍 Delta Dental Insurance Coverage',
        callerText: 'Do you guys accept Delta Dental Premier PPO for preventive cleanings?',
        triageAssessment: 'Delta Dental Premier in-network contract verified. 100% preventive coverage.',
        agentReply: 'Yes! We are directly in-network with Delta Dental Premier. Your bi-annual cleanings and diagnostic X-rays are typically covered at 100% with no out-of-pocket cost.',
        bookedSlot: 'Insurance Pre-Authorization Verified (100% Prophy)',
        smsText: 'Apex Dental: Delta Dental PPO in-network verified. $0 estimated copay for preventive cleanings.',
      },
    ],
    recentActivity: [
      {
        id: 'act-201',
        callerName: 'Samantha Green',
        time: '10:40 AM',
        type: 'urgent_triage',
        summary: 'Emergency same-day chair assigned for cracked bicuspid at 1:45 PM.',
        agentName: 'OrthoBot (Triage)',
        status: 'confirmed',
        transcript: [
          { speaker: 'Chloe (Voice)', text: 'Apex Dental, Chloe speaking! Are you in discomfort?', time: '10:40:02' },
          { speaker: 'Caller', text: 'Yes, broke my tooth during breakfast, intense throbbing.', time: '10:40:08' },
          { speaker: 'OrthoBot (Triage)', text: 'Emergency priority 1. Same-day operatory allocated.', time: '10:40:11' },
          { speaker: 'Chloe (Voice)', text: 'We have chair #2 ready for you at 1:45 PM today with Dr. Hayes.', time: '10:40:15' },
        ],
      },
      {
        id: 'act-202',
        callerName: 'Brian Taylor',
        time: '09:25 AM',
        type: 'appointment',
        summary: 'Booked routine 6-month cleaning & fluoride for Wednesday 11:30 AM.',
        agentName: 'ApexSync',
        status: 'confirmed',
        transcript: [
          { speaker: 'Chloe (Voice)', text: 'Hi Brian! Calling for your routine cleaning?', time: '09:25:02' },
          { speaker: 'Caller', text: 'Yes, looking for next Wednesday morning.', time: '09:25:06' },
          { speaker: 'ApexSync', text: 'Wednesday 11:30 AM reserved in Eaglesoft.', time: '09:25:09' },
        ],
      },
    ],
  },

  dermatology: {
    id: 'dermatology',
    name: 'Lumière Dermatology & Aesthetics',
    category: 'Dermatology & Skin',
    doctor: 'Dr. Clara Dubois, MD',
    phone: '+1 (555) 887-2105',
    greeting: "Welcome to Lumière Dermatology & Laser. Giselle speaking! Are you calling for clinical dermatology or an aesthetic laser consultation?",
    agents: [
      {
        id: 'agent-dm-voice',
        role: 'voice',
        name: 'Giselle',
        title: 'Skin Concierge Voice',
        icon: 'phone',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 78,
        description: 'Handles boutique skin inquiries, cosmetic consultations, and medical dermatology appointments.',
      },
      {
        id: 'agent-dm-triage',
        role: 'triage',
        name: 'DermTriage',
        title: 'Lesion & Mole Evaluator',
        icon: 'shield',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 35,
        description: 'Classifies ABCDE melanoma warning signs and fast-tracks bleeding or changing lesions to Dr. Dubois.',
      },
      {
        id: 'agent-dm-sched',
        role: 'scheduler',
        name: 'LumiCalendar',
        title: 'Laser & Procedure Room Sync',
        icon: 'calendar',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 29,
        description: 'Schedules medical exam rooms and aesthetic laser suites without equipment collisions.',
      },
      {
        id: 'agent-dm-sms',
        role: 'sms',
        name: 'GlowCare',
        title: 'Pre/Post-Care SMS Dispatcher',
        icon: 'message',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 48,
        description: 'Dispatches pre-laser sun exposure warnings and post-peel hydration guides directly to smartphones.',
      },
    ],
    scenarios: [
      {
        label: '🔬 Suspicious Changing Mole Check',
        callerText: 'I noticed a dark mole on my shoulder that has irregular borders and started itching.',
        triageAssessment: 'POTENTIAL DYSPLASTIC NEVUS (ABCDE Risk). Fast-track clinical dermatology slot.',
        agentReply: 'Thank you for calling us promptly. Any changing or itching mole should be examined with dermoscopy. Dr. Dubois has an urgent medical slot this Wednesday at 11:15 AM. Shall I reserve this for you?',
        bookedSlot: 'Wednesday, Oct 21 at 11:15 AM (Full Dermoscopy Exam - Dr. Dubois)',
        smsText: 'Lumière Derm: Medical skin exam confirmed for Wed Oct 21 at 11:15 AM. Avoid makeup/lotions on shoulder.',
      },
      {
        label: '✨ HydraFacial & Botox Consultation',
        callerText: 'I want to schedule a consultation for preventative Botox and a HydraFacial treatment.',
        triageAssessment: 'Aesthetic cosmetic consultation. Treatment Suite 1.',
        agentReply: 'We would love to pamper you! Our master aesthetician has openings for a signature consultation this Friday at 3:00 PM or Saturday morning at 10:30 AM. Would Friday afternoon work?',
        bookedSlot: 'Friday, Oct 23 at 3:00 PM (Aesthetic Suite #1)',
        smsText: 'Lumière Aesthetics: Your consult is set for Fri Oct 23 at 3:00 PM. We look forward to glowing with you!',
      },
      {
        label: '🧴 Tretinoin Acne Medication Refill',
        callerText: 'I need my prescription for Tretinoin 0.05% cream refilled at Walgreens.',
        triageAssessment: 'Established patient maintenance topical therapy. Safe for automated electronic refill.',
        agentReply: 'I pulled up your clinical chart with Dr. Dubois. Your Tretinoin 0.05% refill has been electronically approved and sent to Walgreens on 5th Ave.',
        bookedSlot: 'Electronic e-Prescription Dispatched to Walgreens',
        smsText: 'Lumière Rx: Tretinoin 0.05% order sent to Walgreens on 5th Ave. Apply sunscreen daily!',
      },
    ],
    recentActivity: [
      {
        id: 'act-301',
        callerName: 'Victoria Sterling',
        time: '11:10 AM',
        type: 'urgent_triage',
        summary: 'Urgent dermoscopy exam booked for changing shoulder nevus on Wednesday 11:15 AM.',
        agentName: 'DermTriage',
        status: 'confirmed',
        transcript: [
          { speaker: 'Giselle (Voice)', text: 'Lumière Dermatology, Giselle speaking!', time: '11:10:02' },
          { speaker: 'Caller', text: 'I have an itching mole with uneven borders.', time: '11:10:07' },
          { speaker: 'DermTriage', text: 'ABCDE criteria positive. Expedited medical slot triggered.', time: '11:10:10' },
          { speaker: 'Giselle (Voice)', text: 'Reserved Wednesday at 11:15 AM with Dr. Dubois.', time: '11:10:14' },
        ],
      },
    ],
  },

  veterinary: {
    id: 'veterinary',
    name: 'HappyPaws Animal Hospital & Surgery',
    category: 'Veterinary Medicine',
    doctor: 'Dr. Robert Sterling, DVM',
    phone: '+1 (555) 762-4418',
    greeting: "Hello, thank you for calling HappyPaws Animal Hospital! Bella here. Is your pet in distress or are you calling for wellness care?",
    agents: [
      {
        id: 'agent-vt-voice',
        role: 'voice',
        name: 'Bella',
        title: 'Pet Inbound Voice Agent',
        icon: 'phone',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 112,
        description: 'Answers anxious pet parents 24/7 with calm, soothing voice and identifies pet breed & symptoms.',
      },
      {
        id: 'agent-vt-triage',
        role: 'triage',
        name: 'VetTriage',
        title: 'Toxin & Trauma Screener',
        icon: 'shield',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 49,
        description: 'Instantly identifies toxic ingestions (chocolate, xylitol, lilies) and alerts vet ICU.',
      },
      {
        id: 'agent-vt-sched',
        role: 'scheduler',
        name: 'PawsCalendar',
        title: 'Vet & Surgery Coordinator',
        icon: 'calendar',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 41,
        description: 'Allocates doctor exam tables, surgical suites, and routine vaccine booster appointments.',
      },
      {
        id: 'agent-vt-sms',
        role: 'sms',
        name: 'PawsReminder',
        title: 'Rabies & Heartworm Recall',
        icon: 'message',
        status: 'active',
        autonomyLevel: 'Full Autonomy',
        tasksToday: 73,
        description: 'Sends automated vaccination due reminders and post-op recovery care checklists to owners.',
      },
    ],
    scenarios: [
      {
        label: '🍫 Dog Ingested Dark Chocolate',
        callerText: 'My 30-pound golden doodle ate a 4oz bar of 70% dark chocolate about 15 minutes ago!',
        triageAssessment: 'ACUTE THEOBROMINE TOXICITY WARNING. Toxic dose threshold exceeded. Immediate induction needed.',
        agentReply: 'Dark chocolate is very dangerous for dogs. Based on 70% cocoa and your doodle’s weight, this is a toxic dose. Please bring your pet into our emergency bay immediately. Our veterinary team is prepped for your arrival.',
        bookedSlot: 'EMERGENCY ICU BAY ALLOCATED - Arrival in 15 mins',
        smsText: 'HappyPaws EMERGENCY: ICU bay prepped for chocolate ingestion. Drive safely to: 124 Pet Care Way.',
      },
      {
        label: '💉 Annual Rabies & Wellness Exam',
        callerText: 'I need to bring my cat Milo in for his annual booster shots and rabies vaccine.',
        triageAssessment: 'Feline wellness & vaccine protocol. Exam Room 1.',
        agentReply: 'We would love to see Milo! Dr. Sterling has a feline wellness slot this Thursday at 4:00 PM or Saturday at 11:00 AM. Which day works best?',
        bookedSlot: 'Thursday, Oct 22 at 4:00 PM (Milo - Rabies & Wellness Exam)',
        smsText: 'HappyPaws: Milo is scheduled for Thu Oct 22 at 4:00 PM. Please bring him in a secure cat carrier.',
      },
      {
        label: '💊 Apoquel Allergy Medication Refill',
        callerText: 'Can I get a refill authorization for Milo’s Apoquel 5.4mg itch tablets?',
        triageAssessment: 'Chronic allergic dermatitis medication. Annual exam current.',
        agentReply: 'I reviewed Milo’s file with Dr. Sterling. His annual checkup is up to date, so I have authorized a 30-day bottle of Apoquel. It will be ready for pickup at our front counter after 2:00 PM today.',
        bookedSlot: 'Pharmacy Pickup Ready at Front Counter',
        smsText: 'HappyPaws: Milo’s Apoquel 5.4mg is ready for front desk pickup. Total: $42.50.',
      },
    ],
    recentActivity: [
      {
        id: 'act-401',
        callerName: 'Jessica Bell (Dog: Toby)',
        time: '11:05 AM',
        type: 'urgent_triage',
        summary: 'Emergency bay allocated for dark chocolate ingestion; vitals stabilized.',
        agentName: 'VetTriage',
        status: 'confirmed',
        transcript: [
          { speaker: 'Bella (Voice)', text: 'HappyPaws Emergency Line, Bella speaking!', time: '11:05:01' },
          { speaker: 'Caller', text: 'My dog Toby just ate dark baker chocolate!', time: '11:05:06' },
          { speaker: 'VetTriage', text: 'Theobromine calculation: Critical. ICU alert dispatched.', time: '11:05:08' },
          { speaker: 'Bella (Voice)', text: 'Bring Toby straight to emergency bay #1 now. We are ready.', time: '11:05:12' },
        ],
      },
    ],
  },
};

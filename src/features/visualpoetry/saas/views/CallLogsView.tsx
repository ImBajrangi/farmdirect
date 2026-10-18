import React, { useState } from 'react';
import { Search, Filter, Download, PhoneCall, Clock, CheckCircle2, AlertTriangle, ArrowUpRight, MessageSquare } from 'lucide-react';
import { CallRecord } from '../types';

interface CallLogsViewProps {
  calls: CallRecord[];
}

export const CallLogsView: React.FC<CallLogsViewProps> = ({ calls }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  const filteredCalls = calls.filter((c) => {
    const matchesSearch =
      c.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.callerNumber.includes(searchTerm) ||
      c.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(filteredCalls, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `opencall_transcripts_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div>
      <div className="oc-view-header">
        <div className="oc-view-title-group">
          <h1>Call History & Transcripts</h1>
          <p className="oc-view-subtitle">
            Search, inspect, and export verbatim conversations recorded by your clinic's AI assistants.
          </p>
        </div>
        <div className="oc-view-header-actions">
          <button
            onClick={handleExport}
            style={{
              background: '#ffffff',
              border: '1.5px solid rgba(15, 46, 34, 0.12)',
              borderRadius: '9999px',
              padding: '9px 18px',
              color: 'var(--oc-forest)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(15, 46, 34, 0.04)',
            }}
          >
            <Download size={15} />
            <span>Export Transcripts</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="oc-table-container">
        <div className="oc-table-toolbar">
          <div className="oc-table-search">
            <Search size={15} color="#9aa0b4" />
            <input
              type="text"
              placeholder="Search by caller, phone, specialty or agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="oc-table-filters">
            {['all', 'completed', 'transferred', 'urgent'].map((f) => (
              <button
                key={f}
                className={`oc-filter-chip ${statusFilter === f ? 'is-active' : ''}`}
                onClick={() => setStatusFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="oc-data-table">
            <thead>
              <tr>
                <th>Patient / Caller</th>
                <th>Assigned Agent</th>
                <th>Specialty</th>
                <th>Status</th>
                <th>Sentiment</th>
                <th>Duration</th>
                <th>Started</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#646b82' }}>
                    No call records matching your filter.
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => (
                  <tr key={call.id} onClick={() => setSelectedCall(call)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--oc-forest)' }}>{call.callerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--oc-text-muted)' }}>{call.callerNumber}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--oc-forest)' }}>{call.agentName}</span>
                    </td>
                    <td>
                      <span style={{ color: '#1f6443', fontWeight: 700, fontSize: '0.78125rem' }}>{call.specialty}</span>
                    </td>
                    <td>
                      <span className={`oc-badge ${call.status}`}>{call.status}</span>
                    </td>
                    <td>
                      <span className={`oc-badge ${call.sentiment}`}>{call.sentiment}</span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <Clock size={12} color="#728a7e" />
                        {Math.floor(call.durationSec / 60)}m {call.durationSec % 60}s
                      </span>
                    </td>
                    <td style={{ color: 'var(--oc-text-secondary)', fontSize: '0.78125rem' }}>{call.startedAt}</td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCall(call);
                        }}
                        style={{
                          background: '#f3f7f4',
                          border: '1.5px solid rgba(15, 46, 34, 0.12)',
                          color: 'var(--oc-forest)',
                          borderRadius: '9999px',
                          padding: '5px 14px',
                          fontSize: '0.78125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(15, 46, 34, 0.04)',
                        }}
                      >
                        Transcript
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transcript Detail Drawer */}
      {selectedCall && (
        <div className="oc-drawer-backdrop" onClick={() => setSelectedCall(null)}>
          <div className="oc-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="oc-drawer-header">
              <div>
                <h3 style={{ margin: 0 }}>Call Encounter #{selectedCall.id}</h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--oc-text-secondary)', fontWeight: 600 }}>{selectedCall.startedAt} • {selectedCall.callerName}</span>
              </div>
              <button className="oc-drawer-close" onClick={() => setSelectedCall(null)}>✕</button>
            </div>

            <div className="oc-drawer-body">
              {/* Summary Card */}
              <div style={{ backgroundColor: '#f3f7f4', borderRadius: '16px', padding: '18px', border: '1px solid rgba(15, 46, 34, 0.08)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1f6443', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                  AI Clinical Summary
                </div>
                <p style={{ margin: 0, fontSize: '0.90625rem', color: 'var(--oc-forest)', lineHeight: 1.5, fontWeight: 500 }}>
                  {selectedCall.summary}
                </p>
              </div>

              {/* Call Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid rgba(15, 46, 34, 0.08)', boxShadow: '0 2px 8px rgba(15, 46, 34, 0.04)' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--oc-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Duration</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--oc-forest)' }}>{selectedCall.durationSec}s</span>
                </div>
                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid rgba(15, 46, 34, 0.08)', boxShadow: '0 2px 8px rgba(15, 46, 34, 0.04)' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--oc-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Sentiment</span>
                  <span className={`oc-badge ${selectedCall.sentiment}`} style={{ marginTop: '4px' }}>{selectedCall.sentiment}</span>
                </div>
                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid rgba(15, 46, 34, 0.08)', boxShadow: '0 2px 8px rgba(15, 46, 34, 0.04)' }}>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--oc-text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Compute Cost</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>${selectedCall.cost.toFixed(2)}</span>
                </div>
              </div>

              {/* Full Transcript Stream */}
              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--oc-text-muted)', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.06em' }}>
                  Verbatim Conversation Log
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedCall.transcript.map((turn, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '16px',
                        background: turn.speaker === 'agent' ? '#f3f7f4' : '#ffffff',
                        border: '1px solid rgba(15, 46, 34, 0.08)',
                        boxShadow: '0 2px 8px rgba(15, 46, 34, 0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.78125rem', fontWeight: 700 }}>
                        <span style={{ color: turn.speaker === 'agent' ? '#1f6443' : 'var(--oc-forest)' }}>
                          {turn.speaker === 'agent' ? selectedCall.agentName : selectedCall.callerName}
                        </span>
                        <span style={{ color: 'var(--oc-text-muted)' }}>
                          {turn.timestamp} {turn.latencyMs ? `(${turn.latencyMs}ms)` : ''}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.90625rem', color: 'var(--oc-forest)', lineHeight: 1.5 }}>
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

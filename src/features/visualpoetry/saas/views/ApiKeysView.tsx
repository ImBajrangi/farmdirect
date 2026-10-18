import React, { useState } from 'react';
import { Key, Copy, Check, Plus, Code, Terminal, Shield } from 'lucide-react';
import { ApiKeyRecord } from '../types';

interface ApiKeysViewProps {
  apiKeys: ApiKeyRecord[];
  onGenerateKey: (name: string) => void;
}

export const ApiKeysView: React.FC<ApiKeysViewProps> = ({ apiKeys, onGenerateKey }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState<string>('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    onGenerateKey(newKeyName.trim());
    setNewKeyName('');
    setShowModal(false);
  };

  return (
    <div>
      <div className="oc-view-header">
        <div className="oc-view-title-group">
          <h1>API Keys & Developer Gateway</h1>
          <p className="oc-view-subtitle">
            Integrate OpenCall voice AI capabilities into custom patient portals, telephony PBX, and mobile apps.
          </p>
        </div>
        <div className="oc-view-header-actions">
          <button className="oc-primary-action-btn" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            <span>Generate New API Key</span>
          </button>
        </div>
      </div>

      {/* Keys Table */}
      <div className="oc-table-container" style={{ marginBottom: '28px' }}>
        <table className="oc-data-table">
          <thead>
            <tr>
              <th>Key Identifier</th>
              <th>Token Token</th>
              <th>Permissions</th>
              <th>Created</th>
              <th>Last Used</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((k) => (
              <tr key={k.id}>
                <td style={{ fontWeight: 800, color: 'var(--oc-forest)' }}>{k.name}</td>
                <td>
                  <code style={{ background: '#f3f7f4', padding: '4px 10px', borderRadius: '8px', color: 'var(--oc-forest)', fontFamily: 'monospace', fontWeight: 700, border: '1px solid rgba(15, 46, 34, 0.1)' }}>
                    {k.keyPrefix}
                  </code>
                </td>
                <td>
                  <span className="oc-badge active">{k.permissions}</span>
                </td>
                <td style={{ color: 'var(--oc-text-secondary)' }}>{k.createdAt}</td>
                <td style={{ color: 'var(--oc-text-secondary)' }}>{k.lastUsedAt}</td>
                <td>
                  <button
                    onClick={() => copyToClipboard(k.keyPrefix, k.id)}
                    style={{
                      background: '#f3f7f4',
                      border: '1.5px solid rgba(15, 46, 34, 0.12)',
                      color: copiedKey === k.id ? '#059669' : 'var(--oc-forest)',
                      borderRadius: '9999px',
                      padding: '5px 12px',
                      fontSize: '0.78125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 4px rgba(15, 46, 34, 0.04)',
                    }}
                  >
                    {copiedKey === k.id ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedKey === k.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Developer cURL Code Sample */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--oc-border-subtle)', padding: '28px', boxShadow: 'var(--oc-shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--oc-forest)', fontSize: '0.90625rem', fontWeight: 800 }}>
          <Terminal size={18} color="#1f6443" />
          <span>Quickstart cURL: Initiate Outbound Clinical Call via REST</span>
        </div>

        <pre
          style={{
            backgroundColor: 'var(--oc-forest)',
            border: 'none',
            borderRadius: '16px',
            padding: '20px',
            color: '#ffffff',
            fontSize: '0.84375rem',
            overflowX: 'auto',
            lineHeight: 1.6,
            fontFamily: 'monospace',
          }}
        >
{`curl -X POST https://api.opencall.ai/v1/calls/dispatch \\
  -H "Authorization: Bearer oc_live_89f029...7b3a" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+14158902134",
    "agent_id": "agent-cardiology",
    "patient_context": {
      "patient_id": "PT-9428",
      "preferred_time": "morning",
      "emr_sync": true
    }
  }'`}
        </pre>
      </div>

      {/* Generate Key Modal */}
      {showModal && (
        <div className="oc-drawer-backdrop" onClick={() => setShowModal(false)}>
          <div className="oc-drawer-panel" style={{ maxWidth: '420px', height: 'auto', margin: 'auto', borderRadius: '16px' }} onClick={(e) => e.stopPropagation()}>
            <div className="oc-drawer-header">
              <h3>Generate API Key</h3>
              <button className="oc-drawer-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate} className="oc-drawer-body">
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9aa0b4', textTransform: 'uppercase' }}>Key Label / Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Telehealth Mobile App, Zapier Webhook"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="oc-sim-input"
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </div>
              <button type="submit" className="oc-primary-action-btn" style={{ justifyContent: 'center' }}>
                Generate Key
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

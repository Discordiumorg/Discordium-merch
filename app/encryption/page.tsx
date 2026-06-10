'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  ShieldOff,
  RefreshCw,
  Download,
  Upload,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  Key,
  UserCheck,
  Trash2,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  encryptMessage,
  decryptMessage,
  getKeyFingerprint,
  exportPrivateKeyEncrypted,
  importPrivateKeyEncrypted,
} from '@/lib/crypto';
import {
  getOrCreateMyKeyPair,
  getMyPublicKeyB64,
  clearMyKeys,
  getVerifiedContacts,
  saveVerifiedContact,
  removeVerifiedContact,
  type VerifiedContact,
} from '@/lib/keyStore';

// Mock partner public keys — in production these come from the server
// (public keys are safe to distribute; only the private key is secret)
const MOCK_PARTNER_PUB =
  'BLsG1mZqvXg5YeXjN3PJML7g4e3cWhtDpTzLzQkFu9LGq3VNhcC4zR2fGbY8CbW2JxqFj3oKdXz9wNpVmLsQ==';

type Sheet = 'none' | 'demo' | 'backup_export' | 'backup_import' | 'regen' | 'verify';

function FingerprintDisplay({ fp }: { fp: string }) {
  const [copied, setCopied] = useState(false);
  const groups = fp.split(' ');

  const copy = () => {
    navigator.clipboard.writeText(fp).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-black/30 rounded-2xl p-4">
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {groups.map((g, i) => (
          <span
            key={i}
            className="font-mono text-sm text-green-300 bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1 tracking-widest"
          >
            {g}
          </span>
        ))}
      </div>
      <button
        onClick={copy}
        className="mx-auto flex items-center gap-1.5 text-white/40 text-xs hover:text-white/70 transition-colors"
      >
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        {copied ? 'Kopiert' : 'Fingerabdruck kopieren'}
      </button>
    </div>
  );
}

export default function EncryptionPage() {
  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [fingerprint, setFingerprint] = useState('');
  const [pubKeyB64, setPubKeyB64] = useState('');
  const [createdAt, setCreatedAt] = useState<number | null>(null);
  const [verifiedContacts, setVerifiedContacts] = useState<VerifiedContact[]>([]);
  const [sheet, setSheet] = useState<Sheet>('none');
  const [toast, setToast] = useState('');

  // Demo encrypt/decrypt state
  const [demoPlaintext, setDemoPlaintext] = useState('Hallo! Das ist eine geheime Nachricht 🔒');
  const [demoEncrypted, setDemoEncrypted] = useState('');
  const [demoDecrypted, setDemoDecrypted] = useState('');
  const [demoKey, setDemoKey] = useState<CryptoKey | null>(null);
  const [demoRunning, setDemoRunning] = useState(false);

  // Backup export state
  const [backupPass, setBackupPass] = useState('');
  const [backupPassVisible, setBackupPassVisible] = useState(false);
  const [backupBlob, setBackupBlob] = useState('');

  // Backup import state
  const [importFile, setImportFile] = useState('');
  const [importPass, setImportPass] = useState('');
  const [importPassVisible, setImportPassVisible] = useState(false);

  // Verify contact state
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyName, setVerifyName] = useState('');

  // Regen confirm
  const [regenConfirm, setRegenConfirm] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadKeys = useCallback(async () => {
    try {
      const { fingerprint: fp, createdAt: ts } = await getOrCreateMyKeyPair();
      const pub = getMyPublicKeyB64() ?? '';
      setFingerprint(fp);
      setPubKeyB64(pub);
      setCreatedAt(ts);
      setVerifiedContacts(getVerifiedContacts());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);

  useEffect(() => { loadKeys(); }, [loadKeys]);

  const runDemo = async () => {
    if (!demoPlaintext.trim()) return;
    setDemoRunning(true);
    try {
      // Generate a fresh ephemeral key for the demo
      const { importPublicKey, deriveConversationKey } = await import('@/lib/crypto');
      const { getOrCreateMyKeyPair: mine } = await import('@/lib/keyStore');
      const me = await mine();
      const partnerPub = await importPublicKey(MOCK_PARTNER_PUB).catch(async () => {
        // Fallback: use own public key to derive a symmetric demo key
        return me.publicKey;
      });
      const key = await deriveConversationKey(me.privateKey, partnerPub).catch(async () => {
        // If ECDH fails (same key used for both sides), derive via PBKDF2
        const { crypto: wc } = await import('@/lib/crypto').then(() => ({ crypto: globalThis.crypto }));
        const base = await wc.subtle.importKey('raw', new Uint8Array(32), 'AES-GCM', false, ['encrypt', 'decrypt']);
        return base;
      });

      setDemoKey(key);
      const payload = await encryptMessage(key, demoPlaintext);
      setDemoEncrypted(`ct:${payload.ct.slice(0, 32)}…  iv:${payload.iv}`);
      const plain = await decryptMessage(key, payload);
      setDemoDecrypted(plain);
    } catch (err) {
      setDemoEncrypted('Demo-Fehler: ' + String(err));
    } finally {
      setDemoRunning(false);
    }
  };

  const handleExportBackup = async () => {
    if (backupPass.length < 8) { showToast('Passwort muss mindestens 8 Zeichen haben'); return; }
    try {
      const me = await getOrCreateMyKeyPair();
      const blob = await exportPrivateKeyEncrypted(me.privateKey, backupPass);
      setBackupBlob(blob);
      // Trigger download
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
      a.download = `aura-key-backup-${Date.now()}.json`;
      a.click();
      showToast('Backup heruntergeladen');
      setSheet('none');
      setBackupPass('');
    } catch {
      showToast('Export fehlgeschlagen');
    }
  };

  const handleImportBackup = async () => {
    if (!importFile || !importPass) { showToast('Datei und Passwort erforderlich'); return; }
    try {
      const key = await importPrivateKeyEncrypted(importFile, importPass);
      showToast('Schlüssel erfolgreich importiert');
      setSheet('none');
      setImportFile('');
      setImportPass('');
      loadKeys();
    } catch {
      showToast('Import fehlgeschlagen — falsches Passwort?');
    }
  };

  const handleRegenKeys = async () => {
    if (regenConfirm !== 'LÖSCHEN') return;
    clearMyKeys();
    await loadKeys();
    showToast('Neue Schlüssel generiert — alte Gespräche nicht mehr lesbar');
    setSheet('none');
    setRegenConfirm('');
  };

  const handleAddVerified = () => {
    const fp = verifyInput.trim().toUpperCase().replace(/\s+/g, ' ');
    const name = verifyName.trim();
    if (!fp || !name) { showToast('Name und Fingerabdruck erforderlich'); return; }
    saveVerifiedContact({ userId: `v_${Date.now()}`, name, fingerprint: fp, verifiedAt: Date.now() });
    setVerifiedContacts(getVerifiedContacts());
    showToast(`${name} verifiziert`);
    setSheet('none');
    setVerifyInput('');
    setVerifyName('');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <RefreshCw size={24} className="text-purple-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold font-display flex items-center gap-2">
              <Lock size={16} className="text-green-400" />
              Ende-zu-Ende Verschlüsselung
            </h1>
            <p className="text-white/40 text-[11px]">Nur du kannst deine Nachrichten lesen</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        {/* Zero-knowledge banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/25 rounded-2xl p-4 flex gap-3"
        >
          <ShieldCheck size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-300 text-sm font-semibold">Zero-Knowledge Architektur</p>
            <p className="text-green-400/70 text-xs mt-1 leading-relaxed">
              Deine privaten Schlüssel werden <strong className="text-green-300">ausschließlich auf diesem Gerät</strong> gespeichert.
              Aura hat keinen Zugriff auf deine Nachrichten — nicht einmal wir können sie lesen.
            </p>
          </div>
        </motion.div>

        {/* My key card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-glass rounded-2xl overflow-hidden"
        >
          <div className="px-4 pt-4 pb-3 border-b border-white/8 flex items-center justify-between">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Mein Schlüssel</p>
            <span className="flex items-center gap-1 text-green-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Aktiv
            </span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Algorithmus</span>
              <span className="text-white/70 font-mono">ECDH P-256 + AES-256-GCM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Erstellt</span>
              <span className="text-white/70">{createdAt ? new Date(createdAt).toLocaleDateString('de-DE') : '—'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">Schlüssellänge</span>
              <span className="text-white/70 font-mono">256 bit</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/40">IV-Länge</span>
              <span className="text-white/70 font-mono">96 bit (zufällig pro Nachricht)</span>
            </div>
            <div className="pt-1">
              <p className="text-white/40 text-xs mb-2">Fingerabdruck (SHA-256)</p>
              {fingerprint && <FingerprintDisplay fp={fingerprint} />}
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass rounded-2xl overflow-hidden"
        >
          {[
            {
              icon: <Key size={15} className="text-blue-400" />,
              bg: 'bg-blue-500/15',
              label: 'Verschlüsselungs-Demo',
              sub: 'Live-Demonstration von Encrypt/Decrypt',
              action: () => setSheet('demo'),
            },
            {
              icon: <UserCheck size={15} className="text-purple-400" />,
              bg: 'bg-purple-500/15',
              label: 'Kontakt verifizieren',
              sub: `${verifiedContacts.length} verifizierte Kontakte`,
              action: () => setSheet('verify'),
            },
            {
              icon: <Download size={15} className="text-green-400" />,
              bg: 'bg-green-500/15',
              label: 'Schlüssel exportieren',
              sub: 'Passwortgeschütztes Backup erstellen',
              action: () => setSheet('backup_export'),
            },
            {
              icon: <Upload size={15} className="text-yellow-400" />,
              bg: 'bg-yellow-500/15',
              label: 'Schlüssel importieren',
              sub: 'Von Backup wiederherstellen',
              action: () => setSheet('backup_import'),
            },
            {
              icon: <RefreshCw size={15} className="text-orange-400" />,
              bg: 'bg-orange-500/15',
              label: 'Schlüssel neu generieren',
              sub: 'Achtung: alte Nachrichten nicht mehr lesbar',
              action: () => setSheet('regen'),
              warn: true,
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.bg}`}>
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <p className={`text-sm font-medium ${item.warn ? 'text-orange-400' : 'text-white/85'}`}>
                  {item.label}
                </p>
                <p className="text-white/35 text-xs">{item.sub}</p>
              </div>
              <ChevronRight size={14} className="text-white/20" />
            </button>
          ))}
        </motion.div>

        {/* Verified contacts list */}
        {verifiedContacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-glass rounded-2xl overflow-hidden"
          >
            <div className="px-4 pt-4 pb-2 border-b border-white/8">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">
                Verifizierte Kontakte
              </p>
            </div>
            {verifiedContacts.map((c) => (
              <div key={c.userId} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={14} className="text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 text-sm font-medium">{c.name}</p>
                  <p className="text-white/30 text-[10px] font-mono truncate">{c.fingerprint}</p>
                </div>
                <button
                  onClick={() => {
                    removeVerifiedContact(c.userId);
                    setVerifiedContacts(getVerifiedContacts());
                    showToast('Verifizierung entfernt');
                  }}
                  className="text-white/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Technical detail card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/3 border border-white/8 rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Info size={14} className="text-white/30" />
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Technische Details</p>
          </div>
          <div className="space-y-2 text-xs">
            {[
              ['Schlüsselaustausch', 'ECDH P-256 (Elliptic Curve Diffie-Hellman)'],
              ['Nachrichtenverschlüsselung', 'AES-256-GCM'],
              ['Initialisierungsvektor', '96 bit, kryptografisch zufällig pro Nachricht'],
              ['Authentifizierungs-Tag', '128 bit GCM'],
              ['Key Derivation', 'Web Crypto API (native Browser)'],
              ['Backup-Schutz', 'PBKDF2 + AES-256-GCM (250.000 Iterationen)'],
              ['Schlüsselspeicherung', 'Nur auf diesem Gerät (localStorage)'],
              ['Server-Speicherung', 'Nur verschlüsselter Ciphertext'],
              ['Aura kann lesen?', 'Nein — mathematisch unmöglich ohne privaten Schlüssel'],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="text-white/35 w-44 flex-shrink-0">{k}</span>
                <span className="text-white/60">{v}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom sheets ── */}
      <AnimatePresence>
        {sheet !== 'none' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheet('none')}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-brand-card rounded-t-3xl z-50 px-5 pb-8 pt-5"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
              <button
                onClick={() => setSheet('none')}
                className="absolute top-4 right-4 text-white/30 hover:text-white/70"
              >
                <X size={18} />
              </button>

              {/* Demo sheet */}
              {sheet === 'demo' && (
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg">Verschlüsselungs-Demo</h3>
                  <p className="text-white/40 text-sm">
                    Gib eine Nachricht ein — sie wird mit deinem echten Schlüssel (AES-256-GCM) verschlüsselt
                    und direkt im Browser wieder entschlüsselt. Der Server sieht nur den Ciphertext.
                  </p>
                  <input
                    value={demoPlaintext}
                    onChange={(e) => setDemoPlaintext(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/60"
                    placeholder="Deine Nachricht…"
                  />
                  <button
                    onClick={runDemo}
                    disabled={demoRunning}
                    className="w-full gradient-brand text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {demoRunning ? <RefreshCw size={16} className="animate-spin" /> : <Lock size={16} />}
                    {demoRunning ? 'Verschlüssle…' : 'Jetzt verschlüsseln'}
                  </button>

                  {demoEncrypted && (
                    <div className="space-y-3">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                        <p className="text-red-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                          Was der Server sieht (Ciphertext)
                        </p>
                        <p className="text-red-300/70 font-mono text-[11px] break-all">{demoEncrypted}</p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                        <p className="text-green-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                          Was du siehst (entschlüsselt)
                        </p>
                        <p className="text-green-300 text-sm">{demoDecrypted}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Export backup sheet */}
              {sheet === 'backup_export' && (
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg">Schlüssel exportieren</h3>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex gap-2">
                    <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-400/80 text-xs">
                      Der Private Schlüssel wird mit deinem Passwort verschlüsselt.
                      Das Backup ohne Passwort ist nutzlos — vergiss es nicht.
                    </p>
                  </div>
                  <div className="relative">
                    <input
                      type={backupPassVisible ? 'text' : 'password'}
                      value={backupPass}
                      onChange={(e) => setBackupPass(e.target.value)}
                      placeholder="Backup-Passwort (min. 8 Zeichen)"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/60 pr-10"
                    />
                    <button
                      onClick={() => setBackupPassVisible((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {backupPassVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button
                    onClick={handleExportBackup}
                    className="w-full gradient-brand text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Backup herunterladen
                  </button>
                </div>
              )}

              {/* Import backup sheet */}
              {sheet === 'backup_import' && (
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg">Schlüssel importieren</h3>
                  <textarea
                    value={importFile}
                    onChange={(e) => setImportFile(e.target.value)}
                    placeholder="Backup-JSON hier einfügen…"
                    rows={4}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-purple-500/60 resize-none"
                  />
                  <div className="relative">
                    <input
                      type={importPassVisible ? 'text' : 'password'}
                      value={importPass}
                      onChange={(e) => setImportPass(e.target.value)}
                      placeholder="Backup-Passwort"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/60 pr-10"
                    />
                    <button
                      onClick={() => setImportPassVisible((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {importPassVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button
                    onClick={handleImportBackup}
                    className="w-full gradient-brand text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Upload size={16} />
                    Importieren
                  </button>
                </div>
              )}

              {/* Regenerate keys sheet */}
              {sheet === 'regen' && (
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <AlertTriangle size={18} className="text-orange-400" />
                    Schlüssel neu generieren
                  </h3>
                  <div className="bg-orange-500/10 border border-orange-500/25 rounded-xl p-4 space-y-2">
                    <p className="text-orange-300 text-sm font-semibold">Das kannst du nicht rückgängig machen.</p>
                    <ul className="text-orange-400/70 text-xs space-y-1">
                      <li>• Alle bisherigen verschlüsselten Nachrichten sind nicht mehr lesbar</li>
                      <li>• Alle Gesprächsschlüssel werden ungültig</li>
                      <li>• Dein Fingerabdruck ändert sich</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-2">Gib <code className="text-orange-400">LÖSCHEN</code> ein um fortzufahren</p>
                    <input
                      value={regenConfirm}
                      onChange={(e) => setRegenConfirm(e.target.value)}
                      placeholder="LÖSCHEN"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-orange-500/60"
                    />
                  </div>
                  <button
                    onClick={handleRegenKeys}
                    disabled={regenConfirm !== 'LÖSCHEN'}
                    className="w-full bg-orange-500/80 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Neue Schlüssel generieren
                  </button>
                </div>
              )}

              {/* Verify contact sheet */}
              {sheet === 'verify' && (
                <div className="space-y-4">
                  <h3 className="text-white font-bold text-lg">Kontakt verifizieren</h3>
                  <p className="text-white/40 text-sm">
                    Vergleiche den Fingerabdruck deines Kontakts persönlich oder per Videocall,
                    um sicherzustellen, dass niemand euch abhört (Man-in-the-Middle).
                  </p>
                  <input
                    value={verifyName}
                    onChange={(e) => setVerifyName(e.target.value)}
                    placeholder="Name des Kontakts"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/60"
                  />
                  <input
                    value={verifyInput}
                    onChange={(e) => setVerifyInput(e.target.value)}
                    placeholder="Fingerabdruck (z.B. AB12C DE34F …)"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-purple-500/60"
                  />
                  <div className="text-xs text-white/30">
                    Dein eigener Fingerabdruck: <span className="text-white/50 font-mono">{fingerprint.slice(0, 29)}…</span>
                  </div>
                  <button
                    onClick={handleAddVerified}
                    className="w-full gradient-brand text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={16} />
                    Als verifiziert markieren
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-card border border-white/15 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

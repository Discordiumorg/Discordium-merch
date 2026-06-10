'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Filter,
  Search,
  Shield,
  User,
  Lock,
  Unlock,
  Ban,
  CheckCircle,
  XCircle,
  Settings,
  LogIn,
  Database,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { mockAuditLogs, AuditLog, AuditAction } from '@/lib/security';

const ACTION_META: Record<AuditAction, { label: string; icon: React.ReactNode; color: string }> = {
  user_banned:       { label: 'User Banned',        icon: <Ban size={14} />,         color: 'text-red-400' },
  user_unbanned:     { label: 'User Unbanned',       icon: <Unlock size={14} />,      color: 'text-green-400' },
  ip_blocked:        { label: 'IP Blocked',          icon: <Lock size={14} />,        color: 'text-orange-400' },
  ip_unblocked:      { label: 'IP Unblocked',        icon: <Unlock size={14} />,      color: 'text-blue-400' },
  report_dismissed:  { label: 'Report Dismissed',    icon: <XCircle size={14} />,     color: 'text-white/50' },
  report_actioned:   { label: 'Report Actioned',     icon: <AlertTriangle size={14} />, color: 'text-yellow-400' },
  content_removed:   { label: 'Content Removed',     icon: <XCircle size={14} />,     color: 'text-red-400' },
  content_approved:  { label: 'Content Approved',    icon: <CheckCircle size={14} />, color: 'text-green-400' },
  waf_rule_toggled:  { label: 'WAF Rule Changed',    icon: <Shield size={14} />,      color: 'text-purple-400' },
  rate_limit_changed:{ label: 'Rate Limit Changed',  icon: <RefreshCw size={14} />,   color: 'text-purple-400' },
  admin_login:       { label: 'Admin Login',         icon: <LogIn size={14} />,       color: 'text-blue-400' },
  mod_login:         { label: 'Mod Login',           icon: <LogIn size={14} />,       color: 'text-blue-300' },
  settings_changed:  { label: 'Settings Changed',    icon: <Settings size={14} />,    color: 'text-yellow-400' },
  data_exported:     { label: 'Data Exported',       icon: <Database size={14} />,    color: 'text-orange-400' },
};

const SEVERITY_STYLES = {
  info:     { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    dot: 'bg-blue-400' },
  warning:  { bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20',  dot: 'bg-yellow-400' },
  critical: { bg: 'bg-red-500/10',     border: 'border-red-500/25',     dot: 'bg-red-400' },
};

const ALL_FILTERS = ['All', 'Admin', 'Mod', 'Critical', 'Warning'] as const;
type Filter = typeof ALL_FILTERS[number];

function formatRelTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function formatFull(date: Date): string {
  return date.toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export default function AdminAuditPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exportToast, setExportToast] = useState(false);

  const filtered = useMemo(() => {
    let list = [...mockAuditLogs];
    if (activeFilter === 'Admin') list = list.filter((l) => l.actorRole === 'admin');
    else if (activeFilter === 'Mod') list = list.filter((l) => l.actorRole === 'mod');
    else if (activeFilter === 'Critical') list = list.filter((l) => l.severity === 'critical');
    else if (activeFilter === 'Warning') list = list.filter((l) => l.severity === 'warning');

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.actor.toLowerCase().includes(q) ||
          l.detail.toLowerCase().includes(q) ||
          (l.target ?? '').toLowerCase().includes(q) ||
          ACTION_META[l.action].label.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeFilter, search]);

  const stats = useMemo(() => ({
    total: mockAuditLogs.length,
    critical: mockAuditLogs.filter((l) => l.severity === 'critical').length,
    warning: mockAuditLogs.filter((l) => l.severity === 'warning').length,
    today: mockAuditLogs.filter((l) => Date.now() - l.timestamp.getTime() < 86_400_000).length,
  }), []);

  const handleExport = () => {
    const csv = [
      'ID,Timestamp,Actor,Role,Action,Target,Detail,IP,Severity',
      ...mockAuditLogs.map((l) =>
        [l.id, formatFull(l.timestamp), l.actor, l.actorRole, ACTION_META[l.action].label,
         l.target ?? '', `"${l.detail}"`, l.ipAddress, l.severity].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-audit-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push('/admin')}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold font-display">Audit Log</h1>
            <p className="text-white/40 text-xs">{stats.total} Einträge gesamt</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 transition-colors text-purple-300 text-sm font-medium"
          >
            <Download size={14} />
            CSV
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Gesamt', value: stats.total, color: 'text-white' },
            { label: 'Heute', value: stats.today, color: 'text-blue-400' },
            { label: 'Warnung', value: stats.warning, color: 'text-yellow-400' },
            { label: 'Kritisch', value: stats.critical, color: 'text-red-400' },
          ].map((s) => (
            <div key={s.label} className="card-glass rounded-xl p-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suche nach Aktion, Benutzer, Ziel…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {ALL_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/30 text-xs mb-3">
            <Clock size={12} />
            <span>Neueste zuerst · {filtered.length} Einträge</span>
          </div>

          <AnimatePresence initial={false}>
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 text-white/30 text-sm"
              >
                Keine Einträge gefunden.
              </motion.div>
            ) : (
              filtered.map((log, idx) => {
                const meta = ACTION_META[log.action];
                const sev = SEVERITY_STYLES[log.severity];
                const isExpanded = expandedId === log.id;

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`rounded-xl border overflow-hidden ${sev.border} ${sev.bg}`}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      className="w-full flex items-start gap-3 p-3 text-left"
                    >
                      {/* Severity dot + connector line */}
                      <div className="flex flex-col items-center pt-0.5 flex-shrink-0">
                        <span className={`w-2.5 h-2.5 rounded-full ${sev.dot} flex-shrink-0`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`flex items-center gap-1 font-semibold text-sm ${meta.color}`}>
                            {meta.icon}
                            {meta.label}
                          </span>
                          {log.target && (
                            <span className="text-white/40 text-xs font-mono bg-white/5 px-1.5 py-0.5 rounded">
                              {log.target}
                            </span>
                          )}
                        </div>
                        <p className="text-white/60 text-xs mt-0.5 truncate">{log.detail}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                            log.actorRole === 'admin'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {log.actorRole === 'admin' ? '🛡 Admin' : '🔵 Mod'}
                          </span>
                          <span className="text-white/40 text-[10px]">{log.actor}</span>
                          <span className="text-white/25 text-[10px]">·</span>
                          <span className="text-white/40 text-[10px]">{formatRelTime(log.timestamp)}</span>
                        </div>
                      </div>

                      <div className="text-white/30 flex-shrink-0">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3 pt-1 border-t border-white/10 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div>
                              <span className="text-white/30">Zeitstempel</span>
                              <p className="text-white/70 mt-0.5 font-mono text-[11px]">{formatFull(log.timestamp)}</p>
                            </div>
                            <div>
                              <span className="text-white/30">IP-Adresse</span>
                              <p className="text-white/70 mt-0.5 font-mono text-[11px]">{log.ipAddress}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-white/30">Detail</span>
                              <p className="text-white/70 mt-0.5">{log.detail}</p>
                            </div>
                            <div>
                              <span className="text-white/30">Schweregrad</span>
                              <p className={`mt-0.5 font-medium capitalize ${
                                log.severity === 'critical' ? 'text-red-400' :
                                log.severity === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                              }`}>{log.severity}</p>
                            </div>
                            <div>
                              <span className="text-white/30">Log-ID</span>
                              <p className="text-white/40 mt-0.5 font-mono text-[11px]">{log.id}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Export toast */}
      <AnimatePresence>
        {exportToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg z-50 flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Audit-Log exportiert
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

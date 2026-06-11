'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ArrowLeft, AlertTriangle, Ban, Zap, Activity,
  Globe, Lock, Unlock, RefreshCw, ChevronRight, Check,
  X, Eye, Database, Wifi, Server,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  mockSecurityEvents, mockBlockedIps, mockRateLimitRules, mockWafRules,
  getThreatLevel, THREAT_CONFIG,
  type BlockedIp, type RateLimitRule, type WafRule,
} from '@/lib/security';

const SEVERITY_STYLE: Record<string, string> = {
  info: 'bg-blue-500/15 text-blue-400',
  warning: 'bg-yellow-500/15 text-yellow-400',
  critical: 'bg-red-500/15 text-red-400',
};

const EVENT_ICON: Record<string, string> = {
  rate_limit: '⚡',
  blocked_ip: '🚫',
  waf_trigger: '🛡️',
  failed_login: '🔐',
  suspicious: '👁️',
  ddos: '💥',
};

function timeAgo(d: Date) {
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export default function SecurityPage() {
  const router = useRouter();
  const [events, setEvents] = useState(mockSecurityEvents);
  const [blockedIps, setBlockedIps] = useState(mockBlockedIps);
  const [rateLimits, setRateLimits] = useState(mockRateLimitRules);
  const [wafRules, setWafRules] = useState(mockWafRules);
  const [tab, setTab] = useState<'overview' | 'events' | 'ips' | 'waf' | 'ratelimit'>('overview');
  const [ddosProtection, setDdosProtection] = useState(true);
  const [autoBlock, setAutoBlock] = useState(true);
  const [twoFaRequired, setTwoFaRequired] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const threatLevel = getThreatLevel(events);
  const threatCfg = THREAT_CONFIG[threatLevel];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const unblockIp = (id: string) => {
    setBlockedIps((b) => b.filter((x) => x.id !== id));
    showToast('IP unblocked');
  };

  const blockIp = (ip: string) => {
    const newBlock: BlockedIp = {
      id: `b-${Date.now()}`,
      ip,
      reason: 'Manually blocked by admin',
      blockedAt: new Date(),
      blockedBy: 'admin',
      country: '🌍 Unknown',
      requestCount: 0,
      permanent: false,
    };
    setBlockedIps((b) => [newBlock, ...b]);
    showToast(`IP ${ip} blocked`);
  };

  const toggleRateLimit = (id: string) => {
    setRateLimits((r) => r.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));
  };

  const toggleWafRule = (id: string) => {
    setWafRules((r) => r.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));
  };

  const clearEvents = () => {
    setEvents([]);
    showToast('Event log cleared');
  };

  const TABS = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'events', label: `Events (${events.length})`, icon: AlertTriangle },
    { key: 'ips', label: `Blocked IPs (${blockedIps.length})`, icon: Ban },
    { key: 'waf', label: 'WAF Rules', icon: Shield },
    { key: 'ratelimit', label: 'Rate Limits', icon: Zap },
  ] as const;

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur-xl border-b border-white/10 px-5 py-4 flex items-center gap-3">
        <button onClick={() => router.push('/admin')} className="w-9 h-9 card-glass rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Shield size={18} className="text-purple-400" />
          <span className="text-white font-black text-base">Security Center</span>
        </div>
        <motion.div
          animate={threatCfg.pulse ? { scale: [1, 1.05, 1], opacity: [1, 0.7, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border ${threatCfg.bg} ${threatCfg.color} ${threatCfg.border}`}
        >
          <span className="w-2 h-2 rounded-full bg-current" />
          {threatCfg.label}
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 py-3 border-b border-white/10 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              tab === t.key ? 'gradient-brand text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-5 py-6 pb-20">
        <AnimatePresence mode="wait">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Threat meter */}
              <div className={`rounded-3xl p-5 mb-6 border ${threatCfg.bg} ${threatCfg.border}`}>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={threatCfg.pulse ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <AlertTriangle size={24} className={threatCfg.color} />
                  </motion.div>
                  <div>
                    <p className={`font-black text-lg ${threatCfg.color}`}>Threat Level: {threatCfg.label}</p>
                    <p className="text-white/40 text-xs">
                      {events.filter((e) => Date.now() - e.timestamp.getTime() < 30 * 60_000).length} events in last 30 min
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: threatLevel === 'low' ? '25%' : threatLevel === 'medium' ? '50%' : threatLevel === 'high' ? '75%' : '100%' }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${
                      threatLevel === 'low' ? 'bg-green-500' :
                      threatLevel === 'medium' ? 'bg-yellow-500' :
                      threatLevel === 'high' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Blocked IPs', value: blockedIps.length, icon: Ban, color: 'text-red-400', bg: 'bg-red-500/15' },
                  { label: 'Events Today', value: events.length, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/15' },
                  { label: 'WAF Triggers', value: wafRules.reduce((s, r) => s + r.triggerCount, 0), icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/15' },
                  { label: 'Active Rules', value: rateLimits.filter((r) => r.enabled).length + wafRules.filter((r) => r.enabled).length, icon: Lock, color: 'text-blue-400', bg: 'bg-blue-500/15' },
                ].map((s) => (
                  <div key={s.label} className="card-glass rounded-2xl p-4">
                    <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <s.icon size={16} className={s.color} />
                    </div>
                    <p className={`font-black text-2xl mb-0.5 ${s.color}`}>{s.value}</p>
                    <p className="text-white/40 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Protection toggles */}
              <div className="card-glass rounded-3xl overflow-hidden mb-6">
                <div className="px-5 py-3 border-b border-white/5">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">Protection Systems</p>
                </div>
                {[
                  { label: 'DDoS Protection', desc: 'Auto-detect and block volumetric attacks', icon: Wifi, value: ddosProtection, set: setDdosProtection },
                  { label: 'Auto-Block on Attack', desc: 'Automatically block IPs after WAF triggers', icon: Ban, value: autoBlock, set: setAutoBlock },
                  { label: '2FA Required (Admin/Mod)', desc: 'Require PIN authentication for admin access', icon: Lock, value: twoFaRequired, set: setTwoFaRequired },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0">
                    <div className="w-9 h-9 bg-purple-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon size={16} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{item.label}</p>
                      <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => { item.set(!item.value); showToast(`${item.label} ${!item.value ? 'enabled' : 'disabled'}`); }}
                      className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${item.value ? 'bg-purple-500' : 'bg-white/20'}`}
                    >
                      <motion.div
                        animate={{ x: item.value ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Infrastructure status */}
              <div className="card-glass rounded-3xl p-5">
                <p className="text-white font-bold mb-4">Infrastructure Status</p>
                <div className="space-y-3">
                  {[
                    { name: 'API Servers', status: 'Operational', ok: true, icon: Server },
                    { name: 'Database', status: 'Operational', ok: true, icon: Database },
                    { name: 'CDN / Edge', status: 'Operational', ok: true, icon: Globe },
                    { name: 'DDoS Mitigation', status: ddosProtection ? 'Active' : 'DISABLED', ok: ddosProtection, icon: Shield },
                    { name: 'WAF', status: wafRules.some((r) => r.enabled) ? 'Active' : 'No rules', ok: wafRules.some((r) => r.enabled), icon: Shield },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <item.icon size={15} className="text-white/40 flex-shrink-0" />
                      <span className="text-white/70 text-sm flex-1">{item.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${item.ok ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className={`text-xs font-semibold ${item.ok ? 'text-green-400' : 'text-red-400'}`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Security Events ── */}
          {tab === 'events' && (
            <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/50 text-sm">{events.length} events logged</p>
                <button onClick={clearEvents} className="text-white/40 text-xs flex items-center gap-1.5 hover:text-white transition-colors">
                  <RefreshCw size={12} /> Clear log
                </button>
              </div>

              <div className="space-y-2">
                {events.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-white/40 text-sm">No security events</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="card-glass rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${SEVERITY_STYLE[event.severity]}`}>
                          {EVENT_ICON[event.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-white font-semibold text-sm">{event.ip}</span>
                            {event.country && <span className="text-white/30 text-xs">{event.country}</span>}
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ml-auto ${SEVERITY_STYLE[event.severity]}`}>{event.severity}</span>
                          </div>
                          <p className="text-white/60 text-xs mb-1">{event.detail}</p>
                          <div className="flex items-center gap-2 text-white/30 text-[10px]">
                            <span className="font-mono">{event.path}</span>
                            <span>·</span>
                            <span>{timeAgo(event.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      {event.type === 'ddos' || event.type === 'waf_trigger' ? (
                        <button
                          onClick={() => blockIp(event.ip)}
                          className="mt-3 w-full py-2 rounded-xl bg-red-500/15 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-500/25 transition-colors"
                        >
                          <Ban size={12} /> Block this IP
                        </button>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ── Blocked IPs ── */}
          {tab === 'ips' && (
            <motion.div key="ips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-white/50 text-sm">{blockedIps.length} IPs blocked</p>
              </div>

              <div className="space-y-3">
                {blockedIps.map((ip) => (
                  <motion.div key={ip.id} layout className="card-glass rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-red-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Ban size={16} className="text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-white font-mono font-bold text-sm">{ip.ip}</span>
                          <span className="text-white/40 text-xs">{ip.country}</span>
                          {ip.permanent && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 uppercase">permanent</span>
                          )}
                        </div>
                        <p className="text-red-400/70 text-xs mb-1">{ip.reason}</p>
                        <div className="flex items-center gap-2 text-white/25 text-[10px]">
                          <span>{ip.requestCount.toLocaleString()} requests</span>
                          <span>·</span>
                          <span>by {ip.blockedBy}</span>
                          <span>·</span>
                          <span>{timeAgo(ip.blockedAt)}</span>
                        </div>
                      </div>
                      {!ip.permanent && (
                        <button
                          onClick={() => unblockIp(ip.id)}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-green-500/15 text-white/40 hover:text-green-400 text-xs font-semibold transition-all flex-shrink-0 flex items-center gap-1.5"
                        >
                          <Unlock size={12} /> Lift
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {blockedIps.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-white/40 text-sm">No blocked IPs</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── WAF Rules ── */}
          {tab === 'waf' && (
            <motion.div key="waf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-white/50 text-sm mb-4">Web Application Firewall rules</p>
              <div className="space-y-3">
                {wafRules.map((rule) => (
                  <div key={rule.id} className="card-glass rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${rule.enabled ? 'bg-green-400' : 'bg-white/20'}`} />
                          <span className="text-white font-semibold text-sm">{rule.name}</span>
                          <span className="text-white/30 text-[10px] ml-auto">{rule.triggerCount} triggers</span>
                        </div>
                        <p className="text-white/40 text-xs mb-2">{rule.description}</p>
                        <code className="text-purple-300/70 text-[10px] bg-purple-500/10 px-2 py-0.5 rounded font-mono">
                          {rule.pattern}
                        </code>
                      </div>
                      <button
                        onClick={() => { toggleWafRule(rule.id); showToast(`${rule.name} ${!rule.enabled ? 'enabled' : 'disabled'}`); }}
                        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ml-3 ${rule.enabled ? 'bg-green-500' : 'bg-white/20'}`}
                      >
                        <motion.div
                          animate={{ x: rule.enabled ? 22 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Rate Limits ── */}
          {tab === 'ratelimit' && (
            <motion.div key="ratelimit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-white/50 text-sm mb-4">Configure per-path request limits</p>
              <div className="space-y-3">
                {rateLimits.map((rule) => (
                  <div key={rule.id} className="card-glass rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap size={13} className={rule.enabled ? 'text-yellow-400' : 'text-white/25'} />
                          <code className="text-white font-mono font-bold text-sm">{rule.path}</code>
                        </div>
                        <p className="text-white/40 text-xs">
                          Max <span className="text-white/70 font-semibold">{rule.maxRequests}</span> requests /
                          <span className="text-white/70 font-semibold"> {rule.windowSecs}s</span>
                        </p>
                      </div>
                      <button
                        onClick={() => { toggleRateLimit(rule.id); showToast(`Rate limit ${rule.path} ${!rule.enabled ? 'enabled' : 'disabled'}`); }}
                        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${rule.enabled ? 'bg-purple-500' : 'bg-white/20'}`}
                      >
                        <motion.div
                          animate={{ x: rule.enabled ? 22 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-brand-card border border-white/15 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

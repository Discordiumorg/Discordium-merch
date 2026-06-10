'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Flag, Ban, Check, X, Eye, MessageSquare,
  Clock, AlertTriangle, UserX, ChevronRight, Search,
  Gavel, RefreshCw, Bell, Filter, Camera, MoreVertical,
  CheckCheck, Trash2,
} from 'lucide-react';

// ─── Mock data ────────────────────────────────────────────────────────────────

interface Report {
  id: string;
  type: 'photo' | 'message' | 'profile' | 'behavior';
  reportedUser: string;
  reportedSeed: string;
  reporterName: string;
  reason: string;
  detail: string;
  timestamp: string;
  status: 'open' | 'resolved' | 'dismissed';
  evidence?: string;
}

const REPORTS: Report[] = [
  { id: 'r1', type: 'photo', reportedUser: 'Alex W.', reportedSeed: 'alex1', reporterName: 'Sophie M.', reason: 'Inappropriate photo', detail: 'Profile photo is explicit and violates community guidelines.', timestamp: '5 min ago', status: 'open', evidence: 'photo_report_1' },
  { id: 'r2', type: 'message', reportedUser: 'Marco D.', reportedSeed: 'marco1', reporterName: 'Lena S.', reason: 'Harassment', detail: 'Sent repeated unsolicited explicit messages after being told to stop.', timestamp: '12 min ago', status: 'open' },
  { id: 'r3', type: 'profile', reportedUser: 'Fake User', reportedSeed: 'fake1', reporterName: 'Tom F.', reason: 'Fake profile / Scam', detail: 'Profile photos are stolen from Instagram. Asking for money.', timestamp: '34 min ago', status: 'open' },
  { id: 'r4', type: 'behavior', reportedUser: 'Chris K.', reportedSeed: 'chris1', reporterName: 'Mia L.', reason: 'Threatening behavior', detail: 'Threatened to share private photos. Feels very unsafe.', timestamp: '1h ago', status: 'open' },
  { id: 'r5', type: 'photo', reportedUser: 'Jana P.', reportedSeed: 'jana1', reporterName: 'Felix B.', reason: 'Inappropriate photo', detail: 'Secondary photo is suggestive and likely underage.', timestamp: '2h ago', status: 'open' },
  { id: 'r6', type: 'message', reportedUser: 'Ben T.', reportedSeed: 'ben1', reporterName: 'Anna R.', reason: 'Spam', detail: 'Mass sending copy-paste commercial messages to many users.', timestamp: '3h ago', status: 'resolved' },
  { id: 'r7', type: 'profile', reportedUser: 'Lisa M.', reportedSeed: 'lisa1', reporterName: 'Kai H.', reason: 'Under 18', detail: 'Looks visibly underage. Bio says 18 but photos suggest otherwise.', timestamp: '5h ago', status: 'resolved' },
];

interface BannedUser {
  id: string;
  name: string;
  seed: string;
  reason: string;
  bannedAt: string;
  bannedBy: string;
  reports: number;
}

const BANNED_USERS: BannedUser[] = [
  { id: 'b1', name: 'Elena V.', seed: 'elena1', reason: 'Repeated harassment', bannedAt: '2025-06-09', bannedBy: 'mod_anna', reports: 7 },
  { id: 'b2', name: 'Fake User', seed: 'fake2', reason: 'Scam / impersonation', bannedAt: '2025-06-08', bannedBy: 'mod_ben', reports: 12 },
  { id: 'b3', name: 'Ben T.', seed: 'ben1', reason: 'Spam messaging', bannedAt: '2025-06-07', bannedBy: 'mod_anna', reports: 4 },
  { id: 'b4', name: 'Chris K.', seed: 'chris1', reason: 'Threats & blackmail', bannedAt: '2025-06-05', bannedBy: 'admin', reports: 9 },
];

interface ContentItem {
  id: string;
  type: 'photo' | 'bio';
  user: string;
  seed: string;
  photoSeed?: string;
  content: string;
  flagReason: string;
  timestamp: string;
}

const CONTENT_QUEUE: ContentItem[] = [
  { id: 'c1', type: 'photo', user: 'Alex W.', seed: 'alex1', photoSeed: 'flagged_photo_1', content: 'Profile photo', flagReason: 'Auto-flagged: potential nudity (confidence: 87%)', timestamp: '3 min ago' },
  { id: 'c2', type: 'bio', user: 'Unknown User', seed: 'unknown1', content: '"Looking for sponsors. I offer exclusive content for payment."', flagReason: 'Auto-flagged: commercial solicitation pattern', timestamp: '18 min ago' },
  { id: 'c3', type: 'photo', user: 'Jana P.', seed: 'jana1', photoSeed: 'flagged_photo_2', content: 'Photo 2 of 4', flagReason: 'User-reported: possibly underage', timestamp: '2h ago' },
  { id: 'c4', type: 'bio', user: 'Mike R.', seed: 'mike1', content: '"WhatsApp me at +49xxx for fun. No strings attached. SnapC: mikefun99"', flagReason: 'Auto-flagged: external contact solicitation', timestamp: '4h ago' },
];

const TYPE_COLORS: Record<string, string> = {
  photo: 'bg-orange-500/20 text-orange-400',
  message: 'bg-red-500/20 text-red-400',
  profile: 'bg-yellow-500/20 text-yellow-400',
  behavior: 'bg-red-600/25 text-red-500',
};

const TYPE_ICONS: Record<string, string> = {
  photo: '📷',
  message: '💬',
  profile: '👤',
  behavior: '⚠️',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ModPage() {
  const [tab, setTab] = useState<'reports' | 'bans' | 'content' | 'log'>('reports');
  const [reports, setReports] = useState<Report[]>(REPORTS);
  const [bans, setBans] = useState<BannedUser[]>(BANNED_USERS);
  const [content, setContent] = useState<ContentItem[]>(CONTENT_QUEUE);
  const [search, setSearch] = useState('');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('open');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const resolveReport = (id: string, action: 'warn' | 'ban' | 'dismiss') => {
    setReports((r) => r.map((x) => x.id === id ? { ...x, status: action === 'dismiss' ? 'dismissed' : 'resolved' } : x));
    const messages = { warn: '⚠️ Warning sent to user', ban: '🚫 User banned', dismiss: 'Report dismissed' };
    showToast(messages[action]);
    setExpandedReport(null);
  };

  const liftBan = (id: string) => {
    setBans((b) => b.filter((x) => x.id !== id));
    showToast('Ban lifted — user restored');
  };

  const approveContent = (id: string) => {
    setContent((c) => c.filter((x) => x.id !== id));
    showToast('✓ Content approved');
  };

  const removeContent = (id: string) => {
    setContent((c) => c.filter((x) => x.id !== id));
    showToast('🗑️ Content removed');
  };

  const openCount = reports.filter((r) => r.status === 'open').length;
  const filteredReports = reports.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (search && !r.reportedUser.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const TABS = [
    { key: 'reports', label: 'Reports', icon: Flag, badge: openCount },
    { key: 'bans', label: 'Bans', icon: Ban, badge: bans.length },
    { key: 'content', label: 'Content', icon: Camera, badge: content.length },
    { key: 'log', label: 'Activity', icon: Clock, badge: 0 },
  ] as const;

  const MOD_LOG = [
    { action: 'Resolved report', detail: 'Ben T. — spam (warned)', mod: 'mod_anna', time: '1h ago', icon: CheckCheck },
    { action: 'Banned user', detail: 'Fake User — scam/impersonation', mod: 'admin', time: '2h ago', icon: Ban },
    { action: 'Removed photo', detail: 'Jana P. — under-18 suspected', mod: 'mod_ben', time: '3h ago', icon: Trash2 },
    { action: 'Dismissed report', detail: 'Lisa M. — verified 18+', mod: 'mod_anna', time: '5h ago', icon: X },
    { action: 'Warned user', detail: 'Marco D. — first offense', mod: 'mod_ben', time: '6h ago', icon: AlertTriangle },
    { action: 'Lifted ban', detail: 'User appeal approved', mod: 'admin', time: 'Yesterday', icon: Check },
    { action: 'Content removed', detail: 'External contact solicitation bio', mod: 'mod_anna', time: 'Yesterday', icon: Trash2 },
  ];

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur-xl border-b border-white/10 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center justify-center">
            <Shield size={16} className="text-orange-400" />
          </div>
          <div>
            <span className="text-white font-black text-base">Aura Mod</span>
            <span className="ml-2 text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Moderator
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => showToast('Queue refreshed')}
            className="w-8 h-8 card-glass rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors">
            <RefreshCw size={14} />
          </button>
          <button className="w-8 h-8 card-glass rounded-xl flex items-center justify-center text-white/50 relative">
            <Bell size={14} />
            {openCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center font-black">{openCount}</span>
            )}
          </button>
          <div className="w-8 h-8 bg-orange-500/20 rounded-xl flex items-center justify-center text-xs font-black text-orange-400">M</div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 px-5 py-3 border-b border-white/10 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all relative ${
              tab === t.key ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <t.icon size={14} />
            {t.label}
            {t.badge > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                tab === t.key ? 'bg-orange-500/30 text-orange-300' : 'bg-red-500/25 text-red-400'
              }`}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="px-5 py-6 pb-20">
        <AnimatePresence mode="wait">

          {/* ── Reports ── */}
          {tab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Open', value: reports.filter((r) => r.status === 'open').length, color: 'text-red-400', bg: 'bg-red-500/15' },
                  { label: 'Resolved Today', value: 8, color: 'text-green-400', bg: 'bg-green-500/15' },
                  { label: 'Avg. Response', value: '18m', color: 'text-blue-400', bg: 'bg-blue-500/15' },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-2xl p-3.5 text-center`}>
                    <p className={`font-black text-2xl mb-0.5 ${s.color}`}>{s.value}</p>
                    <p className="text-white/50 text-[10px]">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-4">
                {(['all', 'open', 'resolved'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterStatus(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      filterStatus === f ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'card-glass text-white/50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-white placeholder:text-white/25 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Report list */}
              <div className="space-y-3">
                {filteredReports.map((report) => {
                  const isExpanded = expandedReport === report.id;
                  return (
                    <motion.div
                      key={report.id}
                      layout
                      className={`card-glass rounded-2xl overflow-hidden ${
                        report.status === 'resolved' ? 'opacity-50' : ''
                      }`}
                    >
                      <button
                        onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                        className="w-full flex items-start gap-3 p-4 text-left"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${TYPE_COLORS[report.type]}`}>
                          {TYPE_ICONS[report.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-white font-semibold text-sm">{report.reportedUser}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${TYPE_COLORS[report.type]}`}>{report.type}</span>
                            {report.status === 'open' && (
                              <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 ml-auto" />
                            )}
                          </div>
                          <p className="text-white/60 text-xs font-medium">{report.reason}</p>
                          <p className="text-white/30 text-[10px] mt-0.5">
                            Reported by {report.reporterName} · {report.timestamp}
                          </p>
                        </div>
                        <ChevronRight
                          size={14}
                          className={`text-white/30 flex-shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-white/5 pt-3">
                              {/* Evidence photo */}
                              {report.evidence && (
                                <div className="mb-3 rounded-xl overflow-hidden h-32 relative bg-white/5">
                                  <img
                                    src={`https://picsum.photos/seed/${report.evidence}/400/200`}
                                    alt="Evidence"
                                    className="w-full h-full object-cover blur-md"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-black/60 text-white/60 text-xs px-3 py-1.5 rounded-full">
                                      🔒 Blurred — tap to review
                                    </span>
                                  </div>
                                </div>
                              )}

                              <p className="text-white/60 text-xs leading-relaxed mb-4">
                                "{report.detail}"
                              </p>

                              {report.status === 'open' ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => resolveReport(report.id, 'warn')}
                                    className="flex-1 py-2.5 rounded-xl bg-yellow-500/20 text-yellow-400 text-xs font-bold flex items-center justify-center gap-1.5"
                                  >
                                    <AlertTriangle size={12} /> Warn User
                                  </button>
                                  <button
                                    onClick={() => resolveReport(report.id, 'ban')}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5"
                                  >
                                    <Ban size={12} /> Ban User
                                  </button>
                                  <button
                                    onClick={() => resolveReport(report.id, 'dismiss')}
                                    className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/50 text-xs font-bold flex items-center justify-center gap-1.5"
                                  >
                                    <X size={12} /> Dismiss
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-green-400/70 text-xs">
                                  <CheckCheck size={14} />
                                  <span>
                                    {report.status === 'resolved' ? 'Resolved' : 'Dismissed'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {filteredReports.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">✅</div>
                    <p className="text-white/50 text-sm">No reports in this filter</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Bans ── */}
          {tab === 'bans' && (
            <motion.div key="bans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <p className="text-white/50 text-sm">{bans.length} banned accounts</p>
                <button onClick={() => showToast('Ban list exported')}
                  className="text-white/40 text-xs flex items-center gap-1.5 hover:text-white transition-colors">
                  <Filter size={12} /> Filter
                </button>
              </div>

              <div className="space-y-3">
                {bans.map((user) => (
                  <motion.div key={user.id} layout className="card-glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={`https://picsum.photos/seed/${user.seed}/80/80`}
                        alt={user.name}
                        className="w-12 h-12 rounded-2xl object-cover grayscale opacity-60"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Ban size={10} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 font-semibold text-sm line-through">{user.name}</p>
                      <p className="text-red-400/70 text-xs mt-0.5">{user.reason}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-white/30 text-[10px]">
                        <span>Banned {user.bannedAt}</span>
                        <span>·</span>
                        <span>by {user.bannedBy}</span>
                        <span>·</span>
                        <span>{user.reports} reports</span>
                      </div>
                    </div>
                    <button
                      onClick={() => liftBan(user.id)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-green-500/15 text-white/40 hover:text-green-400 text-xs font-semibold transition-all flex-shrink-0 flex items-center gap-1.5"
                    >
                      <Gavel size={12} /> Lift
                    </button>
                  </motion.div>
                ))}

                {bans.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="text-white/50 text-sm">No active bans</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Content Review ── */}
          {tab === 'content' && (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <p className="text-white/50 text-sm">{content.length} items pending review</p>
                <span className="text-orange-400/70 text-xs font-semibold flex items-center gap-1.5">
                  <Clock size={11} /> Auto-review in 24h
                </span>
              </div>

              <div className="space-y-4">
                {content.map((item) => (
                  <motion.div key={item.id} layout className="card-glass rounded-2xl overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={`https://picsum.photos/seed/${item.seed}/60/60`}
                          alt={item.user}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{item.user}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                              item.type === 'photo' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {item.type}
                            </span>
                            <span className="text-white/30 text-[10px]">{item.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content preview */}
                      {item.type === 'photo' && item.photoSeed ? (
                        <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-white/5">
                          <img
                            src={`https://picsum.photos/seed/${item.photoSeed}/400/200`}
                            alt="Flagged content"
                            className="w-full h-full object-cover blur-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/70 text-white/60 text-xs px-4 py-2 rounded-full flex items-center gap-2">
                              <Eye size={12} /> Blurred for safety — click to review
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/5 rounded-xl p-3 mb-3">
                          <p className="text-white/70 text-sm italic">"{item.content}"</p>
                        </div>
                      )}

                      <div className="flex items-start gap-2 mb-4">
                        <AlertTriangle size={12} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-400/80 text-xs leading-relaxed">{item.flagReason}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => approveContent(item.id)}
                          className="flex-1 py-2.5 rounded-xl bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Check size={13} /> Approve
                        </button>
                        <button
                          onClick={() => removeContent(item.id)}
                          className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                        <button className="px-3 py-2.5 rounded-xl bg-white/5 text-white/40 text-xs font-bold">
                          <MoreVertical size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {content.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="text-white/50 text-sm">Content queue is clear!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Activity Log ── */}
          {tab === 'log' && (
            <motion.div key="log" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <p className="text-white/50 text-sm">Moderation history</p>
              </div>

              <div className="space-y-0">
                {MOD_LOG.map((entry, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    {/* Timeline line */}
                    {i < MOD_LOG.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-px bg-white/10" />
                    )}
                    <div className="w-8 h-8 card-glass rounded-xl flex items-center justify-center flex-shrink-0 relative z-10">
                      <entry.icon size={14} className="text-white/50" />
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="text-white font-semibold text-sm">{entry.action}</p>
                      <p className="text-white/50 text-xs mt-0.5">{entry.detail}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-white/25 text-[10px]">
                        <span>{entry.time}</span>
                        <span>·</span>
                        <span>{entry.mod}</span>
                      </div>
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

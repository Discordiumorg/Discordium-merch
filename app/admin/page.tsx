'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, DollarSign, Zap, Shield, Bell, Settings,
  Search, ChevronDown, MoreVertical, Check, X, Ban, Eye,
  Crown, Star, Activity, BarChart2, Globe, Lock, Unlock,
  AlertTriangle, UserCheck, UserX, Download, RefreshCw, ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// ─── Mock data ───────────────────────────────────────────────────────────────

const STATS = [
  { label: 'Total Users', value: '84,231', delta: '+1,204', up: true, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/15' },
  { label: 'Active Today', value: '12,890', delta: '+843', up: true, icon: Activity, color: 'text-green-400', bg: 'bg-green-500/15' },
  { label: 'New Signups', value: '1,204', delta: '+18%', up: true, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  { label: 'Monthly Revenue', value: '€48,320', delta: '+12%', up: true, icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  { label: 'Premium Users', value: '9,812', delta: '+236', up: true, icon: Crown, color: 'text-pink-400', bg: 'bg-pink-500/15' },
  { label: 'Open Reports', value: '47', delta: '-12', up: false, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/15' },
];

const MOCK_USERS = [
  { id: 'u1', name: 'Sophie Müller', email: 'sophie@example.com', age: 26, city: 'Berlin', plan: 'Platinum', status: 'active', joined: '2024-03-12', seed: 'sophie1', reports: 0, verified: true },
  { id: 'u2', name: 'Lena Schmidt', email: 'lena@example.com', age: 29, city: 'Munich', plan: 'Free', status: 'active', joined: '2024-08-01', seed: 'lena1', reports: 1, verified: true },
  { id: 'u3', name: 'Marcus Weber', email: 'marcus@example.com', age: 33, city: 'Hamburg', plan: 'Premium', status: 'active', joined: '2025-01-20', seed: 'marcus1', reports: 0, verified: false },
  { id: 'u4', name: 'Julia Braun', email: 'julia@example.com', age: 24, city: 'Cologne', plan: 'Free', status: 'suspended', joined: '2024-11-05', seed: 'julia1', reports: 3, verified: false },
  { id: 'u5', name: 'Tom Fischer', email: 'tom@example.com', age: 31, city: 'Frankfurt', plan: 'Premium', status: 'active', joined: '2025-02-14', seed: 'tom1', reports: 0, verified: true },
  { id: 'u6', name: 'Elena Vogel', email: 'elena@example.com', age: 27, city: 'Berlin', plan: 'Free', status: 'banned', joined: '2024-06-30', seed: 'elena1', reports: 7, verified: false },
  { id: 'u7', name: 'Kai Hoffmann', email: 'kai@example.com', age: 22, city: 'Dresden', plan: 'Platinum', status: 'active', joined: '2025-03-01', seed: 'kai1', reports: 0, verified: true },
  { id: 'u8', name: 'Mia Klein', email: 'mia@example.com', age: 25, city: 'Stuttgart', plan: 'Free', status: 'active', joined: '2025-04-10', seed: 'mia1', reports: 0, verified: false },
];

const REVENUE_BARS = [18, 24, 19, 32, 28, 41, 35, 48, 44, 52, 47, 54].map((v, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  value: v,
}));

const PLAN_DIST = [
  { label: 'Free', pct: 88, color: 'bg-white/20' },
  { label: 'Premium', pct: 9, color: 'bg-purple-500' },
  { label: 'Platinum', pct: 3, color: 'bg-pink-500' },
];

const ACTIVITY_LOG = [
  { id: 1, action: 'User banned', detail: 'elena@example.com — 7 reports', time: '2 min ago', type: 'ban' },
  { id: 2, action: 'New premium sub', detail: 'Kai Hoffmann — Platinum yearly', time: '8 min ago', type: 'revenue' },
  { id: 3, action: 'Report resolved', detail: 'Inappropriate photo — removed', time: '15 min ago', type: 'mod' },
  { id: 4, action: 'Promo sent', detail: 'Weekend 40% off push — 12,890 users', time: '1h ago', type: 'promo' },
  { id: 5, action: 'ID verified', detail: 'Sophie Müller — Aura Verified', time: '2h ago', type: 'verify' },
  { id: 6, action: 'Boost purchased', detail: 'x3 boosts — Marcus Weber', time: '3h ago', type: 'revenue' },
];

const SETTINGS_ITEMS = [
  { label: 'Maintenance Mode', desc: 'Take the app offline for all users', value: false },
  { label: 'New Signups', desc: 'Allow new user registrations', value: true },
  { label: 'Video Dating', desc: 'Enable Video Speed Dating feature', value: true },
  { label: 'AI Matching', desc: 'Use AI to improve match quality', value: true },
  { label: 'Push Notifications', desc: 'Send push notifications globally', value: true },
  { label: 'Developer Mode', desc: 'Show debug info to dev accounts', value: false },
];

const PLAN_BADGE: Record<string, string> = {
  Free: 'bg-white/10 text-white/50',
  Premium: 'bg-purple-500/20 text-purple-300',
  Platinum: 'bg-pink-500/20 text-pink-300',
};

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-500/15 text-green-400',
  suspended: 'bg-yellow-500/15 text-yellow-400',
  banned: 'bg-red-500/15 text-red-400',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const ADMIN_PIN = '1234';

  const [tab, setTab] = useState<'overview' | 'users' | 'revenue' | 'settings'>('overview');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);
  const [settings, setSettings] = useState(SETTINGS_ITEMS);
  const [userMenu, setUserMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const maxBar = Math.max(...REVENUE_BARS.map((b) => b.value));

  useEffect(() => {
    if (sessionStorage.getItem('aura_admin_auth') === 'true') setAuthed(true);
  }, []);

  const handlePin = (digit: string) => {
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      if (next === ADMIN_PIN) {
        sessionStorage.setItem('aura_admin_auth', 'true');
        setAuthed(true);
        setPin('');
      } else {
        setPinError(true);
        setTimeout(() => { setPin(''); setPinError(false); }, 800);
      }
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center px-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center w-full max-w-xs">
          <div className="w-16 h-16 gradient-brand rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-white font-black text-2xl mb-1">Admin Access</h1>
          <p className="text-white/40 text-sm mb-8">Enter your 4-digit PIN</p>
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={pinError ? { x: [-4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.3 }}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  i < pin.length ? 'bg-purple-500 border-purple-500' : pinError ? 'border-red-400' : 'border-white/30'
                }`}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
              <button
                key={i}
                onClick={() => d === '⌫' ? setPin((p) => p.slice(0, -1)) : d ? handlePin(d) : undefined}
                disabled={!d && d !== '0'}
                className={`h-14 rounded-2xl text-xl font-bold transition-all ${
                  d ? 'card-glass text-white hover:bg-white/15 active:scale-95' : 'opacity-0 pointer-events-none'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="text-white/20 text-xs mt-6">Demo PIN: 1234</p>
        </motion.div>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const banUser = (id: string) => {
    setUsers((u) => u.map((x) => x.id === id ? { ...x, status: 'banned' } : x));
    setUserMenu(null);
    showToast('User banned');
  };

  const unbanUser = (id: string) => {
    setUsers((u) => u.map((x) => x.id === id ? { ...x, status: 'active' } : x));
    setUserMenu(null);
    showToast('User unbanned');
  };

  const verifyUser = (id: string) => {
    setUsers((u) => u.map((x) => x.id === id ? { ...x, verified: true } : x));
    setUserMenu(null);
    showToast('User verified ✓');
  };

  const toggleSetting = (i: number) => {
    setSettings((s) => s.map((x, j) => j === i ? { ...x, value: !x.value } : x));
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const TABS = [
    { key: 'overview', label: 'Overview', icon: BarChart2 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'revenue', label: 'Revenue', icon: DollarSign },
    { key: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const handleSignOut = () => {
    sessionStorage.removeItem('aura_admin_auth');
    setAuthed(false);
    setPin('');
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur-xl border-b border-white/10 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gradient-brand rounded-xl flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <span className="text-white font-black text-base">Aura Admin</span>
            <span className="ml-2 text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Super Admin
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Data refreshed')}
            className="w-8 h-8 card-glass rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <RefreshCw size={14} />
          </button>
          <button className="w-8 h-8 card-glass rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors relative">
            <Bell size={14} />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full text-[7px] flex items-center justify-center font-bold">3</span>
          </button>
          <button
            onClick={() => router.push('/admin/security')}
            className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Shield size={14} />
          </button>
          <button onClick={handleSignOut} className="w-8 h-8 card-glass rounded-xl flex items-center justify-center text-white/50 hover:text-red-400 transition-colors text-xs font-black">
            ✕
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 px-5 py-3 border-b border-white/10 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              tab === t.key ? 'gradient-brand text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-5 py-6 pb-20" onClick={() => setUserMenu(null)}>
        <AnimatePresence mode="wait">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {STATS.map((stat) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-glass rounded-2xl p-4"
                  >
                    <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                      <stat.icon size={16} className={stat.color} />
                    </div>
                    <p className="text-white font-black text-xl leading-none mb-1">{stat.value}</p>
                    <p className="text-white/40 text-xs mb-2">{stat.label}</p>
                    <span className={`text-xs font-semibold ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.delta} this week
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Revenue chart */}
              <div className="card-glass rounded-3xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Monthly Revenue</h3>
                  <span className="text-green-400 text-xs font-semibold">↑ 12% vs last year</span>
                </div>
                <div className="flex items-end gap-1.5 h-24">
                  {REVENUE_BARS.map((bar) => (
                    <div key={bar.month} className="flex flex-col items-center gap-1 flex-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(bar.value / maxBar) * 80}px` }}
                        transition={{ delay: 0.05, duration: 0.5 }}
                        className="w-full gradient-brand rounded-t-md opacity-80"
                      />
                      <span className="text-white/30 text-[8px]">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan distribution */}
              <div className="card-glass rounded-3xl p-5 mb-6">
                <h3 className="text-white font-bold mb-4">Plan Distribution</h3>
                <div className="space-y-3">
                  {PLAN_DIST.map((p) => (
                    <div key={p.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/70">{p.label}</span>
                        <span className="text-white/50">{p.pct}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.pct}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full ${p.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity log */}
              <div className="card-glass rounded-3xl p-5">
                <h3 className="text-white font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {ACTIVITY_LOG.map((log) => {
                    const colors: Record<string, string> = {
                      ban: 'bg-red-500/20 text-red-400',
                      revenue: 'bg-green-500/20 text-green-400',
                      mod: 'bg-orange-500/20 text-orange-400',
                      promo: 'bg-blue-500/20 text-blue-400',
                      verify: 'bg-purple-500/20 text-purple-400',
                    };
                    const icons: Record<string, string> = { ban: '🚫', revenue: '💰', mod: '🛡️', promo: '📢', verify: '✅' };
                    return (
                      <div key={log.id} className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${colors[log.type]}`}>
                          {icons[log.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold">{log.action}</p>
                          <p className="text-white/40 text-xs truncate">{log.detail}</p>
                        </div>
                        <span className="text-white/25 text-[10px] flex-shrink-0">{log.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Users ── */}
          {tab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Summary chips */}
              <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                {[
                  { label: `All (${users.length})`, filter: '' },
                  { label: `Active (${users.filter((u) => u.status === 'active').length})`, filter: 'active' },
                  { label: `Banned (${users.filter((u) => u.status === 'banned').length})`, filter: 'banned' },
                  { label: `Unverified (${users.filter((u) => !u.verified).length})`, filter: 'unverified' },
                ].map((chip) => (
                  <button key={chip.label} className="flex-shrink-0 px-3 py-1.5 card-glass rounded-xl text-xs font-semibold text-white/60">
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Export */}
              <button
                onClick={() => showToast('CSV export started')}
                className="flex items-center gap-2 text-white/50 text-xs mb-4 hover:text-white transition-colors"
              >
                <Download size={13} />
                Export CSV
              </button>

              {/* Table */}
              <div className="space-y-2">
                {filtered.map((user) => (
                  <div
                    key={user.id}
                    className="card-glass rounded-2xl p-4 flex items-center gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={`https://picsum.photos/seed/${user.seed}/80/80`}
                      alt={user.name}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white font-semibold text-sm truncate">{user.name}</span>
                        {user.verified && <UserCheck size={12} className="text-purple-400 flex-shrink-0" />}
                      </div>
                      <p className="text-white/40 text-xs truncate">{user.email}</p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${PLAN_BADGE[user.plan]}`}>{user.plan}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_BADGE[user.status]}`}>{user.status}</span>
                        {user.reports > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">{user.reports} reports</span>
                        )}
                      </div>
                    </div>
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setUserMenu(userMenu === user.id ? null : user.id); }}
                        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50"
                      >
                        <MoreVertical size={14} />
                      </button>
                      <AnimatePresence>
                        {userMenu === user.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute right-0 top-10 bg-brand-card border border-white/15 rounded-2xl overflow-hidden shadow-xl z-30 min-w-[170px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => { setSelectedUser(user); setUserMenu(null); }}
                              className="w-full flex items-center gap-2.5 px-4 py-3 text-white/80 hover:bg-white/5 text-sm transition-colors"
                            >
                              <Eye size={14} /> View Profile
                            </button>
                            {!user.verified && (
                              <button
                                onClick={() => verifyUser(user.id)}
                                className="w-full flex items-center gap-2.5 px-4 py-3 text-purple-300 hover:bg-purple-500/10 text-sm transition-colors"
                              >
                                <UserCheck size={14} /> Verify User
                              </button>
                            )}
                            {user.status !== 'banned' ? (
                              <button
                                onClick={() => banUser(user.id)}
                                className="w-full flex items-center gap-2.5 px-4 py-3 text-red-400 hover:bg-red-500/10 text-sm transition-colors"
                              >
                                <Ban size={14} /> Ban User
                              </button>
                            ) : (
                              <button
                                onClick={() => unbanUser(user.id)}
                                className="w-full flex items-center gap-2.5 px-4 py-3 text-green-400 hover:bg-green-500/10 text-sm transition-colors"
                              >
                                <Unlock size={14} /> Unban User
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Revenue ── */}
          {tab === 'revenue' && (
            <motion.div key="revenue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'MRR', value: '€48,320', sub: '↑ 12% vs last month', color: 'text-green-400' },
                  { label: 'ARR', value: '€579,840', sub: 'Annualized', color: 'text-blue-400' },
                  { label: 'Avg Revenue / User', value: '€4.93', sub: 'Per paying user', color: 'text-purple-400' },
                  { label: 'Churn Rate', value: '3.2%', sub: '↓ from 4.1%', color: 'text-yellow-400' },
                ].map((item) => (
                  <div key={item.label} className="card-glass rounded-2xl p-4">
                    <p className={`font-black text-2xl mb-1 ${item.color}`}>{item.value}</p>
                    <p className="text-white/60 text-xs font-semibold mb-1">{item.label}</p>
                    <p className="text-white/30 text-[10px]">{item.sub}</p>
                  </div>
                ))}
              </div>

              {/* Revenue breakdown */}
              <div className="card-glass rounded-3xl p-5 mb-6">
                <h3 className="text-white font-bold mb-4">Revenue Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Premium Subscriptions', value: '€28,100', pct: 58, color: 'bg-purple-500' },
                    { label: 'Platinum Subscriptions', value: '€14,200', pct: 29, color: 'bg-pink-500' },
                    { label: 'In-App Purchases', value: '€4,820', pct: 10, color: 'bg-yellow-500' },
                    { label: 'Boost & Spotlight', value: '€1,200', pct: 3, color: 'bg-blue-500' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/70">{item.label}</span>
                        <span className="text-white font-semibold">{item.value}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 0.6 }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top payers */}
              <div className="card-glass rounded-3xl p-5">
                <h3 className="text-white font-bold mb-4">Top Revenue Users</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Kai Hoffmann', plan: 'Platinum', spent: '€47.88/yr', seed: 'kai1' },
                    { name: 'Sophie Müller', plan: 'Platinum', spent: '€47.88/yr', seed: 'sophie1' },
                    { name: 'Tom Fischer', plan: 'Premium', spent: '€23.88/yr', seed: 'tom1' },
                    { name: 'Marcus Weber', plan: 'Premium', spent: '€23.88/yr', seed: 'marcus1' },
                  ].map((user, i) => (
                    <div key={user.name} className="flex items-center gap-3">
                      <span className="text-white/25 text-xs w-4 text-center">{i + 1}</span>
                      <img src={`https://picsum.photos/seed/${user.seed}/40/40`} className="w-9 h-9 rounded-xl object-cover" alt="" />
                      <div className="flex-1">
                        <p className="text-white text-sm font-semibold">{user.name}</p>
                        <p className="text-white/40 text-xs">{user.plan}</p>
                      </div>
                      <span className="text-green-400 text-xs font-bold">{user.spent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Settings ── */}
          {tab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="card-glass rounded-3xl overflow-hidden mb-6">
                {settings.map((item, i) => (
                  <div key={item.label} className={`flex items-center gap-4 px-5 py-4 ${i < settings.length - 1 ? 'border-b border-white/5' : ''}`}>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{item.label}</p>
                      <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleSetting(i)}
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

              {/* Danger zone */}
              <div className="card-glass rounded-3xl p-5 border border-red-500/20">
                <h3 className="text-red-400 font-bold mb-1 flex items-center gap-2">
                  <AlertTriangle size={16} /> Danger Zone
                </h3>
                <p className="text-white/40 text-xs mb-4">These actions are irreversible. Proceed with caution.</p>
                <div className="space-y-2">
                  {[
                    { label: 'Clear All Sessions', desc: 'Log out all users globally' },
                    { label: 'Reset Daily Match Queue', desc: 'Rebuild match suggestions' },
                    { label: 'Purge Deleted Users', desc: 'Permanently remove soft-deleted accounts' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => showToast(`${action.label} — requires 2FA confirmation`)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-red-500/20 hover:bg-red-500/5 transition-colors"
                    >
                      <div className="text-left">
                        <p className="text-red-400 text-sm font-semibold">{action.label}</p>
                        <p className="text-white/30 text-xs">{action.desc}</p>
                      </div>
                      <ChevronDown size={14} className="text-red-400/50 -rotate-90" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* User detail sheet */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-brand-card border border-white/10 rounded-t-3xl"
            >
              <div className="p-5 pb-10">
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
                <div className="flex items-center gap-4 mb-5">
                  <img src={`https://picsum.photos/seed/${selectedUser.seed}/120/120`} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-black text-lg">{selectedUser.name}</h3>
                      {selectedUser.verified && <UserCheck size={14} className="text-purple-400" />}
                    </div>
                    <p className="text-white/50 text-sm">{selectedUser.email}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PLAN_BADGE[selectedUser.plan]}`}>{selectedUser.plan}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_BADGE[selectedUser.status]}`}>{selectedUser.status}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Age', value: selectedUser.age },
                    { label: 'City', value: selectedUser.city },
                    { label: 'Reports', value: selectedUser.reports },
                  ].map((item) => (
                    <div key={item.label} className="card-glass rounded-2xl p-3 text-center">
                      <p className="text-white font-bold text-base">{item.value}</p>
                      <p className="text-white/40 text-xs">{item.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/30 text-xs mb-5">Joined {selectedUser.joined}</p>
                <div className="flex gap-2">
                  {!selectedUser.verified && (
                    <button onClick={() => { verifyUser(selectedUser.id); setSelectedUser(null); }}
                      className="flex-1 py-3 rounded-2xl bg-purple-500/20 text-purple-300 font-semibold text-sm flex items-center justify-center gap-2">
                      <UserCheck size={16} /> Verify
                    </button>
                  )}
                  {selectedUser.status !== 'banned' ? (
                    <button onClick={() => { banUser(selectedUser.id); setSelectedUser(null); }}
                      className="flex-1 py-3 rounded-2xl bg-red-500/20 text-red-400 font-semibold text-sm flex items-center justify-center gap-2">
                      <Ban size={16} /> Ban
                    </button>
                  ) : (
                    <button onClick={() => { unbanUser(selectedUser.id); setSelectedUser(null); }}
                      className="flex-1 py-3 rounded-2xl bg-green-500/20 text-green-400 font-semibold text-sm flex items-center justify-center gap-2">
                      <Unlock size={16} /> Unban
                    </button>
                  )}
                  <button onClick={() => setSelectedUser(null)}
                    className="flex-1 py-3 rounded-2xl card-glass text-white/60 font-semibold text-sm">
                    Close
                  </button>
                </div>
              </div>
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
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-brand-card border border-white/15 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

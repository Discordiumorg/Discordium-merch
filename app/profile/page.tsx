'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Camera,
  Edit3,
  Check,
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Ruler,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  Star,
  Eye,
  Heart,
  Crown,
  Tag,
  Users,
  Lock,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { currentUser, mockMatches, mockVisitors, goalColors, goalEmojis, RelationshipGoal } from '@/lib/mockData';

const allGoals: RelationshipGoal[] = ['casual', 'serious', 'friends+', 'open relationship', 'not sure yet'];
const allInterests = [
  'Photography', 'Travel', 'Coffee', 'Yoga', 'Music', 'Art', 'Hiking', 'Cooking',
  'Gaming', 'Tech', 'Movies', 'Dancing', 'Reading', 'Fitness', 'Sports', 'Wine',
  'Design', 'Cycling', 'Swimming', 'Languages', 'Meditation', 'Fashion',
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({ ...currentUser });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'settings'>('profile');
  const [privateAlbumMode, setPrivateAlbumMode] = useState<'matches' | 'approval'>('matches');
  const [photoRequests, setPhotoRequests] = useState([
    { id: 'req1', name: 'Sophie', photo: 'https://picsum.photos/seed/sophie1/200/200' },
    { id: 'req2', name: 'Marcus', photo: 'https://picsum.photos/seed/marcus1/200/200' },
  ]);

  const unreadMatches = mockMatches.filter((m) => m.unreadCount > 0).length;
  const newVisitors = mockVisitors.filter((v) => Date.now() - v.visitedAt.getTime() < 86400000).length;

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const saveEdit = () => {
    if (editingField) {
      setProfile((prev) => ({ ...prev, [editingField]: tempValue }));
      setEditingField(null);
      showSaved();
    }
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleInterest = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
    showSaved();
  };

  const handleGoalChange = (goal: RelationshipGoal) => {
    setProfile((prev) => ({ ...prev, relationshipGoal: goal }));
    showSaved();
  };

  const stats = [
    { label: 'Profile Views', value: profile.profileViews, icon: Eye, color: 'text-blue-400' },
    { label: 'Matches', value: mockMatches.length, icon: Heart, color: 'text-red-400' },
    { label: 'Super Likes', value: 7, icon: Star, color: 'text-yellow-400' },
  ];

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { icon: Shield, label: 'Privacy settings', action: () => {} },
        { icon: Bell, label: 'Notifications', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', action: () => {} },
      ],
    },
    {
      title: '',
      items: [
        { icon: LogOut, label: 'Sign out', action: () => router.push('/'), danger: true },
      ],
    },
  ];
  void settingsGroups;

  return (
    <div className="min-h-screen bg-brand-dark pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-white font-black text-xl">My Profile</h1>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1 text-green-400 text-xs font-medium"
                >
                  <Check size={14} />
                  Saved
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {(['profile', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeSection === tab
                  ? 'gradient-brand text-white shadow-lg'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab === 'profile' ? '👤 Profile' : '⚙️ Settings'}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-28">
        <AnimatePresence mode="wait">
          {activeSection === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-5 py-5 space-y-5"
            >
              {/* Profile photo section */}
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <img
                    src={profile.photos[0]}
                    alt={profile.name}
                    className="w-28 h-28 rounded-3xl object-cover border-4 border-purple-500/50 shadow-2xl"
                  />
                  <button className="absolute bottom-0 right-0 w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
                    <Camera size={16} className="text-white" />
                  </button>
                  {profile.verified && (
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-brand-dark">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>

                <h2 className="text-white text-2xl font-black">
                  {profile.name}, {profile.age}
                </h2>
                <div className="flex items-center gap-1.5 text-white/60 text-sm mt-1">
                  <MapPin size={14} />
                  {profile.location}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card-glass rounded-2xl p-3 text-center"
                  >
                    <stat.icon size={18} className={`${stat.color} mx-auto mb-1`} />
                    <p className="text-white font-bold text-lg">{stat.value}</p>
                    <p className="text-white/40 text-[10px]">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Profile Completeness Meter */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="card-glass rounded-2xl p-4"
              >
                <div className="flex items-center gap-4">
                  {/* SVG circular progress */}
                  <div className="flex-shrink-0 relative w-20 h-20">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                      <circle
                        cx="40" cy="40" r="32"
                        fill="none"
                        stroke="url(#progressGrad)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 32 * 0.68} ${2 * Math.PI * 32}`}
                      />
                      <defs>
                        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-black text-base">68%</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-sm mb-0.5">Profile Strength</h3>
                    <p className="text-white/50 text-xs mb-2">Complete your profile to get 3x more matches</p>
                    <div className="space-y-1">
                      {[
                        { label: 'Profile photo', done: true },
                        { label: 'Bio written', done: true },
                        { label: 'Age & location', done: true },
                        { label: 'Add more photos (need 3+)', done: profile.photos.length >= 3 },
                        { label: 'Interests selected', done: profile.interests.length > 0 },
                        { label: 'Verify profile', done: profile.verified },
                        { label: 'Connect Instagram', done: !!(profile.socialLinks?.instagram) },
                        { label: 'Relationship goal set', done: !!profile.relationshipGoal },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <span className={`text-xs flex-shrink-0 ${item.done ? 'text-green-400' : 'text-red-400'}`}>
                            {item.done ? '✅' : '❌'}
                          </span>
                          <span className={`text-xs ${item.done ? 'text-white/60' : 'text-white/80'}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Verification card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="card-glass rounded-2xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,rgba(147,51,234,0.3),rgba(244,63,142,0.3))', border: '1px solid rgba(196,132,252,0.3)' }}>
                      <Shield size={18} style={{ color: '#c084fc' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-white font-bold text-sm">Unverified</p>
                        <span className="text-white/30 text-xs">○</span>
                      </div>
                      <p className="text-white/45 text-xs">Complete steps to get your badge</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/verify')}
                    className="text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                    style={{ background: 'rgba(147,51,234,0.2)', color: '#c084fc', border: '1px solid rgba(196,132,252,0.3)' }}
                  >
                    Verify ✦
                  </button>
                </div>
                <div className="mt-3 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full w-[38%]"
                    style={{ background: 'linear-gradient(90deg,#7c3aed,#f43f8e)' }} />
                </div>
                <p className="text-white/30 text-xs mt-1.5">38 / 100 — Basic verification needs 40 pts</p>
              </motion.div>

              {/* Premium status card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="gradient-brand rounded-2xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Crown size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">Free Plan</p>
                      <p className="text-white/70 text-xs">Upgrade for unlimited features</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/premium')}
                    className="bg-white text-purple-700 text-xs font-black px-3 py-2 rounded-xl hover:bg-white/90 transition-colors"
                  >
                    Upgrade ✨
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Likes/day', free: '15', premium: '∞' },
                    { label: 'Visitors', free: '3', premium: 'All' },
                    { label: 'Rewinds', free: '0', premium: '∞' },
                  ].map((row) => (
                    <div key={row.label} className="bg-white/10 rounded-xl py-2 px-1">
                      <p className="text-white/50 text-[9px] mb-1">{row.label}</p>
                      <p className="text-white/40 text-[10px] line-through">{row.free}</p>
                      <p className="text-white font-bold text-sm">{row.premium}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick shop links */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-3"
              >
                <button
                  onClick={() => router.push('/shop')}
                  className="card-glass rounded-2xl p-4 flex items-center gap-3 hover:border-purple-500/40 border border-transparent transition-colors"
                >
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    ⚡
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">Boost</p>
                    <p className="text-white/50 text-xs">10x more views</p>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/shop')}
                  className="card-glass rounded-2xl p-4 flex items-center gap-3 hover:border-blue-500/40 border border-transparent transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    🌟
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">Super Likes</p>
                    <p className="text-white/50 text-xs">Stand out instantly</p>
                  </div>
                </button>
              </motion.div>

              {/* Visitors shortcut */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                onClick={() => router.push('/visitors')}
                className="w-full card-glass rounded-2xl p-4 flex items-center gap-4 hover:border-purple-500/30 border border-transparent transition-colors"
              >
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye size={18} className="text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-bold text-sm">Profile Visitors</p>
                  <p className="text-white/50 text-xs">See who checked out your profile</p>
                </div>
                <ChevronRight size={16} className="text-white/30" />
              </motion.button>

              {/* Invite Friends shortcut */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => router.push('/invite')}
                className="w-full card-glass rounded-2xl p-4 flex items-center gap-4 hover:border-purple-500/30 border border-transparent transition-colors"
              >
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users size={18} className="text-yellow-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-bold text-sm">Invite Friends</p>
                  <p className="text-white/50 text-xs">Earn 200 coins per referral</p>
                </div>
                <ChevronRight size={16} className="text-white/30" />
              </motion.button>

              {/* Photos grid */}
              <div className="card-glass rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Camera size={16} className="text-purple-400" />
                  My Photos
                  <span className="text-white/40 text-sm font-normal">({profile.photos.length}/6)</span>
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {profile.photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                      <img
                        src={photo}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <div className="absolute top-1 left-1 bg-purple-500/80 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          Main
                        </div>
                      )}
                      <button className="absolute top-1 right-1 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={10} className="text-red-400" />
                      </button>
                    </div>
                  ))}
                  {profile.photos.length < 6 && (
                    <button className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1.5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors">
                      <Plus size={20} className="text-white/40" />
                      <span className="text-white/30 text-[10px]">Add photo</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Private Album */}
              <div className="card-glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Lock size={15} className="text-purple-400" />
                    Private Album
                  </h3>
                  {photoRequests.length > 0 && (
                    <span className="bg-pink-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      {photoRequests.length} pending
                    </span>
                  )}
                </div>

                <p className="text-white/40 text-xs mb-3">Private photos are only shared when you approve</p>

                {/* Visibility toggle */}
                <div className="flex gap-2 mb-4">
                  {(['matches', 'approval'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPrivateAlbumMode(mode)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
                        privateAlbumMode === mode
                          ? 'gradient-brand text-white'
                          : 'bg-white/5 text-white/50 border border-white/10'
                      }`}
                    >
                      {mode === 'matches' ? '🔒 Matches only' : '✋ Requires approval'}
                    </button>
                  ))}
                </div>

                {/* Locked photo thumbnails */}
                <div className="flex gap-3 mb-4">
                  {[
                    'https://picsum.photos/seed/private1/200/200',
                    'https://picsum.photos/seed/private2/200/200',
                  ].map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={src} alt="Private" className="w-full h-full object-cover blur-md scale-110" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Lock size={20} className="text-white" />
                      </div>
                    </div>
                  ))}
                  <button className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 hover:border-purple-500/50 transition-colors flex-shrink-0">
                    <Plus size={16} className="text-white/40" />
                    <span className="text-white/30 text-[9px]">Add</span>
                  </button>
                </div>

                {/* Pending requests */}
                {photoRequests.length > 0 && (
                  <div>
                    <p className="text-white/50 text-xs font-semibold mb-2">Pending requests</p>
                    <div className="space-y-2">
                      {photoRequests.map((req) => (
                        <div key={req.id} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
                          <img src={req.photo} alt={req.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                          <span className="text-white/80 text-sm flex-1">{req.name}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setPhotoRequests((prev) => prev.filter((r) => r.id !== req.id))}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg gradient-brand text-white"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setPhotoRequests((prev) => prev.filter((r) => r.id !== req.id))}
                              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white/10 text-white/60"
                            >
                              Deny
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="card-glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Edit3 size={15} className="text-purple-400" />
                    About Me
                  </h3>
                  <button
                    onClick={() => startEdit('bio', profile.bio)}
                    className="text-purple-400 text-xs hover:text-purple-300"
                  >
                    Edit
                  </button>
                </div>

                {editingField === 'bio' ? (
                  <div>
                    <textarea
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full bg-white/10 border border-purple-500/50 rounded-xl px-3 py-2.5 text-white text-sm resize-none focus:outline-none leading-relaxed"
                      rows={4}
                      maxLength={300}
                      autoFocus
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white/30 text-xs">{tempValue.length}/300</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingField(null)}
                          className="p-1.5 rounded-lg bg-white/10 text-white/60 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                        <button
                          onClick={saveEdit}
                          className="p-1.5 rounded-lg gradient-brand text-white"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/70 text-sm leading-relaxed">{profile.bio}</p>
                )}
              </div>

              {/* Relationship goal */}
              <div className="card-glass rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Heart size={15} className="text-pink-400" />
                  Looking For
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allGoals.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => handleGoalChange(goal)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                        profile.relationshipGoal === goal
                          ? goalColors[goal] + ' scale-105'
                          : 'bg-white/5 border-white/15 text-white/50 hover:text-white/80'
                      }`}
                    >
                      <span>{goalEmojis[goal]}</span>
                      {goal.charAt(0).toUpperCase() + goal.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic info */}
              <div className="card-glass rounded-2xl p-4 space-y-3">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <MapPin size={15} className="text-purple-400" />
                  Basic Info
                </h3>

                {[
                  { field: 'job', icon: Briefcase, label: 'Job', value: profile.job || '' },
                  { field: 'education', icon: GraduationCap, label: 'Education', value: profile.education || '' },
                  { field: 'height', icon: Ruler, label: 'Height', value: profile.height || '' },
                ].map((item) => (
                  <div key={item.field} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-surface rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon size={15} className="text-white/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingField === item.field ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="flex-1 bg-white/10 border border-purple-500/50 rounded-lg px-2.5 py-1.5 text-white text-sm focus:outline-none"
                            autoFocus
                          />
                          <button onClick={() => setEditingField(null)} className="text-white/40 hover:text-white/70">
                            <X size={14} />
                          </button>
                          <button onClick={saveEdit} className="text-green-400 hover:text-green-300">
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider">{item.label}</p>
                            <p className="text-white/80 text-sm">
                              {item.value || <span className="text-white/30 italic">Not set</span>}
                            </p>
                          </div>
                          <button
                            onClick={() => startEdit(item.field, item.value)}
                            className="text-purple-400/60 hover:text-purple-400 ml-2"
                          >
                            <Edit3 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interests */}
              <div className="card-glass rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Star size={15} className="text-yellow-400" />
                  Interests
                  <span className="text-white/40 text-xs font-normal">({profile.interests.length} selected)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map((interest) => {
                    const isSelected = profile.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'gradient-brand text-white border-transparent shadow-sm'
                            : 'bg-white/5 border-white/15 text-white/50 hover:text-white/80 hover:border-white/30'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Premium upgrade card */}
              <div className="gradient-brand rounded-2xl p-5 shadow-2xl glow-purple">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={18} className="text-yellow-300" fill="currentColor" />
                      <span className="text-white font-black">Go Premium</span>
                    </div>
                    <p className="text-white/80 text-xs leading-relaxed">
                      Unlock unlimited likes, see who liked you, and get priority placement.
                    </p>
                  </div>
                </div>
                <button className="mt-4 w-full bg-white text-purple-700 font-black py-3 rounded-xl hover:bg-white/90 transition-colors">
                  Upgrade Now ✨
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-5 py-5 space-y-4"
            >
              {/* Open full settings page */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/settings')}
                className="w-full card-glass rounded-2xl p-5 flex items-center gap-4 hover:border-purple-500/30 border border-transparent transition-colors"
              >
                <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⚙️</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-bold">Einstellungen öffnen</p>
                  <p className="text-white/50 text-xs mt-0.5">Konto, Entdeckung, Datenschutz, Sprache &amp; mehr</p>
                </div>
                <ChevronRight size={18} className="text-white/30" />
              </motion.button>

              {/* Quick shortcuts */}
              <div className="card-glass rounded-2xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/10">
                  <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Schnellzugriff</p>
                </div>
                {[
                  { icon: Shield, label: 'Datenschutz', path: '/settings', raw: false },
                  { icon: Bell, label: 'Benachrichtigungen', path: '/settings', raw: false },
                  { icon: Tag, label: 'Deals & Coupons', path: '/discounts', raw: false },
                  { icon: HelpCircle, label: 'Hilfe &amp; FAQ', path: '/settings', raw: true },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors ${
                      i < 3 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-brand-surface">
                      <item.icon size={18} className="text-white/60" />
                    </div>
                    {item.raw ? (
                      <span className="flex-1 text-sm font-medium text-white/80 text-left"
                        dangerouslySetInnerHTML={{ __html: item.label }}
                      />
                    ) : (
                      <span className="flex-1 text-sm font-medium text-white/80 text-left">{item.label}</span>
                    )}
                    <ChevronRight size={16} className="text-white/30" />
                  </button>
                ))}
              </div>

              {/* Sign out */}
              <div className="card-glass rounded-2xl overflow-hidden">
                <button
                  onClick={() => router.push('/')}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-red-500/5 transition-colors"
                >
                  <div className="w-9 h-9 bg-red-500/10 rounded-xl flex items-center justify-center">
                    <LogOut size={18} className="text-red-400" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-red-400 text-left">Abmelden</span>
                </button>
              </div>

              {/* App info */}
              <div className="text-center py-2">
                <p className="text-white/20 text-xs">Aura v1.0.0</p>
                <p className="text-white/20 text-[10px] mt-1">Made with ❤️ for real connections</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav matchCount={unreadMatches} visitorCount={newVisitors} />
    </div>
  );
}

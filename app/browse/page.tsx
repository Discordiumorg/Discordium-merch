'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Star,
  ChevronDown,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import ProfileCard from '@/components/ProfileCard';
import { mockUsers, mockMatches, mockVisitors, goalColors, goalEmojis, RelationshipGoal } from '@/lib/mockData';

type SortBy = 'distance' | 'newest' | 'popular';

interface Filters {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  goals: RelationshipGoal[];
  gender: string[];
  onlineOnly: boolean;
}

const defaultFilters: Filters = {
  minAge: 18,
  maxAge: 50,
  maxDistance: 50,
  goals: [],
  gender: [],
  onlineOnly: false,
};

const allGoals: RelationshipGoal[] = ['casual', 'serious', 'friends+', 'open relationship', 'not sure yet'];
const genderOptions = ['male', 'female', 'non-binary', 'other'];

export default function BrowsePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [activeFilters, setActiveFilters] = useState<Filters>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortBy>('distance');
  const [likedUsers, setLikedUsers] = useState<Set<string>>(new Set());

  const unreadMatches = mockMatches.filter((m) => m.unreadCount > 0).length;
  const newVisitors = mockVisitors.filter((v) => Date.now() - v.visitedAt.getTime() < 86400000).length;

  const filteredUsers = useMemo(() => {
    let users = mockUsers.filter((u) => {
      if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (u.age < activeFilters.minAge || u.age > activeFilters.maxAge) return false;
      if (u.distance > activeFilters.maxDistance) return false;
      if (activeFilters.goals.length > 0 && !activeFilters.goals.includes(u.relationshipGoal)) return false;
      if (activeFilters.gender.length > 0 && !activeFilters.gender.includes(u.gender)) return false;
      if (activeFilters.onlineOnly && !u.online) return false;
      return true;
    });

    if (sortBy === 'distance') {
      users = users.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'popular') {
      users = users.sort((a, b) => b.profileViews - a.profileViews);
    }

    return users;
  }, [searchQuery, activeFilters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.minAge !== 18 || activeFilters.maxAge !== 50) count++;
    if (activeFilters.maxDistance !== 50) count++;
    if (activeFilters.goals.length > 0) count++;
    if (activeFilters.gender.length > 0) count++;
    if (activeFilters.onlineOnly) count++;
    return count;
  }, [activeFilters]);

  const applyFilters = () => {
    setActiveFilters({ ...filters });
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setActiveFilters(defaultFilters);
  };

  const toggleGoal = (goal: RelationshipGoal) => {
    setFilters((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const toggleGender = (gender: string) => {
    setFilters((prev) => ({
      ...prev,
      gender: prev.gender.includes(gender)
        ? prev.gender.filter((g) => g !== gender)
        : [...prev.gender, gender],
    }));
  };

  const handleLike = (userId: string) => {
    setLikedUsers((prev) => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white font-black text-xl">Browse</h1>
          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="appearance-none bg-white/10 border border-white/20 text-white text-xs font-medium px-3 py-2 pr-7 rounded-xl focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="distance" className="bg-brand-card">Nearest</option>
                <option value="newest" className="bg-brand-card">Newest</option>
                <option value="popular" className="bg-brand-card">Popular</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            </div>

            {/* Filter button */}
            <button
              onClick={() => { setFilters(activeFilters); setShowFilters(true); }}
              className={`relative flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
                activeFilterCount > 0
                  ? 'gradient-brand text-white'
                  : 'bg-white/10 border border-white/20 text-white/70'
              }`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 bg-white text-purple-700 text-[9px] font-black rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
            className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {activeFilters.goals.map((goal) => (
              <span
                key={goal}
                className={`flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${goalColors[goal]}`}
              >
                {goalEmojis[goal]} {goal}
              </span>
            ))}
            {activeFilters.onlineOnly && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                🟢 Online
              </span>
            )}
            {(activeFilters.minAge !== 18 || activeFilters.maxAge !== 50) && (
              <span className="flex-shrink-0 inline-flex items-center text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activeFilters.minAge}–{activeFilters.maxAge}y
              </span>
            )}
            <button
              onClick={resetFilters}
              className="flex-shrink-0 text-[10px] text-white/50 hover:text-white/80 px-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="px-5 py-3">
        <p className="text-white/40 text-xs">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} nearby
        </p>
      </div>

      {/* Grid */}
      <div className="px-4 pb-28">
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredUsers.map((user, i) => (
              <ProfileCard
                key={user.id}
                user={user}
                index={i}
                onClick={() => {}}
                onLike={() => handleLike(user.id)}
                onSuperLike={() => {}}
                isMatched={mockMatches.some((m) => m.user.id === user.id)}
                onMessage={() => router.push('/matches')}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-white/60 font-medium">No profiles match your filters</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-purple-400 text-sm font-semibold hover:text-purple-300"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <BottomNav matchCount={unreadMatches} visitorCount={newVisitors} />

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-brand-card rounded-t-3xl z-50 overflow-hidden"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              <div className="px-5 pb-6 overflow-y-auto max-h-[80vh]">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-bold text-lg">Filters</h2>
                  <button
                    onClick={resetFilters}
                    className="text-purple-400 text-sm font-semibold hover:text-purple-300"
                  >
                    Reset
                  </button>
                </div>

                {/* Age range */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-sm">Age Range</h3>
                    <span className="text-purple-400 text-sm font-medium">
                      {filters.minAge} – {filters.maxAge}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-white/50 text-xs mb-1 block">Minimum age</label>
                      <input
                        type="range"
                        min="18"
                        max={filters.maxAge - 1}
                        value={filters.minAge}
                        onChange={(e) => setFilters((p) => ({ ...p, minAge: parseInt(e.target.value) }))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-xs mb-1 block">Maximum age</label>
                      <input
                        type="range"
                        min={filters.minAge + 1}
                        max="80"
                        value={filters.maxAge}
                        onChange={(e) => setFilters((p) => ({ ...p, maxAge: parseInt(e.target.value) }))}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Distance */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                      <MapPin size={14} className="text-purple-400" />
                      Max Distance
                    </h3>
                    <span className="text-purple-400 text-sm font-medium">{filters.maxDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={filters.maxDistance}
                    onChange={(e) => setFilters((p) => ({ ...p, maxDistance: parseInt(e.target.value) }))}
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Looking for */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold text-sm mb-3">Looking For</h3>
                  <div className="flex flex-wrap gap-2">
                    {allGoals.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
                          filters.goals.includes(goal)
                            ? goalColors[goal] + ' border-current'
                            : 'bg-white/5 border-white/15 text-white/60'
                        }`}
                      >
                        <span>{goalEmojis[goal]}</span>
                        {goal.charAt(0).toUpperCase() + goal.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold text-sm mb-3">Show Me</h3>
                  <div className="flex flex-wrap gap-2">
                    {genderOptions.map((gender) => (
                      <button
                        key={gender}
                        onClick={() => toggleGender(gender)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-colors capitalize ${
                          filters.gender.includes(gender)
                            ? 'gradient-brand text-white border-transparent'
                            : 'bg-white/5 border-white/15 text-white/60 hover:border-white/30'
                        }`}
                      >
                        {gender === 'male' ? 'Men' : gender === 'female' ? 'Women' : gender}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Online only */}
                <div className="mb-6">
                  <div className="flex items-center justify-between py-3 border-t border-white/10">
                    <div>
                      <h3 className="text-white font-semibold text-sm">Online Now Only</h3>
                      <p className="text-white/40 text-xs mt-0.5">Show only currently active users</p>
                    </div>
                    <button
                      onClick={() => setFilters((p) => ({ ...p, onlineOnly: !p.onlineOnly }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        filters.onlineOnly ? 'bg-purple-600' : 'bg-white/20'
                      }`}
                    >
                      <motion.div
                        animate={{ x: filters.onlineOnly ? 24 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                      />
                    </button>
                  </div>
                </div>

                <button
                  onClick={applyFilters}
                  className="w-full gradient-brand text-white font-bold py-4 rounded-2xl glow-purple hover:opacity-90 transition-opacity"
                >
                  Show {filteredUsers.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

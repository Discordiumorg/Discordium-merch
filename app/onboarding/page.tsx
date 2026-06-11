'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Check, MapPin, User } from 'lucide-react';

const TOTAL_STEPS = 6;

const INTERESTS = [
  'Travel', 'Photography', 'Coffee', 'Yoga', 'Music', 'Cooking', 'Hiking', 'Gaming',
  'Reading', 'Art', 'Dancing', 'Fitness', 'Movies', 'Wine', 'Cycling', 'Fashion',
  'Tech', 'Meditation', 'Surfing', 'Climbing', 'Concerts', 'Dogs', 'Cats', 'Design',
  'Podcasts', 'Running', 'Sushi', 'Tattoos', 'Astrology', 'Board Games',
];

const GOALS = [
  { id: 'serious', label: 'Serious relationship', emoji: '💍' },
  { id: 'casual', label: 'Casual dating', emoji: '🔥' },
  { id: 'friends+', label: 'Friends first', emoji: '✨' },
  { id: 'open relationship', label: 'Open relationship', emoji: '🌈' },
  { id: 'not sure yet', label: 'Not sure yet', emoji: '🤔' },
];

const GENDERS = ['Man', 'Woman', 'Non-binary', 'Other'];
const INTERESTED_IN = ['Men', 'Women', 'Everyone', 'Non-binary'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [finishing, setFinishing] = useState(false);

  // Step 2 – Photos
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null, null]);

  // Step 3 – About you
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');

  // Step 4 – Bio & Interests
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Step 5 – Goals
  const [goal, setGoal] = useState('');

  // Step 6 – Preferences
  const [interestedIn, setInterestedIn] = useState('');
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(40);
  const [maxDist, setMaxDist] = useState(25);

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const toggleInterest = (i: string) => {
    setSelectedInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const canProceed = () => {
    if (step === 2) return photos.filter(Boolean).length >= 1;
    if (step === 3) return name.trim() && age && gender && location.trim();
    if (step === 4) return selectedInterests.length >= 3;
    if (step === 5) return !!goal;
    if (step === 6) return !!interestedIn;
    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className="w-28 h-28 rounded-3xl gradient-brand flex items-center justify-center mb-8 glow-button"
            >
              <span className="text-5xl">✦</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold gradient-text mb-4"
              style={{ fontFamily: 'Syne, Inter, sans-serif' }}
            >
              Welcome to Aura ✦
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-white/60 text-base leading-relaxed max-w-xs"
            >
              Where real connections spark. Let&apos;s build your profile and find someone worth meeting.
            </motion.p>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col flex-1 px-4">
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
              Add your best photos 📸
            </h2>
            <p className="text-white/50 text-sm mb-6">At least 1 photo required. More photos = more matches!</p>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const seeds = ['photo1', 'photo2', 'photo3', 'photo4', 'photo5', 'photo6'];
                    const newPhotos = [...photos];
                    newPhotos[i] = p ? null : `https://picsum.photos/seed/${seeds[i]}/300/400`;
                    setPhotos(newPhotos);
                  }}
                  className="aspect-square rounded-2xl flex items-center justify-center overflow-hidden relative"
                  style={{
                    background: p ? 'transparent' : 'rgba(28,22,53,0.8)',
                    border: p ? 'none' : '2px dashed rgba(147,51,234,0.3)',
                  }}
                >
                  {p ? (
                    <>
                      <img src={p} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        style={{ background: 'rgba(0,0,0,0.4)' }}>
                        <span className="text-white text-xs">Remove</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Plus size={24} className="text-purple-500" />
                      {i === 0 && <span className="text-xs text-white/30">Main</span>}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col flex-1 px-4 space-y-4">
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
              About you 👤
            </h2>
            <p className="text-white/50 text-sm mb-2">Tell us the basics to find your best matches.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/50 font-medium mb-1 block uppercase tracking-wider">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your first name"
                  className="w-full rounded-2xl px-4 py-3.5 text-white placeholder:text-white/30 text-sm"
                  style={{ background: 'rgba(28,22,53,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
              <div>
                <label className="text-xs text-white/50 font-medium mb-1 block uppercase tracking-wider">Age</label>
                <input
                  type="number"
                  min={18} max={99}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  className="w-full rounded-2xl px-4 py-3.5 text-white placeholder:text-white/30 text-sm"
                  style={{ background: 'rgba(28,22,53,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
              <div>
                <label className="text-xs text-white/50 font-medium mb-1 block uppercase tracking-wider">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className="py-3 rounded-2xl text-sm font-medium transition-all"
                      style={{
                        background: gender === g ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(244,63,142,0.4))' : 'rgba(28,22,53,0.8)',
                        border: gender === g ? '1.5px solid rgba(196,132,252,0.5)' : '1.5px solid rgba(255,255,255,0.07)',
                        color: gender === g ? 'white' : 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/50 font-medium mb-1 block uppercase tracking-wider">Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Your city"
                    className="w-full rounded-2xl pl-10 pr-4 py-3.5 text-white placeholder:text-white/30 text-sm"
                    style={{ background: 'rgba(28,22,53,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col flex-1 px-4">
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
              Bio & Interests 💬
            </h2>
            <p className="text-white/50 text-sm mb-4">Select at least 3 interests.</p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short bio about yourself… (optional)"
              rows={3}
              className="w-full rounded-2xl p-4 text-white text-sm placeholder:text-white/30 resize-none mb-4"
              style={{ background: 'rgba(28,22,53,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <div className="flex flex-wrap gap-2 overflow-y-auto no-scrollbar" style={{ maxHeight: 220 }}>
              {INTERESTS.map((interest) => {
                const isSel = selectedInterests.includes(interest);
                return (
                  <motion.button
                    key={interest}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => toggleInterest(interest)}
                    className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5"
                    style={{
                      background: isSel ? 'linear-gradient(135deg, #7c3aed, #f43f8e)' : 'rgba(28,22,53,0.8)',
                      border: isSel ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      color: isSel ? 'white' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {isSel && <Check size={12} />}
                    {interest}
                  </motion.button>
                );
              })}
            </div>
            {selectedInterests.length > 0 && (
              <p className="text-xs text-purple-400 mt-2">{selectedInterests.length} selected</p>
            )}
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col flex-1 px-4">
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
              Your Goals 🎯
            </h2>
            <p className="text-white/50 text-sm mb-6">What are you looking for right now?</p>
            <div className="space-y-3">
              {GOALS.map((g) => (
                <motion.button
                  key={g.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setGoal(g.id)}
                  className="w-full p-4 rounded-2xl flex items-center gap-4 transition-all"
                  style={{
                    background: goal === g.id ? 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(244,63,142,0.35))' : 'rgba(28,22,53,0.8)',
                    border: goal === g.id ? '1.5px solid rgba(196,132,252,0.5)' : '1.5px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <span className="text-base font-medium text-white">{g.label}</span>
                  {goal === g.id && (
                    <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center gradient-brand">
                      <Check size={13} className="text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="flex flex-col flex-1 px-4 space-y-5">
            <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Syne, Inter, sans-serif' }}>
              Your Preferences ⚙️
            </h2>
            <div>
              <label className="text-xs text-white/50 font-medium mb-2 block uppercase tracking-wider">
                Interested in
              </label>
              <div className="grid grid-cols-2 gap-2">
                {INTERESTED_IN.map((g) => (
                  <button
                    key={g}
                    onClick={() => setInterestedIn(g)}
                    className="py-3 rounded-2xl text-sm font-medium"
                    style={{
                      background: interestedIn === g ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(244,63,142,0.4))' : 'rgba(28,22,53,0.8)',
                      border: interestedIn === g ? '1.5px solid rgba(196,132,252,0.5)' : '1.5px solid rgba(255,255,255,0.07)',
                      color: interestedIn === g ? 'white' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 font-medium mb-2 block uppercase tracking-wider">
                Age Range: {ageMin} – {ageMax}
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40 w-6">Min</span>
                  <input
                    type="range" min={18} max={65} value={ageMin}
                    onChange={(e) => setAgeMin(Number(e.target.value))}
                    className="flex-1 accent-purple-500"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40 w-6">Max</span>
                  <input
                    type="range" min={18} max={65} value={ageMax}
                    onChange={(e) => setAgeMax(Number(e.target.value))}
                    className="flex-1 accent-purple-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 font-medium mb-2 block uppercase tracking-wider">
                Max Distance: {maxDist} km
              </label>
              <input
                type="range" min={1} max={200} value={maxDist}
                onChange={(e) => setMaxDist(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>1 km</span>
                <span>200 km</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col max-w-md mx-auto" style={{ paddingBottom: 24 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button
          onClick={step > 1 ? goBack : undefined}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${step <= 1 ? 'opacity-0 pointer-events-none' : ''}`}
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <ChevronLeft size={20} className="text-white/70" />
        </button>
        <span className="text-sm font-medium text-white/50">Step {step} of {TOTAL_STEPS}</span>
        {step < TOTAL_STEPS && step > 1 ? (
          <button onClick={goNext} className="text-sm text-white/40 font-medium">Skip</button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* Animated step content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 60 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-4"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 py-3">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i + 1 === step ? [1, 1.3, 1] : 1,
            }}
            transition={{ repeat: i + 1 === step ? Infinity : 0, duration: 1.5 }}
            className="rounded-full"
            style={{
              width: i + 1 === step ? 20 : 8,
              height: 8,
              background: i + 1 < step
                ? 'linear-gradient(135deg, #7c3aed, #f43f8e)'
                : i + 1 === step
                ? 'linear-gradient(135deg, #a855f7, #f43f8e)'
                : 'rgba(255,255,255,0.12)',
              transition: 'width 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Next / Finish button */}
      <div className="px-4 pb-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={step < TOTAL_STEPS ? goNext : async () => {
            setFinishing(true);
            try {
              await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: name.trim(),
                  age: parseInt(age) || undefined,
                  gender,
                  location: location.trim(),
                  bio: bio.trim() || undefined,
                  interests: JSON.stringify(selectedInterests),
                  goal,
                  interestedIn,
                  onboarded: true,
                }),
              });
            } catch { /* ignore — we navigate anyway */ }
            router.push('/dashboard');
          }}
          disabled={!canProceed() || finishing}
          className="w-full py-4 rounded-2xl font-bold text-white gradient-brand glow-button disabled:opacity-40 text-base"
        >
          {finishing ? '⏳ Saving…' : step < TOTAL_STEPS ? 'Continue →' : 'Finish Setup ✦'}
        </motion.button>
      </div>
    </div>
  );
}

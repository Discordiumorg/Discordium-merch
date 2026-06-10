'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, RotateCcw } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { personalityTypes, quizQuestions, PersonalityType } from '@/lib/personalityData';

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = question index
  const [selected, setSelected] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState(1);
  const [result, setResult] = useState<PersonalityType | null>(null);
  const [saved, setSaved] = useState(false);

  const question = quizQuestions[step];
  const totalQ = quizQuestions.length;
  const progress = ((step + (selected ? 1 : 0)) / totalQ) * 100;

  const handleSelect = (optionTypes: string[]) => {
    setSelected(optionTypes.join(','));
  };

  const handleNext = () => {
    if (!selected) return;
    const types = selected.split(',');
    const newScores = { ...scores };
    types.forEach((t) => {
      newScores[t] = (newScores[t] || 0) + 1;
    });
    setScores(newScores);
    setSelected(null);
    setDirection(1);

    if (step < totalQ - 1) {
      setStep((s) => s + 1);
    } else {
      // Calculate winner
      const winner = personalityTypes.reduce(
        (best, pt) =>
          (newScores[pt.id] || 0) > (newScores[best.id] || 0) ? pt : best,
        personalityTypes[0]
      );
      setResult(winner);
    }
  };

  const handleRetake = () => {
    setStep(0);
    setSelected(null);
    setScores({});
    setDirection(1);
    setResult(null);
    setSaved(false);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-brand-dark pb-safe flex flex-col max-w-md mx-auto">
        <div
          className="flex-1 overflow-y-auto no-scrollbar px-5 pt-14 pb-6"
        >
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="mb-6 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <ChevronLeft size={20} className="text-white/70" />
          </button>

          {/* Emoji */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 14 }}
            className="flex justify-center mb-4"
          >
            <div
              className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl"
              style={{
                background: `linear-gradient(135deg, ${result.gradient[0]}, ${result.gradient[1]})`,
                boxShadow: `0 8px 32px ${result.color}60`,
              }}
            >
              {result.emoji}
            </div>
          </motion.div>

          {/* Name */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-3xl font-bold text-center gradient-text mb-1"
            style={{ fontFamily: 'Syne, Inter, sans-serif' }}
          >
            {result.name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center text-white/50 text-sm mb-4 italic"
          >
            &ldquo;{result.tagline}&rdquo;
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-white/70 text-sm text-center leading-relaxed mb-6 px-2"
          >
            {result.description}
          </motion.p>

          {/* Strengths */}
          <div className="card-glass rounded-2xl p-4 mb-4">
            <h3 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">Your Strengths</h3>
            <div className="space-y-2">
              {result.strengths.map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${result.color}30`, border: `1px solid ${result.color}` }}
                  >
                    <Check size={11} style={{ color: result.color }} />
                  </div>
                  <span className="text-sm text-white/80">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compatible with */}
          <div className="card-glass rounded-2xl p-4 mb-6">
            <h3 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">Compatible With</h3>
            <div className="flex flex-wrap gap-2">
              {result.compatibleWith.map((id) => {
                const pt = personalityTypes.find((t) => t.id === id);
                if (!pt) return null;
                return (
                  <span
                    key={id}
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      background: `${pt.color}20`,
                      border: `1px solid ${pt.color}50`,
                      color: pt.color,
                    }}
                  >
                    {pt.emoji} {pt.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setSaved(true)}
            className="w-full py-4 rounded-2xl font-semibold text-white gradient-brand glow-button mb-3 flex items-center justify-center gap-2"
          >
            {saved ? <><Check size={18} /> Saved to your profile!</> : '✨ Save to Profile'}
          </motion.button>
          <button
            onClick={handleRetake}
            className="w-full py-3 rounded-2xl font-semibold text-white/50 flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw size={15} />
            Retake Quiz
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark pb-safe flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : router.back())}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <ChevronLeft size={20} className="text-white/70" />
          </button>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span>Question {step + 1} of {totalQ}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full gradient-brand"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 60 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <h2
              className="text-2xl font-bold text-white mb-8 leading-snug"
              style={{ fontFamily: 'Syne, Inter, sans-serif' }}
            >
              {question.question}
            </h2>

            <div className="space-y-3 flex-1">
              {question.options.map((opt) => {
                const key = opt.types.join(',');
                const isSelected = selected === key;
                return (
                  <motion.button
                    key={key}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(opt.types)}
                    className="w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-all"
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(244,63,142,0.4))'
                        : 'rgba(28,22,53,0.8)',
                      border: isSelected
                        ? '1.5px solid rgba(196,132,252,0.6)'
                        : '1.5px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <span className="text-2xl w-9 text-center">{opt.emoji}</span>
                    <span className="text-sm text-white/90 flex-1 leading-snug">{opt.text}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #f43f8e)' }}
                      >
                        <Check size={13} className="text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <div className="py-5">
          <AnimatePresence>
            {selected && (
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="w-full py-4 rounded-2xl font-semibold text-white gradient-brand glow-button"
              >
                {step < totalQ - 1 ? 'Next Question →' : 'See My Result ✨'}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Calendar, MapPin, Users, Clock, Share2, Check, X,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { events, type DateEvent, type EventCategory } from '@/lib/eventsData';
import { mockMatches } from '@/lib/mockData';

type TimeFilter = 'all' | 'week' | 'month';
type CityFilter = 'All' | 'Berlin' | 'Munich' | 'Hamburg' | 'Cologne' | 'Frankfurt' | 'Online';
type ViewTab = 'discover' | 'mine';

const categoryFilters: { id: EventCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'speed-dating', label: 'Speed Dating', emoji: '💘' },
  { id: 'singles-party', label: 'Party', emoji: '🎉' },
  { id: 'virtual', label: 'Virtual', emoji: '💻' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌲' },
  { id: 'workshop', label: 'Workshop', emoji: '🛠️' },
  { id: 'concert', label: 'Concert', emoji: '🎷' },
  { id: 'food-drink', label: 'Food & Drink', emoji: '🍝' },
];

const cities: CityFilter[] = ['All', 'Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Online'];

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}
function formatTime(d: Date) {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function useCountdown(endsAt: Date) {
  const calc = () => {
    const diff = Math.max(0, endsAt.getTime() - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, expired: diff === 0 };
  };
  const [time, setTime] = useState(calc());
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  });
  return time;
}

function groupEvents(evs: DateEvent[]): { label: string; events: DateEvent[] }[] {
  const now = Date.now();
  const weekend = now + 3 * 86400000;
  const nextWeek = now + 10 * 86400000;

  const thisWeekend = evs.filter((e) => e.date.getTime() <= weekend);
  const nextWeekEvs = evs.filter((e) => e.date.getTime() > weekend && e.date.getTime() <= nextWeek);
  const comingUp = evs.filter((e) => e.date.getTime() > nextWeek);

  const groups = [];
  if (thisWeekend.length) groups.push({ label: 'This Weekend', events: thisWeekend });
  if (nextWeekEvs.length) groups.push({ label: 'Next Week', events: nextWeekEvs });
  if (comingUp.length) groups.push({ label: 'Coming Up', events: comingUp });
  return groups;
}

interface EventCardProps {
  event: DateEvent;
  onOpen: (e: DateEvent) => void;
  rsvpd: boolean;
}

function EventCard({ event, onOpen, rsvpd }: EventCardProps) {
  const attendeePct = (event.currentAttendees / event.maxAttendees) * 100;
  const isSoldOut = event.badge === 'Sold Out';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-glass rounded-2xl overflow-hidden"
    >
      {/* Gradient header */}
      <div className={`bg-gradient-to-r ${event.color} p-4 relative`}>
        {event.badge && (
          <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            {event.badge}
          </span>
        )}
        {rsvpd && (
          <span className="absolute top-3 left-3 bg-green-500/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <Check size={9} /> Going
          </span>
        )}
        <div className="flex items-center gap-3">
          <div className="text-3xl">{event.emoji}</div>
          <div>
            <p className="text-white font-black text-sm leading-tight">{event.title}</p>
            <p className="text-white/80 text-xs mt-0.5">Hosted by {event.hostEmoji} {event.hostName}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Date + location row */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-white/70">
            <Calendar size={12} className="text-purple-400" />
            <span>{formatDate(event.date)}</span>
            <span className="text-white/40">·</span>
            <span>{formatTime(event.date)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/60">
          <MapPin size={12} className="text-pink-400 flex-shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        {/* Attendees + price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/5 rounded-xl px-2.5 py-1.5">
              <Users size={11} className="text-purple-400" />
              <span className="text-white/70 text-xs">{event.currentAttendees} attending</span>
            </div>
            <div className="h-1 w-16 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${event.color}`}
                style={{ width: `${attendeePct}%` }}
              />
            </div>
          </div>
          <span className={`text-xs font-black px-2.5 py-1.5 rounded-xl ${
            event.price === 0
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-white/10 text-white border border-white/15'
          }`}>
            {event.price === 0 ? 'Free' : `€${event.price}`}
          </span>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {event.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 text-white/50 rounded-lg border border-white/10">
              #{tag}
            </span>
          ))}
        </div>

        {/* RSVP button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onOpen(event)}
          disabled={isSoldOut && !rsvpd}
          className={`w-full py-2.5 rounded-xl text-sm font-black transition-all ${
            rsvpd
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : isSoldOut
              ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
              : `bg-gradient-to-r ${event.color} text-white shadow-lg`
          }`}
        >
          {rsvpd ? '✓ Going' : isSoldOut ? 'Sold Out' : 'RSVP / Join →'}
        </motion.button>
      </div>
    </motion.div>
  );
}

interface DetailSheetProps {
  event: DateEvent;
  rsvpd: boolean;
  onClose: () => void;
  onRsvp: () => void;
}

function DetailSheet({ event, rsvpd, onClose, onRsvp }: DetailSheetProps) {
  const attendeePct = (event.currentAttendees / event.maxAttendees) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-brand-card rounded-t-3xl overflow-hidden"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${event.color} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center"
          >
            <X size={14} className="text-white" />
          </button>
          <div className="text-5xl mb-3">{event.emoji}</div>
          <h2 className="text-white font-black text-xl leading-tight mb-1">{event.title}</h2>
          <p className="text-white/80 text-sm">Hosted by {event.hostEmoji} {event.hostName}</p>
          {event.badge && (
            <span className="mt-2 inline-block bg-white/20 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {event.badge}
            </span>
          )}
        </div>

        <div className="p-5 space-y-4">
          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed">{event.description}</p>

          {/* Date & Location */}
          <div className="card-glass rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={15} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold">{formatDate(event.date)}</p>
                <p className="text-white/50 text-xs">{formatTime(event.date)} – {formatTime(event.endDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={15} className="text-pink-400" />
              </div>
              <div>
                <p className="text-white font-semibold">{event.location}</p>
                <p className="text-white/50 text-xs">{event.city}</p>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div className="card-glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-purple-400" />
                <span className="text-white font-semibold text-sm">Attendees</span>
              </div>
              <span className="text-white/60 text-sm">{event.currentAttendees} / {event.maxAttendees}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${attendeePct}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className={`h-full rounded-full bg-gradient-to-r ${event.color}`}
              />
            </div>
            <p className="text-white/40 text-xs mt-1">{event.maxAttendees - event.currentAttendees} spots left</p>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/20">
              {event.ageRange}
            </span>
            <span className="text-xs px-2.5 py-1 bg-pink-500/20 text-pink-300 rounded-lg border border-pink-500/20 capitalize">
              {event.gender === 'all' ? 'Open to all' : event.gender}
            </span>
            {event.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-1 bg-white/5 text-white/40 rounded-lg border border-white/10">
                #{t}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="card-glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Entry price</span>
              <div className="text-right">
                <span className={`font-black text-lg ${event.price === 0 ? 'text-green-400' : 'text-white'}`}>
                  {event.price === 0 ? 'Free' : `€${event.price}`}
                </span>
                {event.originalPrice && (
                  <span className="text-white/30 text-sm line-through ml-2">€{event.originalPrice}</span>
                )}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {}}
              className="flex-shrink-0 w-12 h-12 card-glass rounded-xl flex items-center justify-center border border-white/15"
            >
              <Share2 size={18} className="text-white/60" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { onRsvp(); onClose(); }}
              disabled={event.badge === 'Sold Out' && !rsvpd}
              className={`flex-1 py-3 rounded-xl font-black text-sm shadow-lg ${
                rsvpd
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : event.badge === 'Sold Out'
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : `bg-gradient-to-r ${event.color} text-white`
              }`}
            >
              {rsvpd ? '✓ Going!' : event.badge === 'Sold Out' ? 'Sold Out' : 'RSVP — Join Event'}
            </motion.button>
          </div>

          <p className="text-white/20 text-[10px] text-center">Demo mode · No real payment required</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EventsPage() {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [city, setCity] = useState<CityFilter>('All');
  const [category, setCategory] = useState<EventCategory | 'all'>('all');
  const [viewTab, setViewTab] = useState<ViewTab>('discover');
  const [rsvpd, setRsvpd] = useState<Set<string>>(new Set());
  const [detailEvent, setDetailEvent] = useState<DateEvent | null>(null);
  const [attendees, setAttendees] = useState<Record<string, number>>(
    Object.fromEntries(events.map((e) => [e.id, e.currentAttendees]))
  );

  const unreadMatches = mockMatches.filter((m) => m.unreadCount > 0).length;

  const now = Date.now();
  const filtered = events.filter((e) => {
    if (city !== 'All' && e.city !== city) return false;
    if (category !== 'all' && e.category !== category) return false;
    if (timeFilter === 'week' && e.date.getTime() > now + 7 * 86400000) return false;
    if (timeFilter === 'month' && e.date.getTime() > now + 30 * 86400000) return false;
    return true;
  });

  const myEvents = events.filter((e) => rsvpd.has(e.id));

  const handleRsvp = (eventId: string) => {
    setRsvpd((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
        setAttendees((a) => ({ ...a, [eventId]: a[eventId] - 1 }));
      } else {
        next.add(eventId);
        setAttendees((a) => ({ ...a, [eventId]: a[eventId] + 1 }));
      }
      return next;
    });
  };

  const groups = groupEvents(filtered);

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-xl border-b border-white/10 px-5 pt-12 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 card-glass rounded-xl flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <Calendar size={20} className="text-purple-400" />
            <h1 className="text-white font-black text-xl">Events 🎉</h1>
          </div>
        </div>

        {/* View tabs */}
        <div className="flex gap-1 mb-3">
          {(['discover', 'mine'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setViewTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors relative ${
                viewTab === tab ? 'gradient-brand text-white shadow-lg' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab === 'discover' ? '🔍 Discover' : '🎟️ My Events'}
              {tab === 'mine' && rsvpd.size > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {rsvpd.size}
                </span>
              )}
            </button>
          ))}
        </div>

        {viewTab === 'discover' && (
          <>
            {/* Time filter */}
            <div className="flex gap-2 mb-2">
              {(['all', 'week', 'month'] as TimeFilter[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    timeFilter === t ? 'gradient-brand text-white' : 'card-glass text-white/50'
                  }`}
                >
                  {t === 'all' ? 'All Dates' : t === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>

            {/* City filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    city === c ? 'gradient-brand text-white' : 'card-glass text-white/50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categoryFilters.map((cf) => (
                <button
                  key={cf.id}
                  onClick={() => setCategory(cf.id)}
                  className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    category === cf.id ? 'gradient-brand text-white' : 'card-glass text-white/50'
                  }`}
                >
                  <span>{cf.emoji}</span>
                  <span>{cf.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="px-5 pb-32 pt-4 space-y-6">
        {viewTab === 'discover' ? (
          filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-white/60 font-medium">No events match your filters</p>
              <button
                onClick={() => { setCity('All'); setCategory('all'); setTimeFilter('all'); }}
                className="mt-4 text-purple-400 text-sm font-semibold"
              >
                Clear filters
              </button>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label}>
                <h2 className="text-white font-black text-base mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-purple-400" />
                  {group.label}
                </h2>
                <div className="space-y-4">
                  {group.events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={{ ...event, currentAttendees: attendees[event.id] ?? event.currentAttendees }}
                      onOpen={setDetailEvent}
                      rsvpd={rsvpd.has(event.id)}
                    />
                  ))}
                </div>
              </div>
            ))
          )
        ) : (
          myEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🎟️</div>
              <p className="text-white/60 font-medium text-lg">No events yet</p>
              <p className="text-white/30 text-sm mt-1">RSVP to events to see them here</p>
              <button
                onClick={() => setViewTab('discover')}
                className="mt-5 gradient-brand text-white font-bold px-5 py-2.5 rounded-xl text-sm"
              >
                Explore Events
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-white/40 text-xs">{myEvents.length} event{myEvents.length !== 1 ? 's' : ''} you&apos;re going to</p>
              {myEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={{ ...event, currentAttendees: attendees[event.id] ?? event.currentAttendees }}
                  onOpen={setDetailEvent}
                  rsvpd={true}
                />
              ))}
            </div>
          )
        )}
      </div>

      <BottomNav matchCount={unreadMatches} />

      {/* Detail Bottom Sheet */}
      <AnimatePresence>
        {detailEvent && (
          <DetailSheet
            event={{ ...detailEvent, currentAttendees: attendees[detailEvent.id] ?? detailEvent.currentAttendees }}
            rsvpd={rsvpd.has(detailEvent.id)}
            onClose={() => setDetailEvent(null)}
            onRsvp={() => handleRsvp(detailEvent.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  Users, Vote, CheckCircle2, Clock, Plus, ChevronRight,
  Trophy, Calendar, Star, UserCheck, UserPlus, Sparkles,
  BookOpen, Music, Leaf, Dumbbell, Palette, Baby,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// ─── Storage keys ────────────────────────────────────────────────────────────
const POLLS_KEY   = "sociosphere_polls";
const CLUBS_KEY   = "sociosphere_clubs";
const VOTES_KEY   = "sociosphere_votes";
const MEMBERS_KEY = "sociosphere_club_members";

// ─── Seed data ───────────────────────────────────────────────────────────────
const SEED_POLLS = [
  {
    id: "poll-1",
    question: "Which area needs a new park bench most urgently?",
    options: ["Main entrance gate", "Children's play area", "Jogging track corner", "Near the pond"],
    votes: [12, 27, 9, 18],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Welfare Committee",
  },
  {
    id: "poll-2",
    question: "When should the weekly community meeting be held?",
    options: ["Saturday morning", "Sunday evening", "Weekday (6 PM)", "Online only"],
    votes: [34, 19, 22, 11],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Resident Association",
  },
  {
    id: "poll-3",
    question: "Which new facility would you most like added to the community?",
    options: ["Co-working space", "Indoor gym", "Yoga/meditation room", "Mini library"],
    votes: [8, 41, 16, 29],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Facilities Board",
  },
];

const SEED_CLUBS = [
  { id: "club-1", name: "Book Club",       icon: "BookOpen", description: "Weekly reads & literary discussions. Meet every Sunday at 10 AM.", tag: "Cultural",  members: 14, day: "Sundays",   color: "violet" },
  { id: "club-2", name: "Music Circle",    icon: "Music",    description: "Jam sessions, karaoke nights, and music appreciation events.",   tag: "Arts",     members: 9,  day: "Fridays",  color: "rose" },
  { id: "club-3", name: "Green Warriors",  icon: "Leaf",     description: "Gardening drives, composting & eco-friendly community living.",  tag: "Eco",      members: 22, day: "Saturdays",color: "emerald" },
  { id: "club-4", name: "Fitness Squad",   icon: "Dumbbell", description: "Morning jogs, yoga & strength training for all fitness levels.", tag: "Health",   members: 31, day: "Daily",    color: "amber" },
  { id: "club-5", name: "Art & Craft",     icon: "Palette",  description: "Painting, pottery & DIY workshops open to all residents.",      tag: "Creative", members: 17, day: "Thursdays",color: "sky" },
  { id: "club-6", name: "Kids' Corner",    icon: "Baby",     description: "Fun activities, story time & play dates for children 2–12.",    tag: "Kids",     members: 26, day: "Weekends", color: "pink" },
];

const CLUB_ICONS = { BookOpen, Music, Leaf, Dumbbell, Palette, Baby };

const CLUB_COLORS = {
  violet:  { bg: "bg-violet-100 dark:bg-violet-500/15", text: "text-violet-600 dark:text-violet-400", badge: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300", ring: "ring-violet-400" },
  rose:    { bg: "bg-rose-100 dark:bg-rose-500/15",     text: "text-rose-600 dark:text-rose-400",     badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",         ring: "ring-rose-400" },
  emerald: { bg: "bg-emerald-100 dark:bg-emerald-500/15",text: "text-emerald-600 dark:text-emerald-400",badge:"bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",ring:"ring-emerald-400"},
  amber:   { bg: "bg-amber-100 dark:bg-amber-500/15",   text: "text-amber-600 dark:text-amber-400",   badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",     ring: "ring-amber-400" },
  sky:     { bg: "bg-sky-100 dark:bg-sky-500/15",       text: "text-sky-600 dark:text-sky-400",       badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",             ring: "ring-sky-400" },
  pink:    { bg: "bg-pink-100 dark:bg-pink-500/15",     text: "text-pink-600 dark:text-pink-400",     badge: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",         ring: "ring-pink-400" },
};

function daysLeft(isoDate) {
  const diff = new Date(isoDate) - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

function pct(votes, options) {
  const total = options.reduce((s, _, i) => s + votes[i], 0);
  return options.map((_, i) => (total ? Math.round((votes[i] / total) * 100) : 0));
}

// ─── Load / Save helpers ─────────────────────────────────────────────────────
function loadJSON(key, seed) {
  try { return JSON.parse(localStorage.getItem(key)) || seed; } catch { return seed; }
}
function saveJSON(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export default function Community() {
  const { user } = useAuth();
  const userId = user?.id || user?.email || "guest";

  const [tab, setTab]         = useState("polls");
  const [polls, setPolls]     = useState(() => loadJSON(POLLS_KEY, SEED_POLLS));
  const [clubs, setClubs]     = useState(() => loadJSON(CLUBS_KEY, SEED_CLUBS));
  const [votes, setVotes]     = useState(() => loadJSON(VOTES_KEY, {}));       // { pollId: optionIndex }
  const [members, setMembers] = useState(() => loadJSON(MEMBERS_KEY, {}));     // { clubId: [userId,...] }
  const [toast, setToast]     = useState("");
  const [showPollForm, setShowPollForm] = useState(false);
  const [newPoll, setNewPoll] = useState({ question: "", options: ["", ""] });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  // ── Vote on a poll ──────────────────────────────────────────────────────────
  const handleVote = (pollId, optIdx) => {
    if (votes[pollId] !== undefined) return;
    const next = { ...votes, [pollId]: optIdx };
    setVotes(next);
    saveJSON(VOTES_KEY, next);

    setPolls((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== pollId) return p;
        const v = [...p.votes];
        v[optIdx] += 1;
        return { ...p, votes: v };
      });
      saveJSON(POLLS_KEY, updated);
      return updated;
    });
    showToast("✅ Vote recorded!");
  };

  // ── Toggle club membership ──────────────────────────────────────────────────
  const handleClubToggle = (clubId) => {
    const current = members[clubId] || [];
    const isMember = current.includes(userId);
    const next = isMember ? current.filter((id) => id !== userId) : [...current, userId];
    const updated = { ...members, [clubId]: next };
    setMembers(updated);
    saveJSON(MEMBERS_KEY, updated);

    setClubs((prev) => {
      const upd = prev.map((c) => c.id !== clubId ? c : { ...c, members: isMember ? c.members - 1 : c.members + 1 });
      saveJSON(CLUBS_KEY, upd);
      return upd;
    });
    showToast(isMember ? "Left the club." : "🎉 Joined! Welcome aboard!");
  };

  // ── Add new poll ────────────────────────────────────────────────────────────
  const handleAddPoll = () => {
    const opts = newPoll.options.filter((o) => o.trim());
    if (!newPoll.question.trim() || opts.length < 2) {
      showToast("Please provide a question and at least 2 options.");
      return;
    }
    const poll = {
      id: `poll-${Date.now()}`,
      question: newPoll.question.trim(),
      options: opts,
      votes: opts.map(() => 0),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      author: user?.name || "Resident",
    };
    const updated = [poll, ...polls];
    setPolls(updated);
    saveJSON(POLLS_KEY, updated);
    setNewPoll({ question: "", options: ["", ""] });
    setShowPollForm(false);
    showToast("📊 Poll published!");
  };

  const myClubs = useMemo(() => clubs.filter((c) => (members[c.id] || []).includes(userId)), [clubs, members, userId]);

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <section className="overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-6 shadow-sm dark:border-violet-500/20 dark:from-violet-500/10 dark:via-[#0D1524] dark:to-pink-500/10 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-400">
              <Sparkles size={14} /> Community Hub
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Connect &amp; Engage
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Vote on community decisions, join resident clubs &amp; more.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Stat icon={Vote}      label="Active polls"  value={polls.length} color="violet" />
            <Stat icon={Users}     label="Clubs"         value={clubs.length} color="rose" />
            <Stat icon={UserCheck} label="Your clubs"    value={myClubs.length} color="emerald" />
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900 w-fit">
        {[
          { key: "polls", label: "Polls", icon: Vote },
          { key: "clubs", label: "Clubs", icon: Users },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
              tab === key
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* ──────────────── POLLS TAB ──────────────── */}
      {tab === "polls" && (
        <div className="space-y-4">
          {/* Create poll bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{polls.length} active polls</p>
            <button
              onClick={() => setShowPollForm((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-violet-500/20 transition hover:-translate-y-0.5 hover:bg-violet-500"
            >
              <Plus size={16} /> Create Poll
            </button>
          </div>

          {/* New poll form */}
          {showPollForm && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-500/20 dark:bg-violet-500/5">
              <h3 className="mb-4 text-sm font-bold text-slate-800 dark:text-white">New Community Poll</h3>
              <input
                className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                placeholder="Poll question…"
                value={newPoll.question}
                onChange={(e) => setNewPoll((p) => ({ ...p, question: e.target.value }))}
              />
              {newPoll.options.map((opt, i) => (
                <input
                  key={i}
                  className="mb-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const opts = [...newPoll.options];
                    opts[i] = e.target.value;
                    setNewPoll((p) => ({ ...p, options: opts }));
                  }}
                />
              ))}
              <div className="mt-3 flex flex-wrap gap-2">
                {newPoll.options.length < 5 && (
                  <button
                    onClick={() => setNewPoll((p) => ({ ...p, options: [...p.options, ""] }))}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    + Add option
                  </button>
                )}
                <button onClick={handleAddPoll} className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-violet-500">
                  Publish Poll
                </button>
                <button onClick={() => setShowPollForm(false)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Poll cards */}
          {polls.map((poll) => {
            const userVote = votes[poll.id];
            const voted = userVote !== undefined;
            const percentages = pct(poll.votes, poll.options);
            const total = poll.votes.reduce((s, v) => s + v, 0);
            const winIdx = poll.votes.indexOf(Math.max(...poll.votes));
            const remaining = daysLeft(poll.expiresAt);

            return (
              <article key={poll.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0D1524]">
                <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-100 dark:bg-violet-500/15">
                        <Vote size={17} className="text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{poll.author}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${remaining > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
                      <Clock size={11} /> {remaining > 0 ? `${remaining}d left` : "Ended"}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{poll.question}</h3>
                  <p className="mt-0.5 text-xs text-slate-400">{total} vote{total !== 1 ? "s" : ""}</p>
                </div>

                <div className="space-y-3 px-6 py-5">
                  {poll.options.map((option, i) => {
                    const isVoted = voted && userVote === i;
                    const isWinner = voted && winIdx === i;
                    return (
                      <button
                        key={i}
                        disabled={voted || remaining === 0}
                        onClick={() => handleVote(poll.id, i)}
                        className={`group relative w-full overflow-hidden rounded-xl border text-left transition ${
                          isVoted
                            ? "border-violet-400 dark:border-violet-500"
                            : isWinner && voted
                            ? "border-emerald-300 dark:border-emerald-500/50"
                            : "border-slate-200 hover:border-violet-300 dark:border-slate-700 dark:hover:border-violet-500/50"
                        } ${voted ? "cursor-default" : "hover:-translate-y-0.5"}`}
                      >
                        {voted && (
                          <div
                            className={`absolute inset-0 rounded-xl transition-all ${isVoted ? "bg-violet-500/12" : isWinner ? "bg-emerald-500/8" : "bg-slate-500/5"}`}
                            style={{ width: `${percentages[i]}%` }}
                          />
                        )}
                        <div className="relative flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-2">
                            {voted && isVoted && <CheckCircle2 size={14} className="shrink-0 text-violet-500" />}
                            {voted && isWinner && !isVoted && <Trophy size={14} className="shrink-0 text-emerald-500" />}
                            <span className={`text-sm font-semibold ${isVoted ? "text-violet-700 dark:text-violet-300" : "text-slate-700 dark:text-slate-200"}`}>{option}</span>
                          </div>
                          {voted && (
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{percentages[i]}%</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ──────────────── CLUBS TAB ──────────────── */}
      {tab === "clubs" && (
        <div className="space-y-4">
          {/* My clubs summary */}
          {myClubs.length > 0 && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                <Star size={13} /> Your memberships
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {myClubs.map((c) => {
                  const col = CLUB_COLORS[c.color];
                  return (
                    <span key={c.id} className={`rounded-full px-3 py-1 text-xs font-bold ${col.badge}`}>
                      {c.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {clubs.map((club) => {
              const Icon = CLUB_ICONS[club.icon] || Users;
              const col = CLUB_COLORS[club.color] || CLUB_COLORS.violet;
              const isMember = (members[club.id] || []).includes(userId);

              return (
                <article key={club.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#0D1524]">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${col.bg}`}>
                      <Icon size={22} className={col.text} />
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${col.badge}`}>{club.tag}</span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">{club.name}</h3>
                  <p className="mt-1 flex-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{club.description}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Users size={12} /> {club.members} member{club.members !== 1 ? "s" : ""}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar size={12} /> {club.day}
                      </p>
                    </div>

                    <button
                      onClick={() => handleClubToggle(club.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                        isMember
                          ? "bg-slate-100 text-slate-700 hover:bg-rose-100 hover:text-rose-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-500/15 dark:hover:text-rose-400"
                          : `${col.bg} ${col.text} hover:opacity-80`
                      }`}
                    >
                      {isMember ? <><UserCheck size={14} /> Joined</> : <><UserPlus size={14} /> Join</>}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-[200] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xl dark:bg-slate-800">
          {toast}
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  const colors = {
    violet:  "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    rose:    "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className={`grid h-9 w-9 place-items-center rounded-lg ${colors[color]}`}>
        <Icon size={17} />
      </div>
      <div>
        <p className="text-lg font-extrabold leading-none text-slate-900 dark:text-white">{value}</p>
        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}


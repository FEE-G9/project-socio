import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Vote, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Sparkles, 
  Megaphone, 
  BarChart2, 
  X,
  BookOpen,
  Music,
  Leaf,
  Dumbbell,
  Palette,
  Baby,
  ChevronRight
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { addAnnouncement } from '../../data/mockAnnouncements';

const POLLS_STORAGE_KEY = 'sociosphere_polls';

const INITIAL_POLLS = [
  {
    id: "poll-1",
    question: "Which area needs a new park bench most urgently in Gandhi Colony?",
    options: ["Main entrance gate", "Children's play area", "Jogging track corner", "Near the fountain pond"],
    votes: [12, 27, 9, 18],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Gandhi Colony Welfare Board",
    status: "active"
  },
  {
    id: "poll-2",
    question: "When should the weekly community RWA meeting be held?",
    options: ["Saturday morning (10 AM)", "Sunday evening (6 PM)", "Weekday evening (7 PM)", "Online Zoom only"],
    votes: [34, 19, 22, 11],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Gandhi Colony Welfare Board",
    status: "active"
  },
  {
    id: "poll-3",
    question: "Which new facility should Gandhi Colony add to Block B Lawn?",
    options: ["Open Gymnasium", "Badminton Court", "Gazebo & Reading Pod", "Yoga / Meditation Pavilion"],
    votes: [42, 38, 15, 29],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    author: "Gandhi Colony Welfare Board",
    status: "active"
  }
];

const INITIAL_CLUBS = [
  { id: 'club-1', name: 'Fitness & Jogging Squad', lead: 'Priya Patel', members: 31, venue: 'Central Park', schedule: 'Daily at 06:30 AM', status: 'Approved' },
  { id: 'club-2', name: 'Green Warriors Eco Club', lead: 'Aarav Sharma', members: 22, venue: 'Community Garden', schedule: 'Saturdays at 09:00 AM', status: 'Approved' },
  { id: 'club-3', name: 'Book & Literary Circle', lead: 'Ananya Iyer', members: 14, venue: 'Clubhouse Room 1', schedule: 'Sundays at 11:00 AM', status: 'Approved' },
  { id: 'club-4', name: 'Music & Jam Circle', lead: 'Rohan Verma', members: 12, venue: 'Clubhouse Room 2', schedule: 'Fridays at 07:00 PM', status: 'Approved' },
  { id: 'club-5', name: 'Kids Weekend Fun Club', lead: 'Neha Gupta', members: 26, venue: 'Children Play Area', schedule: 'Weekends at 05:00 PM', status: 'Approved' },
];

const AdminCommunity = () => {
  const { user } = useAuth();
  const adminSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const adminSocietyCode = user?.societyCode || (
    adminSociety === 'Gandhi Colony' ? 'GC-101' :
    adminSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  const [activeTab, setActiveTab] = useState('polls'); // 'polls' | 'clubs'
  const [polls, setPolls] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(POLLS_STORAGE_KEY) || '[]');
      if (stored.length > 0) return stored;
    } catch { /* ignore */ }
    return INITIAL_POLLS;
  });

  const [clubs, setClubs] = useState(INITIAL_CLUBS);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // New Poll Form
  const [pollForm, setPollForm] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    daysActive: '7'
  });

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  useEffect(() => {
    localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(polls));
  }, [polls]);

  const totalVotesCast = polls.reduce((acc, p) => acc + (p.votes || []).reduce((sum, v) => sum + v, 0), 0);
  const totalClubMembers = clubs.reduce((acc, c) => acc + c.members, 0);

  const handleCreatePoll = (e) => {
    e.preventDefault();
    if (!pollForm.question.trim() || !pollForm.option1.trim() || !pollForm.option2.trim()) return;

    const options = [pollForm.option1.trim(), pollForm.option2.trim()];
    if (pollForm.option3.trim()) options.push(pollForm.option3.trim());
    if (pollForm.option4.trim()) options.push(pollForm.option4.trim());

    const days = parseInt(pollForm.daysActive, 10) || 7;
    const newPoll = {
      id: `poll-${Date.now().toString().slice(-4)}`,
      question: pollForm.question.trim(),
      options,
      votes: new Array(options.length).fill(0),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
      author: `${adminSociety} Welfare Board`,
      status: 'active'
    };

    setPolls(prev => [newPoll, ...prev]);
    setIsPollModalOpen(false);
    setPollForm({
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      daysActive: '7'
    });
    showToast(`✓ Official RWA Poll published to ${adminSociety} citizens!`);
  };

  const handleBroadcastResults = (poll) => {
    const total = poll.votes.reduce((a, b) => a + b, 0);
    const winningIdx = poll.votes.indexOf(Math.max(...poll.votes));
    const winner = poll.options[winningIdx] || 'Option 1';

    addAnnouncement({
      title: `Official Poll Results: ${poll.question}`,
      content: `The resident voting on "${poll.question}" concluded with ${total} votes cast. The winning decision is "${winner}" with ${poll.votes[winningIdx]} votes. RWA will proceed with implementation.`,
      category: 'Notice',
      important: true,
      author: `${adminSociety} Welfare Board`,
      authorRole: 'Society Authority',
      society: adminSociety,
      societyCode: adminSocietyCode,
      colonyId: adminSocietyCode
    });

    showToast(`✓ Poll results broadcasted to ${adminSociety} Announcements!`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Community Oversight, Polls & Clubs
            </h1>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Building2 size={12} />
              {adminSociety} ({adminSocietyCode})
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Conduct democratic colony voting, oversee resident interest clubs, and broadcast official RWA resolutions.
          </p>
        </div>

        <Button
          onClick={() => setIsPollModalOpen(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
        >
          <Plus size={16} />
          Create Colony Poll
        </Button>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
          toastMsg.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
            : 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'
        }`}>
          <span className="font-semibold text-sm">{toastMsg.text}</span>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Colony Polls", value: polls.length, desc: "Democracy in action", icon: Vote, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Total Resident Votes", value: totalVotesCast, desc: "Ballots submitted", icon: BarChart2, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Approved Clubs", value: clubs.length, desc: "Resident interest groups", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Active Club Members", value: totalClubMembers, desc: "Participating residents", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-[#0D1524]"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{stat.value}</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">{stat.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('polls')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'polls' 
                ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Official Polls ({polls.length})
          </button>
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'clubs' 
                ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Resident Clubs ({clubs.length})
          </button>
        </div>

        {activeTab === 'polls' ? (
          /* POLLS TAB */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {polls.map(poll => {
              const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
              const maxVote = Math.max(...poll.votes);

              return (
                <Card key={poll.id} className="p-5 flex flex-col justify-between border-slate-200 dark:border-slate-800">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          Active Voting
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1.5">{poll.question}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Expires: {new Date(poll.expiresAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • {totalVotes} total votes
                        </p>
                      </div>
                      <span className="font-mono text-xs text-slate-400">{poll.id}</span>
                    </div>

                    {/* Options list with progress bars */}
                    <div className="space-y-2.5">
                      {poll.options.map((opt, idx) => {
                        const count = poll.votes[idx] || 0;
                        const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
                        const isLeading = count === maxVote && count > 0;

                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className={`font-medium ${isLeading ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}>
                                {opt} {isLeading && '★ Leading'}
                              </span>
                              <span className="font-bold text-slate-500">{pct}% ({count})</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${isLeading ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => handleBroadcastResults(poll)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 transition-colors flex items-center gap-1.5"
                    >
                      <Megaphone size={13} />
                      Broadcast Results as Notice
                    </button>
                    <span className="text-[11px] text-slate-400">RWA Sanctioned</span>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* CLUBS TAB */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clubs.map(club => (
              <Card key={club.id} className="p-5 border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                      Official Club
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">{club.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Coordinator: {club.lead}</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {club.members} Members
                  </span>
                </div>

                <div className="p-3 my-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <p className="text-slate-600 dark:text-slate-300"><strong>Assigned Venue:</strong> {club.venue}</p>
                  <p className="text-slate-600 dark:text-slate-300"><strong>Session Schedule:</strong> {club.schedule}</p>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> {club.status}
                  </span>
                  <button 
                    onClick={() => showToast(`✓ Facility booking renewed for ${club.name} at ${club.venue}.`)}
                    className="text-xs font-bold text-slate-600 hover:text-emerald-600 dark:text-slate-300"
                  >
                    Manage Facility
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CREATE POLL MODAL */}
      <Modal
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        title={`Create Official Colony Poll (${adminSociety})`}
      >
        <form onSubmit={handleCreatePoll} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Poll Question *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Should we install solar lighting along Block B perimeter?"
              value={pollForm.question}
              onChange={(e) => setPollForm(prev => ({ ...prev, question: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Voting Options *
            </label>
            <input
              type="text"
              required
              placeholder="Option 1 (e.g., Yes, allocate from reserve fund)"
              value={pollForm.option1}
              onChange={(e) => setPollForm(prev => ({ ...prev, option1: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              type="text"
              required
              placeholder="Option 2 (e.g., No, prioritize clubhouse gym)"
              value={pollForm.option2}
              onChange={(e) => setPollForm(prev => ({ ...prev, option2: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              type="text"
              placeholder="Option 3 (Optional)"
              value={pollForm.option3}
              onChange={(e) => setPollForm(prev => ({ ...prev, option3: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
            <input
              type="text"
              placeholder="Option 4 (Optional)"
              value={pollForm.option4}
              onChange={(e) => setPollForm(prev => ({ ...prev, option4: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Voting Period
            </label>
            <select
              value={pollForm.daysActive}
              onChange={(e) => setPollForm(prev => ({ ...prev, daysActive: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="3">3 Days</option>
              <option value="5">5 Days</option>
              <option value="7">7 Days (Standard 1 Week)</option>
              <option value="14">14 Days (2 Weeks)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsPollModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Publish Poll
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCommunity;

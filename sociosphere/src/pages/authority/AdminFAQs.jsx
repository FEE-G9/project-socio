import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  ShieldAlert, 
  Users, 
  FileText, 
  IndianRupee, 
  Download, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const ADMIN_FAQ_CATEGORIES = [
  { id: 'all', label: 'All Guidelines' },
  { id: 'onboarding', label: 'Resident Onboarding & Verification' },
  { id: 'security', label: 'Security & SOS Escalation' },
  { id: 'civic', label: 'Civic Issue SLAs & Dispatch' },
  { id: 'finance', label: 'Maintenance Dues & Legal Recovery' },
  { id: 'governance', label: 'RWA Governance & General Body' }
];

const ADMIN_FAQS = [
  {
    id: 'faq-1',
    category: 'onboarding',
    question: 'What is the Standard Operating Procedure (SOP) for approving new resident signups?',
    answer: 'When a resident registers on SocioSphere specifying your colony code (e.g. GC-101), their status is initially set to "Pending Approval". As society administrator, you must verify their allotment letter, sale deed, or registered rental lease along with government photo ID. Once verified, click "Approve & Admit" in the Directory to activate their account and grant access to the community portal.',
    actionLabel: 'Go to Resident Directory',
    actionLink: '/authority/members?tab=pending'
  },
  {
    id: 'faq-2',
    category: 'security',
    question: 'How should the authority handle incoming SOS distress calls?',
    answer: 'Distress calls show the resident’s verified name, flat number, and contact number in real-time. Immediately contact the on-duty guard at Gate 1 or Basement Patrol via the Emergency Command Center. Dispatch two uniformed security personnel to the resident’s unit immediately. If medical assistance is required, trigger the Civil Hospital speed-dial hotline simultaneously.',
    actionLabel: 'Open Emergency Command Center',
    actionLink: '/authority/emergency'
  },
  {
    id: 'faq-3',
    category: 'civic',
    question: 'What are the official resolution timelines (SLAs) for civic issues?',
    answer: 'High priority issues (e.g. drinking water pipeline burst, main electrical feeder trip, lift breakdown) have a mandatory 4 to 24-hour resolution SLA. Medium priority issues (perimeter lighting, garbage overflow) must be resolved within 48 hours. Low priority issues (lawn pruning, cosmetic touchups) must be resolved within 5 business days.',
    actionLabel: 'Manage Issues Tracker',
    actionLink: '/authority/issues'
  },
  {
    id: 'faq-4',
    category: 'finance',
    question: 'What is the protocol for recovering overdue maintenance dues?',
    answer: 'Maintenance dues are payable by the 10th of every month. For dues unpaid after 30 days, the portal generates a 1st Soft Reminder Notice. After 60 days, a Formal Demand Notice is sent via email and physical post. After 90 days of non-payment, common facility privileges (clubhouse access, swimming pool) may be temporarily suspended per Model Society Bylaws Section 44.',
    actionLabel: 'View Maintenance Ledger',
    actionLink: '/authority/fees'
  },
  {
    id: 'faq-5',
    category: 'security',
    question: 'When should the authority broadcast a colony-wide Red Alert?',
    answer: 'A Red Alert triggers an immediate audio-visual screen takeover for every citizen logged into your society. It is strictly reserved for life-safety emergencies: active structural fire, confirmed armed intruder on campus, gas leak evacuation, or catastrophic transformer explosion. Always provide clear, actionable evacuation instructions in the directive field.',
    actionLabel: 'Review Emergency Center',
    actionLink: '/authority/emergency'
  },
  {
    id: 'faq-6',
    category: 'governance',
    question: 'How do we publish binding RWA resolutions and General Body Meeting (GBM) notices?',
    answer: 'Per Society Registration Act guidelines, all Annual General Body Meetings require a minimum 21-day advance notice. Publish the agenda under "Announcements", check "High-Priority Notice", and export the RSVP roster to verify that the required 25% quorum of flat owners is present.',
    actionLabel: 'Publish Event / Announcement',
    actionLink: '/authority/events'
  }
];

const AdminFAQs = () => {
  const { user } = useAuth();
  const adminSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const adminSocietyCode = user?.societyCode || (
    adminSociety === 'Gandhi Colony' ? 'GC-101' :
    adminSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaqs = ADMIN_FAQS.filter(faq => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  const downloadSOPManual = () => {
    const lines = [
      `================================================================================`,
      `SOCIETY ADMINISTRATIVE GOVERNANCE & SOP MANUAL - ${adminSociety.toUpperCase()} (${adminSocietyCode})`,
      `Official Welfare Board Guidelines | Generated: ${new Date().toLocaleDateString()}`,
      `================================================================================`,
      '',
      ...ADMIN_FAQS.map((faq, i) => `[SECTION ${i + 1}] ${faq.question}\n${faq.answer}\n`)
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rwa-governance-sop-${adminSociety.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Authority Governance & SOP Guidelines
            </h1>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Building2 size={12} />
              {adminSociety} ({adminSocietyCode})
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Standard operating procedures, legal bylaws, emergency protocols, and administrative best practices for RWA officials.
          </p>
        </div>

        <Button 
          variant="secondary"
          onClick={downloadSOPManual}
          className="flex items-center gap-1.5 text-xs font-bold"
        >
          <Download size={14} />
          Download SOP Manual (.txt)
        </Button>
      </div>

      {/* Search & Category Pills */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search administrative protocols, bylaws, or SLAs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {ADMIN_FAQ_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat.id 
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.map(faq => {
          const isOpen = openFaq === faq.id;

          return (
            <Card key={faq.id} className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 transition-colors">
              <button
                onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shrink-0">
                    <HelpCircle size={17} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {faq.question}
                  </h3>
                </div>
                {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 space-y-3 animate-in fade-in duration-150">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                  {faq.actionLink && (
                    <div className="pt-2">
                      <Link
                        to={faq.actionLink}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        {faq.actionLabel} <ArrowRight size={13} />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminFAQs;

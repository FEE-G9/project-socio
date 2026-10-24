import React, { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Sparkles,
  FileWarning,
  ShieldAlert,
  Users,
  CreditCard,
  Lock,
  HelpCircle,
  Check,
  ThumbsUp,
  ThumbsDown,
  Share2,
  ExternalLink,
  X,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Send,
  MessageSquare,
  Radio,
  Building,
  PhoneCall,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions", icon: HelpCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "getting-started", label: "Getting Started", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "issues", label: "Civic Issues", icon: FileWarning, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "safety", label: "Safety & SOS", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "community", label: "Community & Events", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
  { id: "finance", label: "Fees & Finance", icon: CreditCard, color: "text-teal-500", bg: "bg-teal-500/10" },
  { id: "privacy", label: "Account & Privacy", icon: Lock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

const FAQ_DATA = [
  // 1. Getting Started
  {
    id: "gs-1",
    category: "getting-started",
    question: "What is SocioSphere and how does it work for our colony?",
    answer: "SocioSphere is an all-in-one smart community portal designed for residential societies, apartment colonies, and gated complexes. It unifies civic complaint logging (like potholes, streetlights, and water leakages), emergency SOS dispatch, security crime reporting, community announcements, event calendars, and monthly maintenance ledger tracking into a single easy-to-use digital hub.",
    tags: ["Overview", "Colony", "Basics"],
    action: { label: "Explore Features", link: "/#features" }
  },
  {
    id: "gs-2",
    category: "getting-started",
    question: "How do I find my Society / Colony Code to sign up?",
    answer: "Every registered colony has a unique code (such as 'GC-101' for Gandhi Colony). You can obtain this code from your Resident Welfare Association (RWA) notice board, apartment manager, or entry gate welcome banner. You can also search for your society name during registration. If your colony is new, an admin can register it in under 2 minutes.",
    tags: ["Society Code", "Registration", "Onboarding"],
    action: { label: "Register Your Colony", link: "/signup" }
  },
  {
    id: "gs-3",
    category: "getting-started",
    question: "Is SocioSphere free for residents to use?",
    answer: "Yes, 100%! All standard resident features—including civic issue reporting, crime alerts, emergency Red Alert SOS, community polls, event RSVPs, and maintenance payment history—are completely free for every verified resident in the colony.",
    tags: ["Pricing", "Free", "Residents"]
  },
  {
    id: "gs-4",
    category: "getting-started",
    question: "Can multiple members of the same household have separate accounts?",
    answer: "Yes. Every adult resident in your household can create their own individual account using their own email address and mobile phone number while selecting the same flat, villa, or house number. This allows each member to vote in community polls and receive personal emergency alerts.",
    tags: ["Family", "Multiple Accounts", "Residence"]
  },

  // 2. Civic Issues
  {
    id: "is-1",
    category: "issues",
    question: "How do I report a civic problem like a pothole, broken streetlight, or garbage dump?",
    answer: "To log a civic issue, go to the 'Report Issue' tab. Select the relevant category (Roads & Potholes, Water Supply, Street Lighting, Waste Management, Parks, or Drainage), describe the situation, specify the location or landmark, set urgency (Low, Medium, High, or Critical), and attach a photo if available. Your ticket is routed directly to the colony maintenance team.",
    tags: ["Pothole", "Streetlight", "Garbage", "Water"],
    action: { label: "Report an Issue Now", link: "/citizen/report" }
  },
  {
    id: "is-2",
    category: "issues",
    question: "How can I track the live resolution status of an issue I reported?",
    answer: "Open your Citizen Dashboard or the 'Report Issue' page. Each submitted ticket displays a live status badge: 'Submitted', 'Under Review', 'In Progress', and 'Resolved'. You will also receive an instant status notification whenever the maintenance supervisor posts an update or marks the task completed.",
    tags: ["Status", "Tracking", "Notifications"],
    action: { label: "View Citizen Dashboard", link: "/citizen/dashboard" }
  },
  {
    id: "is-3",
    category: "issues",
    question: "Can my neighbors see and upvote my civic reports?",
    answer: "Yes! Civic issues are visible on the colony's open issue board. Neighbors facing the same problem (for example, low water pressure or broken playground swings) can upvote your report. The system automatically elevates highly upvoted issues to the top of the administrator's priority queue.",
    tags: ["Upvotes", "Community Action", "Transparency"]
  },
  {
    id: "is-4",
    category: "issues",
    question: "What happens if an urgent issue is not resolved in a reasonable timeframe?",
    answer: "If a critical hazard (like an exposed electrical cable or sewage leak) is not acted upon within 24 hours, you can click the 'Escalate' button on your ticket. This immediately sends a high-priority SMS and dashboard alert directly to the head RWA president and maintenance lead.",
    tags: ["Escalation", "SLA", "Urgent"]
  },

  // 3. Safety & SOS
  {
    id: "sf-1",
    category: "safety",
    question: "What is the SOS Emergency button and what happens when I press it?",
    answer: "The pulsating red 'SOS EMERGENCY' button at the top of the screen is engineered for real emergencies—including medical trauma, fire, gas leaks, and physical threats. Pressing it activates an immediate high-visibility Red Alert banner across all active colony screens and dispatches an emergency notification with your exact house number to on-duty security guards.",
    tags: ["Red Alert", "SOS", "Security Dispatch"],
    action: { label: "Emergency Helpline Info", link: "/citizen/emergency" }
  },
  {
    id: "sf-2",
    category: "safety",
    question: "How does Crime Reporting work and can I report anonymously?",
    answer: "The 'Report Crime' module allows residents to flag suspicious persons, vehicle tampering, burglary, or disturbances. You can toggle 'Submit Anonymously' to keep your identity 100% confidential while ensuring security personnel and colony administrators get immediate actionable details.",
    tags: ["Crime", "Anonymous", "Confidential", "Safety"],
    action: { label: "Go to Report Crime", link: "/citizen/report-crime" }
  },
  {
    id: "sf-3",
    category: "safety",
    question: "Who receives alerts when an emergency or crime is reported?",
    answer: "Alerts are immediately routed to on-duty main gate guards, colony security supervisors, and designated RWA emergency responders. The portal also provides one-touch dialing for public emergency services (Police: 112, Ambulance: 108, Fire: 101).",
    tags: ["Guards", "Police", "Helplines"]
  },

  // 4. Community & Events
  {
    id: "cm-1",
    category: "community",
    question: "How does the Community Hub work and what can I do there?",
    answer: "The Community Hub acts as your digital neighborhood town square. Residents can share updates, ask for local service recommendations (electricians, tutors, plumbers), participate in official community voting polls, and join neighborhood discussion threads.",
    tags: ["Hub", "Polls", "Discussions"],
    action: { label: "Open Community Hub", link: "/citizen/community" }
  },
  {
    id: "cm-2",
    category: "community",
    question: "How does the Lost & Found section work?",
    answer: "Lost your car keys, pet, or sports gear? Or did you find an item in the clubhouse or garden? Go to 'Lost & Found', select 'Lost' or 'Found', write a short description with a photo, and set the location. Verified neighbors can contact you directly to claim the item.",
    tags: ["Lost & Found", "Misplaced Items", "Keys"],
    action: { label: "Check Lost & Found", link: "/citizen/lost-found" }
  },
  {
    id: "cm-3",
    category: "community",
    question: "How do I RSVP for community events or propose a new celebration?",
    answer: "Under the 'Events' section, you can see upcoming colony festivals, sports tournaments, yoga sessions, and general body meetings. Click 'RSVP' to register yourself and family members. You can also click 'Propose Event' to request admin approval for a new neighborhood event.",
    tags: ["Events", "RSVP", "Festivals", "Meetings"],
    action: { label: "Browse Events", link: "/citizen/events" }
  },
  {
    id: "cm-4",
    category: "community",
    question: "Is there a real-time Group Chat for residents?",
    answer: "Yes! Look for the floating message icon at the bottom right of the screen (visible to logged-in residents). Clicking it opens the real-time Community Group Chat where you can exchange quick updates, coordinate rides, or say hello to neighbors.",
    tags: ["Chat", "Messaging", "Neighbors"]
  },

  // 5. Fees & Finance
  {
    id: "fn-1",
    category: "finance",
    question: "How do I pay my monthly society maintenance dues?",
    answer: "Navigate to the 'Maintenance Fees' section. You will see an itemized breakdown of current dues (such as security fees, common area electricity, water charges, and lift maintenance). You can settle payments via UPI (Google Pay, PhonePe, Paytm), Net Banking, or Credit/Debit Cards.",
    tags: ["Maintenance", "UPI", "Online Payment"],
    action: { label: "View Maintenance Fees", link: "/citizen/fees" }
  },
  {
    id: "fn-2",
    category: "finance",
    question: "Where can I view community expenses and society financial reports?",
    answer: "SocioSphere emphasizes total financial transparency. Under the 'Expenses' page, residents can audit monthly expenditures approved by the management committee, including contractor invoices, generator diesel bills, and maintenance staff payroll.",
    tags: ["Ledger", "Transparency", "Expenses", "Audit"],
    action: { label: "View Colony Expenses", link: "/citizen/expenses" }
  },
  {
    id: "fn-3",
    category: "finance",
    question: "Can I download official GST-compliant tax receipts for my payments?",
    answer: "Yes! Every successful transaction automatically generates an official digital receipt complete with transaction ID, colony stamp, and breakdown. You can download or print your PDF receipt anytime from your payment history.",
    tags: ["Receipts", "GST", "Invoices", "Downloads"]
  },

  // 6. Account & Privacy
  {
    id: "pr-1",
    category: "privacy",
    question: "How is my personal data and contact information secured?",
    answer: "Your privacy is our utmost priority. SocioSphere uses modern 256-bit encryption for all stored records. Your phone number and private contact details are never visible to general public search or external marketing platforms. Only verified committee administrators have emergency access.",
    tags: ["Privacy", "Security", "Encryption"]
  },
  {
    id: "pr-2",
    category: "privacy",
    question: "What should I do if I move to a different flat or colony?",
    answer: "If you move within the same colony, go to 'Profile' -> 'Edit Residence' and update your block or flat number. If moving to another registered colony, use the 'Switch Community' option in Settings and enter your new Colony Code without losing your account history.",
    tags: ["Relocation", "Address Change", "Settings"],
    action: { label: "Manage Profile", link: "/citizen/profile" }
  },
  {
    id: "pr-3",
    category: "privacy",
    question: "How do I reset my password if I forget it?",
    answer: "On the Login page, click 'Forgot Password?'. Enter your registered email address and you will receive an instant password reset link. You can also request an instant OTP sent to your verified mobile number.",
    tags: ["Password", "Reset", "Login", "OTP"],
    action: { label: "Go to Login", link: "/login" }
  }
];

export default function FAQs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, languages } = useLanguage();
  const { user } = useAuth();

  const isInsideCitizenLayout = location.pathname.startsWith("/citizen");

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // Set of open FAQ IDs to allow individual expanding/collapsing or expanding all
  const [openItems, setOpenItems] = useState(() => new Set(["gs-1", "is-1", "sf-1"]));
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  
  // Ask a question modal
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    flat: user?.residence || "",
    topic: "Civic Issue",
    questionText: ""
  });
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // Filtered FAQ items based on category and search query
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = item.answer.toLowerCase().includes(q);
      const inTags = item.tags.some((tag) => tag.toLowerCase().includes(q));

      return inQuestion || inAnswer || inTags;
    });
  }, [selectedCategory, searchQuery]);

  // Toggle single item
  const toggleItem = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand all / Collapse all
  const areAllExpanded =
    filteredFAQs.length > 0 &&
    filteredFAQs.every((item) => openItems.has(item.id));

  const handleToggleAll = () => {
    if (areAllExpanded) {
      setOpenItems(new Set());
    } else {
      setOpenItems(new Set(filteredFAQs.map((item) => item.id)));
    }
  };

  // Handle helpful feedback
  const handleFeedback = (id, type) => {
    setFeedbackGiven((prev) => ({ ...prev, [id]: type }));
  };

  // Handle share / copy question link
  const handleShare = (id, questionText) => {
    const url = `${window.location.origin}/faqs#${id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${questionText} - Find answers on SocioSphere: ${url}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Handle submit question inquiry
  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (!questionFormData.questionText.trim()) return;
    
    // Save to local storage for persistence
    try {
      const existingInquiries = JSON.parse(localStorage.getItem("sociosphere_user_faq_inquiries") || "[]");
      existingInquiries.push({
        id: Date.now(),
        ...questionFormData,
        date: new Date().toISOString()
      });
      localStorage.setItem("sociosphere_user_faq_inquiries", JSON.stringify(existingInquiries));
    } catch {
      // fallback
    }

    setQuestionSubmitted(true);
    setTimeout(() => {
      setQuestionSubmitted(false);
      setIsQuestionModalOpen(false);
      setQuestionFormData((prev) => ({ ...prev, questionText: "" }));
    }, 2200);
  };

  return (
    <div className={`faq-page-shell min-h-screen text-slate-900 transition-colors duration-200 dark:text-slate-100 ${
      isInsideCitizenLayout ? "" : "bg-slate-50 dark:bg-[#070b14]"
    }`}>

      {/* =========================================================================
          TOP NAVBAR (Only rendered if standalone / not inside CitizenLayout)
          ========================================================================= */}
      {!isInsideCitizenLayout && (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#070b14]/90">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            
            {/* BRAND LOGO */}
            <Link to="/" className="group flex items-center gap-3">
              <img
                src="/logo_main.png"
                alt="SocioSphere"
                className="h-10 w-10 object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Socio<span className="text-emerald-500">Sphere</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Help Center & FAQs
                </span>
              </div>
            </Link>

            {/* NAV LINKS */}
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                to="/"
                className="text-sm font-medium text-slate-600 transition hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
              >
                Home
              </Link>
              <a
                href="/#features"
                className="text-sm font-medium text-slate-600 transition hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
              >
                Features
              </a>
              <Link
                to="/faqs"
                className="text-sm font-bold text-emerald-600 dark:text-emerald-400"
              >
                FAQs
              </Link>
            </nav>

            {/* RIGHT CONTROLS */}
            <div className="flex items-center gap-3">
              
              {/* LANGUAGE SELECTOR */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:block"
                aria-label="Select language"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName}
                  </option>
                ))}
              </select>

              {/* THEME TOGGLE */}
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:scale-105 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                aria-label="Toggle theme"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
              </button>

              {/* AUTH BUTTONS */}
              {user ? (
                <Link
                  to="/citizen/home"
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500"
                >
                  <span>Resident Portal</span>
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500"
                  >
                    Join Colony
                  </Link>
                </div>
              )}
            </div>

          </div>
        </header>
      )}

      {/* =========================================================================
          HERO & SEARCH SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden border-b border-slate-200/60 pb-12 pt-8 dark:border-slate-800/80 sm:pb-16 sm:pt-12">
        {/* Glow ambient background effects */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 blur-3xl" aria-hidden="true">
          <div className="h-64 w-[36rem] rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-indigo-500/10 dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-violet-500/10" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">

          {/* BACK BUTTON (If visited inside citizen layout or wants to go back) */}
          <div className="mb-4 flex items-center justify-start">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          </div>

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400">
            <Sparkles size={14} />
            <span>SocioSphere Help Center</span>
          </div>

          {/* TITLE */}
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            Frequently Asked <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">Questions</span>
          </h1>

          {/* SUBTITLE */}
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Have questions about civic reporting, colony codes, crime alerts, emergency SOS, or society fees? Find instant answers below or expand any question.
          </p>

          {/* SEARCH BAR */}
          <div className="relative mx-auto mt-8 max-w-2xl">
            <div className="relative flex items-center rounded-2xl border border-slate-300/80 bg-white p-1.5 shadow-lg shadow-slate-200/50 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-black/40 dark:focus-within:border-emerald-400">
              <Search size={22} className="ml-3 text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., 'pothole', 'society code', 'sos', 'fees', 'anonymous')..."
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500"
                aria-label="Search frequently asked questions"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mr-1 rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="Clear search query"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* POPULAR QUICK KEYWORDS */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium mr-1">Popular:</span>
              {[
                "Colony Code",
                "Report Issue",
                "SOS Emergency",
                "Maintenance Fees",
                "Anonymous Crime",
                "Lost & Found"
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSearchQuery(chip)}
                  className="rounded-lg border border-slate-200 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                >
                  {chip}
                </button>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          MAIN FAQ CONTENT AREA
          ========================================================================= */}
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* CATEGORY FILTER TABS */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === "all"
                ? FAQ_DATA.length
                : FAQ_DATA.filter((item) => item.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`group flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 dark:bg-emerald-500 dark:text-slate-950"
                    : "border border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon
                  size={16}
                  className={`${
                    isSelected
                      ? "text-white dark:text-slate-950"
                      : cat.color
                  } transition-transform group-hover:scale-110`}
                />
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    isSelected
                      ? "bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* CONTROLS HEADER BAR: COUNT & EXPAND/COLLAPSE ALL */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Showing
            </span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? "Question" : "Questions"}
            </span>
            {searchQuery && (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                matching "{searchQuery}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RotateCcw size={13} />
                <span>Reset Search</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleAll}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60"
            >
              <SlidersHorizontal size={13} />
              <span>{areAllExpanded ? "Collapse All" : "Expand All"}</span>
            </button>
          </div>
        </div>

        {/* EMPTY STATE IF NO SEARCH MATCHES */}
        {filteredFAQs.length === 0 && (
          <div className="my-12 rounded-3xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Search size={28} />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-100">
              No matching questions found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              We couldn't find any FAQs matching "{searchQuery}". Try different keywords or submit your question to the colony admin.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Clear Filters
              </button>
              <button
                type="button"
                onClick={() => setIsQuestionModalOpen(true)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500"
              >
                Ask a Question
              </button>
            </div>
          </div>
        )}

        {/* ACCORDION QUESTIONS LIST */}
        <div className="space-y-3.5">
          {filteredFAQs.map((faq) => {
            const isOpen = openItems.has(faq.id);
            const catMeta = FAQ_CATEGORIES.find((c) => c.id === faq.category) || FAQ_CATEGORIES[0];
            const CatIcon = catMeta.icon;
            const userFeedback = feedbackGiven[faq.id];

            return (
              <div
                key={faq.id}
                id={faq.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-emerald-500/60 bg-white shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20 dark:border-emerald-500/50 dark:bg-[#0c1424] dark:shadow-black/60"
                    : "border-slate-200/90 bg-white/90 shadow-sm hover:border-slate-300 hover:shadow dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-700"
                }`}
              >
                {/* QUESTION ACCORDION HEADER (CLICKABLE TO TOGGLE) */}
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <div className="flex items-start gap-3.5 sm:items-center">
                    {/* Category indicator icon */}
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        isOpen
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                          : `${catMeta.bg} ${catMeta.color}`
                      }`}
                    >
                      <CatIcon size={18} />
                    </span>

                    {/* Question text & tags */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {catMeta.label}
                        </span>
                        {faq.tags.map((tag) => (
                          <span
                            key={tag}
                            className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:inline"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h2
                        className={`mt-1 text-sm font-bold sm:text-base transition-colors ${
                          isOpen
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {faq.question}
                      </h2>
                    </div>
                  </div>

                  {/* ROTATING ARROW INDICATOR (THE EXPAND/COLLAPSE ARROW) */}
                  <div className="shrink-0 pl-2">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown size={18} strokeWidth={2.4} />
                    </span>
                  </div>
                </button>

                {/* EXPANDABLE ACCORDION BODY (GRID CSS SMOOTH ANIMATION) */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 border-t border-slate-100 dark:border-slate-800/80"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-5 pt-3 sm:px-6 sm:pb-5">
                      
                      {/* ANSWER TEXT */}
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {faq.answer}
                      </p>

                      {/* QUICK ACTION BUTTON IF PRESENT */}
                      {faq.action && (
                        <div className="mt-4">
                          <Link
                            to={faq.action.link}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
                          >
                            <span>{faq.action.label}</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      )}

                      {/* ACCORDION FOOTER: HELPFUL FEEDBACK & SHARE LINK */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs dark:border-slate-800/80">
                        
                        {/* Was this helpful? */}
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <span>Was this helpful?</span>
                          {userFeedback ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                              <Check size={13} />
                              Thank you for your feedback!
                            </span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleFeedback(faq.id, "yes")}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                                aria-label="Mark answer as helpful"
                              >
                                <ThumbsUp size={12} />
                                <span>Yes</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleFeedback(faq.id, "no")}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-slate-600 transition hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                                aria-label="Mark answer as not helpful"
                              >
                                <ThumbsDown size={12} />
                                <span>No</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Share / Copy Question */}
                        <button
                          type="button"
                          onClick={() => handleShare(faq.id, faq.question)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                          title="Share question link"
                        >
                          {copiedId === faq.id ? (
                            <>
                              <Check size={13} className="text-emerald-500" />
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                Copied!
                              </span>
                            </>
                          ) : (
                            <>
                              <Share2 size={13} />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                      </div>

                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* =========================================================================
            TRUST METRICS STRIP
            ========================================================================= */}
        <section className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Radio,
              title: "Rapid SOS Response",
              detail: "< 15 min dispatch to gates & guards",
              color: "text-rose-500",
              bg: "bg-rose-500/10"
            },
            {
              icon: Building,
              title: "Verified Colony Access",
              detail: "Exclusive to registered residents & RWAs",
              color: "text-emerald-500",
              bg: "bg-emerald-500/10"
            },
            {
              icon: FileWarning,
              title: "Transparent Tracking",
              detail: "100% public accountability for complaints",
              color: "text-amber-500",
              bg: "bg-amber-500/10"
            },
            {
              icon: PhoneCall,
              title: "National Helplines",
              detail: "Instant 1-tap dial for 112, 108 & 101",
              color: "text-blue-500",
              bg: "bg-blue-500/10"
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* =========================================================================
            STILL HAVE QUESTIONS / CONTACT SECTION
            ========================================================================= */}
        <section className="relative mt-12 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-900/5 p-6 shadow-xl dark:border-emerald-500/20 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-[#070b14] sm:p-8">
          <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <MessageSquare size={13} />
                <span>Need Personalized Assistance?</span>
              </div>
              <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                Still have unanswered questions?
              </h3>
              <p className="mt-1 max-w-xl text-xs text-slate-600 dark:text-slate-300 sm:text-sm">
                Can't find what you are looking for in our FAQs? Send a question directly to your Colony Management Desk or connect with support.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsQuestionModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500"
              >
                <Send size={15} />
                <span>Ask Colony Admin</span>
              </button>

              <Link
                to="/citizen/emergency"
                className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/50"
              >
                <Radio size={15} />
                <span>Emergency Helplines</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* =========================================================================
          ASK A QUESTION MODAL
          ========================================================================= */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#0D1524] sm:p-8">
            
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setIsQuestionModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close question modal"
            >
              <X size={18} />
            </button>

            {questionSubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  Question Submitted Successfully!
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  Your inquiry has been forwarded to your colony's RWA administration team. You will receive an update in your notification feed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuestionSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <HelpCircle size={18} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Ask a Question
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Submit your question to the colony helpdesk
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={questionFormData.name}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, name: e.target.value })}
                      placeholder="e.g., Aryan Sharma"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Flat / Villa Number
                    </label>
                    <input
                      type="text"
                      required
                      value={questionFormData.flat}
                      onChange={(e) => setQuestionFormData({ ...questionFormData, flat: e.target.value })}
                      placeholder="e.g., Block B, Flat 304"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Topic Category
                  </label>
                  <select
                    value={questionFormData.topic}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, topic: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Civic Issue">Civic Problem (Roads, Water, Lighting)</option>
                    <option value="Maintenance Dues">Maintenance Fees & Accounts</option>
                    <option value="Colony Code">Society Code & Registration</option>
                    <option value="Security">Security & Parking Rules</option>
                    <option value="Events">Clubhouse & Events</option>
                    <option value="Other">Other General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Your Question or Concern
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={questionFormData.questionText}
                    onChange={(e) => setQuestionFormData({ ...questionFormData, questionText: e.target.value })}
                    placeholder="Type your question in detail here..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsQuestionModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500"
                  >
                    <Send size={13} />
                    <span>Submit Question</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          PUBLIC FOOTER (Only when standalone / not inside CitizenLayout)
          ========================================================================= */}
      {!isInsideCitizenLayout && (
        <footer className="mt-16 border-t border-slate-200/80 bg-white/60 py-8 dark:border-slate-800/80 dark:bg-[#070b14]/60">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 lg:px-8 sm:text-left">
            <div className="flex items-center gap-2">
              <img src="/logo_main.png" alt="SocioSphere" className="h-6 w-6 object-contain" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Socio<span className="text-emerald-500">Sphere</span>
              </span>
              <span className="text-xs text-slate-400">
                — One Community. Everything Connected.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-emerald-500">Home</Link>
              <a href="/#features" className="hover:text-emerald-500">Features</a>
              <Link to="/faqs" className="text-emerald-600 dark:text-emerald-400">FAQs</Link>
              <Link to="/login" className="hover:text-emerald-500">Login</Link>
              <Link to="/signup" className="hover:text-emerald-500">Sign Up</Link>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}

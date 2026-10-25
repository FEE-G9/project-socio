import {
  HelpCircle,
  Sparkles,
  FileWarning,
  ShieldAlert,
  Users,
  CreditCard,
  Lock,
} from "lucide-react";

export const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions", icon: HelpCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "getting-started", label: "Getting Started", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "issues", label: "Civic Issues", icon: FileWarning, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "safety", label: "Safety & SOS", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "community", label: "Community & Events", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
  { id: "finance", label: "Fees & Finance", icon: CreditCard, color: "text-teal-500", bg: "bg-teal-500/10" },
  { id: "privacy", label: "Account & Privacy", icon: Lock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
];

export const INITIAL_FAQS = [
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

export const getFAQs = () => {
  const stored = localStorage.getItem("sociosphere_faqs");
  if (!stored) {
    try {
      localStorage.setItem("sociosphere_faqs", JSON.stringify(INITIAL_FAQS));
    } catch {
      // ignore storage errors
    }
    return INITIAL_FAQS;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_FAQS;
  } catch (err) {
    console.error("Failed to parse stored FAQs:", err);
    return INITIAL_FAQS;
  }
};

export const saveFAQs = (faqs) => {
  try {
    localStorage.setItem("sociosphere_faqs", JSON.stringify(faqs));
  } catch (err) {
    console.error("Failed to save FAQs:", err);
  }
};

export const getUserInquiries = () => {
  try {
    const stored = localStorage.getItem("sociosphere_user_faq_inquiries");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveUserInquiries = (inquiries) => {
  try {
    localStorage.setItem("sociosphere_user_faq_inquiries", JSON.stringify(inquiries));
  } catch (err) {
    console.error("Failed to save user inquiries:", err);
  }
};

export const getFAQFeedback = () => {
  try {
    const stored = localStorage.getItem("sociosphere_faq_feedback");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const saveFAQFeedback = (feedback) => {
  try {
    localStorage.setItem("sociosphere_faq_feedback", JSON.stringify(feedback));
  } catch (err) {
    console.error("Failed to save FAQ feedback:", err);
  }
};

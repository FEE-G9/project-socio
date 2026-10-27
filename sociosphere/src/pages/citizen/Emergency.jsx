import { useState } from "react";
import {
  Phone,
  Shield,
  Ambulance,
  Flame,
  Zap,
  Droplets,
  AlertTriangle,
  MapPin,
  Star,
  StarOff,
  PhoneCall,
  Search,
  Info,
} from "lucide-react";

const FAVOURITES_KEY = "sociosphere_emergency_favourites";

// ─── All emergency contacts ───────────────────────────────────────────────────
const ALL_CONTACTS = [
  // National
  {
    id: "e-112",
    name: "National Emergency",
    number: "112",
    category: "national",
    icon: "AlertTriangle",
    desc: "Single unified emergency helpline — police, fire & medical response",
  },
  {
    id: "e-100",
    name: "Police Helpline",
    number: "100",
    category: "national",
    icon: "Shield",
    desc: "Direct local police station dispatch & emergency law enforcement",
  },
  {
    id: "e-101",
    name: "Fire & Rescue Service",
    number: "101",
    category: "national",
    icon: "Flame",
    desc: "Fire brigade dispatch & emergency disaster rescue operations",
  },
  {
    id: "e-102",
    name: "Ambulance Response",
    number: "102",
    category: "national",
    icon: "Ambulance",
    desc: "Emergency government hospital ambulance response service",
  },
  {
    id: "e-108",
    name: "Disaster & Medical EMS (108)",
    number: "108",
    category: "national",
    icon: "Ambulance",
    desc: "Accident emergency relief, trauma care & advanced life support",
  },
  {
    id: "e-1091",
    name: "Women Safety Helpline",
    number: "1091",
    category: "national",
    icon: "Phone",
    desc: "Dedicated 24×7 rapid response safety helpline for women",
  },
  {
    id: "e-1098",
    name: "Child Helpline",
    number: "1098",
    category: "national",
    icon: "Phone",
    desc: "National emergency care and protection service for children in distress",
  },
  {
    id: "e-1070",
    name: "Natural Disaster Relief",
    number: "1070",
    category: "national",
    icon: "AlertTriangle",
    desc: "State disaster management authority for flood, earthquake & storm relief",
  },
  {
    id: "e-1073",
    name: "National Highway Helpline",
    number: "1073",
    category: "national",
    icon: "AlertTriangle",
    desc: "Highway accident emergency response & towing rescue",
  },

  // Utilities
  {
    id: "e-1912",
    name: "Electricity Board Emergency",
    number: "1912",
    category: "utilities",
    icon: "Zap",
    desc: "Power outage, high voltage transformer sparking & electrical line hazards",
  },
  {
    id: "e-1916",
    name: "Water Supply & Drainage",
    number: "1916",
    category: "utilities",
    icon: "Droplets",
    desc: "Burst main pipeline, sewer line blockage & clean water supply emergency",
  },
  {
    id: "e-1800-180-1234",
    name: "LPG Gas Leak Helpline",
    number: "1800-180-1234",
    category: "utilities",
    icon: "Flame",
    desc: "Immediate LPG cylinder gas leakage & fire hazard response",
  },

  // Medical
  {
    id: "e-104",
    name: "National Health Helpline (104)",
    number: "104",
    category: "medical",
    icon: "Ambulance",
    desc: "Teleconsultation, first aid guidance & emergency blood bank locator",
  },
  {
    id: "e-1911",
    name: "AIIMS Emergency Unit",
    number: "1911",
    category: "medical",
    icon: "Ambulance",
    desc: "Central referral hospital trauma & critical intensive care triage",
  },
  {
    id: "e-9152987821",
    name: "iCall Mental Wellbeing",
    number: "9152987821",
    category: "medical",
    icon: "Phone",
    desc: "Confidential psychosocial counselling & crisis mental health support",
  },

  // Community
  {
    id: "e-colony-security",
    name: "Colony Security Gate Control",
    number: "9800000001",
    category: "community",
    icon: "Shield",
    desc: "Main security gatehouse, patrol guards & colony perimeter desk",
  },
  {
    id: "e-colony-mgmt",
    name: "Society RWA Office Helpdesk",
    number: "9800000002",
    category: "community",
    icon: "Phone",
    desc: "Society resident welfare office manager & maintenance desk",
  },
  {
    id: "e-nearest-police",
    name: "Local Police Station Desk",
    number: "9800000003",
    category: "community",
    icon: "Shield",
    desc: "Sector police station in-charge & beat officer on duty",
  },
  {
    id: "e-nearest-hospital",
    name: "Nearest General Hospital",
    number: "9800000004",
    category: "community",
    icon: "Ambulance",
    desc: "Local civil hospital casualty & emergency 24/7 reception",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Helplines" },
  { key: "national", label: "National" },
  { key: "medical", label: "Medical & Health" },
  { key: "utilities", label: "Civic Utilities" },
  { key: "community", label: "Colony Helplines" },
];

const ICON_MAP = {
  AlertTriangle,
  Shield,
  Ambulance,
  Flame,
  Zap,
  Droplets,
  Phone,
  PhoneCall,
};

function loadFavs() {
  try {
    return JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFavs(ids) {
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(ids));
}

export default function Emergency() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [favourites, setFavourites] = useState(loadFavs);

  const toggleFav = (id) => {
    const next = favourites.includes(id)
      ? favourites.filter((f) => f !== id)
      : [...favourites, id];
    setFavourites(next);
    saveFavs(next);
  };

  const filtered = ALL_CONTACTS.filter((c) => {
    const matchCat = category === "all" || c.category === category;
    const matchSearch =
      !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.number.includes(search) ||
      c.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const favContacts = ALL_CONTACTS.filter((c) => favourites.includes(c.id));

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header & SOS Hub ── */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0D1524] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
              </span>
              24/7 Rapid Response Hub
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Emergency Services & Helplines
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Immediate one-tap dialling for national law enforcement, medical trauma
              dispatch, municipal utilities, and colony security desks.
            </p>
          </div>

          {/* Primary SOS 112 Action */}
          <a
            href="tel:112"
            className="flex items-center gap-4 rounded-2xl bg-red-600 px-6 py-4 text-white shadow-lg shadow-red-600/25 transition-all hover:-translate-y-0.5 hover:bg-red-700 active:scale-[0.98] sm:min-w-64"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20">
              <PhoneCall size={24} className="animate-pulse" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-100">
                National SOS Helpline
              </p>
              <p className="text-3xl font-black leading-none tracking-tight">
                112
              </p>
            </div>
          </a>
        </div>

        {/* ── Top 4 Quick Dial Cards ── */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Police Control", number: "100", icon: Shield },
            { label: "Ambulance", number: "102", icon: Ambulance },
            { label: "Fire & Rescue", number: "101", icon: Flame },
            { label: "Women Safety", number: "1091", icon: Phone },
          ].map(({ label, number, icon: Icon }) => (
            <a
              key={number}
              href={`tel:${number}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:-translate-y-0.5 hover:border-red-400 hover:bg-white hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-red-500/60 dark:hover:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-200/80 text-slate-700 transition-colors group-hover:bg-red-50 group-hover:text-red-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-red-950/40 dark:group-hover:text-red-400">
                  <Icon size={18} />
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 transition-colors group-hover:text-red-600 dark:text-slate-500 dark:group-hover:text-red-400">
                  <PhoneCall size={12} /> Dial
                </span>
              </div>
              <div className="mt-3">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {label}
                </p>
                <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {number}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Favourites / Pinned ── */}
      {favContacts.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D1524]">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            Pinned Quick Helplines
          </div>
          <div className="flex flex-wrap gap-2.5">
            {favContacts.map((c) => (
              <a
                key={c.id}
                href={`tel:${c.number}`}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 transition-all hover:border-red-400 hover:bg-white hover:text-red-600 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-red-500 dark:hover:text-red-400"
              >
                <PhoneCall size={13} className="text-red-600 dark:text-red-400" />
                <span>{c.name}</span>
                <span className="font-mono text-slate-400 dark:text-slate-500">
                  {c.number}
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ── Search + Filter Toolbar ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search helpline or emergency service…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-800 dark:bg-[#0D1524] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                category === key
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Supportive Notice ── */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/40">
        <Info size={16} className="shrink-0 text-slate-500 dark:text-slate-400" />
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Tap any service card to dial instantly. Tap the star icon to pin high-priority
          contacts to the top of your dashboard.
        </p>
      </div>

      {/* ── Contact Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-[#0D1524]">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            No emergency services found matching "{search}"
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((contact) => {
            const Icon = ICON_MAP[contact.icon] || Phone;
            const isFav = favourites.includes(contact.id);

            return (
              <article
                key={contact.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-[#0D1524] dark:hover:border-slate-700"
              >
                {/* Card Top */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-red-50 group-hover:text-red-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-red-950/40 dark:group-hover:text-red-400">
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-900 transition-colors group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400">
                          {contact.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {contact.desc}
                        </p>
                      </div>
                    </div>

                    {/* Favourite Star */}
                    <button
                      onClick={() => toggleFav(contact.id)}
                      className="shrink-0 p-1 text-slate-300 transition-all hover:scale-110 hover:text-amber-400 dark:text-slate-600"
                      aria-label={
                        isFav ? "Remove from favourites" : "Save to favourites"
                      }
                      title={isFav ? "Remove" : "Save"}
                    >
                      {isFav ? (
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                      ) : (
                        <StarOff size={16} />
                      )}
                    </button>
                  </div>

                  {/* Metadata Row */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80">
                    <span className="rounded-md border border-slate-200/80 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-300">
                      {contact.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      24×7 Available
                    </span>
                  </div>
                </div>

                {/* Call Button */}
                <a
                  href={`tel:${contact.number}`}
                  className="group/btn mt-4 flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-white transition-all hover:bg-red-600 active:scale-[0.99] dark:bg-slate-800 dark:hover:bg-red-600"
                >
                  <span className="font-mono text-base font-extrabold tracking-wide">
                    {contact.number}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide">
                    <PhoneCall
                      size={14}
                      className="transition-transform group-hover/btn:translate-x-0.5"
                    />
                    Call Now
                  </span>
                </a>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Location Guidance Banner ── */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D1524]">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <MapPin size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            State your exact address when placing an emergency call
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Clearly mention your colony name, block number, and flat/house number so
            first responders and ambulance teams reach you immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

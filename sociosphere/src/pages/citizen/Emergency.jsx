import { useState } from "react";
import {
  Phone, Shield, Ambulance, Flame, Zap, Droplets,
  AlertTriangle, MapPin, Clock, Star, StarOff,
  PhoneCall, Search, ChevronRight, Info,
} from "lucide-react";

const FAVOURITES_KEY = "sociosphere_emergency_favourites";

// ─── All emergency contacts ───────────────────────────────────────────────────
const ALL_CONTACTS = [
  // National
  { id: "e-112",  name: "National Emergency",        number: "112",  category: "national",   icon: "AlertTriangle", color: "rose",   desc: "Single emergency helpline — police, fire & medical" },
  { id: "e-100",  name: "Police",                    number: "100",  category: "national",   icon: "Shield",        color: "blue",   desc: "Local police station emergency response" },
  { id: "e-101",  name: "Fire Brigade",              number: "101",  category: "national",   icon: "Flame",         color: "orange", desc: "Fire & rescue operations" },
  { id: "e-102",  name: "Ambulance",                 number: "102",  category: "national",   icon: "Ambulance",     color: "rose",   desc: "Medical emergency ambulance service" },
  { id: "e-108",  name: "Accident & Medical (108)",  number: "108",  category: "national",   icon: "Ambulance",     color: "rose",   desc: "Accident relief & advanced medical care" },
  { id: "e-1091", name: "Women Helpline",            number: "1091", category: "national",   icon: "Phone",         color: "pink",   desc: "24×7 safety helpline for women" },
  { id: "e-1098", name: "Child Helpline",            number: "1098", category: "national",   icon: "Phone",         color: "violet", desc: "Children in distress or emergency" },
  { id: "e-1070", name: "Natural Calamity",          number: "1070", category: "national",   icon: "AlertTriangle", color: "amber",  desc: "Flood, earthquake & natural disaster relief" },
  { id: "e-1073", name: "Road Accident Helpline",    number: "1073", category: "national",   icon: "AlertTriangle", color: "amber",  desc: "Road accident emergency response" },

  // Utilities
  { id: "e-1912", name: "Electricity Emergency",    number: "1912",  category: "utilities",  icon: "Zap",           color: "yellow", desc: "Power outage, live wire & electrical hazards" },
  { id: "e-1916", name: "Water & Drainage",         number: "1916",  category: "utilities",  icon: "Droplets",      color: "cyan",   desc: "Burst pipe, drainage overflow & water supply" },
  { id: "e-1800-180-1234", name: "LPG Gas Leak",   number: "1800-180-1234", category: "utilities", icon: "Flame", color: "orange", desc: "Gas leak emergency — Indane / HP / Bharat Gas" },

  // Medical
  { id: "e-104",  name: "Health Helpline (104)",    number: "104",   category: "medical",    icon: "Ambulance",     color: "rose",   desc: "Teleconsultation & health advice" },
  { id: "e-1911", name: "AIIMS Emergency",          number: "1911",  category: "medical",    icon: "Ambulance",     color: "rose",   desc: "AIIMS Delhi emergency department" },
  { id: "e-9152987821", name: "iCall Mental Health", number: "9152987821", category: "medical", icon: "Phone",     color: "violet", desc: "Mental health support & counselling" },

  // Community
  { id: "e-colony-security", name: "Colony Security", number: "9800000001", category: "community", icon: "Shield",   color: "emerald", desc: "Your society security control room" },
  { id: "e-colony-mgmt",     name: "Society Manager",  number: "9800000002", category: "community", icon: "Phone",    color: "emerald", desc: "Society management office helpline" },
  { id: "e-nearest-police",  name: "Nearest Police Station", number: "9800000003", category: "community", icon: "Shield", color: "blue", desc: "Your nearest local police station" },
  { id: "e-nearest-hospital",name: "Nearest Hospital", number: "9800000004", category: "community", icon: "Ambulance", color: "rose", desc: "Nearest government hospital emergency" },
];

const CATEGORIES = [
  { key: "all",       label: "All" },
  { key: "national",  label: "National" },
  { key: "medical",   label: "Medical" },
  { key: "utilities", label: "Utilities" },
  { key: "community", label: "Community" },
];

const ICON_MAP = { AlertTriangle, Shield, Ambulance, Flame, Zap, Droplets, Phone, PhoneCall };

const COLOR = {
  rose:    { bg: "bg-rose-100 dark:bg-rose-500/15",     text: "text-rose-600 dark:text-rose-400",     badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",     ring: "hover:border-rose-300 dark:hover:border-rose-500/50" },
  blue:    { bg: "bg-blue-100 dark:bg-blue-500/15",     text: "text-blue-600 dark:text-blue-400",     badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",     ring: "hover:border-blue-300 dark:hover:border-blue-500/50" },
  orange:  { bg: "bg-orange-100 dark:bg-orange-500/15", text: "text-orange-600 dark:text-orange-400", badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300", ring: "hover:border-orange-300 dark:hover:border-orange-500/50" },
  amber:   { bg: "bg-amber-100 dark:bg-amber-500/15",   text: "text-amber-600 dark:text-amber-400",   badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",   ring: "hover:border-amber-300 dark:hover:border-amber-500/50" },
  yellow:  { bg: "bg-yellow-100 dark:bg-yellow-500/15", text: "text-yellow-600 dark:text-yellow-400", badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300", ring: "hover:border-yellow-300 dark:hover:border-yellow-500/50" },
  pink:    { bg: "bg-pink-100 dark:bg-pink-500/15",     text: "text-pink-600 dark:text-pink-400",     badge: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",     ring: "hover:border-pink-300 dark:hover:border-pink-500/50" },
  violet:  { bg: "bg-violet-100 dark:bg-violet-500/15", text: "text-violet-600 dark:text-violet-400", badge: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300", ring: "hover:border-violet-300 dark:hover:border-violet-500/50" },
  cyan:    { bg: "bg-cyan-100 dark:bg-cyan-500/15",     text: "text-cyan-600 dark:text-cyan-400",     badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",     ring: "hover:border-cyan-300 dark:hover:border-cyan-500/50" },
  emerald: { bg: "bg-emerald-100 dark:bg-emerald-500/15",text: "text-emerald-600 dark:text-emerald-400",badge:"bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",ring:"hover:border-emerald-300 dark:hover:border-emerald-500/50"},
};

function loadFavs() {
  try { return JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]"); } catch { return []; }
}
function saveFavs(ids) { localStorage.setItem(FAVOURITES_KEY, JSON.stringify(ids)); }

export default function Emergency() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [favourites, setFavourites] = useState(loadFavs);
  const [calling, setCalling] = useState(null);

  const toggleFav = (id) => {
    const next = favourites.includes(id) ? favourites.filter((f) => f !== id) : [...favourites, id];
    setFavourites(next);
    saveFavs(next);
  };

  const filtered = ALL_CONTACTS.filter((c) => {
    const matchCat = category === "all" || c.category === category;
    const matchSearch = !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()) || c.number.includes(search);
    return matchCat && matchSearch;
  });

  const favContacts = ALL_CONTACTS.filter((c) => favourites.includes(c.id));

  return (
    <div className="space-y-6 pb-8">

      {/* ── Hero ── */}
      <section className="overflow-hidden rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50 via-white to-orange-50 p-6 shadow-sm dark:border-rose-500/20 dark:from-rose-500/10 dark:via-[#0D1524] dark:to-orange-500/10 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-400">
              <AlertTriangle size={14} /> Emergency Contacts
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Help is one tap away
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Police · Ambulance · Fire · Utilities · Community helplines
            </p>
          </div>

          {/* SOS quick-dial */}
          <a
            href="tel:112"
            className="inline-flex w-fit items-center gap-3 rounded-2xl bg-rose-600 px-6 py-4 text-white shadow-xl shadow-rose-500/30 transition hover:-translate-y-0.5 hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500/30"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20">
              <Phone size={22} />
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80">National Emergency</p>
              <p className="text-2xl font-extrabold leading-none">112</p>
            </div>
          </a>
        </div>

        {/* Top-4 quick dials */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Police",     number: "100", color: "bg-blue-600",   icon: Shield },
            { label: "Ambulance",  number: "102", color: "bg-rose-600",   icon: Ambulance },
            { label: "Fire",       number: "101", color: "bg-orange-500", icon: Flame },
            { label: "Women Help", number: "1091",color: "bg-pink-600",   icon: Phone },
          ].map(({ label, number, color, icon: Icon }) => (
            <a
              key={number}
              href={`tel:${number}`}
              className={`flex items-center gap-3 rounded-2xl ${color} p-4 text-white transition hover:-translate-y-0.5 hover:opacity-90 shadow-md`}
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide opacity-75">{label}</p>
                <p className="text-xl font-extrabold leading-none">{number}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Favourites ── */}
      {favContacts.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/5">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            <Star size={13} className="fill-amber-400 text-amber-400" /> Saved contacts
          </p>
          <div className="flex flex-wrap gap-2">
            {favContacts.map((c) => {
              const col = COLOR[c.color] || COLOR.rose;
              return (
                <a
                  key={c.id}
                  href={`tel:${c.number}`}
                  className={`flex items-center gap-2 rounded-xl border border-transparent bg-white px-3 py-2 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 dark:bg-slate-900 ${col.text}`}
                >
                  <PhoneCall size={14} /> {c.name} · {c.number}
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Search + Filter ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or number…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                category === key
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tip banner ── */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
        <Info size={16} className="mt-0.5 shrink-0 text-blue-500" />
        <p className="text-xs leading-5 text-blue-700 dark:text-blue-300">
          <strong>Tap any card</strong> to call directly from your phone. <strong>Star</strong> contacts to pin them to the top. Community numbers (society, hospital) are illustrative — update them in Settings.
        </p>
      </div>

      {/* ── Contact grid ── */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-[#0D1524]">
          <p className="text-sm text-slate-500 dark:text-slate-400">No contacts found for "{search}"</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((contact) => {
            const Icon = ICON_MAP[contact.icon] || Phone;
            const col  = COLOR[contact.color] || COLOR.rose;
            const isFav = favourites.includes(contact.id);

            return (
              <article
                key={contact.id}
                className={`group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#0D1524] ${col.ring}`}
              >
                {/* Favourite toggle */}
                <button
                  onClick={() => toggleFav(contact.id)}
                  className="absolute right-4 top-4 text-slate-300 transition hover:scale-110 dark:text-slate-600"
                  aria-label={isFav ? "Remove from favourites" : "Save to favourites"}
                  title={isFav ? "Remove" : "Save"}
                >
                  {isFav
                    ? <Star size={16} className="fill-amber-400 text-amber-400" />
                    : <StarOff size={16} className="hover:text-amber-400" />}
                </button>

                <div className="flex items-start gap-4 pr-6">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${col.bg}`}>
                    <Icon size={22} className={col.text} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{contact.name}</p>
                    <p className="mt-0.5 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{contact.desc}</p>
                  </div>
                </div>

                <a
                  href={`tel:${contact.number}`}
                  className={`mt-4 flex items-center justify-between rounded-xl border px-4 py-3 transition ${col.bg} border-transparent hover:opacity-90`}
                >
                  <span className={`text-lg font-extrabold tracking-wide ${col.text}`}>{contact.number}</span>
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${col.text}`}>
                    <PhoneCall size={14} /> Call now
                  </div>
                </a>

                <div className="mt-2 flex items-center gap-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${col.badge}`}>{contact.category}</span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                    <Clock size={9} /> Available 24 × 7
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Location note ── */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-[#0D1524]">
        <MapPin size={18} className="shrink-0 text-emerald-500" />
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-white">Share your location when calling</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Always state your full address &amp; colony name so emergency services reach you faster.
          </p>
        </div>
      </div>
    </div>
  );
}


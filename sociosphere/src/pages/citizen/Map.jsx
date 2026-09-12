import React, { useState, useEffect } from "react";
import CommunityMap from "../../components/map/CommunityMap";
import MapFilters from "../../components/map/MapFilters";
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  X,
  ChevronRight,
  ShieldAlert,
  Droplets,
  Zap,
  Trash2,
  Navigation,
  Compass,
} from "lucide-react";

  import { useTheme } from "../../context/ThemeContext";
// Default neighborhood coordinates & mock pins if localStorage is empty
const defaultMapPins = [
  {
    id: "ISSUE-8492",
    title: "Major Water Leakage near Basement P2 Entrance",
    category: "Water Leakage",
    description:
      "Continuous fresh water gushing from overhead pipe junction near ramp. Slippery floor causing safety hazard.",
    location: "Basement P2, Pillar B-14",
    priority: "HIGH PRIORITY",
    status: "In Progress",
    statusClass: "progress",
    date: "Today, 08:30 AM",
    eta: "Today, 2:00 PM",
    icon: Droplets,
    x: 28,
    y: 72,
    image:
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ISSUE-8419",
    title: "Broken Storm Drain Grate on North Boulevard",
    category: "Drainage",
    description:
      "Heavy cast-iron grate collapsed inward creating a 2-foot open hole in vehicle driveway.",
    location: "Block B - North Boulevard Curve",
    priority: "CRITICAL PRIORITY",
    priorityClass: "critical",
    status: "In Progress",
    statusClass: "progress",
    date: "Yesterday, 04:15 PM",
    eta: "Tomorrow, 11:00 AM",
    icon: AlertTriangle,
    x: 68,
    y: 22,
    image:
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "CRM-2026-8819",
    title: "Suspicious Activity & Vehicle Inspection near Gate 3",
    category: "Suspicious Activity",
    description:
      "Unidentified individual observing parked vehicles near North Drive. Security patrol dispatched.",
    location: "Sector 4 - Visitor Parking Gate 3",
    priority: "CRITICAL THREAT",
    priorityClass: "critical",
    status: "Security Dispatched",
    statusClass: "progress",
    date: "Today, 10:15 PM",
    eta: "Patrol En Route",
    icon: ShieldAlert,
    x: 84,
    y: 54,
    image:
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ISSUE-8390",
    title: "Flickering High-Mast Streetlight at Gate 3",
    category: "Streetlight",
    description:
      "Main LED luminaire strobing erratically since evening storm. Driver scheduled.",
    location: "Gate 3 Visitor Entrance",
    priority: "MEDIUM PRIORITY",
    priorityClass: "medium",
    status: "Resolved",
    statusClass: "resolved",
    date: "Aug 25, 07:20 PM",
    eta: "Resolved",
    icon: Zap,
    x: 48,
    y: 42,
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "ISSUE-8354",
    title: "Overflowing Recycling Bin near Clubhouse Wing",
    category: "Garbage",
    description:
      "Cardboard packing boxes and plastic containers overflowing after weekend event.",
    location: "Clubhouse Lawn East Wing",
    priority: "LOW PRIORITY",
    priorityClass: "low",
    status: "Resolved",
    statusClass: "resolved",
    date: "Aug 24, 10:30 AM",
    eta: "Resolved",
    icon: Trash2,
    x: 74,
    y: 78,
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Map({ onClose, isEmbedded = false }) {
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [mapMode, setMapMode] = useState("markers"); // 'markers' | 'heatmap'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [allPins, setAllPins] = useState([]);

  // Load user reports from localStorage and assign coordinates if needed
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("sociosphere_user_reports") || "[]"
      );

      // Predefined grid coordinate pairs to distribute user reports nicely across Sector 4 map
      const sampleCoords = [
        { x: 22, y: 35 },
        { x: 38, y: 64 },
        { x: 62, y: 38 },
        { x: 78, y: 48 },
        { x: 32, y: 82 },
        { x: 82, y: 28 },
      ];

      const formattedUserReports = stored.map((item, idx) => {
        const coord = sampleCoords[idx % sampleCoords.length];
        return {
          ...item,
          x: item.x ?? coord.x,
          y: item.y ?? coord.y,
        };
      });

      if (formattedUserReports.length > 0) {
        setAllPins([...formattedUserReports, ...defaultMapPins]);
      } else {
        setAllPins(defaultMapPins);
      }
    } catch (e) {
      console.error("Failed to load map pins:", e);
      setAllPins(defaultMapPins);
    }
  }, []);

  // Filter pins based on category, status, and search query
  const filteredPins = allPins.filter((pin) => {
    // Category match
    if (activeCategory !== "all") {
      const cat = (pin.category || "").toLowerCase();
      if (activeCategory === "water" && !cat.includes("water") && !cat.includes("leak")) return false;
      if (activeCategory === "drainage" && !cat.includes("drain")) return false;
      if (activeCategory === "electric" && !cat.includes("light") && !cat.includes("electric")) return false;
      if (activeCategory === "garbage" && !cat.includes("garbage") && !cat.includes("waste")) return false;
      if (
        activeCategory === "crime" &&
        !cat.includes("crime") &&
        !cat.includes("theft") &&
        !cat.includes("vandalism") &&
        !cat.includes("safety") &&
        !cat.includes("security") &&
        !pin.id?.startsWith("CRM-")
      )
        return false;
    }

    // Status match
    if (activeStatus !== "all") {
      if (activeStatus === "progress" && pin.status !== "In Progress" && pin.status !== "Security Dispatched")
        return false;
      if (activeStatus === "resolved" && pin.status !== "Resolved" && pin.status !== "Logged")
        return false;
      if (
        activeStatus === "critical" &&
        pin.priorityClass !== "critical" &&
        !pin.priority?.includes("CRITICAL")
      )
        return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (pin.title || "").toLowerCase().includes(q);
      const matchLoc = (pin.location || "").toLowerCase().includes(q);
      const matchId = (pin.id || "").toLowerCase().includes(q);
      const matchCat = (pin.category || "").toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchId && !matchCat) return false;
    }

    return true;
  });

  const activeCount = allPins.filter(
    (p) => p.status === "In Progress" || p.status === "Security Dispatched"
  ).length;

  const resolvedCount = allPins.filter(
    (p) => p.status === "Resolved" || p.status === "Logged"
  ).length;

  const criticalCount = allPins.filter(
    (p) => p.priorityClass === "critical" || p.priority?.includes("CRITICAL")
  ).length;

  return (
    <main className={`${theme === "light" ? "theme-light" : "theme-dark"} ${isEmbedded ? "p-0" : "min-h-screen bg-[#070B14]"} text-[#F8FAFC]`}>
      {/* Header (rendered if not embedded inside modal) */}
      {!isEmbedded && (
        <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-[#080E1A] backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition-colors hover:text-emerald-400"
              onClick={() => (onClose ? onClose() : window.history.back())}
            >
              <ArrowLeft size={18} />
              Back to dashboard
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Compass size={18} />
              Live Interactive Civic Heatmap
            </div>
          </div>
        </header>
      )}

      <div className={`mx-auto max-w-7xl ${isEmbedded ? "p-2 sm:p-4" : "px-4 py-6 sm:px-6 sm:py-8 lg:px-8"}`}>
        {/* Title & Stats Row */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-400">
              GIS Community Grid
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Sector 4 Live Problem Heatmap
            </h1>
            <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
              Real-time spatial visualization of maintenance issues, security dispatch, and municipal repairs.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 text-xs">
            <div className="rounded-xl border border-slate-800 bg-[#0D1524] px-3 py-2 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-500">Total Pins</span>
              <span className="text-base font-extrabold text-blue-400">{allPins.length}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#0D1524] px-3 py-2 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-500">Active</span>
              <span className="text-base font-extrabold text-amber-400">{activeCount}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#0D1524] px-3 py-2 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-500">Critical</span>
              <span className="text-base font-extrabold text-rose-400">{criticalCount}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#0D1524] px-3 py-2 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-500">Resolved</span>
              <span className="text-base font-extrabold text-emerald-400">{resolvedCount}</span>
            </div>
          </div>
        </div>

        {/* Map Filters Bar */}
        <div className="mb-4">
          <MapFilters
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            mapMode={mapMode}
            setMapMode={setMapMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        {/* Main Map Component & Side Inspector Grid */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <CommunityMap
            issues={filteredPins}
            selectedIssue={selectedIssue}
            setSelectedIssue={setSelectedIssue}
            mapMode={mapMode}
          />

          {/* Side Issue Inspector / Selected Details Panel */}
          <aside className="space-y-4">
            {selectedIssue ? (
              <div className="relative rounded-2xl border border-slate-800 bg-[#0D1524] p-5 text-slate-100 shadow-2xl animate-fade-in">
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="Close Inspector"
                >
                  <X size={18} />
                </button>

                <div className="mb-3 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {selectedIssue.id}
                  </span>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 uppercase">
                    {selectedIssue.status}
                  </span>
                </div>

                <h3 className="mb-2 text-base font-bold text-slate-100">
                  {selectedIssue.title}
                </h3>

                {selectedIssue.image && (
                  <div className="mb-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    <img
                      src={selectedIssue.image}
                      alt={selectedIssue.title}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                )}

                <p className="mb-4 text-xs leading-5 text-slate-400">
                  {selectedIssue.description}
                </p>

                <div className="space-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-semibold text-slate-200">{selectedIssue.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Priority:</span>
                    <span className="font-semibold text-amber-400">{selectedIssue.priority}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-semibold text-blue-400 truncate max-w-[170px]">
                      {selectedIssue.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Reported Date:</span>
                    <span className="text-slate-300">{selectedIssue.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Expected ETA:</span>
                    <span className="font-bold text-emerald-400">{selectedIssue.eta}</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-800 pt-4">
                  <button
                    onClick={() => alert(`Tracking technician dispatch for ${selectedIssue.id}`)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-500 shadow-md shadow-blue-600/20"
                  >
                    <Navigation size={15} />
                    Track Technician Dispatch
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-[#0D1524]/60 p-8 text-center text-slate-400">
                <MapPin size={36} className="mb-3 text-blue-400/60" />
                <h3 className="text-sm font-bold text-slate-200">Interactive Map Inspector</h3>
                <p className="mt-1 text-xs text-slate-500 leading-5">
                  Click on any pin on the map to inspect full report details, images, technician ETA, and live status.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

import React from "react";
import {
  Search,
  Filter,
  Layers,
  Flame,
  MapPin,
  X,
  Droplets,
  Zap,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  SlidersHorizontal,
  Compass,
} from "lucide-react";

const categories = [
  { id: "all", label: "All Categories", icon: Compass },
  { id: "water", label: "Water & Leakage", icon: Droplets },
  { id: "drainage", label: "Drainage", icon: AlertTriangle },
  { id: "electric", label: "Electrical & Lights", icon: Zap },
  { id: "garbage", label: "Waste & Garbage", icon: Trash2 },
  { id: "crime", label: "Crime & Security", icon: ShieldAlert },
];

export default function MapFilters({
  activeCategory,
  setActiveCategory,
  activeStatus,
  setActiveStatus,
  mapMode,
  setMapMode,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#0D1524] p-4 text-slate-100 shadow-xl backdrop-blur-md">
      {/* Top Search & Controls Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search map by location, issue title, or ID..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-10 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Map Display Mode Toggles */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/90 p-1">
          <button
            onClick={() => setMapMode("markers")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              mapMode === "markers"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MapPin size={14} />
            Pins
          </button>
          <button
            onClick={() => setMapMode("heatmap")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              mapMode === "heatmap"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame size={14} />
            Heatmap
          </button>
        </div>
      </div>

      {/* Categories Horizontal Scroll / Grid */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
          <SlidersHorizontal size={14} /> Filter:
        </span>

        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-400 font-bold shadow-sm"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Icon size={14} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Status Secondary Filter Pills */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80 text-xs">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-2">
          Status:
        </span>
        {["all", "progress", "resolved", "critical"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`rounded-lg px-2.5 py-1 capitalize text-xs font-medium transition-all ${
              activeStatus === status
                ? "bg-slate-700 text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {status === "all" ? "All Statuses" : status}
          </button>
        ))}
      </div>
    </div>
  );
}

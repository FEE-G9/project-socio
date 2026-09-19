import React from "react";
import {
  Droplets,
  Zap,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function IssueMarker({ issue, isSelected, onClick }) {
  const getMarkerIcon = () => {
    if (issue.icon) return issue.icon;
    const cat = (issue.category || "").toLowerCase();
    if (cat.includes("water") || cat.includes("leak")) return Droplets;
    if (cat.includes("drain")) return AlertTriangle;
    if (cat.includes("light") || cat.includes("electric")) return Zap;
    if (cat.includes("waste") || cat.includes("garbage")) return Trash2;
    if (
      cat.includes("crime") ||
      cat.includes("theft") ||
      cat.includes("vandalism") ||
      cat.includes("safety") ||
      cat.includes("security")
    )
      return ShieldAlert;
    return AlertTriangle;
  };

  const Icon = getMarkerIcon();

  const isCrime =
    (issue.id && issue.id.startsWith("CRM-")) ||
    (issue.category || "").toLowerCase().includes("crime") ||
    (issue.priorityClass === "critical");

  const isResolved = issue.status === "Resolved";

  // Color scheme determination
  const getMarkerStyles = () => {
    if (isResolved) {
      return {
        bg: "bg-emerald-500",
        border: "border-emerald-400",
        ring: "ring-emerald-500/30",
        text: "text-emerald-400",
        glow: "shadow-emerald-500/30",
      };
    }
    if (isCrime) {
      return {
        bg: "bg-rose-600",
        border: "border-rose-400",
        ring: "ring-rose-500/40",
        text: "text-rose-400",
        glow: "shadow-rose-600/50",
      };
    }
    if (issue.priorityClass === "high" || issue.priorityClass === "critical") {
      return {
        bg: "bg-amber-500",
        border: "border-amber-400",
        ring: "ring-amber-500/30",
        text: "text-amber-400",
        glow: "shadow-amber-500/30",
      };
    }
    return {
      bg: "bg-blue-500",
      border: "border-blue-400",
      ring: "ring-blue-500/30",
      text: "text-blue-400",
      glow: "shadow-blue-500/30",
    };
  };

  const styles = getMarkerStyles();

  // Position coordinates (fallback to deterministic layout if x/y not provided)
  const posX = issue.x ?? 50;
  const posY = issue.y ?? 50;

  return (
    <div
      onClick={onClick}
      style={{ left: `${posX}%`, top: `${posY}%` }}
      className={`group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 hover:z-30 ${
        isSelected ? "scale-125 z-40" : "hover:scale-110"
      }`}
    >
      {/* Outer Pulse Ring */}
      {!isResolved && (
        <span
          className={`absolute -inset-2 rounded-full opacity-75 animate-ping ${styles.bg}`}
        />
      )}

      {/* Main Marker Pin */}
      <div
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 ${styles.border} ${styles.bg} text-white shadow-lg ${styles.glow} transition-transform duration-200`}
      >
        <Icon size={18} strokeWidth={2.2} />
      </div>

      {/* ID Label tag */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950/90 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-300 border border-slate-800 shadow-md">
        {issue.id}
      </div>

      {/* Hover Tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 mb-3 hidden -translate-x-1/2 w-48 rounded-xl border border-slate-800 bg-[#0D1524] p-2.5 text-xs shadow-2xl group-hover:block z-50">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className={`font-mono text-[10px] font-bold ${styles.text}`}>
            {issue.id}
          </span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-slate-300">
            {issue.status}
          </span>
        </div>
        <h4 className="font-bold text-slate-100 line-clamp-1 leading-tight">
          {issue.title}
        </h4>
        <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
          {issue.location}
        </p>
      </div>
    </div>
  );
}

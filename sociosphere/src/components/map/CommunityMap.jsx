import React, { useState } from "react";
import IssueMarker from "./IssueMarker";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  MapPin,
  Layers,
  Sparkles,
  Navigation,
} from "lucide-react";

export default function CommunityMap({
  issues = [],
  selectedIssue,
  setSelectedIssue,
  mapMode = "markers",
}) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#070B14] shadow-2xl select-none">
      {/* Map Canvas Background Grid & Sector SVG Layout */}
      <div
        className="relative h-full w-full transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Dark Grid Lines Pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
            backgroundSize: "32px 32px, 64px 64px, 64px 64px",
          }}
        />

        {/* Vector Drawing of Sector 4 Layout */}
        <svg
          className="absolute inset-0 h-full w-full opacity-40 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Perimeter Road */}
          <rect
            x="5%"
            y="5%"
            width="90%"
            height="90%"
            rx="24"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="8 6"
          />

          {/* Internal Block Rectangles */}
          <rect
            x="12%"
            y="12%"
            width="32%"
            height="32%"
            rx="16"
            fill="#0D1524"
            stroke="#1E293B"
            strokeWidth="2"
          />
          <text
            x="28%"
            y="28%"
            fill="#64748B"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            BLOCK A (Towers 1-4)
          </text>

          <rect
            x="56%"
            y="12%"
            width="32%"
            height="32%"
            rx="16"
            fill="#0D1524"
            stroke="#1E293B"
            strokeWidth="2"
          />
          <text
            x="72%"
            y="28%"
            fill="#64748B"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            BLOCK B (Towers 5-8)
          </text>

          <rect
            x="12%"
            y="56%"
            width="32%"
            height="32%"
            rx="16"
            fill="#0D1524"
            stroke="#1E293B"
            strokeWidth="2"
          />
          <text
            x="28%"
            y="72%"
            fill="#64748B"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            BASEMENT P1/P2 & PARKING
          </text>

          <circle
            cx="72%"
            cy="72%"
            r="14%"
            fill="#081426"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x="72%"
            y="72%"
            fill="#34D399"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            CLUBHOUSE & LAWNS
          </text>

          {/* Promenade Central Axis */}
          <line
            x1="50%"
            y1="5%"
            x2="50%"
            y2="95%"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <line
            x1="5%"
            y1="50%"
            x2="95%"
            y2="50%"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Heatmap Overlay Layer (rendered when mapMode === 'heatmap') */}
        {mapMode === "heatmap" && (
          <div className="absolute inset-0 pointer-events-none">
            {issues.map((issue) => {
              const posX = issue.x ?? 50;
              const posY = issue.y ?? 50;
              const isCritical =
                issue.priorityClass === "critical" ||
                (issue.id && issue.id.startsWith("CRM-"));

              return (
                <div
                  key={`heat-${issue.id}`}
                  style={{
                    left: `${posX}%`,
                    top: `${posY}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className={`absolute rounded-full filter blur-2xl opacity-60 ${
                    isCritical
                      ? "h-44 w-44 bg-rose-500/50"
                      : "h-36 w-36 bg-amber-500/40"
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Render Issue Markers */}
        {issues.map((issue) => (
          <IssueMarker
            key={issue.id}
            issue={issue}
            isSelected={selectedIssue?.id === issue.id}
            onClick={() => setSelectedIssue(issue)}
          />
        ))}
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-3 rounded-xl border border-slate-800 bg-[#080E1A]/90 px-3.5 py-2 backdrop-blur-md text-xs text-slate-300 shadow-xl">
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          Crime / Critical
        </span>
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          High Priority
        </span>
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Medium / Low
        </span>
        <span className="flex items-center gap-1.5 font-semibold">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Resolved
        </span>
      </div>

      {/* Map Control Buttons (Zoom & Reset) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 rounded-xl border border-slate-800 bg-[#080E1A]/90 p-1.5 backdrop-blur-md shadow-xl">
        <button
          onClick={handleZoomIn}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={17} />
        </button>
        <button
          onClick={handleZoomOut}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={17} />
        </button>
        <button
          onClick={handleResetZoom}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Reset Zoom"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {/* Compass / Location Indicator */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-xl border border-slate-800 bg-[#080E1A]/90 px-3 py-1.5 text-xs font-bold text-slate-200 backdrop-blur-md shadow-lg">
        <Compass size={16} className="text-blue-400" />
        Greenwood Heights • Sector 4 Grid Map
      </div>
    </div>
  );
}

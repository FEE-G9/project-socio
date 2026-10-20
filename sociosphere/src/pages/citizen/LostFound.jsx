import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Tag,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shield,
  HelpCircle,
  Phone,
  Mail,
  User,
  Sparkles,
  Filter,
  X,
  MessageSquare,
  Gift,
  Share2,
  Trash2,
  ExternalLink,
  ChevronRight,
  PackageSearch,
  Eye,
  Check,
  Building2,
  Lock,
} from "lucide-react";
import { useLostFound } from "../../context/LostFoundContext";
import { useAuth } from "../../context/AuthContext";

// Quick Image Presets for rapid and realistic reporting
const PRESET_IMAGES = [
  {
    label: "Keys",
    icon: "🔑",
    url: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
    category: "Keys",
  },
  {
    label: "Wallet",
    icon: "👛",
    url: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    category: "Wallets & IDs",
  },
  {
    label: "Phone / Earbuds",
    icon: "🎧",
    url: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
  },
  {
    label: "Pet Dog / Cat",
    icon: "🐾",
    url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    category: "Pets",
  },
  {
    label: "Bag / Backpack",
    icon: "🎒",
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    category: "Bags & Luggage",
  },
  {
    label: "Eyewear",
    icon: "👓",
    url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
  },
  {
    label: "Car / Bike Fob",
    icon: "🚗",
    url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    category: "Keys",
  },
  {
    label: "Documents",
    icon: "📄",
    url: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80",
    category: "Documents",
  },
];

const CATEGORIES = [
  "All",
  "Wallets & IDs",
  "Keys",
  "Electronics",
  "Pets",
  "Bags & Luggage",
  "Accessories",
  "Documents",
  "Other",
];

export default function LostFound() {
  const { user } = useAuth();
  const {
    items,
    addItem,
    deleteItem,
    markAsResolved,
    submitClaim,
    resolveClaim,
    addComment,
    stats,
  } = useLostFound();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "lost" | "found" | "my" | "reunited"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSociety, setSelectedSociety] = useState("all");

  // Modal states
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState("lost"); // "lost" | "found"
  const [selectedItem, setSelectedItem] = useState(null); // for detail modal
  const [claimModalItem, setClaimModalItem] = useState(null); // for claim modal

  // Forms
  const [reportForm, setReportForm] = useState({
    title: "",
    category: "Keys",
    location: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    reward: "",
    securityHint: "",
    phone: user?.phone || "+91 98000 00000",
    image: "",
    society: user?.society || user?.communityName || "Gandhi Colony",
  });

  const [claimForm, setClaimForm] = useState({
    claimantName: user?.name && !user.name.includes("@") ? user.name : "",
    claimantEmail: user?.email || "",
    claimantPhone: user?.phone || "",
    proofDescription: "",
  });

  const [newCommentText, setNewCommentText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const userEmail = (user?.email || "").trim().toLowerCase();
  const userSociety = (user?.society || user?.communityName || "Gandhi Colony").trim();

  // Open report modal helper
  const handleOpenReportModal = (type = "lost") => {
    setReportModalType(type);
    setReportForm({
      title: "",
      category: type === "lost" ? "Wallets & IDs" : "Keys",
      location: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      reward: "",
      securityHint: "",
      phone: user?.phone || "+91 98000 00000",
      image: "",
      society: userSociety,
    });
    setReportModalOpen(true);
  };

  // Submit report
  const handleCreateReport = (e) => {
    e.preventDefault();
    if (!reportForm.title.trim()) {
      showToast("Please provide an item title.");
      return;
    }

    addItem({
      ...reportForm,
      type: reportModalType,
    });

    setReportModalOpen(false);
    showToast(
      `🎉 Successfully posted ${reportModalType === "lost" ? "Lost" : "Found"} item report!`
    );
  };

  // Submit claim
  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimForm.proofDescription.trim()) {
      showToast("Please provide proof details or answer the verification question.");
      return;
    }

    if (!claimModalItem) return;

    submitClaim(claimModalItem.id, claimForm);
    setClaimModalItem(null);
    setClaimForm({
      claimantName: user?.name && !user.name.includes("@") ? user.name : "",
      claimantEmail: user?.email || "",
      claimantPhone: user?.phone || "",
      proofDescription: "",
    });
    showToast("Ownership claim submitted! The poster has been notified to review your details.");
  };

  // Add discussion lead
  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedItem) return;

    addComment(selectedItem.id, {
      text: newCommentText,
      author: user?.name && !user.name.includes("@") ? user.name : "Resident",
      authorEmail: user?.email || "",
    });

    // Update selected item in modal view
    setSelectedItem((prev) => ({
      ...prev,
      comments: [
        ...(prev.comments || []),
        {
          id: `c-${Date.now()}`,
          author: user?.name && !user.name.includes("@") ? user.name : "Resident",
          authorEmail: user?.email || "",
          text: newCommentText,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    setNewCommentText("");
    showToast("Community lead posted!");
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Tab filter
      if (activeTab === "lost" && (item.type !== "lost" || item.status === "claimed")) return false;
      if (activeTab === "found" && (item.type !== "found" || item.status === "claimed")) return false;
      if (activeTab === "reunited" && item.status !== "claimed") return false;
      if (activeTab === "my") {
        const isMine =
          (item.reportedByEmail && item.reportedByEmail.toLowerCase() === userEmail) ||
          item.reportedById === user?.id;
        if (!isMine) return false;
      }

      // 2. Category filter
      if (selectedCategory !== "All" && item.category !== selectedCategory) {
        return false;
      }

      // 3. Society filter
      if (selectedSociety !== "all") {
        const soc = (item.society || item.communityName || "").toLowerCase();
        if (soc !== selectedSociety.toLowerCase()) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const locMatch = item.location?.toLowerCase().includes(query);
        const reporterMatch = item.reportedBy?.toLowerCase().includes(query);
        const catMatch = item.category?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !locMatch && !reporterMatch && !catMatch) {
          return false;
        }
      }

      return true;
    });
  }, [items, activeTab, selectedCategory, selectedSociety, searchQuery, userEmail, user?.id]);

  // Check if item belongs to current user
  const isOwner = (item) => {
    if (!item) return false;
    if (userEmail && item.reportedByEmail?.toLowerCase() === userEmail) return true;
    if (user?.id && item.reportedById === user.id) return true;
    return false;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-slate-900/95 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          HERO BANNER & HEADER
      ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/20 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/10" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <PackageSearch className="h-3.5 w-3.5" />
              <span>SocioSphere Community Registry</span>
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Citizen Lost &amp; Found
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Safely recover misplaced items, assist fellow neighbors in <strong className="text-slate-900 dark:text-white">{userSociety}</strong>, and verify ownership with built-in security questions.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenReportModal("lost")}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/30 active:scale-95"
            >
              <AlertCircle className="h-4 w-4" />
              <span>Report Lost Item</span>
            </button>

            <button
              onClick={() => handleOpenReportModal("found")}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>I Found An Item</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Items</span>
              <PackageSearch className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {stats.total}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">Listed across societies</span>
          </div>

          <div className="rounded-2xl border border-rose-200/70 bg-rose-50/50 p-4 shadow-sm backdrop-blur dark:border-rose-900/40 dark:bg-rose-950/20">
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Lost</span>
              <AlertCircle className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-black text-rose-700 dark:text-rose-300">
              {stats.lostCount}
            </p>
            <span className="text-xs text-rose-600/80 dark:text-rose-400/80">Neighbors searching</span>
          </div>

          <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/50 p-4 shadow-sm backdrop-blur dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Found Items</span>
              <Shield className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {stats.foundCount}
            </p>
            <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80">Safely kept for owner</span>
          </div>

          <div className="rounded-2xl border border-purple-200/70 bg-purple-50/50 p-4 shadow-sm backdrop-blur dark:border-purple-900/40 dark:bg-purple-950/20">
            <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Reunited</span>
              <Sparkles className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-black text-purple-700 dark:text-purple-300">
              {stats.resolvedCount}
            </p>
            <span className="text-xs text-purple-600/80 dark:text-purple-400/80">Returned to rightful owner</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          SEARCH & FILTER BAR
      ======================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name, location, brand, or keyword..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-10 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Society Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <Building2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>Society:</span>
              <select
                value={selectedSociety}
                onChange={(e) => setSelectedSociety(e.target.value)}
                className="bg-transparent font-bold text-slate-900 outline-none dark:text-white cursor-pointer"
              >
                <option value="all">All Societies</option>
                <option value="Gandhi Colony">Gandhi Colony</option>
                <option value="Shayam Nagar">Shayam Nagar</option>
                <option value="Dalima Vihar">Dalima Vihar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status / Scope Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <span>All Listings</span>
            <span className="rounded-full bg-slate-200/50 px-1.5 py-0.5 text-[10px] dark:bg-slate-700">
              {items.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("lost")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "lost"
                ? "bg-rose-600 text-white shadow-sm shadow-rose-600/30"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Lost Items</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
              {stats.lostCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("found")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "found"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Found Items</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
              {stats.foundCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("my")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "my"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>My Reports</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
              {
                items.filter(
                  (i) =>
                    (i.reportedByEmail && i.reportedByEmail.toLowerCase() === userEmail) ||
                    i.reportedById === user?.id
                ).length
              }
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reunited")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "reunited"
                ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Reunited ({stats.resolvedCount})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          ITEM CARDS GRID
      ======================================================== */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/50 p-12 text-center dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <PackageSearch className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            No items found
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {searchQuery
              ? `No items matching "${searchQuery}". Try adjusting your search query or filters.`
              : "No lost or found items listed in this category yet. Be the first to report!"}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => handleOpenReportModal("lost")}
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-500"
            >
              Report Lost Item
            </button>
            <button
              onClick={() => handleOpenReportModal("found")}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
            >
              Report Found Item
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const isItemLost = item.type === "lost";
            const isResolved = item.status === "claimed";
            const itemIsMine = isOwner(item);

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = isItemLost
                        ? "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80"
                        : "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80";
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top Badges */}
                  <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md ${
                        isItemLost ? "bg-rose-600" : "bg-emerald-600"
                      }`}
                    >
                      {isItemLost ? (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          <span>LOST</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-3 w-3" />
                          <span>FOUND</span>
                        </>
                      )}
                    </span>

                    {isResolved && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md">
                        <Sparkles className="h-3 w-3" />
                        <span>REUNITED</span>
                      </span>
                    )}
                  </div>

                  {/* Reward Badge */}
                  {item.reward && !isResolved && (
                    <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-black text-slate-950 shadow-md">
                      <Gift className="h-3 w-3" />
                      <span>{item.reward}</span>
                    </div>
                  )}

                  {/* Category Pill at bottom of image */}
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-lg bg-slate-950/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    {/* Location & Society */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="shrink-0 font-bold text-slate-700 dark:text-slate-300">
                        {item.society || item.communityName}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-2 text-lg font-bold text-slate-900 line-clamp-1 dark:text-white">
                      {item.title}
                    </h3>

                    {/* Description Snippet */}
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-300">
                      {item.description}
                    </p>

                    {/* Security verification required notice */}
                    {item.securityHint && (
                      <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
                        <Lock className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span className="truncate">
                          Proof required: {item.securityHint}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Reporter & Date Footer */}
                  <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            item.reporterAvatar ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                          }
                          alt={item.reportedBy}
                          className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-900 line-clamp-1 dark:text-white">
                            {item.reportedBy}
                            {itemIsMine && (
                              <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                                (You)
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {item.date}
                          </p>
                        </div>
                      </div>

                      {/* Leads / Claims counts */}
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {item.claims && item.claims.length > 0 && (
                          <span
                            className="flex items-center gap-0.5 font-bold text-amber-500"
                            title={`${item.claims.length} claims submitted`}
                          >
                            <Shield className="h-3 w-3" />
                            {item.claims.length}
                          </span>
                        )}
                        {item.comments && item.comments.length > 0 && (
                          <span
                            className="flex items-center gap-0.5"
                            title={`${item.comments.length} community leads`}
                          >
                            <MessageSquare className="h-3 w-3" />
                            {item.comments.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </button>

                      {!isResolved && !itemIsMine && (
                        <button
                          onClick={() => setClaimModalItem(item)}
                          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90 ${
                            isItemLost
                              ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20"
                              : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"
                          }`}
                        >
                          <Shield className="h-3.5 w-3.5" />
                          <span>{isItemLost ? "I Found This" : "Claim Item"}</span>
                        </button>
                      )}

                      {!isResolved && itemIsMine && (
                        <button
                          onClick={() => {
                            markAsResolved(item.id);
                            showToast("🎉 Celebrations! Item marked as successfully reunited!");
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 py-2 text-xs font-bold text-white shadow-sm shadow-purple-600/20 hover:bg-purple-500"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Mark Reunited</span>
                        </button>
                      )}

                      {itemIsMine && (
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this listing?")) {
                              deleteItem(item.id);
                              showToast("Listing deleted.");
                            }
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          CREATE / REPORT ITEM MODAL
      ======================================================== */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <button
              onClick={() => setReportModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <PackageSearch className="h-3.5 w-3.5" />
                <span>New Community Listing</span>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                Report a Lost or Found Item
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Provide accurate details to help citizens verify and recover items safely.
              </p>
            </div>

            {/* Type Selector Toggle */}
            <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => {
                  setReportModalType("lost");
                  setReportForm((prev) => ({ ...prev, category: "Wallets & IDs" }));
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  reportModalType === "lost"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <AlertCircle className="h-4 w-4" />
                <span>I Lost Something</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setReportModalType("found");
                  setReportForm((prev) => ({ ...prev, category: "Keys", reward: "" }));
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  reportModalType === "found"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>I Found Something</span>
              </button>
            </div>

            {/* Report Form */}
            <form onSubmit={handleCreateReport} className="mt-6 space-y-4 text-left">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  value={reportForm.title}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, title: e.target.value })
                  }
                  placeholder={
                    reportModalType === "lost"
                      ? "e.g., Black Apple Leather Wallet with Punjab ID"
                      : "e.g., Set of 3 Godrej Keys with Marvel Keychain"
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Category *
                  </label>
                  <select
                    value={reportForm.category}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, category: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Society / Community *
                  </label>
                  <select
                    value={reportForm.society}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, society: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Gandhi Colony">Gandhi Colony</option>
                    <option value="Shayam Nagar">Shayam Nagar</option>
                    <option value="Dalima Vihar">Dalima Vihar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Exact Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={reportForm.location}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, location: e.target.value })
                    }
                    placeholder="e.g., Central Park Bench, Lift 2 Block B"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Date {reportModalType === "lost" ? "Lost" : "Found"} *
                  </label>
                  <input
                    type="date"
                    required
                    value={reportForm.date}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, date: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reportForm.description}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, description: e.target.value })
                  }
                  placeholder="Describe color, size, recognizable marks, where it was last seen, or where it is kept safely..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Security Question / Hint for claiming */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <Lock className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Security Verification Question (To verify real owner)</span>
                </label>
                <input
                  type="text"
                  value={reportForm.securityHint}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, securityHint: e.target.value })
                  }
                  placeholder="e.g., What is engraved inside? What is the phone wallpaper?"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Optional Reward for Lost Items */}
              {reportModalType === "lost" && (
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    <Gift className="h-3.5 w-3.5 text-amber-500" />
                    <span>Optional Reward Amount</span>
                  </label>
                  <input
                    type="text"
                    value={reportForm.reward}
                    onChange={(e) =>
                      setReportForm({ ...reportForm, reward: e.target.value })
                    }
                    placeholder="e.g., ₹1,000 Cash Reward or Complimentary Lunch"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              )}

              {/* Quick Image Presets */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Photo: Click a Quick Preset or Paste Custom URL
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setReportForm({
                          ...reportForm,
                          image: preset.url,
                          category: preset.category,
                        });
                      }}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                        reportForm.image === preset.url
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={reportForm.image}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, image: e.target.value })
                  }
                  placeholder="Or paste an image URL (https://...)"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={reportForm.phone}
                  onChange={(e) =>
                    setReportForm({ ...reportForm, phone: e.target.value })
                  }
                  placeholder="+91 98000 00000"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-lg transition ${
                    reportModalType === "lost"
                      ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30"
                      : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                  }`}
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          ITEM DETAILS & COMMUNITY LEADS MODAL
      ======================================================== */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Top Info */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider text-white ${
                  selectedItem.type === "lost" ? "bg-rose-600" : "bg-emerald-600"
                }`}
              >
                {selectedItem.type === "lost" ? "LOST ITEM" : "FOUND ITEM"}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {selectedItem.category}
              </span>

              {selectedItem.status === "claimed" && (
                <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-black text-white">
                  REUNITED &amp; RESOLVED
                </span>
              )}

              {selectedItem.reward && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-black text-slate-950">
                  <Gift className="h-3.5 w-3.5" />
                  <span>{selectedItem.reward}</span>
                </span>
              )}
            </div>

            <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
              {selectedItem.title}
            </h2>

            {/* Media & Details Layout */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="h-64 w-full object-cover"
                />
              </div>

              <div className="space-y-4 text-left">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Location &amp; Society
                  </h4>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                    <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{selectedItem.location}</span>
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {selectedItem.society || selectedItem.communityName} ({selectedItem.date})
                  </p>
                </div>

                {/* Reporter Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Posted By Resident
                  </h4>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          selectedItem.reporterAvatar ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                        }
                        alt={selectedItem.reportedBy}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {selectedItem.reportedBy}
                        </p>
                        <p className="text-xs text-slate-500">
                          {selectedItem.reportedByEmail}
                        </p>
                      </div>
                    </div>

                    {selectedItem.phone && (
                      <a
                        href={`tel:${selectedItem.phone}`}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
                      >
                        <Phone className="h-3 w-3" />
                        <span>Call</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Security Verification Hint */}
                {selectedItem.securityHint && (
                  <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                      <Lock className="h-4 w-4" />
                      <span>Security Verification Hint</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                      {selectedItem.securityHint}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Description
              </h4>
              <p className="mt-2 rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                {selectedItem.description}
              </p>
            </div>

            {/* Submitted Claims Section (Visible to reporter or if claims exist) */}
            {selectedItem.claims && selectedItem.claims.length > 0 && (
              <div className="mt-6 border-t border-slate-200/80 pt-6 text-left dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Shield className="h-4 w-4 text-amber-500" />
                    <span>Submitted Ownership Claims ({selectedItem.claims.length})</span>
                  </h4>
                </div>

                <div className="mt-3 space-y-3">
                  {selectedItem.claims.map((claim) => (
                    <div
                      key={claim.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800/80"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {claim.claimantName} • {claim.claimantPhone}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {new Date(claim.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                            claim.status === "approved"
                              ? "bg-emerald-500 text-white"
                              : claim.status === "rejected"
                              ? "bg-rose-500 text-white"
                              : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-white">Proof Provided:</strong>{" "}
                        {claim.proofDescription}
                      </p>

                      {/* Poster can approve/reject claim */}
                      {isOwner(selectedItem) && claim.status === "pending" && (
                        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={() => {
                              resolveClaim(selectedItem.id, claim.id, "approved");
                              setSelectedItem((prev) => ({
                                ...prev,
                                status: "claimed",
                                claims: (prev.claims || []).map((c) =>
                                  c.id === claim.id ? { ...c, status: "approved" } : c
                                ),
                              }));
                              showToast("Claim approved! Item status marked as Reunited!");
                            }}
                            className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                          >
                            <Check className="h-3 w-3" />
                            <span>Verify &amp; Hand Over</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              resolveClaim(selectedItem.id, claim.id, "rejected");
                              setSelectedItem((prev) => ({
                                ...prev,
                                claims: (prev.claims || []).map((c) =>
                                  c.id === claim.id ? { ...c, status: "rejected" } : c
                                ),
                              }));
                              showToast("Claim rejected.");
                            }}
                            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            Reject Claim
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Leads & Discussion Thread */}
            <div className="mt-6 border-t border-slate-200/80 pt-6 text-left dark:border-slate-800">
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <MessageSquare className="h-4 w-4 text-emerald-500" />
                <span>Community Leads &amp; Clues ({selectedItem.comments?.length || 0})</span>
              </h4>

              {/* Comments list */}
              <div className="mt-3 space-y-2.5 max-h-48 overflow-y-auto">
                {selectedItem.comments && selectedItem.comments.length > 0 ? (
                  selectedItem.comments.map((comm) => (
                    <div
                      key={comm.id}
                      className="rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>{comm.author}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comm.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">
                        {comm.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">
                    No community clues posted yet. Be the first to share a lead!
                  </p>
                )}
              </div>

              {/* Add Comment / Lead */}
              <form onSubmit={handlePostComment} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Share a clue (e.g. 'Left at security desk', 'Saw on bench at 5 PM')..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
                >
                  Post Lead
                </button>
              </form>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              {selectedItem.status !== "claimed" && !isOwner(selectedItem) && (
                <button
                  type="button"
                  onClick={() => {
                    const it = selectedItem;
                    setSelectedItem(null);
                    setClaimModalItem(it);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500"
                >
                  <Shield className="h-4 w-4" />
                  <span>Submit Ownership Claim / I Found This</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-xl px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUBMIT CLAIM / VERIFICATION MODAL
      ======================================================== */}
      {claimModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 text-left">
            <button
              onClick={() => setClaimModalItem(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Shield className="h-3.5 w-3.5" />
              <span>Ownership Verification</span>
            </div>

            <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
              {claimModalItem.type === "lost"
                ? `Report Found Item: "${claimModalItem.title}"`
                : `Claim Ownership of "${claimModalItem.title}"`}
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Please provide identifying proof or answers to security questions to help verify ownership.
            </p>

            {claimModalItem.securityHint && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  Question from Poster:
                </p>
                <p className="mt-0.5 text-xs text-slate-700 dark:text-slate-300">
                  "{claimModalItem.securityHint}"
                </p>
              </div>
            )}

            <form onSubmit={handleClaimSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={claimForm.claimantName}
                  onChange={(e) =>
                    setClaimForm({ ...claimForm, claimantName: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={claimForm.claimantPhone}
                    onChange={(e) =>
                      setClaimForm({ ...claimForm, claimantPhone: e.target.value })
                    }
                    placeholder="+91 98000 00000"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={claimForm.claimantEmail}
                    onChange={(e) =>
                      setClaimForm({ ...claimForm, claimantEmail: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Proof of Ownership / Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={claimForm.proofDescription}
                  onChange={(e) =>
                    setClaimForm({
                      ...claimForm,
                      proofDescription: e.target.value,
                    })
                  }
                  placeholder="Describe unique markings, scratches, interior items, lock screen wallpaper, or where you found it..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setClaimModalItem(null)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500"
                >
                  Submit Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

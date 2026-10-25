import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  FAQ_CATEGORIES,
  INITIAL_FAQS,
  getFAQs,
  saveFAQs,
  getUserInquiries,
  saveUserInquiries,
  getFAQFeedback,
  saveFAQFeedback,
} from "../data/mockFAQs";
import { useAuth } from "./AuthContext";

export const FAQContext = createContext(null);

export const FAQProvider = ({ children }) => {
  const { user } = useAuth();

  // Core Data
  const [faqs, setFaqs] = useState(() => getFAQs());
  const [userInquiries, setUserInquiries] = useState(() => getUserInquiries());
  const [feedbackGiven, setFeedbackGiven] = useState(() => getFAQFeedback());

  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Accordion open/close items (stores Set of FAQ ids)
  const [openItems, setOpenItems] = useState(
    () => new Set(["gs-1", "is-1", "sf-1"])
  );

  // Copied link toast / indicator
  const [copiedId, setCopiedId] = useState(null);

  // Ask a question modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    flat: user?.residence || user?.flat || "",
    topic: "Civic Issue",
    questionText: "",
  });
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // Keep question form user info in sync when user logs in or profile changes
  useEffect(() => {
    if (user) {
      setQuestionFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        flat: user.residence || user.flat || prev.flat,
      }));
    }
  }, [user]);

  // Sync across tabs if storage changes
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "sociosphere_faqs") {
        setFaqs(getFAQs());
      }
      if (e.key === "sociosphere_user_faq_inquiries") {
        setUserInquiries(getUserInquiries());
      }
      if (e.key === "sociosphere_faq_feedback") {
        setFeedbackGiven(getFAQFeedback());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Filtered FAQ items based on category and search query
  const filteredFAQs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inQuestion = item.question?.toLowerCase().includes(q);
      const inAnswer = item.answer?.toLowerCase().includes(q);
      const inTags = item.tags?.some((tag) => tag.toLowerCase().includes(q));

      return inQuestion || inAnswer || inTags;
    });
  }, [faqs, selectedCategory, searchQuery]);

  // Toggle single item accordion state
  const toggleItem = useCallback((id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Expand all currently filtered items
  const expandAll = useCallback(() => {
    setOpenItems(new Set(filteredFAQs.map((item) => item.id)));
  }, [filteredFAQs]);

  // Collapse all items
  const collapseAll = useCallback(() => {
    setOpenItems(new Set());
  }, []);

  // Check if all filtered FAQs are expanded
  const areAllExpanded = useMemo(() => {
    return (
      filteredFAQs.length > 0 &&
      filteredFAQs.every((item) => openItems.has(item.id))
    );
  }, [filteredFAQs, openItems]);

  // Toggle between Expand All and Collapse All
  const handleToggleAll = useCallback(() => {
    if (areAllExpanded) {
      collapseAll();
    } else {
      expandAll();
    }
  }, [areAllExpanded, collapseAll, expandAll]);

  // Reset all filters to default
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
  }, []);

  // Handle helpful feedback rating
  const handleFeedback = useCallback((id, type) => {
    setFeedbackGiven((prev) => {
      const updated = { ...prev, [id]: type };
      saveFAQFeedback(updated);
      return updated;
    });
  }, []);

  // Handle share / copy question link
  const handleShare = useCallback((id, questionText) => {
    const url = `${window.location.origin}/faqs#${id}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(
        `${questionText} - Find answers on SocioSphere: ${url}`
      );
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  }, []);

  // Modal open / close handlers
  const openQuestionModal = useCallback(() => {
    setIsQuestionModalOpen(true);
  }, []);

  const closeQuestionModal = useCallback(() => {
    setIsQuestionModalOpen(false);
  }, []);

  // Submit question inquiry
  const handleQuestionSubmit = useCallback(
    (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (!questionFormData.questionText.trim()) return;

      const newInquiry = {
        id: Date.now(),
        ...questionFormData,
        date: new Date().toISOString(),
      };

      const current = getUserInquiries();
      const updated = [newInquiry, ...current];
      saveUserInquiries(updated);
      setUserInquiries(updated);

      setQuestionSubmitted(true);
      setTimeout(() => {
        setQuestionSubmitted(false);
        setIsQuestionModalOpen(false);
        setQuestionFormData((prev) => ({ ...prev, questionText: "" }));
      }, 2200);
    },
    [questionFormData]
  );

  // Add a new FAQ entry
  const addFaq = useCallback((newFaq) => {
    setFaqs((prev) => {
      const updated = [newFaq, ...prev];
      saveFAQs(updated);
      return updated;
    });
  }, []);

  const value = {
    // Data & Categories
    faqs,
    setFaqs,
    categories: FAQ_CATEGORIES,
    filteredFAQs,
    userInquiries,
    addFaq,

    // Search & Category Filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    resetFilters,

    // Accordion Expansion
    openItems,
    setOpenItems,
    toggleItem,
    expandAll,
    collapseAll,
    handleToggleAll,
    areAllExpanded,

    // Feedback & Sharing
    feedbackGiven,
    handleFeedback,
    copiedId,
    handleShare,

    // Ask Question Modal & Form
    isQuestionModalOpen,
    setIsQuestionModalOpen,
    openQuestionModal,
    closeQuestionModal,
    questionFormData,
    setQuestionFormData,
    questionSubmitted,
    handleQuestionSubmit,
  };

  return <FAQContext.Provider value={value}>{children}</FAQContext.Provider>;
};

export const useFAQ = () => {
  const context = useContext(FAQContext);
  if (!context) {
    throw new Error("useFAQ must be used within an FAQProvider");
  }
  return context;
};

// Convenient alias
export const useFaq = useFAQ;

export default FAQContext;

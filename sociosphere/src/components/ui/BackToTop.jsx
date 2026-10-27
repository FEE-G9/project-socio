import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";

const SCROLL_THRESHOLD = 320;

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasChatButton =
    location.pathname.startsWith("/citizen") ||
    location.pathname.startsWith("/authority");

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed ${
        hasChatButton
          ? "bottom-20 right-[22px] sm:bottom-6 sm:right-[30px]"
          : "bottom-6 right-4 sm:bottom-6 sm:right-6"
      } z-40 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500 text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-emerald-600 hover:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 dark:border-emerald-400 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-600 ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      aria-label="Back to top"
      title="Back to top"
    >
      <ChevronUp size={22} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}


import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  MessageSquare,
  ShieldAlert,
  Wallet,
  Play,
  BookOpen,
  HelpCircle,
  GraduationCap,
} from "lucide-react";

const tutorials = [
  {
    number: "01",
    title: "Login & Registration",
    description:
      "Learn how to create your account, register as a Citizen or Authority, and access your personalized dashboard.",
    icon: Users,
    label: "Getting Started",
    video: "/Create_account_final.mp4",
    videoTitle: "Create Your Account & Get Started",
  },
  {
    number: "02",
    title: "Community Issues",
    description:
      "Learn how to report colony problems, submit complaints, and follow the status of reported issues.",
    icon: MessageSquare,
    label: "Community Services",
    video: "/report_issue.mp4",
    videoTitle: "Report and Track Community Issues",
  },
  {
    number: "03",
    title: "Crime Reporting",
    description:
      "Learn how to report crime-related concerns and use the community safety reporting features.",
    icon: ShieldAlert,
    label: "Community Safety",
    video: "/report_crime.mp4",
    videoTitle: "Community Crime Reporting Guide",
  },
  {
    number: "04",
    title: "Expenses & Finance",
    description:
      "Explore society expenses, understand financial information, and learn about contribution requests.",
    icon: Wallet,
    label: "Financial Transparency",
    video: "/expenses.mp4",
    videoTitle: "Understanding Society Finances",
  },
];

function HowItWorks() {
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const videoSectionRef = useRef(null);

  const openTutorial = (tutorial) => {
    setSelectedTutorial(tutorial);

    setTimeout(() => {
      videoSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#071510] px-5 py-8 text-white sm:px-8 md:py-12">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/[0.08] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-green-500/[0.06] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Navigation */}
        <div className="mb-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo_main.png"
              alt="SocioSphere Logo"
              className="h-10 w-10 rounded-xl object-contain"
            />
            <span className="text-lg font-bold">
              Socio<span className="text-emerald-400">Sphere</span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white"
          >
            <ArrowLeft size={15} />
            Home
          </Link>
        </div>

        {/* Introduction */}
        <section className="mb-20 max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2">
            <GraduationCap size={16} className="text-emerald-400" />
            <span className="text-xs font-semibold tracking-widest text-emerald-300">
              SOCIOSPHERE TUTORIAL CENTER
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Learn How to Use{" "}
            <span className="text-emerald-400">SocioSphere</span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-gray-400 md:text-lg">
            New to SocioSphere? Explore our tutorials to learn how
            to create your account, report community issues, use
            safety features, and understand society finances.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#tutorial-categories"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-[#04130d] transition hover:bg-emerald-400"
            >
              Explore Tutorials
              <ArrowRight size={16} />
            </a>

            <a
              href="#website-walkthrough"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-white"
            >
              <Play size={16} />
              Full Website Walkthrough
            </a>
          </div>
        </section>

        {/* Tutorial Categories */}
        <section
          id="tutorial-categories"
          className="mb-20 scroll-mt-10"
        >
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              LEARN STEP BY STEP
            </p>

            <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Explore Tutorial Categories
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                  Choose a category to watch its corresponding video
                  and learn how the feature works.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <BookOpen size={16} />
                Platform Guides
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {tutorials.map((tutorial) => {
              const Icon = tutorial.icon;
              const isSelected =
                selectedTutorial?.number === tutorial.number;

              return (
                <button
                  type="button"
                  key={tutorial.number}
                  onClick={() => openTutorial(tutorial)}
                  aria-pressed={isSelected}
                  className={`group flex h-full flex-col rounded-2xl border p-6 text-left transition duration-300 hover:-translate-y-1 hover:bg-[#10251a] focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    isSelected
                      ? "border-emerald-400 bg-[#10251a]"
                      : "border-white/[0.07] bg-[#0b1c14]/90 hover:border-emerald-400/30"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400 transition group-hover:bg-emerald-400/15">
                      <Icon size={22} strokeWidth={1.7} />
                    </div>

                    <span className="text-sm font-semibold text-gray-600">
                      {tutorial.number}
                    </span>
                  </div>

                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-400">
                    {tutorial.label}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {tutorial.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-gray-400">
                    {tutorial.description}
                  </p>

                  <div className="mt-6 flex w-full items-center justify-between border-t border-white/[0.07] pt-5 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">
                    <span>
                      {isSelected ? "Selected Tutorial" : "Watch Tutorial"}
                    </span>
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Category Video */}
        <section
          id="tutorial-video"
          ref={videoSectionRef}
          className="mb-24 scroll-mt-8"
        >
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              {selectedTutorial
                ? `TUTORIAL ${selectedTutorial.number}`
                : "YOUR LEARNING GUIDE"}
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {selectedTutorial ? (
                selectedTutorial.title
              ) : (
                <>
                  Choose a{" "}
                  <span className="text-emerald-400">Tutorial</span>
                </>
              )}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400 md:text-base">
              {selectedTutorial
                ? selectedTutorial.description
                : "Select any category above to watch its tutorial video here."}
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-[#10291b] via-[#0b1c14] to-[#08140e] p-4 sm:p-8">
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-black">
              {selectedTutorial ? (
                <video
                  key={selectedTutorial.video}
                  className="aspect-video w-full bg-black"
                  controls
                  preload="metadata"
                  playsInline
                >
                  <source
                    src={selectedTutorial.video}
                    type="video/mp4"
                  />
                  Your browser does not support HTML video.
                </video>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center px-5 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400">
                    <Play size={26} fill="currentColor" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold sm:text-2xl">
                    Your Tutorial Awaits
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
                    Click a tutorial category above to play its video.
                  </p>
                </div>
              )}
            </div>

            {selectedTutorial && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-400">
                  {selectedTutorial.label}
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  {selectedTutorial.videoTitle}
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                  Follow this video to understand how to use the{" "}
                  {selectedTutorial.title.toLowerCase()} features
                  in SocioSphere.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {tutorials
                    .filter(
                      (tutorial) =>
                        tutorial.number !== selectedTutorial.number
                    )
                    .map((tutorial) => (
                      <button
                        type="button"
                        key={tutorial.number}
                        onClick={() => openTutorial(tutorial)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:border-emerald-400/30 hover:bg-emerald-400/[0.06] hover:text-white"
                      >
                        {tutorial.title}
                        <ArrowRight size={14} />
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Complete Website Walkthrough */}
        <section
          id="website-walkthrough"
          className="mb-24 scroll-mt-10"
        >
          <div className="mb-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2">
              <Play size={14} className="text-emerald-400" />
              <span className="text-xs font-semibold tracking-widest text-emerald-300">
                COMPLETE WEBSITE GUIDE
              </span>
            </div>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Explore the Complete{" "}
              <span className="text-emerald-400">
                SocioSphere Workflow
              </span>
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400 md:text-base">
              Discover how SocioSphere works from start to finish,
              including community services, safety features, and
              financial transparency.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-[#10291b] via-[#0b1c14] to-[#08140e] p-4 sm:p-8">
            <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-black">
              <video
                key="/walkthrough.mp4"
                className="aspect-video w-full bg-black"
                controls
                preload="metadata"
                playsInline
              >
                <source
                  src="/walkthrough.mp4"
                  type="video/mp4"
                />
                Your browser does not support HTML video.
              </video>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                ONE COMMUNITY. EVERYTHING CONNECTED.
              </p>

              <h3 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                Your Complete Guide to SocioSphere
              </h3>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400">
                Watch the complete website demonstration to understand
                how residents can access community features, report
                issues, explore safety tools, and track society finances.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-20 rounded-2xl border border-white/[0.07] bg-[#0b1c14]/80 p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400">
                <HelpCircle size={22} />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Still have questions?
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                  Find answers to common questions about SocioSphere
                  and its community features.
                </p>
              </div>
            </div>

            <Link
              to="/faqs"
              className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/[0.15] hover:text-white"
            >
              Visit FAQs
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/[0.07] pt-7 sm:flex-row">
          <p className="text-xs text-gray-500">
            © SocioSphere
          </p>

          <p className="text-center text-xs font-medium tracking-[0.15em] text-emerald-400">
            ONE COMMUNITY. EVERYTHING CONNECTED.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-emerald-400"
          >
            Back to Home
            <ArrowRight size={15} />
          </Link>
        </footer>
      </div>
    </div>
  );
}

export default HowItWorks;

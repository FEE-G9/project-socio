import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Compass } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-12 transition-colors duration-200">
      <div className="max-w-md w-full text-center">
        {/* Brand Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
          <img
            src="/logo_main.png"
            alt="SocioSphere"
            className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Socio<span className="text-emerald-500">Sphere</span>
          </span>
        </Link>

        {/* 404 Illustration / Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
            <Compass className="w-12 h-12 stroke-[1.75]" />
          </div>
          <div className="mt-4 text-7xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
            404
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or the link may be broken.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-sm shadow-emerald-500/20"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

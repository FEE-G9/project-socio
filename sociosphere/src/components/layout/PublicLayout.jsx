import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import ScrollReveal from "../ui/ScrollReveal";

const PublicLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <main>
        <ScrollReveal key={location.pathname} className="min-h-screen">
          <Outlet />
        </ScrollReveal>
      </main>
    </div>
  );
};

export default PublicLayout;
import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import CitizenLayout from "./components/layout/CitizenLayout";
import AuthorityLayout from "./components/layout/AuthorityLayout";
import GroupChat from "./components/community/GroupChat";

import Landing from "./pages/public/Landing";
import SignUp from "./pages/public/Sign_up";
import Login from "./pages/public/Login";
import FAQs from "./pages/public/FAQs";
import NotFound from "./pages/public/NotFound";
import HowItWorks from "./pages/public/HowItWorks";

import Report from "./pages/citizen/Report";
import ReportCrime from "./pages/citizen/ReportCrime";

import Home from "./pages/citizen/Home";
import Dashboard from "./pages/citizen/Dashboard";
import Profile from "./pages/citizen/Profile";
import Settings from "./pages/citizen/Settings";
import Announcements from "./pages/citizen/Announcements";
import Events from "./pages/citizen/Events";
import Maintenance from "./pages/citizen/Maintenance";
import LostFound from "./pages/citizen/LostFound";
import Expenses from "./pages/citizen/Expenses";
import Community from "./pages/citizen/Community";
import Emergency from "./pages/citizen/Emergency";

import AdminHome from "./pages/authority/Admin";
import Analytics from "./pages/authority/Analytics";
import Issues from "./pages/authority/Issues";
import Crimes from "./pages/authority/Crimes";
import Members from "./pages/authority/Members";
import ManageEmergency from "./pages/authority/ManageEmergency";
import ManageFees from "./pages/authority/ManageFees";
import AuthorityProfile from "./pages/authority/AuthorityProfile";

import { useAuth } from "./context/AuthContext";
import RedAlertOverlay from "./components/ui/RedAlertOverlay";
import BackToTop from "./components/ui/BackToTop";

function App() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const isAuthority = location.pathname.startsWith("/authority");
  const isProtectedPath = location.pathname.startsWith("/citizen") || location.pathname.startsWith("/authority");

  return (
    <>
      {!isAuthority && isAuthenticated && user && <RedAlertOverlay />}

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/faq" element={<Navigate to="/faqs" replace />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/howitworks" element={<Navigate to="/how-it-works" replace />} />
        </Route>

        {/* ================= CITIZEN ================= */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Navigate to="/login" replace />} />
          <Route path="report" element={<Report />} />
          <Route path="report-crime" element={<ReportCrime />} />
          <Route path="lost-found" element={<LostFound />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="fees" element={<Maintenance />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="events" element={<Events />} />
          <Route path="community" element={<Community />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="faq" element={<Navigate to="/citizen/faqs" replace />} />
        </Route>

        {/* ================= AUTHORITY ================= */}
        <Route path="/authority" element={<AuthorityLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="issues" element={<Issues />} />
          <Route path="crimes" element={<Crimes />} />
          <Route path="members" element={<Members />} />
          <Route path="emergency" element={<ManageEmergency />} />
          <Route path="fees" element={<ManageFees />} />
          <Route path="expenses" element={<Navigate to="/authority/fees" replace />} />
          <Route path="profile" element={<AuthorityProfile />} />
          <Route path="faqs" element={<Navigate to="/authority/home" replace />} />
          <Route path="faq" element={<Navigate to="/authority/home" replace />} />
        </Route>

        {/* ================= 404 / FALLBACK ================= */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isAuthenticated && user && isProtectedPath && <GroupChat />}
      <BackToTop />
    </>
  );
}

export default App;

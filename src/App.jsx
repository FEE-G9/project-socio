import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CitizenLayout from './components/layout/CitizenLayout';

// Lazy load citizen pages to optimize bundle size
const Home = React.lazy(() => import('./pages/citizen/Home'));
const Dashboard = React.lazy(() => import('./pages/citizen/Dashboard'));
const Profile = React.lazy(() => import('./pages/citizen/Profile'));
const IssueDetail = React.lazy(() => import('./pages/citizen/IssueDetail'));
const Report = React.lazy(() => import('./pages/citizen/Report'));
const ReportCrime = React.lazy(() => import('./pages/citizen/ReportCrime'));
const Map = React.lazy(() => import('./pages/citizen/Map'));
const Community = React.lazy(() => import('./pages/citizen/Community'));
const Announcements = React.lazy(() => import('./pages/citizen/Announcements'));
const Fees = React.lazy(() => import('./pages/citizen/Fees'));
const Expenses = React.lazy(() => import('./pages/citizen/Expenses'));

/**
 * App Component
 * 
 * Main application router configuration.
 * Sets up nested routes with layouts for different user types (public, citizen, authority).
 * Currently configured for citizen routes with CitizenLayout wrapper.
 */
function App() {
  return (
    <Routes>
      {/* Citizen Routes */}
      <Route path="/citizen" element={<CitizenLayout />}>
        {/* Home - default citizen page */}
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        
        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Profile */}
        <Route path="profile" element={<Profile />} />
        
        {/* Issues & Reports */}
        <Route path="issues" element={<IssueDetail />} />
        <Route path="issue/:id" element={<IssueDetail />} />
        <Route path="report" element={<Report />} />
        <Route path="report-crime" element={<ReportCrime />} />
        
        {/* Map */}
        <Route path="map" element={<Map />} />
        
        {/* Community */}
        <Route path="community" element={<Community />} />
        
        {/* Announcements */}
        <Route path="announcements" element={<Announcements />} />
        
        {/* Finances */}
        <Route path="fees" element={<Fees />} />
        <Route path="expenses" element={<Expenses />} />
      </Route>

      {/* Redirect root to citizen home */}
      <Route path="/" element={<Navigate to="/citizen/home" replace />} />

      {/* Catch-all for undefined routes */}
      <Route path="*" element={<Navigate to="/citizen/home" replace />} />
    </Routes>
  );
}

export default App;
 
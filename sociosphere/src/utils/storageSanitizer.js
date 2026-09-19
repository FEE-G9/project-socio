// Storage Sanitizer to prevent QuotaExceededError and clean bloated base64 images from localStorage

import { INITIAL_ISSUES } from '../data/mockIssues';
import { INITIAL_CRIMES } from '../data/mockCrimes';

export function sanitizeLocalStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    // 1. Sanitize sociosphere_issues
    const rawIssues = localStorage.getItem('sociosphere_issues');
    if (!rawIssues) {
      localStorage.setItem('sociosphere_issues', JSON.stringify(INITIAL_ISSUES));
    } else {
      try {
        const issues = JSON.parse(rawIssues);
        if (Array.isArray(issues)) {
          if (issues.length === 0) {
            localStorage.setItem('sociosphere_issues', JSON.stringify(INITIAL_ISSUES));
          } else {
            let modified = false;
            const cleaned = issues.map((iss) => {
              if (iss.image && (iss.image.startsWith('data:') || iss.image.length > 500)) {
                modified = true;
                return { ...iss, image: null };
              }
              return iss;
            });
            if (modified) {
              localStorage.setItem('sociosphere_issues', JSON.stringify(cleaned));
            }
          }
        }
      } catch (e) {
        localStorage.setItem('sociosphere_issues', JSON.stringify(INITIAL_ISSUES));
      }
    }

    // 2. Sanitize sociosphere_crimes_v2
    const rawCrimes = localStorage.getItem('sociosphere_crimes_v2');
    if (!rawCrimes) {
      localStorage.setItem('sociosphere_crimes_v2', JSON.stringify(INITIAL_CRIMES));
    } else {
      try {
        const crimes = JSON.parse(rawCrimes);
        if (Array.isArray(crimes)) {
          if (crimes.length === 0) {
            localStorage.setItem('sociosphere_crimes_v2', JSON.stringify(INITIAL_CRIMES));
          } else {
            let modified = false;
            const cleaned = crimes.map((crm) => {
              if (crm.image && (crm.image.startsWith('data:') || crm.image.length > 500)) {
                modified = true;
                return { ...crm, image: null };
              }
              return crm;
            });
            if (modified) {
              localStorage.setItem('sociosphere_crimes_v2', JSON.stringify(cleaned));
            }
          }
        }
      } catch (e) {
        localStorage.setItem('sociosphere_crimes_v2', JSON.stringify(INITIAL_CRIMES));
      }
    }

    // 3. Sanitize sociosphere_user_reports
    const rawReports = localStorage.getItem('sociosphere_user_reports');
    if (rawReports) {
      try {
        const reports = JSON.parse(rawReports);
        if (Array.isArray(reports)) {
          let modified = false;
          const cleaned = reports.map((rep) => {
            if (rep.image && (rep.image.startsWith('data:') || rep.image.length > 500)) {
              modified = true;
              return { ...rep, image: null };
            }
            return rep;
          });
          if (modified) {
            localStorage.setItem('sociosphere_user_reports', JSON.stringify(cleaned));
          }
        }
      } catch (e) {
        localStorage.removeItem('sociosphere_user_reports');
      }
    }
  } catch (err) {
    console.warn('LocalStorage sanitation encountered non-critical error:', err);
  }
}

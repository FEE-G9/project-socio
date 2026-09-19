import React, { createContext, useContext, useState, useEffect } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [adminAlert, setAdminAlert] = useState(null);
  
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(() => {
    const saved = localStorage.getItem('sociosphere_acknowledged_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  // Check on initial load
  useEffect(() => {
    const currentAlertStr = localStorage.getItem('sociosphere_admin_alert');
    if (currentAlertStr) {
      try {
        const currentAlert = JSON.parse(currentAlertStr);
        if (!acknowledgedAlerts.includes(currentAlert.id)) {
          setAdminAlert(currentAlert);
        }
      } catch (e) {
        console.error("Failed to parse alert", e);
      }
    }
  }, [acknowledgedAlerts]);

  // Listen for storage events across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'sociosphere_admin_alert') {
        if (e.newValue) {
          try {
            const newAlert = JSON.parse(e.newValue);
            const ackAlerts = JSON.parse(localStorage.getItem('sociosphere_acknowledged_alerts') || '[]');
            if (!ackAlerts.includes(newAlert.id)) {
              setAdminAlert(newAlert);
            }
          } catch (err) {
            console.error(err);
          }
        } else {
          setAdminAlert(null);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const triggerAdminAlert = (type, directive) => {
    const newAlert = {
      id: Date.now(),
      type: type,
      directive: directive,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('sociosphere_admin_alert', JSON.stringify(newAlert));
  };

  const dismissAdminAlert = () => {
    if (adminAlert) {
      const newAck = [...acknowledgedAlerts, adminAlert.id];
      setAcknowledgedAlerts(newAck);
      localStorage.setItem('sociosphere_acknowledged_alerts', JSON.stringify(newAck));
      setAdminAlert(null);
    }
  };

  return (
    <AlertContext.Provider value={{ adminAlert, triggerAdminAlert, dismissAdminAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

import React, { createContext, useContext, useState, useEffect } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [adminAlert, setAdminAlert] = useState(null);
  const [citizenSOS, setCitizenSOS] = useState(null);
  
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(() => {
    const saved = localStorage.getItem('sociosphere_acknowledged_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  // Check on initial load
  useEffect(() => {
    // 1. Admin broadcast alert
    const currentAlertStr = localStorage.getItem('sociosphere_admin_alert');
    if (currentAlertStr) {
      try {
        const currentAlert = JSON.parse(currentAlertStr);
        if (!acknowledgedAlerts.includes(currentAlert.id)) {
          setAdminAlert(currentAlert);
        }
      } catch (e) {
        console.error("Failed to parse admin alert", e);
      }
    }

    // 2. Citizen SOS alert
    const currentSOSStr = localStorage.getItem('sociosphere_citizen_sos');
    if (currentSOSStr) {
      try {
        const currentSOS = JSON.parse(currentSOSStr);
        if (currentSOS && currentSOS.status !== 'RESOLVED') {
          setCitizenSOS(currentSOS);
        }
      } catch (e) {
        console.error("Failed to parse citizen SOS", e);
      }
    }
  }, [acknowledgedAlerts]);

  // Listen for storage events across tabs & custom window events
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

      if (e.key === 'sociosphere_citizen_sos') {
        if (e.newValue) {
          try {
            const newSOS = JSON.parse(e.newValue);
            if (newSOS.status === 'RESOLVED') {
              setCitizenSOS(null);
            } else {
              setCitizenSOS(newSOS);
            }
          } catch (err) {
            console.error(err);
          }
        } else {
          setCitizenSOS(null);
        }
      }
    };

    const handleCustomSOSUpdate = () => {
      const currentSOSStr = localStorage.getItem('sociosphere_citizen_sos');
      if (currentSOSStr) {
        try {
          const currentSOS = JSON.parse(currentSOSStr);
          if (currentSOS && currentSOS.status !== 'RESOLVED') {
            setCitizenSOS(currentSOS);
          } else {
            setCitizenSOS(null);
          }
        } catch (e) {
          setCitizenSOS(null);
        }
      } else {
        setCitizenSOS(null);
      }
    };

    const handleCustomAdminUpdate = () => {
      const currentAlertStr = localStorage.getItem('sociosphere_admin_alert');
      if (currentAlertStr) {
        try {
          const currentAlert = JSON.parse(currentAlertStr);
          const ackAlerts = JSON.parse(localStorage.getItem('sociosphere_acknowledged_alerts') || '[]');
          if (!ackAlerts.includes(currentAlert.id)) {
            setAdminAlert(currentAlert);
          }
        } catch (e) {
          setAdminAlert(null);
        }
      } else {
        setAdminAlert(null);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('sociosphere_sos_updated', handleCustomSOSUpdate);
    window.addEventListener('sociosphere_admin_alert_updated', handleCustomAdminUpdate);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('sociosphere_sos_updated', handleCustomSOSUpdate);
      window.removeEventListener('sociosphere_admin_alert_updated', handleCustomAdminUpdate);
    };
  }, []);

  // Admin triggers broadcast to citizens
  const triggerAdminAlert = (type, directive) => {
    const newAlert = {
      id: Date.now(),
      type: type,
      directive: directive,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('sociosphere_admin_alert', JSON.stringify(newAlert));
    setAdminAlert(newAlert);
    window.dispatchEvent(new Event('sociosphere_admin_alert_updated'));
  };

  // Citizen or Admin dismisses admin broadcast alert
  const dismissAdminAlert = () => {
    if (adminAlert) {
      const newAck = [...acknowledgedAlerts, adminAlert.id];
      setAcknowledgedAlerts(newAck);
      localStorage.setItem('sociosphere_acknowledged_alerts', JSON.stringify(newAck));
      setAdminAlert(null);
    }
  };

  // Citizen triggers SOS to Admin
  const triggerCitizenSOS = (sosData) => {
    const newSOS = {
      id: Date.now(),
      senderName: sosData.senderName || 'Resident',
      senderPhone: sosData.senderPhone || 'N/A',
      residence: sosData.residence || 'Flat Unknown',
      block: sosData.block || 'Block A',
      type: sosData.type || 'Immediate Threat / SOS',
      note: sosData.note || 'Emergency assistance requested immediately.',
      location: sosData.location || 'Within Society Premises',
      status: 'ACTIVE', // ACTIVE | DISPATCHED | RESOLVED
      timestamp: new Date().toISOString(),
      dispatchedAt: null,
      responderNote: null
    };

    localStorage.setItem('sociosphere_citizen_sos', JSON.stringify(newSOS));
    setCitizenSOS(newSOS);
    window.dispatchEvent(new Event('sociosphere_sos_updated'));
    return newSOS;
  };

  // Admin acknowledges SOS & dispatches security
  const acknowledgeCitizenSOS = (sosId, note = 'Security patrol team has been dispatched to your location.') => {
    if (citizenSOS) {
      const updatedSOS = {
        ...citizenSOS,
        status: 'DISPATCHED',
        dispatchedAt: new Date().toISOString(),
        responderNote: note
      };
      localStorage.setItem('sociosphere_citizen_sos', JSON.stringify(updatedSOS));
      setCitizenSOS(updatedSOS);
      window.dispatchEvent(new Event('sociosphere_sos_updated'));
    }
  };

  // Resolve or cancel SOS
  const resolveCitizenSOS = (sosId) => {
    if (citizenSOS) {
      const resolvedSOS = {
        ...citizenSOS,
        status: 'RESOLVED',
        resolvedAt: new Date().toISOString()
      };
      localStorage.setItem('sociosphere_citizen_sos', JSON.stringify(resolvedSOS));
      // Remove after brief resolution sync
      setTimeout(() => {
        localStorage.removeItem('sociosphere_citizen_sos');
        setCitizenSOS(null);
        window.dispatchEvent(new Event('sociosphere_sos_updated'));
      }, 500);
      setCitizenSOS(null);
    }
  };

  const cancelCitizenSOS = () => {
    localStorage.removeItem('sociosphere_citizen_sos');
    setCitizenSOS(null);
    window.dispatchEvent(new Event('sociosphere_sos_updated'));
  };

  return (
    <AlertContext.Provider value={{ 
      adminAlert, 
      triggerAdminAlert, 
      dismissAdminAlert,
      citizenSOS,
      triggerCitizenSOS,
      acknowledgeCitizenSOS,
      resolveCitizenSOS,
      cancelCitizenSOS
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import soundAlarm from '../utils/audioAlarm';

const AlertContext = createContext();

export const SOS_ACTIVE_STORAGE_KEY = 'sociosphere_active_sos_alerts';

export const AlertProvider = ({ children }) => {
  const [adminAlert, setAdminAlert] = useState(null);
  const [citizenSOS, setCitizenSOS] = useState(null);
  
  const [activeSOSList, setActiveSOSList] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SOS_ACTIVE_STORAGE_KEY) || '[]');
      if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch { /* ignore */ }
    return [
      {
        id: 'SOS-901',
        residentName: 'Aarav Sharma',
        senderName: 'Aarav Sharma',
        unit: 'Block B - Flat 402',
        residence: 'Flat 402',
        block: 'Block B',
        phone: '+91 98765 43210',
        senderPhone: '+91 98765 43210',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        type: 'Medical Crisis',
        status: 'Guards Dispatched',
        society: 'Gandhi Colony',
        silenced: true,
        note: 'Elevator emergency call triggered.'
      }
    ];
  });
  
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(() => {
    const saved = localStorage.getItem('sociosphere_acknowledged_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const [silencedSOSIds, setSilencedSOSIds] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('sociosphere_silenced_sos_ids') || '[]');
    } catch {
      return [];
    }
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

    // 3. Active SOS list
    const activeStoredStr = localStorage.getItem(SOS_ACTIVE_STORAGE_KEY);
    if (activeStoredStr) {
      try {
        const parsed = JSON.parse(activeStoredStr);
        if (Array.isArray(parsed)) {
          setActiveSOSList(parsed);
        }
      } catch (e) {
        console.error("Failed to parse active SOS list", e);
      }
    } else {
      localStorage.setItem(SOS_ACTIVE_STORAGE_KEY, JSON.stringify(activeSOSList));
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

      if (e.key === SOS_ACTIVE_STORAGE_KEY) {
        if (e.newValue) {
          try {
            const list = JSON.parse(e.newValue);
            if (Array.isArray(list)) setActiveSOSList(list);
          } catch (err) {
            console.error(err);
          }
        }
      }
    };

    const handleCustomSOSUpdate = () => {
      // Reload citizen SOS
      const currentSOSStr = localStorage.getItem('sociosphere_citizen_sos');
      if (currentSOSStr) {
        try {
          const currentSOS = JSON.parse(currentSOSStr);
          if (currentSOS && currentSOS.status !== 'RESOLVED') {
            setCitizenSOS(currentSOS);
          } else {
            setCitizenSOS(null);
          }
        } catch {
          setCitizenSOS(null);
        }
      } else {
        setCitizenSOS(null);
      }

      // Reload active SOS list
      const activeStoredStr = localStorage.getItem(SOS_ACTIVE_STORAGE_KEY);
      if (activeStoredStr) {
        try {
          const parsed = JSON.parse(activeStoredStr);
          if (Array.isArray(parsed)) setActiveSOSList(parsed);
        } catch { /* ignore */ }
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
        } catch {
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
    const sosId = sosData.id || `SOS-${Date.now().toString().slice(-4)}`;
    const newSOS = {
      id: sosId,
      rawId: Date.now(),
      senderName: sosData.senderName || sosData.residentName || 'Resident',
      residentName: sosData.senderName || sosData.residentName || 'Resident',
      senderPhone: sosData.senderPhone || sosData.phone || '+91 98765 43210',
      phone: sosData.senderPhone || sosData.phone || '+91 98765 43210',
      residence: sosData.residence || 'Unit 402',
      unit: sosData.unit || `${sosData.block || 'Block B'} - ${sosData.residence || 'Unit 402'}`,
      block: sosData.block || 'Block B',
      society: sosData.society || 'Gandhi Colony',
      type: sosData.type || 'Immediate Threat / SOS',
      note: sosData.note || 'Emergency assistance requested immediately.',
      location: sosData.location || 'Within Society Premises',
      status: 'Active',
      silenced: false,
      timestamp: new Date().toISOString(),
      dispatchedAt: null,
      responderNote: null
    };

    // 1. Live citizenSOS for screen takeover
    localStorage.setItem('sociosphere_citizen_sos', JSON.stringify(newSOS));
    setCitizenSOS(newSOS);

    // 2. Prepend to active distress calls
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(SOS_ACTIVE_STORAGE_KEY) || '[]');
      if (!Array.isArray(list)) list = [];
    } catch { list = []; }
    const updatedList = [newSOS, ...list.filter(item => item.id !== newSOS.id)];
    localStorage.setItem(SOS_ACTIVE_STORAGE_KEY, JSON.stringify(updatedList));
    setActiveSOSList(updatedList);

    // 3. Remove from silenced ids if retriggered
    const updatedSilenced = silencedSOSIds.filter(id => id !== sosId);
    setSilencedSOSIds(updatedSilenced);
    try {
      sessionStorage.setItem('sociosphere_silenced_sos_ids', JSON.stringify(updatedSilenced));
    } catch { /* ignore */ }

    window.dispatchEvent(new Event('sociosphere_sos_updated'));
    return newSOS;
  };

  // Admin silences the alarm (Dismisses takeover, keeps in Active Distress Calls!)
  const silenceCitizenSOS = (sosId) => {
    const id = sosId || citizenSOS?.id;
    soundAlarm.stop();
    if (!id) return;

    // Record as silenced in session
    const updatedSilenced = Array.from(new Set([...silencedSOSIds, id]));
    setSilencedSOSIds(updatedSilenced);
    try {
      sessionStorage.setItem('sociosphere_silenced_sos_ids', JSON.stringify(updatedSilenced));
    } catch { /* ignore */ }

    // Update live takeover object
    if (citizenSOS && citizenSOS.id === id) {
      const updated = { ...citizenSOS, silenced: true };
      localStorage.setItem('sociosphere_citizen_sos', JSON.stringify(updated));
      setCitizenSOS(updated);
    }

    // Update in active distress calls list
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(SOS_ACTIVE_STORAGE_KEY) || '[]');
      if (!Array.isArray(list)) list = [];
    } catch { list = []; }

    const updatedList = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          silenced: true,
          status: (item.status === 'Guards Dispatched' || item.status === 'Guards On Site')
            ? item.status 
            : 'Alarm Silenced'
        };
      }
      return item;
    });

    localStorage.setItem(SOS_ACTIVE_STORAGE_KEY, JSON.stringify(updatedList));
    setActiveSOSList(updatedList);

    window.dispatchEvent(new Event('sociosphere_sos_updated'));
  };

  // Admin acknowledges SOS & dispatches security
  const acknowledgeCitizenSOS = (sosId, note = 'Security Quick Response Team has been dispatched to your location.') => {
    const id = sosId || citizenSOS?.id;
    if (!id) return;

    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(SOS_ACTIVE_STORAGE_KEY) || '[]');
      if (!Array.isArray(list)) list = [];
    } catch { list = []; }

    const updatedList = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Guards Dispatched',
          dispatchedAt: new Date().toISOString(),
          responderNote: note
        };
      }
      return item;
    });

    localStorage.setItem(SOS_ACTIVE_STORAGE_KEY, JSON.stringify(updatedList));
    setActiveSOSList(updatedList);

    if (citizenSOS && citizenSOS.id === id) {
      const updatedSOS = {
        ...citizenSOS,
        status: 'Guards Dispatched',
        dispatchedAt: new Date().toISOString(),
        responderNote: note
      };
      localStorage.setItem('sociosphere_citizen_sos', JSON.stringify(updatedSOS));
      setCitizenSOS(updatedSOS);
    }

    window.dispatchEvent(new Event('sociosphere_sos_updated'));
  };

  // Admin marks handled / resolves SOS (Removes from Active Distress Calls)
  const resolveCitizenSOS = (sosId) => {
    const id = sosId || citizenSOS?.id;
    soundAlarm.stop();
    if (!id) return;

    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(SOS_ACTIVE_STORAGE_KEY) || '[]');
      if (!Array.isArray(list)) list = [];
    } catch { list = []; }

    const updatedList = list.filter(item => item.id !== id);
    localStorage.setItem(SOS_ACTIVE_STORAGE_KEY, JSON.stringify(updatedList));
    setActiveSOSList(updatedList);

    if (citizenSOS && citizenSOS.id === id) {
      localStorage.removeItem('sociosphere_citizen_sos');
      setCitizenSOS(null);
    }

    // Clean from silenced ids
    const updatedSilenced = silencedSOSIds.filter(item => item !== id);
    setSilencedSOSIds(updatedSilenced);
    try {
      sessionStorage.setItem('sociosphere_silenced_sos_ids', JSON.stringify(updatedSilenced));
    } catch { /* ignore */ }

    window.dispatchEvent(new Event('sociosphere_sos_updated'));
  };

  const cancelCitizenSOS = () => {
    soundAlarm.stop();
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
      activeSOSList,
      silencedSOSIds,
      triggerCitizenSOS,
      silenceCitizenSOS,
      acknowledgeCitizenSOS,
      resolveCitizenSOS,
      cancelCitizenSOS
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

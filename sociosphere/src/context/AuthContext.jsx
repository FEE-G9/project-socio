import React, { createContext, useContext, useState, useEffect } from 'react';
import { getColonies } from "../data/mockColonies";const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sociosphere_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    const colonies = getColonies();
    const defaultColony = colonies[0] || { id: 'colony-1', name: 'Green Meadows Heights' };
    return {
      id: 'usr-1',
      name: 'Aarav Sharma',
      email: 'aarav@sociosphere.io',
      role: 'citizen', // 'citizen' | 'authority'
      communityId: defaultColony.id,
      communityName: defaultColony.name,
      unitNumber: 'Block B - 402',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      joinedDate: 'Jan 2025'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sociosphere_is_auth') !== 'false';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sociosphere_auth_user', JSON.stringify(user));
    }
    localStorage.setItem('sociosphere_is_auth', isAuthenticated ? 'true' : 'false');
  }, [user, isAuthenticated]);

  const login = ({ name, email, communityId, role, unitNumber }) => {
    const colonies = getColonies();
    const foundColony = colonies.find(c => c.id === communityId) || colonies[0];

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name || (role === 'authority' ? 'Authority Administrator' : 'Resident Citizen'),
      email: email || 'user@sociosphere.io',
      role: role || 'citizen',
      communityId: foundColony ? foundColony.id : 'colony-1',
      communityName: foundColony ? foundColony.name : 'Green Meadows Heights',
      unitNumber: unitNumber || (role === 'authority' ? 'HQ Office' : 'Block B - 201'),
      phone: '+91 98765 12345',
      avatar: role === 'authority' 
        ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      joinedDate: 'Sep 2026'
    };

    setUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const updateUserProfile = (updatedFields) => {
    setUser(prev => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('sociosphere_auth_user', JSON.stringify(next));
      return next;
    });
  };

  const switchRole = (newRole) => {
    setUser(prev => {
      const next = { ...prev, role: newRole };
      localStorage.setItem('sociosphere_auth_user', JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('sociosphere_is_auth', 'false');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUserProfile, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

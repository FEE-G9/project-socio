import React, { createContext, useContext, useState, useEffect } from 'react';
import { getColonies } from "../data/mockColonies";const AuthContext = createContext();
const ACCOUNTS_STORAGE_KEY = 'sociosphere_accounts';

const getAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

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
    // Return a completely blank shell to force dynamic loading
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sociosphere_is_auth') !== 'false';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sociosphere_auth_user', JSON.stringify(user));
      const accounts = getAccounts();
      accounts[user.email.trim().toLowerCase()] = user;
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    }
    localStorage.setItem('sociosphere_is_auth', isAuthenticated ? 'true' : 'false');
  }, [user, isAuthenticated]);

  const login = (userData) => {
    const { name, email, communityId, communityName, role, unitNumber, phone, city, department, username, age, occupation } = userData;
    
    const colonies = getColonies();
    const foundColony = colonies.find(c => c.id === communityId || c.name === communityName) || colonies[0];

    const normalizedEmail = (email || 'user@sociosphere.io').trim().toLowerCase();
    const existingUser = getAccounts()[normalizedEmail];
    const newUser = existingUser || {
      id: `usr-${Date.now()}`,
      name: name || username || (role === 'authority' ? 'Authority Administrator' : 'Resident Citizen'),
      email: email || (username && username.includes("@") ? username : 'user@sociosphere.io'),
      name: name || (role === 'authority' ? 'Authority Administrator' : 'Resident Citizen'),
      email: normalizedEmail,
      role: role || 'citizen',
      communityId: foundColony ? foundColony.id : 'colony-1',
      communityName: communityName || (foundColony ? foundColony.name : 'Green Meadows Heights'),
      unitNumber: unitNumber || '',
      phone: phone || '',
      city: city || '',
      department: department || '',
      age: age || '',
      occupation: occupation || '',
      avatar: role === 'authority' 
        ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
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
    localStorage.removeItem('sociosphere_auth_user');
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

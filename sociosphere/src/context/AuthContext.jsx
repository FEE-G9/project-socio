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

const normalizeUser = (candidate) => {
  if (!candidate) return null;

  const email = candidate.email?.trim().toLowerCase() || '';
  const storedName = candidate.name?.trim() || '';
  const validName = storedName && storedName.toLowerCase() !== email && !storedName.includes('@');

  return {
    ...candidate,
    name: validName
      ? storedName
      : candidate.role === 'authority'
        ? 'Authority Administrator'
        : 'Resident Citizen',
    email,
    city: candidate.city === 'Chandigarh' || !candidate.city ? 'Rajpura' : candidate.city,
    communityCity: candidate.communityCity === 'Chandigarh' || !candidate.communityCity
      ? 'Rajpura'
      : candidate.communityCity,
    avatarStyle: candidate.avatarStyle || 'classic',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sociosphere_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const storedAccount = parsed.email
          ? getAccounts()[parsed.email.trim().toLowerCase()]
          : null;
        const accountName = storedAccount?.name?.trim();
        const parsedName = parsed.name?.trim();
        const nameIsEmail = !parsedName || parsedName.toLowerCase() === parsed.email?.trim().toLowerCase();

        return normalizeUser({
          ...storedAccount,
          ...parsed,
          name: nameIsEmail && accountName && !accountName.includes('@')
            ? accountName
            : parsed.name,
        });
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
    const {
      name,
      email,
      communityId,
      communityName,
      role,
      unitNumber,
      phone,
      city,
      department,
      username,
      age,
      occupation,
    } = userData;

    const colonies = getColonies();
    const foundColony = colonies.find(c => c.id === communityId || c.name === communityName) || colonies[0];

    const normalizedEmail = (email || 'user@sociosphere.io').trim().toLowerCase();
    const suppliedName = (name || username || '').trim();
    const accounts = getAccounts();
    const existingUser = accounts[normalizedEmail] || Object.values(accounts).find(account => {
      const accountName = account?.name?.trim().toLowerCase();
      const accountUsername = account?.username?.trim().toLowerCase();
      const accountEmail = account?.email?.trim().toLowerCase();
      const suppliedValue = suppliedName.toLowerCase();

      return suppliedValue && (
        accountName === suppliedValue ||
        accountUsername === suppliedValue ||
        accountEmail === suppliedValue
      );
    });
    const fallbackName = role === 'authority'
      ? 'Authority Administrator'
      : 'Resident Citizen';
    const existingName = existingUser?.name?.trim();
    const suppliedNameIsEmail = suppliedName.includes('@');
    const resolvedName = existingName && !existingName.includes('@') && existingName !== fallbackName
      ? existingName
      : suppliedName && !suppliedNameIsEmail
        ? suppliedName
        : fallbackName;
    const newUser = existingUser
      ? {
          ...normalizeUser(existingUser),
          name: resolvedName,
          email: existingUser.email?.trim().toLowerCase() || normalizedEmail,
          city: existingUser.city === 'Chandigarh' || !existingUser.city ? 'Rajpura' : existingUser.city,
          communityCity: existingUser.communityCity === 'Chandigarh' || !existingUser.communityCity
            ? 'Rajpura'
            : existingUser.communityCity,
          avatarStyle: existingUser.avatarStyle || 'classic',
        }
      : {
          id: `usr-${Date.now()}`,
          name: resolvedName,
          email: normalizedEmail,
          role: role || 'citizen',
          communityId: foundColony ? foundColony.id : 'colony-1',
          communityName: communityName || (foundColony ? foundColony.name : 'Green Meadows Heights'),
          unitNumber: unitNumber || '',
          phone: phone || '',
          city: city || 'Rajpura',
          communityCity: city || 'Rajpura',
          department: department || '',
          age: age || '',
          occupation: occupation || '',
          avatar: role === 'authority'
            ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          avatarStyle: 'classic',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
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

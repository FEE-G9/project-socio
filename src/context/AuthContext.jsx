import React, { createContext, useState } from 'react';

/**
 * AuthContext
 * 
 * Manages authentication state for the application.
 * Will be integrated with Express.js + MongoDB backend.
 */
const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext };

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    notificationCount,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;



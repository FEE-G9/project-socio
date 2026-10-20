import React, { createContext, useContext, useState, useEffect } from "react";
import { getColonies } from "../data/mockColonies";
import { useAuth } from "./AuthContext";
import { useLostFound, LostFoundProvider } from "./LostFoundContext";

export const SocietyContext = createContext(null);

export const SocietyProvider = ({ children }) => {
  const { user } = useAuth();
  const [colonies, setColonies] = useState(() => getColonies());
  const [activeSociety, setActiveSociety] = useState(
    () => user?.society || user?.communityName || "Gandhi Colony"
  );

  useEffect(() => {
    if (user?.society || user?.communityName) {
      setActiveSociety(user?.society || user?.communityName);
    }
  }, [user]);

  const value = {
    colonies,
    activeSociety,
    setActiveSociety,
  };

  return (
    <SocietyContext.Provider value={value}>
      <LostFoundProvider>{children}</LostFoundProvider>
    </SocietyContext.Provider>
  );
};

export const useSociety = () => {
  const context = useContext(SocietyContext);
  if (!context) {
    throw new Error("useSociety must be used within a SocietyProvider");
  }
  return context;
};

// Re-export useLostFound for developer convenience if imported via SocietyContext
export { useLostFound };
export default SocietyContext;

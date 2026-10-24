import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getLostFoundItems, saveLostFoundItems } from "../data/mockLostFound";
import { useAuth } from "./AuthContext";

const LostFoundContext = createContext(null);

export const LostFoundProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState(() => getLostFoundItems());
  const [loading, setLoading] = useState(false);

  // Sync state from localStorage
  const refreshItems = useCallback(() => {
    try {
      const current = getLostFoundItems();
      setItems(current);
    } catch (err) {
      console.error("Error refreshing lost & found items:", err);
    }
  }, []);

  // Listen for storage changes across tabs and local events
  useEffect(() => {
    const handleUpdate = () => {
      refreshItems();
    };

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("sociosphere_lostfound_updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("sociosphere_lostfound_updated", handleUpdate);
    };
  }, [refreshItems]);

  // Add a new lost or found item
  const addItem = useCallback(
    (itemData) => {
      const newItem = {
        id: `LF-${Date.now().toString().slice(-4)}`,
        type: itemData.type || "lost", // "lost" | "found"
        title: itemData.title?.trim() || "Untitled Item",
        category: itemData.category || "Other",
        status: "open", // "open" | "claimed" | "resolved"
        society:
          itemData.society ||
          user?.society ||
          user?.communityName ||
          "Gandhi Colony",
        societyCode:
          itemData.societyCode ||
          user?.societyCode ||
          (user?.society === "Shayam Nagar"
            ? "SN-202"
            : user?.society === "Dalima Vihar"
            ? "DV-303"
            : "GC-101"),
        colonyId:
          itemData.colonyId ||
          user?.communityId ||
          (user?.society === "Shayam Nagar"
            ? "colony-shayam"
            : user?.society === "Dalima Vihar"
            ? "colony-dalima"
            : "colony-gandhi"),
        colonyName:
          itemData.colonyName ||
          itemData.society ||
          user?.society ||
          user?.communityName ||
          "Gandhi Colony",
        location: itemData.location?.trim() || "Within Society Campus",
        date: itemData.date || new Date().toISOString().split("T")[0],
        description: itemData.description?.trim() || "",
        reportedBy:
          user?.name && !user.name.includes("@")
            ? user.name
            : itemData.reportedBy || "Resident Citizen",
        reportedByEmail: user?.email || itemData.reportedByEmail || "",
        reportedById: user?.id || `user-${Date.now()}`,
        reporterAvatar:
          user?.avatar ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        phone: itemData.phone || user?.phone || "+91 98000 00000",
        image:
          itemData.image ||
          (itemData.type === "lost"
            ? "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80"
            : "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"),
        reward: itemData.reward ? itemData.reward.trim() : null,
        securityHint: itemData.securityHint?.trim() || "",
        claims: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newItem, ...items];
      setItems(updated);
      saveLostFoundItems(updated);
      return newItem;
    },
    [items, user]
  );

  // Update an existing item
  const updateItem = useCallback(
    (id, updates) => {
      const updated = items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });

      setItems(updated);
      saveLostFoundItems(updated);
    },
    [items]
  );

  // Delete an item
  const deleteItem = useCallback(
    (id) => {
      const updated = items.filter((item) => item.id !== id);
      setItems(updated);
      saveLostFoundItems(updated);
      return true;
    },
    [items]
  );

  // Mark an item as resolved / reunited
  const markAsResolved = useCallback(
    (id, note = "Item has been successfully recovered and reunited.") => {
      const updated = items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: "claimed",
            resolvedAt: new Date().toISOString(),
            resolvedNote: note,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });

      setItems(updated);
      saveLostFoundItems(updated);
    },
    [items]
  );

  // Submit a claim on a found or lost item
  const submitClaim = useCallback(
    (itemId, claimData) => {
      const newClaim = {
        id: `cl-${Date.now().toString().slice(-4)}`,
        claimantName:
          claimData.claimantName ||
          (user?.name && !user.name.includes("@") ? user.name : "Resident"),
        claimantEmail: claimData.claimantEmail || user?.email || "",
        claimantPhone: claimData.claimantPhone || user?.phone || "N/A",
        proofDescription: claimData.proofDescription?.trim() || "",
        status: "pending", // "pending" | "approved" | "rejected"
        createdAt: new Date().toISOString(),
      };

      const updated = items.map((item) => {
        if (item.id === itemId) {
          const currentClaims = item.claims || [];
          return {
            ...item,
            claims: [newClaim, ...currentClaims],
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });

      setItems(updated);
      saveLostFoundItems(updated);
      return newClaim;
    },
    [items, user]
  );

  // Approve or reject a claim
  const resolveClaim = useCallback(
    (itemId, claimId, action) => {
      const isApproved = action === "approved" || action === "approve";

      const updated = items.map((item) => {
        if (item.id === itemId) {
          const updatedClaims = (item.claims || []).map((claim) => {
            if (claim.id === claimId) {
              return {
                ...claim,
                status: isApproved ? "approved" : "rejected",
              };
            }
            return claim;
          });

          return {
            ...item,
            claims: updatedClaims,
            status: isApproved ? "claimed" : item.status,
            resolvedAt: isApproved ? new Date().toISOString() : item.resolvedAt,
            resolvedNote: isApproved
              ? "Claim verified and ownership reunited!"
              : item.resolvedNote,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });

      setItems(updated);
      saveLostFoundItems(updated);
    },
    [items]
  );

  // Add a community discussion comment / clue
  const addComment = useCallback(
    (itemId, { text, author, authorEmail }) => {
      const newComment = {
        id: `c-${Date.now().toString().slice(-4)}`,
        author:
          author ||
          (user?.name && !user.name.includes("@") ? user.name : "Resident"),
        authorEmail: authorEmail || user?.email || "",
        text: text?.trim() || "",
        createdAt: new Date().toISOString(),
      };

      const updated = items.map((item) => {
        if (item.id === itemId) {
          const comments = item.comments || [];
          return {
            ...item,
            comments: [...comments, newComment],
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      });

      setItems(updated);
      saveLostFoundItems(updated);
      return newComment;
    },
    [items, user]
  );

  // Calculate statistics
  const stats = {
    total: items.length,
    lostCount: items.filter((i) => i.type === "lost" && i.status !== "claimed")
      .length,
    foundCount: items.filter(
      (i) => i.type === "found" && i.status !== "claimed"
    ).length,
    resolvedCount: items.filter((i) => i.status === "claimed").length,
    activeCount: items.filter((i) => i.status === "open").length,
  };

  const value = {
    items,
    allItems: items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    markAsResolved,
    submitClaim,
    resolveClaim,
    addComment,
    refreshItems,
    stats,
  };

  return (
    <LostFoundContext.Provider value={value}>
      {children}
    </LostFoundContext.Provider>
  );
};

export const useLostFound = () => {
  const context = useContext(LostFoundContext);
  if (!context) {
    throw new Error("useLostFound must be used within a LostFoundProvider");
  }
  return context;
};

export default LostFoundContext;

import React, { createContext, useContext, useState } from "react";

const IssueContext = createContext(null);

const STORAGE_KEY = "sociosphere_issues";

const loadIssues = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load issues:", error);
    return [];
  }
};

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState(loadIssues);

  const addIssue = (issue) => {
    const newIssue = {
      id: issue.id || `ISSUE-${Date.now()}`,
      createdAt: issue.createdAt || new Date().toISOString(),
      status: issue.status || "In Progress",
      ...issue,
    };

    setIssues((previousIssues) => {
      const updatedIssues = [newIssue, ...previousIssues];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedIssues)
      );

      return updatedIssues;
    });

    return newIssue;
  };

  const updateIssue = (issueId, updatedFields) => {
    setIssues((previousIssues) => {
      const updatedIssues = previousIssues.map((issue) =>
        issue.id === issueId
          ? { ...issue, ...updatedFields }
          : issue
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedIssues)
      );

      return updatedIssues;
    });
  };

  const deleteIssue = (issueId) => {
    setIssues((previousIssues) => {
      const updatedIssues = previousIssues.filter(
        (issue) => issue.id !== issueId
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedIssues)
      );

      return updatedIssues;
    });
  };

  return (
    <IssueContext.Provider
      value={{
        issues,
        addIssue,
        updateIssue,
        deleteIssue,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);

  if (!context) {
    throw new Error(
      "useIssues must be used inside IssueProvider"
    );
  }

  return context;
};
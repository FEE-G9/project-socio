import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { IssueProvider } from "./context/IssueContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <IssueProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </IssueProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
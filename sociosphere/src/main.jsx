import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AlertProvider } from "./context/AlertContext.jsx";
import { sanitizeLocalStorage } from "./utils/storageSanitizer.js";

import "./index.css";

// Sanitize localStorage and recover quota on startup
sanitizeLocalStorage();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AlertProvider>
              <App />
            </AlertProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
  
  import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { LanguageProvider } from './contexts/LanguageContext';
import "./index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
  
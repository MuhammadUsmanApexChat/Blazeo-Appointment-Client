import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App2.jsx";
import { bootstrapBlazeoClient } from "./blazeoBootstrap.js";
import "./style.css";

/** Blazeo: `blazeoClientDefaults.ts` + optional `VITE_BLAZEO_*` (.env) → `configure()` for calendar-client. */
bootstrapBlazeoClient();

const rootEl = document.getElementById("app");
if (!rootEl) {
  throw new Error("Missing #app element");
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

/**
 * Entry point (first file Vite runs in the browser).
 *
 * What happens here:
 * 1) We find the <div id="root"></div> in index.html
 * 2) We ask ReactDOM to "render" our <App /> component into it
 * 3) React takes over that part of the page and updates it when state changes
 */
const rootElement = document.getElementById("root");

if (!rootElement) {
  // This should never happen unless index.html was changed.
  throw new Error("Root element #root not found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  /**
   * React.StrictMode helps catch problems in development.
   * It may run some code twice in dev to detect side effects.
   */
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


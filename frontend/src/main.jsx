import { createRoot } from "react-dom/client"; // Correct import
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import React from "react";

const root = createRoot(document.getElementById("root")); // Create root
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./index.css";
import App from "./App.tsx";
import Panel from "./pages/Panel.tsx";
import { initPixelTracking } from "./lib/pixel-tracking";

// Initialize Meta Pixel from build-time env var (set VITE_META_PIXEL_ID in Vercel)
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
if (PIXEL_ID && typeof window !== "undefined") {
  const w = window as Window & { fbq?: (...args: unknown[]) => void };
  if (typeof w.fbq === "function") {
    w.fbq("init", PIXEL_ID);
    w.fbq("track", "PageView");
  }
  // Engagement tracking: ViewContent (50%), ScrollDepth75, PhoneClick, EmailClick, CTAClick
  initPixelTracking();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  </StrictMode>
);

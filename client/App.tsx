import "./global.css";
import "./lib/i18n";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import ManageApps from "./pages/ManageApps";
import PushNotifications from "./pages/PushNotifications";
import { useTranslation } from "react-i18next";
import { Suspense } from "react";

const App = () => {
  const { t } = useTranslation();
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/company"
              element={<Placeholder title={t("menu.manageCompany")} />}
            />
            <Route path="/apps" element={<ManageApps />} />
            <Route
              path="/reader"
              element={<Placeholder title={t("menu.manageReader")} />}
            />
            <Route path="/notifications" element={<PushNotifications />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);

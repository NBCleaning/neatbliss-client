import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ConfigProvider, useConfig } from "./config/ConfigProvider";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { StatusBanner } from "./components/StatusBanner";
import { StatusNoticeModal } from "./components/StatusNoticeModal";
import { PreviewPill } from "./components/PreviewPill";
import { HomePage } from "./pages/Home";
import { ServicesPage } from "./pages/Services";
import { QuotePage } from "./pages/Quote";
import { AdminPage } from "./pages/Admin";
import { ADMIN_ROUTE } from "./routes";
import { useEffect } from "react";

function PublicLayout({ children }: { children: React.ReactNode }) {
  const { config, source } = useConfig();
  return (
    <>
      <StatusBanner />
      <NavBar />
      {children}
      <Footer />
      <PreviewPill />
      <StatusNoticeModal
        enabled={config.status.enabled}
        message={config.status.message}
        disabled={source === "draft"}
      />
    </>
  );
}

function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

    if (location.hash) {
      const id = location.hash.slice(1);
      // The target section may mount a frame after navigation.
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior, block: "start" });
        } else if (attempts < 10) {
          attempts += 1;
          window.requestAnimationFrame(tryScroll);
        }
      };
      tryScroll();
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash, location.key]);
  return null;
}

export default function App() {
  const rawBase = import.meta.env.BASE_URL || "/";
  const basename = rawBase.endsWith("/") && rawBase !== "/"
    ? rawBase.slice(0, -1)
    : rawBase === "/"
      ? undefined
      : rawBase;

  return (
    <ConfigProvider>
      <BrowserRouter basename={basename}>
        <ScrollManager />
        <Routes>
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/services"
            element={
              <PublicLayout>
                <ServicesPage />
              </PublicLayout>
            }
          />
          <Route
            path="/quote"
            element={
              <PublicLayout>
                <QuotePage />
              </PublicLayout>
            }
          />
          <Route path={ADMIN_ROUTE} element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

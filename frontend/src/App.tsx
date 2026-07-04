import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ThemeProvider, useTheme } from "@/lib/theme-context";
import { initTelegram } from "@/lib/telegram";
import AuthGate from "@/components/AuthGate";
import ForceSubGate from "@/components/ForceSubGate";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import AmbientBackground from "@/components/AmbientBackground";
import AdminPasswordGate from "@/components/AdminPasswordGate";
import Home from "@/pages/Home";
import Coupons from "@/pages/Coupons";
import Referral from "@/pages/Referral";
import Leaderboard from "@/pages/Leaderboard";
import Vip from "@/pages/Vip";
import History from "@/pages/History";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  if (!profile?.is_admin) return <Navigate to="/" replace />;
  return <AdminPasswordGate>{children}</AdminPasswordGate>;
}

function Shell() {
  const location = useLocation();
  const hideNav = location.pathname.startsWith("/admin");
  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col">
      <AmbientBackground />
      <TopBar />
      <main key={location.pathname} className="flex-1 px-4 pb-28 pt-3 fade-in">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/vip" element={<Vip />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}

function AppToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme}
      position="top-center"
      toastOptions={{
        style:
          theme === "light"
            ? {
                background: "#ffffff",
                border: "1px solid #e2d9c3",
                color: "#1a1712",
              }
            : {
                background: "#0f1310",
                border: "1px solid #1d231f",
                color: "#f5f5f5",
              },
      }}
    />
  );
}

export default function App() {
  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGate>
          <ForceSubGate>
            <Shell />
          </ForceSubGate>
        </AuthGate>
        <AppToaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

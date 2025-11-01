import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider } from "./contexts/auth-context";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import TripPlanner from "./pages/TripPlanner";
import LiveTracking from "./pages/LiveTracking";
import Alerts from "./pages/Alerts";
import FriendNetwork from "./pages/FriendNetwork";
import AdminDashboard from "./pages/AdminDashboard";
import FareComparePage from "./pages/fare-compare";
import HotelBookingPage from "./pages/hotel-booking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="system" storageKey="safe-app-theme">
        <AuthProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/fare-compare" element={<FareComparePage />} />
              <Route path="/hotels" element={<HotelBookingPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/trip-planner" element={<TripPlanner />} />
              <Route path="/live-tracking" element={<LiveTracking />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/friend-network" element={<FriendNetwork />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

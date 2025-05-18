import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/auth";
import MainLayout from "./components/MainLayout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PropertyList from "./pages/PropertyList";
import PropertyForm from "./pages/PropertyForm";
import PropertyDetail from "./pages/PropertyDetail";
import ProfileDetail from "./pages/ProfileDetail";
import ReportDetail from "./pages/ReportDetail";
import RentAnalysis from "./pages/RentAnalysis";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SampleUsersCreator from "./pages/SampleUsersCreator";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Documentation from "./pages/Documentation";
import HelpCenter from "./pages/HelpCenter";
import ApiAccess from "./pages/ApiAccess";
import Community from "./pages/Community";
import HudGuidelines from "./pages/documentation/HudGuidelines";
import ShraProcedures from "./pages/documentation/ShraProcedures";
import QuickStart from "./pages/documentation/QuickStart";
import RentalFairness from "./pages/RentalFairness";

// Create a QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Protected Route component - moved inside the AppRoutes component
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Debug information
  console.log("AppRoutes auth state:", { isAuthenticated });
  
  // Protected Route component defined inside AppRoutes
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // Add debug information
    console.log("ProtectedRoute check:", { isAuthenticated, isLoading });
    
    if (isLoading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      return <Navigate to="/login" replace />;
    }
    
    console.log("User is authenticated, rendering protected content");
    return <>{children}</>;
  };
  
  return (
    <Routes>
      {/* Landing page as root route */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Public pages */}
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Documentation and Resource pages */}
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/documentation/hud-guidelines" element={<HudGuidelines />} />
      <Route path="/documentation/shra-procedures" element={<ShraProcedures />} />
      <Route path="/documentation/quick-start" element={<QuickStart />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/api-access" element={<ApiAccess />} />
      <Route path="/community" element={<Community />} />
      
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      <Route path="/sample-users" element={<SampleUsersCreator />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* All other protected routes */}
      <Route path="/properties" element={
        <ProtectedRoute>
          <MainLayout>
            <PropertyList />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/properties/new" element={
        <ProtectedRoute>
          <MainLayout>
            <PropertyForm />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/properties/:id" element={
        <ProtectedRoute>
          <MainLayout>
            <PropertyDetail />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/properties/edit/:id" element={
        <ProtectedRoute>
          <MainLayout>
            <PropertyForm />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/analysis" element={
        <ProtectedRoute>
          <MainLayout>
            <RentAnalysis />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* New Rental Fairness route */}
      <Route path="/rental-fairness" element={
        <ProtectedRoute>
          <MainLayout>
            <RentalFairness />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports" element={
        <ProtectedRoute>
          <MainLayout>
            <Reports />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reports/:id" element={
        <ProtectedRoute>
          <MainLayout>
            <ReportDetail />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/users" element={
        <ProtectedRoute>
          <MainLayout>
            <UserManagement />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/users/:id" element={
        <ProtectedRoute>
          <MainLayout>
            <ProfileDetail />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout>
            <Settings />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Not Found route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// The main App component wraps everything with the necessary providers in the correct order
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

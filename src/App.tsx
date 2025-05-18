
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
import PropertyDetail from "./pages/PropertyDetail";
import ProfileDetail from "./pages/ProfileDetail";
import ReportDetail from "./pages/ReportDetail";
import RentAnalysis from "./pages/RentAnalysis";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SampleUsersCreator from "./pages/SampleUsersCreator";

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
      
      <Route path="/properties/:id" element={
        <ProtectedRoute>
          <MainLayout>
            <PropertyDetail />
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

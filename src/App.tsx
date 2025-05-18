
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/auth";
import MainLayout from "./components/MainLayout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PropertyList from "./pages/PropertyList";
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

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, session } = useAuth();
  
  // Add debug information
  console.log("ProtectedRoute check:", { isAuthenticated, isLoading, session: !!session });
  
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

// We're keeping the routes logic in a separate component that is rendered INSIDE the AuthProvider
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  // Debug information
  console.log("AppRoutes auth state:", { isAuthenticated });
  
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
      
      <Route path="/properties" element={
        <ProtectedRoute>
          <MainLayout>
            <PropertyList />
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
      
      <Route path="/users" element={
        <ProtectedRoute>
          <MainLayout>
            <UserManagement />
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

// The main App component wraps everything with the necessary providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

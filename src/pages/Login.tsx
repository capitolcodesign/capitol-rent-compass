
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Logo from '@/components/Logo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import AuthFooter from '@/components/auth/AuthFooter';

const Login: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === 'signup' ? 'signup' : 'login');
  const { isAuthenticated, session, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // This effect runs whenever isAuthenticated or session changes
  useEffect(() => {
    // Only redirect if auth state is determined (not loading) and user is authenticated
    if (!isLoading && isAuthenticated && session) {
      console.log("User authenticated, redirecting to dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, session, navigate, isLoading]);
  
  const handleSignupSuccess = () => {
    // Switch to login tab after successful signup
    setActiveTab('login');
  };
  
  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-capitol-cream p-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-capitol-charcoal">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // If already authenticated, don't render the login form at all
  if (isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-capitol-cream p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo size="lg" />
          <h1 className="mt-6 text-3xl font-bold text-capitol-charcoal">SHRA Rent Reasonableness</h1>
          <p className="mt-2 text-secondary">Sacramento Housing and Redevelopment Agency</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to access the SHRA Rent Reasonableness platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignupForm onSuccess={handleSignupSuccess} />
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Sacramento Housing &amp; Redevelopment Agency
            </p>
          </CardFooter>
        </Card>
        
        <AuthFooter />
      </div>
    </div>
  );
};

export default Login;

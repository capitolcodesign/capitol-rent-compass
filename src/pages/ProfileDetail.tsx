
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, User, Mail, Calendar, ClipboardList, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EditUserProfileForm } from '@/components/users/EditUserProfileForm';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  created_at: string | null;
}

const ProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as UserProfile;
    },
  });

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'admin';

  // Handle user deactivation
  const handleDeactivateUser = async () => {
    try {
      // In a real implementation, you would call a Supabase Function or Edge Function 
      // that uses the admin API to deactivate a user
      // For now, we'll just show a toast
      toast({
        title: "Feature not implemented",
        description: "User deactivation requires Supabase Edge Functions with admin privileges.",
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate user.",
        variant: "destructive",
      });
    }
  };

  // Fetch user's email from auth.users (if permissions allow)
  const { data: authInfo } = useQuery({
    queryKey: ['auth-info', id],
    queryFn: async () => {
      // This is a minimal implementation as it might be limited by permissions
      // In a real app, this might come from a function or API endpoint
      return { email: "user@example.com" };  // Placeholder
    },
    enabled: !!profile,
  });

  // Fetch properties managed by this user
  const { data: managedProperties } = useQuery({
    queryKey: ['user-properties', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, address, type')
        .eq('user_id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    },
    enabled: !!id,
  });

  // Fetch reports created by this user
  const { data: userReports } = useQuery({
    queryKey: ['user-reports', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('id, name, created_at, status')
        .eq('created_by', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    },
    enabled: !!id,
  });

  const handleEditSuccess = () => {
    setIsEditing(false);
    queryClient.invalidateQueries({ queryKey: ['profile', id] });
    toast({
      title: "Profile Updated",
      description: "User profile has been successfully updated.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-muted-foreground">Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/users')} className="mr-2">
            <ChevronLeft size={18} />
            Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load user profile</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Unable to retrieve user information. The user may have been deleted or you may not have permission to view this profile.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/users')}>Return to Users</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const getInitials = () => {
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/users')} className="mr-2">
            <ChevronLeft size={18} />
            Back
          </Button>
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>
        {isAdmin && (
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline">
              Reset Password
            </Button>
            <Button variant="destructive" onClick={handleDeactivateUser}>
              Deactivate User
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{profile.first_name} {profile.last_name}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline" className="capitalize mt-1">
                      {profile.role || 'User'}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            {isEditing && isAdmin ? (
              <CardContent>
                <EditUserProfileForm 
                  user={profile} 
                  onSuccess={handleEditSuccess}
                  onCancel={() => setIsEditing(false)} 
                />
              </CardContent>
            ) : (
              <>
                <CardContent>
                  <div className="space-y-4">
                    {authInfo?.email && (
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Email Address</p>
                          <p className="text-sm text-muted-foreground">{authInfo.email}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-3">
                      <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Role</p>
                        <p className="text-sm text-muted-foreground capitalize">{profile.role || 'User'}</p>
                      </div>
                    </div>
                    
                    {profile.created_at && (
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Member Since</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(profile.created_at).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </CardFooter>
              </>
            )}
          </Card>

          <Tabs defaultValue="properties" className="mt-6">
            <TabsList>
              <TabsTrigger value="properties">Managed Properties</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Properties Managed by {profile.first_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {managedProperties && managedProperties.length > 0 ? (
                    <div className="space-y-4">
                      {managedProperties.map((property: any) => (
                        <div key={property.id} className="p-4 border rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">{property.name}</p>
                            <p className="text-sm text-muted-foreground">{property.address}</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/properties/${property.id}`)}>
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-6">This user doesn't manage any properties.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Reports Created by {profile.first_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {userReports && userReports.length > 0 ? (
                    <div className="space-y-4">
                      {userReports.map((report: any) => (
                        <div key={report.id} className="p-4 border rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">{report.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={report.status === 'published' ? 'default' : 'outline'}>
                                {report.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Created {new Date(report.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/reports/${report.id}`)}>
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-6">This user hasn't created any reports.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-6">Activity tracking is not enabled for this user.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="font-medium">Role:</dt>
                  <dd className="capitalize">{profile.role || 'User'}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="font-medium">Status:</dt>
                  <Badge>Active</Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="font-medium">Properties:</dt>
                  <dd>{managedProperties?.length || 0}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="font-medium">Reports:</dt>
                  <dd>{userReports?.length || 0}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>View Properties</span>
                  <Badge variant="outline" className="capitalize">{profile.role === 'admin' ? 'Allowed' : 'Limited'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Edit Properties</span>
                  <Badge variant="outline" className="capitalize">{['admin', 'staff'].includes(profile.role || '') ? 'Allowed' : 'Denied'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Generate Reports</span>
                  <Badge variant="outline" className="capitalize">{['admin', 'staff'].includes(profile.role || '') ? 'Allowed' : 'Limited'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Manage Users</span>
                  <Badge variant="outline" className="capitalize">{profile.role === 'admin' ? 'Allowed' : 'Denied'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Access Settings</span>
                  <Badge variant="outline" className="capitalize">{profile.role === 'admin' ? 'Allowed' : 'Denied'}</Badge>
                </div>
              </div>
            </CardContent>
            {isAdmin && (
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                  Manage Permissions
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AddUserModal } from '@/components/users/AddUserModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  created_at: string | null;
  email?: string | null;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles data from the profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role, created_at');
        
      if (profilesError) {
        throw profilesError;
      }

      // Log for debugging
      console.log("Fetched profiles:", profilesData?.length || 0);
      
      // If we have profiles, fetch the corresponding user emails
      if (profilesData && profilesData.length > 0) {
        // We need to enrich the profiles with email data from auth.users
        // We'll do this client-side since we can't directly join with auth.users
        
        const enrichedProfiles = await Promise.all(
          profilesData.map(async (profile) => {
            try {
              // For each profile, fetch the user record from auth
              const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.id);
              
              if (userError) {
                console.error('Error fetching user details:', userError);
                return { ...profile, email: null };
              }
              
              return { 
                ...profile, 
                email: userData?.user?.email || null 
              };
            } catch (error) {
              console.error('Error enriching profile:', error);
              return { ...profile, email: null };
            }
          })
        );
        
        setUsers(enrichedProfiles);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch user data. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const filteredUsers = searchQuery.trim() === ''
    ? users
    : users.filter(user => 
        (user.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.role || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return (first + last).toUpperCase() || 'U';
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => setIsAddUserModalOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <Card>
        <CardHeader className="p-4">
          <CardTitle>User List</CardTitle>
          <CardDescription>
            {filteredUsers.length} users found
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-6">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow 
                        key={user.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{getInitials(user.first_name, user.last_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{user.first_name || 'Anonymous'} {user.last_name || 'User'}</div>
                              <div className="text-xs text-muted-foreground">{user.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{user.role || 'User'}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.created_at ? 
                            new Date(user.created_at).toLocaleDateString() : 
                            'Unknown'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        {searchQuery.trim() !== '' ? 
                          'No users match your search.' : 
                          'No users found. Add your first user to get started.'
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <AddUserModal 
        open={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        onSuccess={fetchUsers}
      />
    </div>
  );
}

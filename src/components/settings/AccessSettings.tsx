
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Edit } from 'lucide-react';
import { UserRoleManagement } from '@/components/admin/UserRoleManagement';
import { User } from '@/contexts/auth/types';

interface UserDisplay extends User {
  created_at: string;
}

interface AccessSettingsProps {
  users: UserDisplay[] | undefined;
  isLoading: boolean;
  refetchUsers: () => void;
}

export const AccessSettings: React.FC<AccessSettingsProps> = ({ 
  users, 
  isLoading, 
  refetchUsers 
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = searchQuery.trim() === ''
    ? users
    : users?.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          User Management
        </CardTitle>
        <CardDescription>
          Manage user permissions and roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users by name, email or role..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      
        {isLoading ? (
          <div className="flex justify-center p-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map(userItem => (
                <div key={userItem.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">{userItem.firstName} {userItem.lastName}</h3>
                        <Badge variant="outline" className="ml-2 capitalize">{userItem.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{userItem.email}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/users/${userItem.id}`)}
                        className="flex items-center"
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                  
                  <UserRoleManagement 
                    user={userItem} 
                    onUpdate={refetchUsers}
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-6">
                {searchQuery.trim() !== '' ? 'No users match your search.' : 'No users found. Add users to manage their roles.'}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

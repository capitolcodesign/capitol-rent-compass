
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
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
        {isLoading ? (
          <div className="flex justify-center p-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {users && users.length > 0 ? (
              users.map(userItem => (
                <div key={userItem.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{userItem.firstName} {userItem.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{userItem.email}</p>
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
                No users found. Add users to manage their roles.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

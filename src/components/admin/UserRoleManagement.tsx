
import React, { useState } from 'react';
import { User, UserRole } from '@/contexts/auth/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ConfirmActionDialog } from './ConfirmActionDialog';
import { UsersIcon, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';

interface UserRoleManagementProps {
  user: User;
  onUpdate: () => void;
}

export function UserRoleManagement({ user, onUpdate }: UserRoleManagementProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const roleIcons = {
    admin: <ShieldCheck className="h-4 w-4 text-green-500" />,
    staff: <ShieldAlert className="h-4 w-4 text-blue-500" />,
    auditor: <ShieldQuestion className="h-4 w-4 text-amber-500" />,
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'staff':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'auditor':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleRoleChange = async () => {
    if (selectedRole === user.role) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Role Updated",
        description: `${user.firstName}'s role has been updated to ${selectedRole}.`,
      });
      
      onUpdate();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating the user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      // Add a deleted_at field to the profiles table to mark users as deleted
      const { error } = await supabase
        .from('profiles')
        .update({ 
          // Add a 'deleted_at' timestamp
          deleted_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "User Deactivated",
        description: `${user.firstName} ${user.lastName} has been deactivated.`,
      });
      
      setIsDeleteDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast({
        title: "Deactivation Failed",
        description: "You need administrator privileges to deactivate users. Contact your system administrator.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className={`${getRoleBadgeColor(user.role)}`}>
          {roleIcons[user.role as keyof typeof roleIcons]}
          <span className="ml-1.5 capitalize">{user.role}</span>
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <Select
          value={selectedRole}
          onValueChange={(value: UserRole) => setSelectedRole(value)}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="auditor">Auditor</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          onClick={handleRoleChange}
          disabled={selectedRole === user.role || isUpdating}
          size="sm"
        >
          {isUpdating ? "Updating..." : "Update"}
        </Button>
        
        <Button
          variant="danger"
          size="sm"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deactivating..." : "Deactivate"}
        </Button>
      </div>

      <ConfirmActionDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        title="Deactivate User"
        description={`Are you sure you want to deactivate ${user.firstName} ${user.lastName}? This action cannot be undone.`}
        confirmLabel="Deactivate User"
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}

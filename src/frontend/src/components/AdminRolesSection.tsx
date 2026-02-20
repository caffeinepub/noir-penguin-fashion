import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useUpdateAdminRoles, useIsCallerAdmin } from '../hooks/useQueries';
import type { AdminUser } from '../backend';
import { AdminRole } from '../backend';
import { Save, Shield } from 'lucide-react';

interface AdminRolesSectionProps {
  adminRoles: AdminUser[];
}

export default function AdminRolesSection({ adminRoles }: AdminRolesSectionProps) {
  const [roles, setRoles] = useState<AdminUser[]>([]);
  const { data: isAdmin } = useIsCallerAdmin();

  const updateAdminRoles = useUpdateAdminRoles();

  useEffect(() => {
    setRoles(adminRoles);
  }, [adminRoles]);

  const handleRoleChange = (index: number, newRole: AdminRole) => {
    const updatedRoles = [...roles];
    updatedRoles[index] = { ...updatedRoles[index], role: newRole };
    setRoles(updatedRoles);
  };

  const handleSave = async () => {
    try {
      await updateAdminRoles.mutateAsync(roles);
      toast.success('Admin roles updated successfully');
    } catch (error) {
      toast.error('Failed to update admin roles');
      console.error(error);
    }
  };

  const getRoleLabel = (role: AdminRole): string => {
    switch (role) {
      case AdminRole.superAdmin:
        return 'Super Admin';
      case AdminRole.productManager:
        return 'Product Manager';
      case AdminRole.orderManager:
        return 'Order Manager';
      case AdminRole.customerSupport:
        return 'Customer Support';
      default:
        return String(role);
    }
  };

  const getRoleValue = (role: AdminRole): string => {
    return role as string;
  };

  const createRoleFromValue = (roleValue: string): AdminRole => {
    return roleValue as AdminRole;
  };

  if (!isAdmin) {
    return (
      <Card className="bg-noirBlack border-softPink/20">
        <CardContent className="p-8">
          <p className="text-white text-center">Only Super Admins can manage admin roles.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-noirBlack border-softPink/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-softPink" />
          Admin Roles Management
        </CardTitle>
        <CardDescription className="text-gray-400">
          Manage administrator access levels and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {roles.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No admin users configured yet.</p>
        ) : (
          <div className="border border-softPink/20 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-softPink/20">
                  <TableHead className="text-white">Admin Name</TableHead>
                  <TableHead className="text-white">Principal ID</TableHead>
                  <TableHead className="text-white">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((admin, index) => (
                  <TableRow key={admin.id.toString()} className="border-softPink/20">
                    <TableCell className="text-white font-medium">{admin.name}</TableCell>
                    <TableCell className="text-gray-400 font-mono text-xs">
                      {admin.id.toString().slice(0, 20)}...
                    </TableCell>
                    <TableCell>
                      <Select
                        value={getRoleValue(admin.role)}
                        onValueChange={(value) => handleRoleChange(index, createRoleFromValue(value))}
                      >
                        <SelectTrigger className="bg-noirBlack border-softPink/20 text-white w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-noirBlack border-softPink/20">
                          <SelectItem value={AdminRole.superAdmin} className="text-white">Super Admin</SelectItem>
                          <SelectItem value={AdminRole.productManager} className="text-white">Product Manager</SelectItem>
                          <SelectItem value={AdminRole.orderManager} className="text-white">Order Manager</SelectItem>
                          <SelectItem value={AdminRole.customerSupport} className="text-white">Customer Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={updateAdminRoles.isPending || roles.length === 0}
          className="bg-softPink hover:bg-softPink/80 text-noirBlack font-semibold"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateAdminRoles.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}

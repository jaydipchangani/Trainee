import React, { useState, useEffect } from 'react';
import { Table, Card, Checkbox, message, Typography, Tabs } from 'antd';
import { usePermission } from '../contexts/PermissionContext';
import { useAuth } from '../contexts/AuthContext';
import { Role, Permission } from '../types/types';

const { Title } = Typography;
const { TabPane } = Tabs;

const Roles: React.FC = () => {
  const { permissions, roles, loading, updatePermission } = usePermission();
  const { authState } = useAuth();
  const [permissionsByRole, setPermissionsByRole] = useState<{ [key: string]: Permission[] }>({});

  useEffect(() => {
    if (permissions.length > 0) {
      const grouped = permissions.reduce((acc, permission) => {
        if (!acc[permission.roleId]) {
          acc[permission.roleId] = [];
        }
        acc[permission.roleId].push(permission);
        return acc;
      }, {} as { [key: string]: Permission[] });
      
      setPermissionsByRole(grouped);
    }
  }, [permissions]);

  const handlePermissionChange = async (permission: Permission, action: string, checked: boolean) => {
    try {
      const adminRoleId = roles.find(r => r.name === 'Admin')?.id;
      
      // Only prevent admin from changing their own permissions
      if (authState.user?.role === 'Admin' && 
          permission.roleId === adminRoleId) {
        message.error('Admin cannot modify their own permissions');
        return;
      }

      let newActions = [...permission.actions];
      
      if (checked && !newActions.includes(action)) {
        newActions.push(action);
      } else if (!checked && newActions.includes(action)) {
        newActions = newActions.filter(a => a !== action);
      }

      // Automatically check "view" if "edit", "add", or "delete" is checked
      if (['edit', 'add', 'delete'].includes(action) && checked && !newActions.includes('view')) {
        newActions.push('view');
      }

      await updatePermission(permission.id, newActions);
      message.success('Permission updated successfully');
    } catch (error) {
      message.error('Failed to update permission');
    }
  };

  const renderPermissionTable = (roleId: string) => {
    const rolePermissions = permissionsByRole[roleId] || [];
    const isAdmin = roles.find(r => r.id === roleId)?.name === 'Admin';
    const currentUserIsAdmin = authState.user?.role === 'Admin';
    
    const modules = [...new Set(rolePermissions.map(p => p.module))];
    
    return (
      <Table
        dataSource={modules}
        rowKey={(item) => item}
        pagination={false}
        loading={loading}
      >
        <Table.Column
          title="Module"
          dataIndex="module"
          key="module"
          render={(module) => (
            <span className="capitalize">{module}</span>
          )}
        />
        <Table.Column
          title="View"
          key="view"
          render={(module: string) => {
            const permission = rolePermissions.find(p => p.module === module);
            return (
              <Checkbox
                checked={permission?.actions.includes('view')}
                onChange={(e) => {
                  if (permission) {
                    handlePermissionChange(permission, 'view', e.target.checked);
                  }
                }}
                disabled={!currentUserIsAdmin || (isAdmin && currentUserIsAdmin)}
              >
                {module} - View
              </Checkbox>
            );
          }}
        />
        <Table.Column
          title="Add"
          key="add"
          render={(module: string) => {
            const permission = rolePermissions.find(p => p.module === module);
            const viewChecked = permission?.actions.includes('view');
            return (
              <Checkbox
                checked={permission?.actions.includes('add')}
                onChange={(e) => {
                  if (permission) {
                    handlePermissionChange(permission, 'add', e.target.checked);
                  }
                }}
                disabled={!viewChecked || !currentUserIsAdmin || (isAdmin && currentUserIsAdmin)}
              >
                {module} - Add
              </Checkbox>
            );
          }}
        />
        <Table.Column
          title="Edit"
          key="edit"
          render={(module: string) => {
            const permission = rolePermissions.find(p => p.module === module);
            const viewChecked = permission?.actions.includes('view');
            return (
              <Checkbox
                checked={permission?.actions.includes('edit')}
                onChange={(e) => {
                  if (permission) {
                    handlePermissionChange(permission, 'edit', e.target.checked);
                  }
                }}
                disabled={!viewChecked || !currentUserIsAdmin || (isAdmin && currentUserIsAdmin)}
              >
                {module} - Edit
              </Checkbox>
            );
          }}
        />
        <Table.Column
          title="Delete"
          key="delete"
          render={(module: string) => {
            const permission = rolePermissions.find(p => p.module === module);
            const viewChecked = permission?.actions.includes('view');
            return (
              <Checkbox
                checked={permission?.actions.includes('delete')}
                onChange={(e) => {
                  if (permission) {
                    handlePermissionChange(permission, 'delete', e.target.checked);
                  }
                }}
                disabled={!viewChecked || !currentUserIsAdmin || (isAdmin && currentUserIsAdmin)}
              >
                {module} - Delete
              </Checkbox>
            );
          }}
        />
      </Table>
    );
  };

  return (
    <div>
      <Title level={2}>Roles & Permissions</Title>
      
      <Card>
        <Tabs defaultActiveKey="1">
          {roles.map((role) => (
            <TabPane tab={role.name} key={role.id.toString()}>
              <div className="mb-4">
                <p><strong>Description:</strong> {role.description}</p>
              </div>
              {renderPermissionTable(role.id)}
              {role.name === 'Admin' && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-700">
                    Note: Admin permissions cannot be modified, even by other admins.
                  </p>
                </div>
              )}
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default Roles;
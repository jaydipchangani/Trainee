import React, { useState, useEffect } from 'react';
import { Table, Card, Checkbox, Button, message, Typography, Tabs, Tooltip } from 'antd';
import { rolesApi, permissionsApi } from '../api/api';
import { Role, Permission, ModuleType, ActionType } from '../types/types';
import { usePermission } from '../contexts/PermissionContext';

const { Title } = Typography;
const { TabPane } = Tabs;

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState(false);
  const { hasPermission, refreshPermissions } = usePermission();

  const fetchRoles = async () => {
    try {
      const data = await rolesApi.getAll();
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      message.error('Failed to fetch roles');
    }
  };

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const data = await permissionsApi.getAll();
      setPermissions(data);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      message.error('Failed to fetch permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const modules: ModuleType[] = ['users', 'roles', 'employees', 'projects'];
  const actions: ActionType[] = ['view', 'add', 'edit', 'delete'];

  const handlePermissionChange = async (
    checked: boolean,
    roleId: number,
    module: ModuleType,
    action: ActionType
  ) => {
    if (roleId === 1 && module === 'roles' && action === 'edit') {
      message.error("You cannot modify the Admin role's permissions.");
      return;
    }
  
    if (!hasPermission('roles', 'edit')) {
      message.error('You do not have permission to edit roles');
      return;
    }
  
    setSavingPermissions(true);
    try {
      let permission = permissions.find(
        (p) => p.roleId === roleId && p.module === module
      );
  
      if (!permission) {
        // ✅ If permission entry does not exist, create it
        const newPermission = await permissionsApi.create({
          roleId,
          module,
          actions: checked ? [action] : [],
        });
  
        setPermissions([...permissions, newPermission]);
      } else {
        // ✅ If permission exists, update it
        const updatedActions = checked
          ? [...new Set([...permission.actions, action])] // Ensure no duplicates
          : permission.actions.filter((a) => a !== action);
  
        await permissionsApi.update(permission.id, { actions: updatedActions });
  
        setPermissions(
          permissions.map((p) =>
            p.id === permission.id ? { ...p, actions: updatedActions } : p
          )
        );
      }
  
      message.success('Permission updated successfully');
      await refreshPermissions();
    } catch (error) {
      console.error('Failed to update permission:', error);
      message.error('Failed to update permission. Check API or backend logs.');
    } finally {
      setSavingPermissions(false);
    }
  };
  
  

  const hasActionPermission = (roleId: number, module: ModuleType, action: ActionType) => {
    const permission = permissions.find(
      p => p.roleId === roleId && p.module === module
    );
    return permission ? permission.actions.includes(action) : false;
  };

  const renderPermissionTable = (role: Role) => {
    return (
      <Table
        dataSource={modules}
        rowKey={module => module}
        pagination={false}
        loading={loading}
      >
        <Table.Column
          title="Module"
          dataIndex="module"
          key="module"
          render={(module: ModuleType) => (
            <span className="capitalize">{module}</span>
          )}
        />
        {actions.map(action => (
          <Table.Column
            title={<span className="capitalize">{action}</span>}
            key={action}
            render={(module: ModuleType) => (
              <Checkbox
                checked={hasActionPermission(role.id, module, action)}
                onChange={e => handlePermissionChange(e.target.checked, role.id, module, action)}
                disabled={savingPermissions || (role.id === 1 && module === 'roles' && action === 'edit')} // Admin role is fixed
              />
            )}
          />
        ))}
      </Table>
    );
  };

  return (
    <div>
      <Title level={2}>Roles & Permissions</Title>
      
      {!hasPermission('roles', 'edit') && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-700">
            You are in view-only mode. Only administrators can modify permissions.
          </p>
        </div>
      )}

      <Tabs type="card">
        {roles.map(role => (
          <TabPane 
            tab={
              <Tooltip title={role.description}>
                <span>{role.name}</span>
              </Tooltip>
            } 
            key={role.id.toString()}
          >
            <Card 
              title={
                <div>
                  <span className="font-bold">{role.name}</span>
                  <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                </div>
              }
            >
              {renderPermissionTable(role)}
              
              {role.id === 1 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-blue-700">
                    The Admin role has fixed permissions and cannot be modified for security reasons.
                  </p>
                </div>
              )}
            </Card>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Roles;
export const rolePermissions = {
    Admin: {
      manageUsers: true,
      managePermissions: true,
      manageEmployees: true,
      manageProjects: true,
    },
    HR: {
      manageUsers: false,
      managePermissions: false,
      manageEmployees: true,
      manageProjects: false,
    },
    Supervisor: {
      manageUsers: false,
      managePermissions: false,
      manageEmployees: true, // Only view/edit
      manageProjects: false,
    },
    Manager: {
      manageUsers: false,
      managePermissions: false,
      manageEmployees: false,
      manageProjects: true,
    },
  };
  
  export const hasPermission = (role: string, action: keyof typeof rolePermissions["Admin"]) => {
    return rolePermissions[role]?.[action] || false;
  };
  
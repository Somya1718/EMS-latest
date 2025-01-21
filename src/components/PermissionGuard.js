//src/components/PermissionGuard.js
import React from 'react';
import { useAcl } from '../context/AclContext';

const PermissionGuard = ({ permission, children, fallback = null }) => {
  const { hasPermission } = useAcl();
  
  if (!hasPermission(permission)) {
    return fallback;
  }
  
  return children;
};

export default PermissionGuard;
import type { Access, FieldAccess } from 'payload/types';

export type TenantRole =
  | 'owner'
  | 'admin'
  | 'editor'
  | 'author'
  | 'media-manager'
  | 'viewer';

export type AuthUser = {
  id: string;
  email?: string;
  role?: string;
  memberships?: Array<{
    id?: string;
    role?: TenantRole;
    tenant?: string | { id?: string };
  }>;
  tenants?: Array<{ id?: string }>;
};

const SUPER_ROLES = ['super-admin'];

const extractTenantIds = (user: AuthUser | null | undefined): string[] => {
  if (!user) return [];
  const fromMembership = (user.memberships ?? [])
    .map((membership) => {
      const tenant = membership?.tenant;
      if (!tenant) return undefined;
      if (typeof tenant === 'string') return tenant;
      return tenant.id ?? undefined;
    })
    .filter((value): value is string => Boolean(value));

  if (fromMembership.length > 0) {
    return Array.from(new Set(fromMembership));
  }

  const fromTenants = (user.tenants ?? [])
    .map((tenant) => tenant?.id)
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(fromTenants));
};

export const isSuperAdmin: Access = ({ req }) => {
  const user = req.user as AuthUser | undefined;
  if (!user) return false;
  if (!user.role) return false;
  return SUPER_ROLES.includes(user.role);
};

export const isAuthenticated: Access = ({ req }) => Boolean(req.user);

export const tenantScopedAccess = (field: string = 'tenant'): Access => ({ req }) => {
  const user = req.user as AuthUser | undefined;

  if (!user) {
    return false;
  }

  if (user.role && SUPER_ROLES.includes(user.role)) {
    return true;
  }

  const tenantIds = extractTenantIds(user);

  if (tenantIds.length === 0) {
    return false;
  }

  return {
    [field]: {
      in: tenantIds,
    },
  };
};

export const tenantFieldAccess = (field: string = 'tenant'): FieldAccess => ({ req, value }) => {
  const user = req.user as AuthUser | undefined;

  if (!user) return false;

  if (user.role && SUPER_ROLES.includes(user.role)) {
    return true;
  }

  const tenantIds = extractTenantIds(user);

  if (tenantIds.length === 0) {
    return false;
  }

  if (!value) {
    return tenantIds.length > 0;
  }

  if (typeof value === 'string') {
    return tenantIds.includes(value);
  }

  if (typeof value === 'object' && 'id' in value) {
    return value.id ? tenantIds.includes(value.id) : false;
  }

  return false;
};

export const membershipManagementAccess: Access = ({ req, data }) => {
  const user = req.user as AuthUser | undefined;

  if (!user) return false;

  if (user.role && SUPER_ROLES.includes(user.role)) {
    return true;
  }

  const tenantIds = extractTenantIds(user);
  if (tenantIds.length === 0) {
    return false;
  }

  const targetTenant =
    (typeof data?.tenant === 'string' && data?.tenant) ||
    (typeof data?.tenant === 'object' ? data?.tenant?.id : undefined);

  if (!targetTenant) {
    return {
      tenant: {
        in: tenantIds,
      },
    };
  }

  return tenantIds.includes(targetTenant);
};

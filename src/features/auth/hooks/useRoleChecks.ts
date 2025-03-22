
import { UserProfile } from '../types';

export const useRoleChecks = (profile: UserProfile | null) => {
  // Role-based permission helpers
  const isAdmin = () => profile?.role === 'admin';
  const isManager = () => ['admin', 'manager'].includes(profile?.role || '');

  return { isAdmin, isManager };
};

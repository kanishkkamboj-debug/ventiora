import React from 'react';
import { Badge } from '../common/Badge';
import type { Role } from '../../types/common.types';
import { ROLE_LABELS } from '../../utils/constants';

interface UserBadgeProps {
  role: Role;
}

export function UserBadge({ role }: UserBadgeProps) {
  const variant =
    role === 'ADMIN' ? 'destructive' : role === 'MODERATOR' ? 'primary' : 'secondary';
  return <Badge variant={variant}>{ROLE_LABELS[role]}</Badge>;
}

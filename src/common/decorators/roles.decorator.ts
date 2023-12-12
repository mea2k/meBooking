import { SetMetadata } from '@nestjs/common';
import { UserRoleType } from '../interfaces/types';

export const ROLES_KEY = 'userRoles';
export const Roles = (...roles: UserRoleType[]) => SetMetadata(ROLES_KEY, roles);
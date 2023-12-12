import { Types } from 'mongoose';

// тип данных для первичного ключа
export type IDType = string | number | Types.ObjectId;

// тип данных для роли пользователя
export enum UserRoleType {
	CLIENT = 'client',
	MANAGER = 'manager',
	ADMIN = 'admin',
}

export const DEFAULT_USER_ROLE: UserRoleType = UserRoleType.CLIENT;

// тип данных для типа хранилища
export type StorageType = 'file' | 'mongo';


export interface ToNumberOptions {
	default?: number;
	min?: number;
	max?: number;
}

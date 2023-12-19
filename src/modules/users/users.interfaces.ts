import { IDType, UserRoleType } from 'src/common/interfaces/types';

// Метка для объекта включения (инъекции зависимости)
export const USERS_STORAGE = 'USERS_STORAGE';

/** ИНТЕРФЕЙС - ПОЛЬЗОВАТЕЛЬ
 * Определяет информацию для каждого объекта ПОЛЬЗОВАТЕЛЬ:
 *   _id:           IDType  - ID  (обязательный параметр)
 *   email:         string  - email пользователя (обязательный параметр)
 *   login:         string  - логин пользователя (обязательный параметр)
 *   name:    		string  - имя пользователя (обязательный параметр)
 *   passwordHash?:	string  - хеш пароля
 *   contactPhone?: string  - номер телефона
 *   role: 		    string  - роль пользователя (по умолчанию 'client')
 *
 * Обязательным является только поля ID, email, login, name, role
 */
export interface IUser {
	_id: IDType;
	email: string;
	login: string;
	name: string;
	passwordHash?: string;
	contactPhone?: string;
	role: UserRoleType;
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ИЗ_ФОРМЫ_ДЛЯ_СОЗДАНИЯ_ПОЛЬЗОВАТЕЛЯ
 * Определяет информацию, на основании которой создается объект ПОЛЬЗОВАТЕЛЬ:
 * (берется из формы создания)
 *   email:         string   - email пользователя (обязательный параметр)
 *   login:         string   - логин пользователя (обязательный параметр)
 *   name: 		    string   - имя пользователя
 *   password1:     string   - пароль - строка 1 (обязательный параметр)
 *   password2:     string   - пароль - строка 2 (обязательный параметр)
 *   contactPhone?: string   - контактный номер телефона
 *   role?:         string   - роль пользователя (client, manager, admin)
 *
 * Обязательным является только поля email, login, password
 */
export interface IUserCreateDto {
	email: IUser['email'];
	login: IUser['login'];
	name: IUser['name'];
	password1: string;
	password2: string;
	contactPhone?: IUser['contactPhone'];
	role?: IUser['role'];
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ДЛЯ_ДОБАВЛЕНИЯ_ОБНОВЛЕНИЯ_ПОЛЬЗОВАТЕЛЯ
 * Определяет информацию, на основании которой создается объект ПОЛЬЗОВАТЕЛЬ:
 * (берется из формы создания)
 *   email:         string   - email пользователя (обязательный параметр)
 *   login:         string   - логин пользователя (обязательный параметр)
 *   name: 		    string   - имя пользователя
 *   contactPhone?: string   - контактный номер телефона
 *   role?:         string   - роль пользователя (client, manager, admin)
 *   passwordHash?: string   - хеш пароля (заполняется на основе паролей password1 и password2)
 *
 * Обязательным является только поля email, login, password
 */
export interface IUserDto {
	email: IUser['email'];
	login: IUser['login'];
	name: IUser['name'];
	passwordHash?: IUser['passwordHash'];
	contactPhone?: IUser['contactPhone'];
	role?: IUser['role'];
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ДЛЯ_ПОИСКА_ПОЛЬЗОВАТЕЛЕЙ
 *   email?:         string   - email пользователя
 *   name?: 		 string   - имя пользователя
 *   contactPhone?:  string   - контактный номер телефона
 *   offset?:        number   - смещение выдачи (начинать с указанной записи)
 *   limit?:         number   - размер выдачи (количество записей)
 *
 * Обязательных полей нет
 */
export interface SearchUserParams {
	email?: string;
	name?: string;
	contactPhone?: string;
	role?: UserRoleType;
	offset?: number;
	limit?: number;
}

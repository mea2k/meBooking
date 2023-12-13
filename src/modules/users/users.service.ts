import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IUser, IUserDto, SearchUserParams, USERS_STORAGE } from './users.interfaces';
import { UserStorageFile } from './storage/userStorageFile';
import { UserStorageDb } from './storage/userStorageDb';
import { ConfigService } from '../config/config.service';
import { IDType } from 'src/common/interfaces/types';

@Injectable()
export class UsersService {
	//private readonly _storage: BookStorageDb | BookStorageFile;

	constructor(
		config: ConfigService,
		@Inject(USERS_STORAGE)
		private readonly _storage: UserStorageFile | UserStorageDb,
	) {
		//console.log('USERS_SERVICE - constructor');
	}

	/** ПОЛУЧЕНИЕ СПИСКА ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
	 * @returns Promise<список пользователей в формате JSON ([{...}, {...}, ...])>
	 */
	getAll() {
		return this._storage.getAll();
	}

	/** ПОЛУЧЕНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОМУ ПОЛЬЗОВАТЕЛЮ
	 * @params {string} id - ID пользователя
	 * @returns Promise<информация о пользователе в формате JSON {...}>
	 */
	get(id: string) {
		return this._storage.get(this._storage.convertId(id));
	}

	/** ДОБАВЛЕНИЕ НОВОго ПОЛЬЗОВАТЕЛЯ
	 * @constructor
	 * @params {JSON} параметры нового пользователя (email, login, firstName, password1, password2)
	 * @returns Promise<сам добавленный объект в формате JSON ({...})>
	 */
	create(item: IUserDto) {
		try {
			return this._storage.create(item);
		} catch(e) {
			console.log('here')
			throw new HttpException((e as Error).message, HttpStatus.BAD_REQUEST);
		}
	}

	/** ИЗМЕНЕНИЕ ПАРАМЕТРОВ ПОЛЬЗОВАТЕЛЯ
	 * @constructor
	 * @params {string} id - ID пользователя
	 * @params {JSON} новые параметры (email, login, firstName, pawwsord1, password2)
	 * @returns Promise<измененный объект в формате JSON ({...})>
	 */
	update(id: string, item: IUserDto) {
		return this._storage.update(this._storage.convertId(id), item);
	}

	/** УДАЛЕНИЕ ВЫБРАННОГО ПОЛЬЗОВАТЕЛЯ
	 * @constructor
	 * @params {string} id   - ID пользователя
	 * @returns Promise<bool>
	 */
	delete(id: string) {
		return this._storage.delete(this._storage.convertId(id));
	}

	///////////////////////////////////////////////////////////////////////////
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	///////////////////////////////////////////////////////////////////////////

	/** ПОИСК ПОЛЬЗОВАТЕЛЯ ПО ЛОГИНУ
	 * @constructor
	 * @params login    - логин пользователя
	 *
	 * @returns Promise<IUser | null>
	 */
	getByLogin(login: IUser['login']): Promise<IUser | null> {
		return this._storage.getByLogin(login);
	}

	/** ПОИСК ПОЛЬЗОВАТЕЛЯ ПО ПАРАМЕТРАМ ПОИСКА
	 * @constructor
	 * @params params    - SearchUserParams {name,email,contactPhone,role,offset,limit}
	 *
	 * @returns Promise<IUser[]>
	 */
	search(params: SearchUserParams): Promise<IUser[]> {
		return this._storage.search(params);
	}


	/** ПРОВЕРКА РАВЕНСТВА ИДЕНТИФИКАТОРОВ ПОЛЬЗОВАТЕЛЯ
	 * (используется при определении авторства объекта)
	 * @constructor
	 * @params user  	  - объект IUser
	 * @params otherId	  - идентификатор другого пользователя
	 *
	 * @returns boolean
	 */
	compare(user: IUser, otherId: string | IDType): boolean {
		if (typeof otherId === 'string') {
			return user?._id == this._storage.convertId(otherId);
		} else {
			return user?._id == otherId;
		}
	}
}

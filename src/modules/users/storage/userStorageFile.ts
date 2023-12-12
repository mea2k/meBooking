import * as fs from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { StorageFile } from '../../../storage/storageFile';
import { IUser, IUserDto, SearchUserParams } from '../users.interfaces';
import { ConfigService } from '../../config/config.service';
import { hashPassword } from 'src/common/functions/hash';

@Injectable()
class UserStorageFile extends StorageFile<IUser, IUserDto, '_id'> {
	constructor(config: ConfigService) {
		// Проверка на существование пути и создание его
		if (!fs.existsSync(config.get('DATA_PATH'))) {
			fs.mkdirSync(config.get('DATA_PATH'), { recursive: true });
		}
		super(config.get('DATA_PATH') + config.get('USERS_FILE'), '_id');
	}

	//
	// ОБЯЗАТЕлЬНЫЕ МЕТОДЫ АБСТРАКТНОГО КЛАССА - РОДИТЕЛЯ
	//
	_getNextId(id: IUser['_id']) {
		// number
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - number
	convertId(id: string): IUser['_id'] {
		return id && !isNaN(Number(id)) ? Number(id) : id;
	}

	//
	// ПЕРЕОПРЕДЕЛЕНИЕ МЕТОДОВ РОДИТЕЛЯ
	//
	async create(item: IUser | IUserDto): Promise<IUser | null> {
		// проверка, что такого логина еще нет
		const anotherUser = await this.getByLogin(item.login);
		if (anotherUser) {
			throw new BadRequestException(`Login ${item.login} already exists!`);
			return null;
		}
		item.passwordHash = await hashPassword(item.login, item.passwordHash);
		return super.create(item);
	}


	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//
	getByLogin(login: IUser['login']): Promise<IUser | null> {
		return new Promise<IUser | null>((resolve) =>
			resolve(this._storage.find((e) => e['login'] == login) || null),
		);
	}

	getByEmail(email: IUser['email']): Promise<IUser | null> {
		return new Promise<IUser | null>((resolve) =>
			resolve(this._storage.find((e) => e['email'] == email) || null),
		);
	}

	search(params: SearchUserParams): Promise<IUser[]> {
		return new Promise<IUser[]>((resolve) =>
			resolve(this._storage.filter((e) => 
				( (params.name ? e['name'] == params.name : false) ||
				  (params.email ? e['email'] == params.email : false) ||
				  (params.contactPhone ? e['contactPhone'] == params.contactPhone : false) ||
				  (!params.name && !params.email && !params.contactPhone && params.role ? true : false) ) &&
				( params.role ? e['role'] == params.role : true ),
			).slice(
				params.offset, 
				params.limit
					? params.offset
						? params.offset + params.limit
						: params.limit
					: undefined,
			)
		));
	}
}

// экспорт класса
export { UserStorageFile };

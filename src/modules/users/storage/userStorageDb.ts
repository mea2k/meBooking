import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { IUser, IUserDto, SearchUserParams } from '../users.interfaces';
import { StorageDb } from '../../../storage/storageDb';
import { User, UserDocument } from './userSchema';

@Injectable()
class UserStorageDb extends StorageDb<UserDocument, IUserDto, '_id'> {
	constructor(
		@InjectModel(User.name) private UserModel: Model<UserDocument>,
		@InjectConnection() private connection: Connection,
	) {
		super(UserModel, '_id');
	}

	//
	// ОБЯЗАТЕлЬНЫЕ МЕТОДЫ АБСТРАКТНОГО КЛАССА - РОДИТЕЛЯ
	//
	_getNextId(id: IUser['_id']): IUser['_id'] {
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - string
	convertId(id: string): IUser['_id'] {
		return id;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//
	async getByLogin(login: IUser['login']): Promise<UserDocument | null | any> {
		return this._model.findOne({ login: login }).exec();
	}
	async getByEmail(email: IUser['email']): Promise<UserDocument | null | any> {
		return this._model.findOne({ email: email }).exec();
	}
	async search(params: SearchUserParams): Promise<UserDocument[]> {
		return this._model
			.find({
				$or: [
					{ email: params.email },
					{ name: params.name },
					{ contactPhone: params.contactPhone },
				],
				role: params.role,
			})
			.skip(params.offset ? params.offset : 0)
			.limit(params.limit ? params.limit : 0);
	}
}

// экспорт класса
export { UserStorageDb };

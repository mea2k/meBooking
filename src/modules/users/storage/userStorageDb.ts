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
		return this._model.findOne({ login: login }).select('-__v').exec();
	}
	async getByEmail(email: IUser['email']): Promise<UserDocument | null | any> {
		return this._model.findOne({ email: email }).exec();
	}
	async search(params: SearchUserParams): Promise<UserDocument[]> {
		// формируем фильтр поиска исходя из заполненных полей params
		const filter = [{}];
		'name' in params &&	params.name &&
			filter.push({ name: new RegExp(params.name, 'gi') });
		'email' in params && params.email &&
			filter.push({ email: new RegExp(params.email, 'gi') });
		'contactPhone' in params &&	params.contactPhone &&
			filter.push({ contactPhone: new RegExp(params.contactPhone, 'gi') });
		'role' in params && params.role && filter.push({ role: params.role });
		return this._model
			.find({ $and: filter }, { __v: 0 })
			.skip(params.offset ? params.offset : 0)
			.limit(params.limit ? params.limit : 0);
	}
}

// экспорт класса
export { UserStorageDb };

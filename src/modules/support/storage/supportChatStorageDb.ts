import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { StorageDb } from '../../../storage/storageDb';
import { SupportChat, SupportChatDocument } from './supportChatSchema';
import { ISupportChat, ISupportChatDto } from '../support.interfaces';

@Injectable()
class SupportChatStorageDb extends StorageDb<
	SupportChatDocument,
	ISupportChatDto,
	'_id'
> {
	constructor(
		@InjectModel(SupportChat.name) private supportChatModel: Model<SupportChatDocument>,
		@InjectConnection() private connection: Connection,
	) {
		super(supportChatModel, '_id');
	}

	_getNextId(id: ISupportChat['_id']) {
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - string
	convertId(id: string): ISupportChat['_id'] {
		return id;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//
	// поиск чатов пользователя
	// isActive - 	если true, то только активные
	//				если false, то только закрытые
	//				если undefined, то любые
	search(
		userId: ISupportChat['user'],
		isActive: boolean = undefined,
	): Promise<ISupportChat[]> {
		if (isActive == undefined) {
			return this._model.find({ user: userId }).lean();
		} else {
			return this._model
				.find({ user: userId, isActive: isActive })
				.lean();
		}
	}
}

// экспорт класса
export { SupportChatStorageDb };

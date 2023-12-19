import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { StorageDb } from '../../../storage/storageDb';
import { ChatMessages, ChatMessageDocument } from './chatMessageSchema';
import { IChatMessage, IChatMessageDto } from '../support.interfaces';

@Injectable()
class ChatMessageStorageDb extends StorageDb<
	ChatMessageDocument,
	IChatMessageDto,
	'_id'
> {
	constructor(
		@InjectModel(ChatMessages.name)
		private chatMessageModel: Model<ChatMessageDocument>,
		@InjectConnection() private connection: Connection,
	) {
		super(chatMessageModel, '_id');
	}

	_getNextId(id: IChatMessage['_id']) {
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - string
	convertId(id: string): IChatMessage['_id'] {
		return id;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//
	// получение сообщений по ID чата
	getMessagesByChat(chatId: IChatMessage['chat']): Promise<IChatMessage[]> {
		return this._model
			.find({ chat: chatId }, { __v: 0 })
			.sort({ sentAt: 1 })
			.lean();
	}

	// получение числа непрочитанных сообщений в чате
	getUnreadCount(
		chatId: IChatMessage['chat'],
		author: IChatMessage['author'],
	): Promise<number> {
		return this._model
			.countDocuments({
				chat: chatId,
				author: { $ne: author },
				readAt: { $exists: false },
			})
			.lean();
	}

	// отметка сообщений о прочтении
	async markMessagesAsRead(
		chatId: IChatMessage['chat'],
		author: IChatMessage['author'],
		createdBefore: Date,
	): Promise<any> {
		const now = new Date();
		const res = await this._model.updateMany(
			{
				chat: chatId,
				author: { $ne: author },
				sentAt: { $lte: createdBefore },
				readAt: { $exists: false },
			},
			{ readAt: now.toString() },
		);
		return Promise.resolve({
			success: res.acknowledged,
			messagesCount: res.matchedCount,
		});
	}
}

// экспорт класса
export { ChatMessageStorageDb };

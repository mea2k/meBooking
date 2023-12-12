import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { StorageFile } from '../../../storage/storageFile';
import { IChatMessage, IChatMessageDto } from '../support.interfaces';

@Injectable()
class ChatMessageStorageFile extends StorageFile<IChatMessage, IChatMessageDto, '_id'> {
	constructor(config: ConfigService) {
		// Проверка на существование пути и создание его
		if (!fs.existsSync(config.get('DATA_PATH'))) {
			fs.mkdirSync(config.get('DATA_PATH'), { recursive: true });
		}
		super(config.get('DATA_PATH') + config.get('CHATMESSAGES_FILE'), '_id');
	}

	_getNextId(id: IChatMessage['_id']) {
		// number
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - number
	convertId(id: string): IChatMessage['_id'] {
		return id && !isNaN(Number(id)) ? Number(id) : id;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//

	// получение сообщений по ID чата
	getMessagesByChat(chatId: IChatMessage['chat']): Promise<IChatMessage[]> {
		return new Promise<IChatMessage[] | []>((resolve) =>
			resolve(this._storage.filter((e) => e.chat == chatId) || []),
		);
	}

	// получение числа непрочитанных сообщений в чате
	getUnreadCount(chatId: IChatMessage['chat'], author: IChatMessage['author']): Promise<number> {
		return new Promise<number>((resolve) =>
			resolve(this._storage.filter(
				(e) =>
					e.chat == chatId &&
					e.author != author &&
					(!('readAt' in e) || (e.readAt == undefined))
			).length,
			),
		);
	}

	// отметка сообщений о прочтении
	markMessagesAsRead(
		chatId: IChatMessage['chat'],
		author: IChatMessage['author'],
		createdBefore: Date,
	): Promise<any> {
		var count: number = 0;
		try {
			this._storage.forEach((e, i, arr) => {
				if (
					e.chat == chatId &&
					e.author != author &&
					!('readAt' in e || e.readAt == undefined) &&
					( new Date(e.sentAt).getTime() <= createdBefore.getTime() )
				) {
					// модифицируем жлемент исходного массива
					arr[i].readAt = new Date();
					count++;
				}
			});
			// сохранение изменений
			this._dumpToFile();
			return Promise.resolve({
				success: true,
				messagesCount: count,
			});
		} catch (e) {
			console.log(e);
			return Promise.resolve({
				success: false,
			});
		}
	}
}

// экспорт класса
export { ChatMessageStorageFile };

import { Injectable, Inject } from '@nestjs/common';
import { SupportChatStorageFile } from './storage/supportChatStorageFile';
import { SupportChatStorageDb } from './storage/supportChatStorageDb';
import { ChatMessageStorageFile } from './storage/chatMessageStorageFile';
import { ChatMessageStorageDb } from './storage/chatMessageStorageDb';
import { CHATMESSAGES_STORAGE, IChatMessage, IChatMessageDto, IMarkChatMessageAsRead, ISearchChatParams, ISendChatMessageDto, ISupportChat, ISupportChatCreateUpdateDto, ISupportChatDto, SUPPORTCHAT_STORAGE } from './support.interfaces';

@Injectable()
export class SupportService {
	constructor(
		@Inject(SUPPORTCHAT_STORAGE)
		private readonly _chatStorage: SupportChatStorageFile | SupportChatStorageDb,
		@Inject(CHATMESSAGES_STORAGE)
		private readonly _messagesStorage: ChatMessageStorageFile | ChatMessageStorageDb,
	) {
		//console.log('SUPPORT_SERVICE - constructor');
	}

	/** ПОЛУЧЕНИЕ СПИСКА ВСЕХ ЧАТОВ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
	 * @returns Promise<список объектов в формате JSON ([{...}, {...}, ...])>
	 */
	getAll(offset: number = undefined, limit: number = undefined) {
		return this._chatStorage.getAll(offset, limit);
	}

	/** ПОЛУЧЕНИЕ ИНФОРМАЦИИ И СООБЩЕНИЙ ПО ВЫБРАННОМУ ЧАТУ
	 * @params {string} id - ID объекта
	 * @returns Promise<информация об объекте в формате JSON {...}>
	 */
	async get(id: string) {
		// конвертируем ID к правильному типу
		const chatId = this._chatStorage.convertId(id);
		const chat = await this._chatStorage.get(chatId);
		const chatMessages = await this._messagesStorage.getMessagesByChat(chatId);
		return {
			...chat,
			messages: chatMessages
		};
	}

	/** СОЗДАНИЕ НОВОГО ЧАТА
	 * @constructor
	 * @params {JSON} параметры нового объекта (user, text, isActive?)
	 * @params {string} ID пользователя (берется из сессии req.user)
	 * @returns Promise<сам добавленный объект в формате JSON ({...})> или NULL
	 */
	async create(data: ISupportChatCreateUpdateDto, userID: string) {
		// пополняем данные для сохранения в хранилище
		const item: ISupportChatDto = {
			user: this._chatStorage.convertId(userID),
			createdAt: new Date(),
			text: data.text,
			isActive: true,
		};

		const newChat = await this._chatStorage.create(item);
		if (newChat) {
			// добавляем первое сообщение в чат
			const msgItem: IChatMessageDto = {
				author: this._chatStorage.convertId(userID),
				chat: newChat._id,
				text: data.text,
				sentAt: new Date(),
			}
			const message = await this._messagesStorage.create(msgItem);
			return newChat;
		}
		return null;
	}

	/** СОЗДАНИЕ СООБЩЕНИЯ В ЧАТ
	 * @constructor
	 * @params {JSON} параметры нового объекта (author, supportChat, text)
	 * @returns Promise<сам добавленный объект в формате JSON ({...})> или NULL
	 */
	async createMessage(data: ISendChatMessageDto) {
		// пополняем данные для сохранения в хранилище
		const item: IChatMessageDto = {
			author: this._messagesStorage.convertId(data.author),
			chat: this._messagesStorage.convertId(data.supportChat),
			text: data.text,
			sentAt: new Date(),
		};

		return this._messagesStorage.create(item);
	}

	/** ИЗМЕНЕНИЕ ПАРАМЕТРОВ ЧАТА
	 * @constructor
	 * @params {string} id - ID объекта
	 * @params {JSON} новые параметры ({isActive})
	 * @returns Promise<измененный объект в формате JSON ({...})> или NULL
	 */
	async update(id: string, data: ISupportChatCreateUpdateDto) {
		const item: ISupportChatDto = {
			...data,
		};

		// конвертируем ID к правильному типу
		return this._chatStorage.update(this._chatStorage.convertId(id), item);
	}

	/** ИЗМЕНЕНИЕ ПАРАМЕТРОВ СООБЩЕНИЯ ЧАТА
	 * (ТОЛЬКО параметр время чтения (readAt))
	 * @constructor
	 * @params {string} id - ID объекта
	 * @params {JSON} новые параметры ({readAt})
	 * @returns Promise<измененный объект в формате JSON ({...})> или NULL
	 */
	async updateMessage(id: string, data: IChatMessageDto) {
		const item: IChatMessageDto = {
			readAt: new Date(),
		};

		// конвертируем ID к правильному типу
		return this._messagesStorage.update(this._messagesStorage.convertId(id), item);
	}

	/** УДАЛЕНИЕ ВЫБРАННОГО ЧАТА
	 * @constructor
	 * @params {string} id   - ID объекта
	 * @returns Promise<bool>
	 */
	delete(id: string) {
		// конвертируем ID к правильному типу
		return this._chatStorage.delete(this._chatStorage.convertId(id));
	}

	///////////////////////////////////////////////////////////////////////////
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	///////////////////////////////////////////////////////////////////////////

	/** ЧИСЛО НЕПРОЧИТАННЫХ СООБЩЕНИЙ В ЧАТЕ
	 * @constructor
	 * @params {string} chatId    - ID чата
	 * @params {string} author    - ID пользователя - автора сообщений
	 *
	 * @returns Promise<number>
	 */
	getUnreadCount(chatId: string, author: string): Promise<number> {
		return this._messagesStorage.getUnreadCount(
			this._messagesStorage.convertId(chatId),
			this._messagesStorage.convertId(author),
		);
	}

	/** ПОИСК ЧАТОВ ПОЛЬЗОВАТЕЛЯ
	 * @constructor
	 * @params userId    - ID пользователя
	 *
	 * @returns Promise<IReservation[]>
	 */
	searchChats(data: ISearchChatParams): Promise<ISupportChat[]> {
		return this._chatStorage.search(
			this._chatStorage.convertId(data.user),
			('isActive in data') ? data.isActive : undefined 
		)
	}

	/** ОТМЕТКА СООБЩЕНИЙ О ПРОЧТЕНИИ
	 * @constructor
	 * @params data    - параметры ({chatId, authir, createdBefore})
	 * 
	 * @returns Promise<{}>
	 */
	markMessagesAsRead(data: IMarkChatMessageAsRead): Promise<any> {
		return this._messagesStorage.markMessagesAsRead(
			this._messagesStorage.convertId(data.supportChat),
			data.author,
			data.createdBefore,
		);
	}
}

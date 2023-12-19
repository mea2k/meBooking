import { IDType } from 'src/common/interfaces/types';

// Метка для объекта включения (инъекции зависимости)
export const SUPPORTCHAT_STORAGE = 'SUPPORTCHAT_STORAGE';
export const CHATMESSAGES_STORAGE = 'CHATMESSAGES_STORAGE';

/** ИНТЕРФЕЙС - ЧАТ ПОДДЕРЖКИ
 * Определяет информацию по каждому запросу в чат поддержки:
 *   _id:           IDType    - ID  (обязательный параметр)
 *   user:          IDType    - ID пользователя (обязательный параметр)
 *   createdAt:    	Date      - дата создания чата (обязательный параметр)
 *   isActive:		boolean   - чат активный? (можно в него писать сообщения)
 *
 * Обязательным является только поля ID, user, createdAt
 */
export interface ISupportChat {
	_id: IDType;
	user: IDType;
	createdAt: Date;
	isActive?: boolean;
	messages?: IChatMessage[];
}

/** ИНТЕРФЕЙС - СООБЩЕНИЕ ЧАТА
 * Содержит сообщение в рамках чата
 *   _id:           IDType    - ID  (обязательный параметр)
 *   chat:          IDType    - ID чата (обязательный параметр)
 *   author:        IDType    - ID пользователя автора (обязательный параметр)
 *   sentAt:    	Date      - дата отправки сообщения (обязательный параметр)
 *   text:		    string    - текст сообщения (обязательный параметр)
 *   readAt:		Date      - дата прочтения сообщения
 *
 * Обязательными являются только поля ID, chat, author, sentdAt, text
 */
export interface IChatMessage {
	_id: IDType;
	chat: IDType;
	author: IDType;
	sentAt: Date;
	text: string;
	readAt?: Date;
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ИЗ_ФОРМЫ_ДЛЯ_СОЗДАНИЯ_ЧАТА
 * Определяет информацию, на основании которой создается/изменяется объект ЧАТ:
 * (берется из формы создания/изменения)
 *   user:      string   - автор чата (обязательный параметр)
 *   text:      string   - сообщение в чат (обязательный параметр)
 *   isActive:  boolean  - чат активный? (можно в него писать сообщения)
 *
 * Обязательными являются только поля user, text
 */
export interface ISupportChatCreateUpdateDto {
	user: string;
	text: string;
	isActive?: boolean;
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ДЛЯ_СОЗДАНИЯ_ЧАТА
 * Определяет информацию, на основании которой создается/изменяется объект ЧАТ:
 *   user:       IDType   - автор чата (обязательный параметр)
 *   text:       string   - сообщение в чат (обязательный параметр)
 *   createdAt:  Date     - дата создания чата (обязательный параметр)
 *   isActive:	 boolean  - чат активный? (можно в него писать сообщения)
 *
 * Обязательными являются только поля user, text
 * Для обновления обязательных полей нет.
 */
export interface ISupportChatDto {
	user?: IDType;
	text?: string;
	createdAt?: Date;
	isActive?: boolean;
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ДЛЯ_ДОБАВЛЕНИЯ_СООБЩЕНИЯ_В_ЧАТ_ИЗ_ФОРМЫ
 * Определяет информацию, на основании которой добавляется сообщение
 * в существующий чат:
 * (формируется дополняя форму создания/обновления)
 *   author:        IDType   - автор сообщения (обязательный параметр)
 *   supportChat:   IDType   - ID чата (обращения) (обязательный параметр)
 *   text:          string   - текст сообщения (обязательный параметр)
 *
 * Обязательными являются только поля supportChat, text
 */
export interface ISendChatMessageDto {
	author?: string;
	supportChat?: string;
	text: string;
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ДЛЯ_ДОБАВЛЕНИЯ_СООБЩЕНИЯ_В_ЧАТ
 * Определяет информацию, на основании которой добавляется сообщение
 * в существующий чат:
 * (формируется дополняя форму создания/обновления)
 *   author:        IDType   - автор сообщения (обязательный параметр)
 *   supportChat:   IDType   - ID чата (обращения) (обязательный параметр)
 *   text:          string   - текст сообщения (обязательный параметр)
 *   sentAt:    	Date      - дата отправки сообщения (обязательный параметр)
 *   readAt:		Date      - дата прочтения сообщения (для обновления)
 *
 * Обязательными являются только поля author, supportChat, text
 * Для обновления обязательных полей нет.
 */
export interface IChatMessageDto {
	author?: IChatMessage['author'];
	chat?: ISupportChat['_id'];
	text?: string;
	sentAt?: Date;
	readAt?: Date;
}

/** ИНТЕРФЕЙС - ПОМЕТКА_СООБЩЕНИЯЯ_КАК_ПРОЧИТАННОЕ
 * Помечает сообщения чата как прочитанные (до указанного времени)
 *   user:            IDType   - ID пользователя (обязатпельное поле)
 *   supportChat:     string(универсально)   - ID чата (обращения) (обязательный параметр)
 *   createdBefore:   Date     - время, ранее которого сообщения помечаются
 *  							 как прочитанные (обязательный параметр)
 *
 * Обязательными являются только поля user, supportChat, createdBefore
 */
export interface IMarkChatMessageAsRead {
	author: IChatMessage['author'];
	supportChat: string;
	createdBefore: Date;
}

/** ИНТЕРФЕЙС - ПОМЕТКА_СООБЩЕНИЯЯ_КАК_ПРОЧИТАННОЕ_ФОРМА
 * Параметры формы для вызова метода прочтения сообщений
 *   createdBefore:   Date     - время, ранее которого сообщения помечаются
 *  							 как прочитанные (обязательный параметр)
 *
 * Обязательными является только поле  createdBefore
 */
export interface IMarkChatMessageAsReadDto {
	createdBefore: Date;
}

/** ИНТЕРФЕЙС - ПАРАМЕТРЫ_ПОИСКА_ЧАТОВ
 * Оуществляет поиск чатов
 *   user:       string    - ID пользователя, чьи чаты (обязательный параметр)
 *   isActive:   boolean   - поиск всех, или только открытых/закрытых
 *   limit:         number   - количество найденных объектов
 *   offset:        number   - смещение выдачи относительно первого найденного объекта
 *
 */
export interface ISearchChatParams {
	user?: string;
	isActive?: ISupportChat['isActive'];
	limit?: number;
	offset?: number;
}

import { IDType } from 'src/common/interfaces/types';

// Метка для объекта включения (инъекции зависимости)
export const HOTELROOMS_STORAGE = 'HOTELROOMS_STORAGE';

/** ИНТЕРФЕЙС - НОМЕР_ГОСТИНИЦЫ
 * Определяет информацию для каждого объекта гостиница:
 *   _id:           IDType   - ID  (обязательный параметр)
 *   hotel:			IDType	 = ID гостиницы, в которой этот номер (обязательный параметр)
 *   title:         string   - название номера (single, double. lux, ...) (обязательный параметр)
 *   description:   string   - описание
 *   services:		string[] - состав номера, доп.услуг (массив строк)
 *   images:		string[] - фото номера (массив url-ов)
 *   createdAt:    	Date     - дата создания записи (обязательный параметр)
 *   updatedAt:		Date     - дата изменения параметров записи
 *   isEnabled:		boolean  - номер доступен для брони
 *
 * Обязательным является только поля ID, hotel, title, createdAt
 */
export interface IHotelRoom {
	_id: IDType;
	hotel: IDType;
	title: string;
	description?: string;
	services?: string[];
	images?: string[];
	createdAt: Date;
	updatedAt?: Date;
	isEnabled: boolean;
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ИЗ_ФОРМЫ_ДЛЯ_СОЗДАНИЯ_ОБНОВЛЕНИЯ_НОМЕРА_ГОСТИНИЦЫ
 * Определяет информацию, на основании которой создается/изменяется объект НОМЕР_ГОСТИНИЦЫ:
 * (берется из формы создания/изменения)
 *   hotel:			string(универсально) = ID гостиницы, в которой этот номер (обязательный параметр)
 *   title:         string   - название номера (single, double. lux, ...) (обязательный параметр)
 *   description:   string   - описание
 *   services:		string[] - состав номера, доп.услуг (массив строк)
 *   images:		string[] - фото номера (массив url-ов)
 *   isEnabled:		boolean  - номер доступен для брони
 *
 * Обязательным является только поля hotel, title
 */
export interface IHotelRoomCreateUpdateDto {
	hotel: string;
	title: IHotelRoom['title'];
	description?: IHotelRoom['description'];
	services?: IHotelRoom['services'][];
	images?: IHotelRoom['images'][];
	isEnabled?: IHotelRoom['isEnabled'];
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ДЛЯ_СОЗДАНИЯ_ОБНОВЛЕНИЯ_НОМЕРА_ГОСТИНИЦЫ
 * Определяет информацию, на основании которой создается объект ГОСТИНИЦА:
 * (формируется дополняя форму создания/обновления)
 *   hotel:			string(универсально) = ID гостиницы, в которой этот номер (обязательный параметр)
 *   title:         string   - название номера (single, double. lux, ...) (обязательный параметр)
 *   description:   string   - описание
 *   services:		string[] - состав номера, доп.услуг (массив строк)
 *   images:		string[] - фото номера (массив url-ов)
 *   createdAt:    	Date     - дата создания записи (обязательный параметр)
 *   updatedAt:		Date     - дата изменения параметров записи
 *   isEnabled:		boolean  - номер доступен для брони
 *
 * createdAt, updatedAt - заполняются автоматически по текущей дате в зависимости от операции
 * isEnabled по умолчанию TRUE, если не заполнена (только при создании).
 *
 * Обязательным является только поля hotel, title
 */
export interface IHotelRoomDto {
	hotel: string;
	title: IHotelRoom['title'];
	description?: IHotelRoom['description'];
	services?: IHotelRoom['services'][];
	images?: IHotelRoom['images'][];
	createdAt?: IHotelRoom['createdAt'];
	updatedAt?: IHotelRoom['updatedAt'];
	isEnabled?: IHotelRoom['isEnabled'];
}

/** ИНТЕРФЕЙС - ПАРАМЕТРЫ_ПОИСКА
 * Определяет параметры поиска объектов в хранилище
 *   title:         string   - название номера (поиск по вхождению)
 *   hotel:			IDType	 = ID гостиницы, в которой ищатся номера
 *   services:		string[] - состав номера, доп.услуг (поиск с логическим И)
 *   isEnabled:		boolean  - номер доступен для брони
 *   limit:         number   - количество найденных объектов
 *   offset:        number   - смещение выдачи относительно первого найденного объекта
 *
 * Обязательным является только поля title
 */
export interface SearchHotelRoomParams {
	title?: IHotelRoom['title'];
	hotel?: IHotelRoom['hotel'];
	services?: IHotelRoom['services'];
	isEnabled?: IHotelRoom['isEnabled'];
	limit?: number;
	offset?: number;
}

/** ИНТЕРФЕЙС - НОМЕРА ГОСТИНИЦЫ
 * Осуществляет поиск всех номеров выбранной гостиницы
 *   hotel:         IDType   - ID гостиницы
 *   limit:         number   - количество найденных объектов
 *   offset:        number   - смещение выдачи относительно первого найденного объекта
 *
 * Обязательным является только поля title
 */
export interface SearchHotelRoomByHotelParams {
	hotel: IHotelRoom['hotel'];
	limit?: number;
	offset?: number;
}

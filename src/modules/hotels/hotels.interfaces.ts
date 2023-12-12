import { IDType } from 'src/common/interfaces/types';

// Метка для объекта включения (инъекции зависимости)
export const HOTELS_STORAGE = 'HOTELS_STORAGE';

/** ИНТЕРФЕЙС - ГОСТИНИЦЫ
 * Определяет информацию для каждого объекта гостиница:
 *   _id:           IDType  - ID  (обязательный параметр)
 *   title:         string  - название гостиницы (обязательный параметр)
 *   description:   string  - описание
 *   createdAt:    	Date    - дата создания записи (обязательный параметр)
 *   updatedAt:		Date    - дата изменения параметров записи
 *
 * Обязательным является только поля ID, title, createdAt
 */
export interface IHotel {
	_id: IDType;
	title: string;
	description?: string;
	createdAt: Date;
	updatedAt?: Date;
}


/** ИНТЕРФЕЙС - ДАННЫЕ_ИЗ_ФОРМЫ_ДЛЯ_ГОСТИНИЦЫ
 * Определяет информацию, на основании которой создается/изменяется объект ГОСТИНИЦА:
 * (берется из формы создания/изменения)
 *   title:         string   - название гостиницы (обязательный параметр)
 *   description:   string   - описание
 *
 * Обязательным является только поля title
 */
export interface IHotelCreateDto {
	title: IHotel['title'];
	description?: IHotel['description'];
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ДЛЯ_ДОБАВЛЕНИЯ_ОБНОВЛЕНИЯ_ГОСТИНИЦЫ
 * Определяет информацию, на основании которой создается объект ГОСТИНИЦА:
 * (формируется дополняя форму создания/обновления)
 *   title:         string   - название гостиницы (обязательный параметр)
 *   description:   string   - описание
 *   createdAt?: 	Date     - дата создания (текущая дата при создании)
 *   updatedAt?: 	Date     - дата изменения (текущая дата при изменении)
 *
 * Обязательным является только поля title
 */
export interface IHotelDto {
	title: IHotel['title'];
	description?: IHotel['description'];
	createdAt?: IHotel['createdAt'];
	updatedAt?: IHotel['updatedAt'];
}

/** ИНТЕРФЕЙС - ПАРАМЕТРЫ_ПОИСКА
 * Определяет параметры поиска объектов в хранилище
 *   limit:         number   - количество найденных объектов
 *   offset:        number   - смещение выдачи относительно первого найденного объекта
 *   title: 		string	 - строка поиска (поиск по полю TITLE по похожести)
 *
 * Обязательным является только поля title
 */
export interface SearchHotelParams {
	title: IHotel['title'];
	limit?: number;
	offset?: number;
}

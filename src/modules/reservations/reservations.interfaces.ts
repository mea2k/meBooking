import { IDType } from 'src/common/interfaces/types';

// Метка для объекта включения (инъекции зависимости)
export const RESERVATIONS_STORAGE = 'RESERVATIONS_STORAGE';

/** ИНТЕРФЕЙС - БРОНЬ
 * Определяет информацию для каждого объекта бронь:
 *   _id:           IDType  - ID  (обязательный параметр)
 *   userId:        IDType  - ID пользователя (обязательный параметр)
 *   hotelId:       IDType  - ID гостиницы (обязательный параметр)
 *   roomId:        IDType  - ID номера в гостинице (обязательный параметр)
 *   dateStart:    	Date    - дата начала брони (обязательный параметр)
 *   dateEnd:    	Date    - дата окончания брони (обязательный параметр)
 *   description:   string  - описание
 * 
 * 	 hoterRoom и hotel - добавляются ТОЛЬКО после добавления/обновления брони
 *
 * Обязательным являются только поля ID, userId, hotelId, roomId, dateStart, dateEnd
 */
export interface IReservation {
	_id: IDType;
	userId: IDType;
	hotelId: IDType;
	roomId: IDType;
	dateStart: Date;
	dateEnd: Date;
	description?: string;
	hotelRoom?: {
		description?: string;
		services: string[];
		images?: string[];
	};
	hotel?: {
		title: string;
		description?: string;
	};
}

/** ИНТЕРФЕЙС - ДАННЫЕ_ИЗ_ФОРМЫ_ДЛЯ_СОЗДАНИЯ_ОБНОВЛЕНИЯ_БРОНИ
 * Определяет информацию, на основании которой создается/изменяется объект ГОСТИНИЦА:
 * (берется из формы создания/изменения)
 *   roomId:        string(универсально)  - ID номера в гостинице (обязательный параметр)
 *   dateStart:    	Date    - дата начала брони (обязательный параметр)
 *   dateEnd:    	Date    - дата окончания брони (обязательный параметр)
 *   description:   string  - описание
 *
 * Обязательным являются только поля roomId, dateStart, dateEnd
 * (остальные поля заполнятся контроллером или сервисом бронирования)
 */
export interface IReservationCreateUpdateDto {
	roomId: string;
	dateStart: IReservation['dateStart'];
	dateEnd: IReservation['dateEnd'];
	description?: IReservation['description'];
}


/** ИНТЕРФЕЙС - ДАННЫЕ_ДЛЯ_СОЗДАНИЯ_ОБНОВЛЕНИЯ_БРОНИ
 * Определяет информацию, на основании которой создается/изменяется объект ГОСТИНИЦА:
 * (берется из формы создания/изменения)
 *   roomId:        string(универсально)  - ID номера в гостинице (обязательный параметр)
 *   dateStart:    	Date    - дата начала брони (обязательный параметр)
 *   dateEnd:    	Date    - дата окончания брони (обязательный параметр)
 *   description:   string  - описание
 *
 * Обязательным являются только поля roomId, dateStart, dateEnd
 * (остальные поля заполнятся контроллером или сервисом бронирования)
 */
export interface IReservationDto {
	userId: IDType;
	hotelId: IDType;
	roomId: IDType;
	dateStart: IReservation['dateStart'];
	dateEnd: IReservation['dateEnd'];
	description?: IReservation['description'];
}


/** ИНТЕРФЕЙС - ПАРАМЕТРЫ_ПОИСКА
 * Определяет параметры поиска объектов в хранилище
 *   userId:        IDType  - ID пользователя 
 *   dateStart:    	Date    - дата начала брони (обязательный параметр)
 *   dateEnd:    	Date    - дата окончания брони (обязательный параметр)
 *   limit:         number   - количество найденных объектов
 *   offset:        number   - смещение выдачи относительно первого найденного объекта
 *
 * Обязательным является только поля title
 */
export interface SearchReservationParams {
	userId?: IReservation['userId'];
	dateStart?: IReservation['dateStart'];
	dateEnd?: IReservation['dateEnd'];
	limit?: number;
	offset?: number;
}

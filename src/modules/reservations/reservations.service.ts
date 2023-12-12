import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { IReservation, IReservationCreateUpdateDto, IReservationDto, RESERVATIONS_STORAGE, SearchReservationParams } from './Reservations.interfaces';
import { ReservationStorageDb } from './storage/reservationStorageDb';
import { ReservationStorageFile } from './storage/reservationStorageFile';
import { HotelsService } from '../hotels/hotels.service';
import { HotelRoomsService } from '../hotel-rooms/hotel-rooms.service';
import { IHotelRoom } from '../hotel-rooms/hotel-rooms.interfaces';
import { IHotel } from '../hotels/hotels.interfaces';
import { IDType } from 'src/common/interfaces/types';

@Injectable()
export class ReservationsService {
	constructor(
		private config: ConfigService,
		private hotelService: HotelsService,
		private hotelRoomService: HotelRoomsService,
		@Inject(RESERVATIONS_STORAGE)
		private readonly _storage: ReservationStorageFile | ReservationStorageDb,
	) {
		//console.log('RESERVATION_SERVICE - constructor');
	}

	/** ПОЛУЧЕНИЕ СПИСКА ВСЕХ БРОНЕЙ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
	 * @returns Promise<список объектов в формате JSON ([{...}, {...}, ...])>
	 */
	getAll() {
		return this._storage.getAll();
	}

	/** ПОЛУЧЕНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОЙ БРОНЕ НОМЕРА
	 * @params {string} id - ID объекта
	 * @returns Promise<информация об объекте в формате JSON {...}>
	 */
	get(id: string) {
		// конвертируем ID к правильному типу
		return this._storage.get(this._storage.convertId(id));
	}

	/** ДОБАВЛЕНИЕ НОВОЙ БРОНИ НОМЕРА
	 * @constructor
	 * @params {JSON} параметры нового объекта (userId, hotelId, roomId, dateStart, dateEnd, description)
	 * @returns Promise<сам добавленный объект в формате JSON ({...})> или NULL
	 */
	async create(data: IReservationCreateUpdateDto, userId: IDType) {
		// проверка, что на данные даты номер не занят
		if (!(await this._checkReservation(data))) return null;

		// пополняем данные для сохранения в хранилище
		const roomInfo: IHotelRoom = await this.hotelRoomService.get(data.roomId);
		const hotelInfo: IHotel = await this.hotelService.getShortInfo(roomInfo.hotel);
		
		const item: IReservationDto = { 
			...data,
			userId: userId,
			roomId: roomInfo._id,
			hotelId: hotelInfo._id,
		};

		const result: IReservation = await this._storage.create(item);
		// если успех - дополняем результат информацией о номере и гостинице
		if (result && result._id) {
			result.hotel = {
				title: hotelInfo.title,
				description: hotelInfo.description,
			};
			result.hotelRoom = {
				services: roomInfo.services,
				description: roomInfo.description,
				images: roomInfo.images,
			};
		}
		return result;
	}

	/** ИЗМЕНЕНИЕ ПАРАМЕТРОВ БРОНИ НОМЕРА
	 * @constructor
	 * @params {string} id - ID объекта
	 * @params {JSON} новые параметры (title, description, services, images, isEnabled, updatedAt)
	 * @returns Promise<измененный объект в формате JSON ({...})> или NULL
	 */
	async update(id: string, item: IReservationCreateUpdateDto) {
		// получаем полную запись и обновляем значение новых полей
		let fullItem = await this._storage.get(this._storage.convertId(id));
		fullItem = {
			...fullItem,
			...item,
		};
		// проверка, что на данные даты номер не занят
		if (
			item.dateStart &&
			item.dateEnd &&
			!(await this._checkReservation(
				{ ...item, roomId: String(fullItem.roomId) },
				id,
			))
		)
			return null;

		// конвертируем ID к правильному типу
		return this._storage.update(this._storage.convertId(id), fullItem);
	}

	/** УДАЛЕНИЕ ВЫБРАННОЙ БРОНИ НОМЕРА
	 * @constructor
	 * @params {string} id   - ID объекта
	 * @returns Promise<bool>
	 */
	delete(id: string) {
		// конвертируем ID к правильному типу
		return this._storage.delete(this._storage.convertId(id));
	}

	///////////////////////////////////////////////////////////////////////////
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	///////////////////////////////////////////////////////////////////////////

	/** ПОИСК БРОНИ
	 * @constructor
	 * @params data    - параметры поиска в формате SearchHotelRoomParams
	 *
	 * @returns Promise<IReservation[]>
	 */
	search(data: SearchReservationParams): Promise<IReservation[]> {
		return this._storage.search(data);
	}

	/** ПОИСК БРОНЕЙ ПОЛЬЗОВАТЕЛЯ
	 * @constructor
	 * @params userId    - ID пользователя
	 *
	 * @returns Promise<IReservation[]>
	 */
	searchByUser(userId: IReservation['userId']): Promise<IReservation[]> {
		return this._storage.searchByUser(userId);
	}

	/** ПОИСК БРОНЕЙ ПО НОМЕРУ
	 * @constructor
	 * @params roomId    - ID номера
	 *
	 * @returns Promise<IReservation[]>
	 */
	searchByRoom(roomId: IReservation['roomId']): Promise<IReservation[]> {
		return this._storage.searchByRoom(roomId);
	}

	/** ПРОВЕРКА КОРРЕКТНОСТИ ПАРАМЕТРОВ БРОНИ
	 * Критерии проверки:
	 *  - дата начала - после сегодня
	 *  - дата конца - после даты начала
	 *  - на указанный период номер свободен
	 * @returns TRUE если бронь возможна или FALSE
	 */
	async _checkReservation(
		data: IReservationCreateUpdateDto,
		ignoreReservationId: string = undefined,
	) {
		const curTime = (new Date()).getTime();
		const resStart = (new Date(data.dateStart)).getTime();
		const resEnd = (new Date(data.dateEnd)).getTime();

		// проверка, что дата в будущем
		if (resStart < curTime) return false;

		// проверка, что дата окончания после даты начала
		if (resStart > resEnd) return false;

		// порверка, что на номере нет брони в указанный период
		const roomReservations = await this._storage.searchByRoom(this._storage.convertId(data.roomId));
		if (roomReservations && roomReservations.length) {
			for (const r of roomReservations) {
				if (ignoreReservationId && r._id == this._storage.convertId(ignoreReservationId))
					continue;
				const curResStart = new Date(r.dateStart).getTime();
				const curResEnd = new Date(r.dateEnd).getTime();
				if (resEnd <= curResStart || resStart >= curResEnd) continue;
				else return false;
			}
		}

		// все в порядке - можно бронировать
		return true;
	}
}

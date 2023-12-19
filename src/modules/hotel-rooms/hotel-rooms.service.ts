import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { HotelRoomStorageFile } from './storage/hotelroomStorageFile';
import { HotelRoomStorageDb } from './storage/hotelroomStorageDb';
// eslint-disable-next-line prettier/prettier
import { HOTELROOMS_STORAGE, IHotelRoom, IHotelRoomCreateUpdateDto, IHotelRoomDto, SearchHotelRoomParams } from './hotel-rooms.interfaces';

@Injectable()
export class HotelRoomsService {
	constructor(
		config: ConfigService,
		@Inject(HOTELROOMS_STORAGE)
		private readonly _storage: HotelRoomStorageFile | HotelRoomStorageDb,
	) {
		//console.log('HOTELROOM_SERVICE - constructor');
	}

	/** ПОЛУЧЕНИЕ СПИСКА ВСЕХ НОМЕРОВ ВСЕХ ГОСТИНИЦ
	 * @returns Promise<список объектов в формате JSON ([{...}, {...}, ...])>
	 */
	getAll() {
		return this._storage.getAll();
	}

	/** ПОЛУЧЕНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОМУ НОМЕРУ
	 * @constructor
	 * @params {string} id - ID объекта
	 * @returns Promise<информация об объекте в формате JSON {...}>
	 */
	get(id: string) {
		// конвертируем ID к правильному типу
		return this._storage.get(this._storage.convertId(id));
	}

	/** ДОБАВЛЕНИЕ НОВОГО НОМЕРА ГОСТИНИЦЫ
	 * @constructor
	 * @params {JSON} параметры нового объекта (hotel, title, description, services, images, createdAt)
	 * @returns Promise<сам добавленный объект в формате JSON ({...})>
	 */
	create(data: IHotelRoomCreateUpdateDto) {
		const item: IHotelRoomDto = { ...data };
		// добавление даты
		item.createdAt = item.createdAt ? item.createdAt : new Date();
		// добавляем доступность номера для брони
		item.isEnabled = 'isEnabled' in item ? item.isEnabled : true;
		return this._storage.create(item);
	}

	/** ИЗМЕНЕНИЕ ПАРАМЕТРОВ НОМЕРА ГОСТИНИЦЫ
	 * @constructor
	 * @params {string} id - ID объекта
	 * @params {JSON} новые параметры (title, description, services, images, isEnabled, updatedAt)
	 * @returns Promise<измененный объект в формате JSON ({...})>
	 */
	update(id: string, data: IHotelRoomCreateUpdateDto) {
		const item: IHotelRoomDto = { ...data };
		// добавление даты
		item.updatedAt = item.updatedAt ? item.updatedAt : new Date();
		// конвертируем ID к правильному типу
		return this._storage.update(this._storage.convertId(id), item);
	}

	/** УДАЛЕНИЕ ВЫБРАННОГО НОМЕРА ГОСТИНИЦЫ
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

	/** ПОИСК НОМЕРА ГОСТИНИЦЫ
	 * @constructor
	 * @params {SearchHotelRoomParams} data - параметры поиска типа SearchHotelRoomParams
	 * 							({title, hotel?, services?, isEnabled?,	limit?, offset?})
	 * @returns Promise<IHotel[]>
	 */
	search(data: SearchHotelRoomParams): Promise<IHotelRoom[]> {
		return this._storage.search(data);
	}

	/** ПОЛУЧЕНИЕ СПИСКА НОМЕРОВ ГОСТИНИЦЫ
	 * @constructor
	 * @params {string} hotelId   - ID гостиницы
	 * @params {number} offset    - смещение выборки
	 * @params {number} limit     - ограничение выборки
	 *
	 * @returns Promise<IHotel[]>
	 */
	searchByHotel(
		hotelId: string,
		offset: number,
		limit: number,
	): Promise<IHotelRoom[]> {
		// поиск только по доступным номерам
		// (isEnabled = true)
		const searchData: SearchHotelRoomParams = {
			hotel: this._storage.convertId(hotelId),
			isEnabled: true,
			offset: offset ? offset : undefined,
			limit: limit ? limit : undefined,
		};
		return this._storage.search(searchData);
	}
}

import { Inject, Injectable } from '@nestjs/common';
import { IDType } from 'src/common/interfaces/types';
import { ConfigService } from '../config/config.service';
import { HotelStorageFile } from './storage/hotelStorageFile';
import { HotelStorageDb } from './storage/hotelStorageDb';
// eslint-disable-next-line prettier/prettier
import { HOTELS_STORAGE, IHotel, IHotelDto, SearchHotelParams } from './hotels.interfaces';

@Injectable()
export class HotelsService {
	constructor(
		config: ConfigService,
		@Inject(HOTELS_STORAGE)
		private readonly _storage: HotelStorageFile | HotelStorageDb,
	) {
		//console.log('HOTEL_SERVICE - constructor');
	}

	/** ПОЛУЧЕНИЕ СПИСКА ВСЕХ ГОСТИНИЦ
	 * @returns Promise<список объектов в формате JSON ([{...}, {...}, ...])>
	 */
	getAll() {
		return this._storage.getAll();
	}

	/** ПОЛУЧЕНИЕ ИНФОРМАЦИИ ПО ВЫБРАННОЙ ГОСТИНИЦЕ
	 * @params {string} id - ID объекта
	 * @returns Promise<информация об объекте в формате JSON {...}>
	 */
	get(id: string) {
		// конвертируем ID к правильному типу
		return this._storage.get(this._storage.convertId(id));
	}

	/** ПОЛУЧЕНИЕ КРАТКОЙ ИНФОРМАЦИИ ПО ВЫБРАННОЙ ГОСТИНИЦЕ
	 *  (функция используется другими модулями (reservation))
	 * @params {IDType} id - ID объекта
	 * @returns Promise<информация об объекте в формате JSON {...}>
	 */
	getShortInfo(id: IDType) {
		return this._storage.get(id);
	}

	/** ДОБАВЛЕНИЕ НОВОЙ ГОСТИНИЦЫ
	 * @constructor
	 * @params {JSON} параметры нового объекта (title, description, createdAt)
	 * @returns Promise<сам добавленный объект в формате JSON ({...})>
	 */
	create(item: IHotelDto) {
		// добавление даты
		item.createdAt = item.createdAt ? item.createdAt : new Date();
		return this._storage.create(item);
	}

	/** ИЗМЕНЕНИЕ ПАРАМЕТРОВ ГОСТИНИЦЫ
	 * @constructor
	 * @params {string} id - ID объекта
	 * @params {JSON} новые параметры (title, description, updatedAt)
	 * @returns Promise<измененный объект в формате JSON ({...})>
	 */
	update(id: string, item: IHotelDto) {
		// добавление даты
		item.updatedAt = item.updatedAt ? item.updatedAt : new Date();
		// конвертируем ID к правильному типу
		return this._storage.update(this._storage.convertId(id), item);
	}

	/** УДАЛЕНИЕ ВЫБРАННОЙ ГОСТИНИЦЫ
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

	/** ПОИСК ГОСТИНИЦЫ ПО НАЗВАНИЮ
	 * @constructor
	 * @params data    - параметры поиска в формате SearchHotelParams
	 *
	 * @returns Promise<IHotel[]>
	 */
	search(data: SearchHotelParams): Promise<IHotel[]> {
		return this._storage.search(data);
	}
}

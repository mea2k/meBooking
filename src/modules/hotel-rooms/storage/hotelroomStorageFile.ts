import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { StorageFile } from '../../../storage/storageFile';
import { IHotelRoom, IHotelRoomDto, SearchHotelRoomParams } from '../hotel-rooms.interfaces';
import { ConfigService } from '../../config/config.service';

@Injectable()
class HotelRoomStorageFile extends StorageFile<IHotelRoom, IHotelRoomDto, '_id'> {
	constructor(config: ConfigService) {
		// Проверка на существование пути и создание его
		if (!fs.existsSync(config.get('DATA_PATH'))) {
			fs.mkdirSync(config.get('DATA_PATH'), { recursive: true });
		}
		super(config.get('DATA_PATH') + config.get('HOTELROOMS_FILE'), '_id');
	}

	//
	// ОБЯЗАТЕлЬНЫЕ МЕТОДЫ АБСТРАКТНОГО КЛАССА
	//
	_getNextId(id: IHotelRoom['_id']) {
		// number
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - number
	convertId(id: string): IHotelRoom['_id'] {
		return id && !isNaN(Number(id)) ? Number(id) : id;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//
	search(params: SearchHotelRoomParams): Promise<IHotelRoom[]> {
		//console.log(params)
		return new Promise<IHotelRoom[]>((resolve) =>
			resolve(this._storage
				.filter((e) => 
					new RegExp(params.title, 'gi').test(e.title) &&
					(params.hotel ? e.hotel == params.hotel : true) &&
					( (params.services?.length && e.services?.length) 
						? params.services.every((s) => e.services.indexOf(s) !== -1) 
						: true) &&
					( (('isEnabled' in params) && (params.isEnabled !== undefined)) ? e.isEnabled === true : true )
				)
				.slice(
					params.offset ? params.offset : 0,
					params.limit
						? params.offset
							? params.offset + params.limit
							: params.limit
						: undefined,
				)
			),
		);
	}
}

// экспорт класса
export { HotelRoomStorageFile };

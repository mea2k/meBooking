import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { StorageFile } from '../../../storage/storageFile';
import { IHotel, IHotelDto, SearchHotelParams } from '../Hotels.interfaces';
import { ConfigService } from '../../config/config.service';

@Injectable()
class HotelStorageFile extends StorageFile<IHotel, IHotelDto, '_id'> {
	constructor(config: ConfigService) {
		// Проверка на существование пути и создание его
		if (!fs.existsSync(config.get('DATA_PATH'))) {
			fs.mkdirSync(config.get('DATA_PATH'), { recursive: true });
		}
		super(config.get('DATA_PATH') + config.get('HOTELS_FILE'), '_id');
	}

	//
	// ОБЯЗАТЕлЬНЫЕ МЕТОДЫ АБСТРАКТНОГО КЛАССА - РОДИТЕЛЯ
	//
	_getNextId(id: IHotel['_id']) {
		// number
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - number
	convertId(id: string): IHotel['_id'] {
		return id && !isNaN(Number(id)) ? Number(id) : id;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//
	search(params: SearchHotelParams): Promise<IHotel[]> {
		return new Promise<IHotel[]>((resolve) =>
			resolve(
				this._storage
					.filter((e) => new RegExp(params.title, 'gi').test(e.title))
					.slice(
						params.offset ? params.offset : 0,
						params.limit
							? params.offset
								? params.offset + params.limit
								: params.limit
							: undefined,
					),
			),
		);
	}
}

// экспорт класса
export { HotelStorageFile };

import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { StorageFile } from '../../../storage/storageFile';
// eslint-disable-next-line prettier/prettier
import { IReservation, IReservationDto, SearchReservationParams } from '../reservations.interfaces';
import { ConfigService } from '../../config/config.service';

@Injectable()
class ReservationStorageFile extends StorageFile<
	IReservation,
	IReservationDto,
	'_id'
> {
	constructor(config: ConfigService) {
		// Проверка на существование пути и создание его
		if (!fs.existsSync(config.get('DATA_PATH'))) {
			fs.mkdirSync(config.get('DATA_PATH'), { recursive: true });
		}
		super(config.get('DATA_PATH') + config.get('RESERVATIONS_FILE'), '_id');
	}

	//
	// ОБЯЗАТЕлЬНЫЕ МЕТОДЫ АБСТРАКТНОГО КЛАССА - РОДИТЕЛЯ
	//
	_getNextId(id: IReservation['_id']) {
		// number
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - number
	convertId(id: string): IReservation['_id'] {
		return id && !isNaN(Number(id)) ? Number(id) : id;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//
	search(data: SearchReservationParams): Promise<IReservation[]> {
		return new Promise<IReservation[]>((resolve) =>
			resolve(
				this._storage
					.filter(
						(e) =>
							e.userId ==
								('userId' in data ? data.userId : e.userId) &&
							new Date(e.dateStart).getTime() >=
								(data.dateStart
									? new Date(data.dateStart).getTime()
									: 0) &&
							new Date(e.dateEnd).getTime() <=
								(data.dateEnd
									? new Date(data.dateEnd).getTime()
									: new Date(8640000000000000).getTime()), //MaxDate
					)
					.slice(
						data.offset ? data.offset : 0,
						data.limit ? data.limit : undefined,
					),
			),
		);
	}

	searchByUser(userId: IReservation['userId']): Promise<IReservation[]> {
		return this.search({ userId: userId });
	}

	searchByRoom(roomId: IReservation['roomId']): Promise<IReservation[]> {
		return new Promise<IReservation[]>((resolve) =>
			resolve(this._storage.filter((e) => e.roomId == roomId)),
		);
	}
}

// экспорт класса
export { ReservationStorageFile };

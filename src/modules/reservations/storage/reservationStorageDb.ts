import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { StorageDb } from '../../../storage/storageDb';
import { Reservation, ReservationDocument } from './ReservationSchema';
import { IReservation, IReservationDto, SearchReservationParams } from '../Reservations.interfaces';

@Injectable()
class ReservationStorageDb extends StorageDb<ReservationDocument, IReservationDto, '_id'> {
	constructor(
		@InjectModel(Reservation.name) private ReservationModel: Model<ReservationDocument>,
		@InjectConnection() private connection: Connection,
	) {
		super(ReservationModel, '_id');
	}

	//
	// ОБЯЗАТЕлЬНЫЕ МЕТОДЫ АБСТРАКТНОГО КЛАССА - РОДИТЕЛЯ
	//
	_getNextId(id: IReservation['_id']): IReservation['_id'] {
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - string
	convertId(id: string): IReservation['_id'] {
		return id;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//
	search(params: SearchReservationParams): Promise<ReservationDocument[]> {
		// формируем фильтр поиска исходя из заполненных полей params
		const filter = [{}];
		'userId' in params && params.userId &&
			filter.push({ userId: params.userId });
		'dateStart' in params && params.dateStart &&
			filter.push({ dateStart: { $gte: params.dateStart } });
		'dateEnd' in params && params.dateEnd &&
			filter.push({ dateEnd: { $lte: params.dateEnd } });

		return this._model
			.find({ $and: filter }, { __v: 0 })
			.skip(params.offset ? params.offset : 0)
			.limit(params.limit ? params.limit : 0);
	}

	searchByUser(userId: IReservation['userId']): Promise<ReservationDocument[]> {
		return this.search({ userId: userId });
	}

	searchByRoom(roomId: IReservation['roomId']): Promise<ReservationDocument[]> {
		return this._model.find({
			roomId: roomId,
		});
	}
}

// экспорт класса
export { ReservationStorageDb };

import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { StorageDb } from '../../../storage/storageDb';
import { HotelRoom, HotelRoomDocument } from './hotelroomSchema';
import { IHotelRoom, IHotelRoomDto, SearchHotelRoomParams } from '../hotel-rooms.interfaces';

@Injectable()
class HotelRoomStorageDb extends StorageDb<HotelRoomDocument, IHotelRoomDto, '_id'> {
	constructor(
		@InjectModel(HotelRoom.name) private HotelRoomModel: Model<HotelRoomDocument>,
		@InjectConnection() private connection: Connection,
	) {
		super(HotelRoomModel, '_id');
	}

	//
	// ОБЯЗАТЕлЬНЫЕ МЕТОДЫ АБСТРАКТНОГО КЛАССА - РОДИТЕЛЯ
	//
	_getNextId(id: IHotelRoom['_id']): IHotelRoom['_id'] {
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - string
	convertId(id: string): IHotelRoom['_id'] {
		return id;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//
	search(data: SearchHotelRoomParams): Promise<HotelRoomDocument[]> {
		const servicesSearchArray = data.services ? data.services : [];
		const isEnabledSearchArray =
			'isEnabled' in data ? [data.isEnabled] : [true, false];
		return this._model
			.find({
				title: { $regex: data.title, $options: 'i' },
				services: { $all: servicesSearchArray },
				isEnabled: { $in: isEnabledSearchArray },
			})
			.skip(data.offset ? data.offset : 0)
			.limit(data.limit ? data.limit : 0);
	}
}

// экспорт класса
export { HotelRoomStorageDb };

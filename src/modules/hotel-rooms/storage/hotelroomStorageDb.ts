import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { StorageDb } from '../../../storage/storageDb';
import { HotelRoom, HotelRoomDocument } from './hotelroomSchema';
import { IHotelRoom, IHotelRoomDto, SearchHotelRoomParams } from '../hotel-rooms.interfaces';
import { toBool } from 'src/common/functions/type_converters';

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
	search(params: SearchHotelRoomParams): Promise<HotelRoomDocument[]> {
		const servicesSearchArray = params.services ? params.services : [];

		// формируем фильтр поиска исходя из заполненных полей params
		const filter = [{}];
		'title' in params && params.title &&
			filter.push({ title: new RegExp(params.title, 'gi') });
		'services' in params && servicesSearchArray.length &&
			filter.push({ services: { $all: servicesSearchArray } });
		'isEnabled' in params &&
			filter.push({ isEnabled: params.isEnabled });

			console.log(params);
		return this._model
			.find({ $and: filter }, { __v: 0 })
			.skip(params.offset ? params.offset : 0)
			.limit(params.limit ? params.limit : 0);
	}
}

// экспорт класса
export { HotelRoomStorageDb };

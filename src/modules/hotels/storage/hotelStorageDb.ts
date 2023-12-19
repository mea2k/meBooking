import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { StorageDb } from '../../../storage/storageDb';
import { Hotel, HotelDocument } from './hotelSchema';
import { IHotel, IHotelDto, SearchHotelParams } from '../hotels.interfaces';

@Injectable()
class HotelStorageDb extends StorageDb<HotelDocument, IHotelDto, '_id'> {
	constructor(
		@InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
		@InjectConnection() private connection: Connection,
	) {
		super(HotelModel, '_id');
	}

	//
	// ОБЯЗАТЕлЬНЫЕ МЕТОДЫ АБСТРАКТНОГО КЛАССА - РОДИТЕЛЯ
	//
	_getNextId(id: IHotel['_id']): IHotel['_id'] {
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - string
	convertId(id: string): IHotel['_id'] {
		return id;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//
	search(data: SearchHotelParams): Promise<HotelDocument[]> {
		return this._model
			.find({ title: { $regex: data.title, $options: 'i' } }, { __v: 0 })
			.skip(data.offset ? data.offset : 0)
			.limit(data.limit ? data.limit : 0)
			.lean();
	}
}

// экспорт класса
export { HotelStorageDb };

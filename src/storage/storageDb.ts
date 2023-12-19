import 'reflect-metadata';
import { Document, Model, SortOrder } from 'mongoose';
import { Storage } from './storage';

// АБСТРАКТНЫЙ ШАБЛОННЫЙ КЛАСС ДЛЯ ХРАНЕНИЯ ОБЪЕКТОВ В БД MONGO
// Реализует интерфейс ItemStorage
// ШАБЛОННЫЕ ТИПЫ:
//		ItemType - тип хранимого объекта
//		ItemTypeDto - тип объекта после заполнения и проверки входных данных формы
//					  (часть полей из ItemType может не быть)
//					  (используется для CREATE и UPDATE)
//		KeyName - тип ключевого поля (которое является идентифицирующим для объекта)
//					  (один из аттрибутов ItemType)
abstract class StorageDb<
	ItemType,
	ItemTypeDto,
	KeyName extends keyof ItemType,
> extends Storage<ItemType, ItemTypeDto, KeyName> {
	// модель данных Mongoose
	protected _model: Model<ItemType>;

	// Конструктор - параметры:
	// 		model - модель данных Mongoose
	//		key - имя ключевого поля (его тип должен быть KeyName)
	//		debug - флаг вывода отладочной информации (true)
	constructor(model: Model<ItemType>, key: KeyName, debug = true) {
		super(key, debug);
		this._model = model;
	}

	//
	// РЕАЛИЗАЦИЯ МЕТОДОВ ИНТЕРФЕЙСА ITEMSTORAGE
	//
	getAll(
		offset: number = undefined,
		limit: number = undefined,
	): Promise<ItemType[]> {
		return this._model
			.find({}, { __v: 0 }, { skip: offset, limit: limit })
			.lean();
	}

	get(id: ItemType[KeyName]): Promise<ItemType | null> {
		return this._model.findById(id, { __v: 0 }).lean();
	}

	async create(
		item: ItemType | ItemTypeDto,
	): Promise<ItemType & Document & any> {
		const maxId: Array<ItemType> = await this._model
			.find({}, { [this._keyName]: 1 })
			.sort({ [this._keyName]: <SortOrder>-1 })
			.limit(1);
		// новый ID
		const nextId = this._getNextId(
			maxId.length ? <ItemType[KeyName]>maxId[0][this._keyName] : null,
		);

		if (this._debug) {
			console.log('CREATE -', item);
		}

		const newItem = new this._model({ ...item, [this._keyName]: nextId });
		return newItem.save();
	}

	// TODO: разобраться с ANY - Mongoose не принимает без any
	async update(
		id: ItemType[KeyName],
		item: ItemType | ItemTypeDto,
	): Promise<ItemType | null> {
		return this._model
			.findByIdAndUpdate(id, { $set: <any>{ ...item } }, { new: true })
			.exec();
	}

	async delete(id: ItemType[KeyName]): Promise<boolean> {
		const res = await this._model.findByIdAndDelete(id).exec();
		if (res) return true;
		return false;
	}
}

// экспорт класса
export { StorageDb };

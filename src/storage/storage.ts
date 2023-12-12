import 'reflect-metadata';
import { ItemStorage } from 'src/common/interfaces/itemStorage';

// АБСТРАКТНЫЙ ШАБЛОННЫЙ КЛАСС ДЛЯ ХРАНЕНИЯ ОБЪЕКТОВ 
// Реализует интерфейс ItemStorage
// ШАБЛОННЫЕ ТИПЫ:
//		ItemType - тип хранимого объекта
//		ItemTypeDto - тип объекта после заполнения и проверки входных данных формы
//					  (часть полей из ItemType может не быть)
//					  (используется для CREATE и UPDATE)
//		KeyName - тип ключевого поля (которое является идентифицирующим для объекта)
//					  (один из аттрибутов ItemType)
abstract class Storage<ItemType, ItemTypeDto, KeyName extends keyof ItemType>
	implements ItemStorage<ItemType, ItemTypeDto, ItemType[KeyName]>
{
	// имя ключевого поля
	protected _keyName: KeyName;
	// флаг вывода отладочной информации
	protected _debug: boolean;

	// получение следующего свободного идентификатора объекта
	// (используется в CREATE)
	// ТРЕБУЕТСЯ РЕАЛИЗАЦИЯ в наследниках
	protected abstract _getNextId(
		id: ItemType[KeyName] | null,
	): ItemType[KeyName];

	// Преобразование ключевого поля (ID) из String
	// в требуемый тип ItemType[KeyName]
	// (используется везде, где ID передается параметром)
	// ТРЕБУЕТСЯ РЕАЛИЗАЦИЯ в наследниках
	public abstract convertId(id: string | null): ItemType[KeyName];

	// Конструктор - параметры:
	//		key - имя ключевого поля (его тип должен быть KeyName)
	//		debug - флаг вывода отладочной информации (true)
	constructor(key: KeyName, debug = true) {
		this._keyName = key;
		this._debug = debug;
	}

	//
	// РЕАЛИЗАЦИЯ МЕТОДОВ ИНТЕРФЕЙСА ITEMSTORAGE
	//
	public abstract getAll(
		offset?: number,	// default undefined
		limit?: number,		// default undefined
	): Promise<ItemType[]>;

	public abstract get(id: ItemType[KeyName]): Promise<ItemType | null>;

	public abstract create(item: ItemType | ItemTypeDto): Promise<ItemType>;

	public abstract update(id: ItemType[KeyName], item: ItemType | ItemTypeDto): Promise<ItemType | null>;

	public abstract delete(id: ItemType[KeyName]): Promise<boolean>;
}

// экспорт класса
export { Storage };

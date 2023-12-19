import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { StorageFile } from '../../../storage/storageFile';
import { ISupportChat, ISupportChatDto } from '../support.interfaces';

@Injectable()
class SupportChatStorageFile extends StorageFile<
	ISupportChat,
	ISupportChatDto,
	'_id'
> {
	constructor(config: ConfigService) {
		// Проверка на существование пути и создание его
		if (!fs.existsSync(config.get('DATA_PATH'))) {
			fs.mkdirSync(config.get('DATA_PATH'), { recursive: true });
		}
		super(config.get('DATA_PATH') + config.get('SUPPORTCHAT_FILE'), '_id');
	}

	_getNextId(id: ISupportChat['_id']) {
		// number
		if (id && !isNaN(Number(id))) return Number(id) + 1;
		return 1;
	}

	// в базе данных тип ID - number
	convertId(id: string): ISupportChat['_id'] {
		return id && !isNaN(Number(id)) ? Number(id) : id;
	}

	//
	// СПЕЦИФИЧЕСКИЕ МЕТОДЫ
	//
	// поиск чатов пользователя
	// isActive - 	если true, то только активные
	//				если false, то только закрытые
	//				если undefined, то любые
	search(
		userId: ISupportChat['user'],
		isActive: boolean = undefined,
	): Promise<ISupportChat[]> {
		return new Promise<ISupportChat[] | []>((resolve) =>
			resolve(
				this._storage.filter(
					(e) =>
						e.user == userId &&
						e.isActive ===
							(isActive == undefined ? e.isActive : isActive),
				) || [],
			),
		);
	}
}

// экспорт класса
export { SupportChatStorageFile };

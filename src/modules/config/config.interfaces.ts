import { StorageType } from 'src/common/interfaces/types';

export interface IConfig {
	// ТИП ХРАНИЛИЩА {"file", "mongo"}
	STORAGE_TYPE: StorageType; // "file"

	// ПОРТ приложения
	APP_PORT: number; // 3000

	// КОНСТАНТЫ ДЛЯ РАБОТЫ С БД MONGO
	// строка подключения
	MONGO_URL: string; // "mongodb://localhost:27017/",
	// имя БД
	MONGO_DATABASE: string; //  "books",
	// пользователь и пароль для работы с БД
	MONGO_USERNAME: string; //  "user",
	MONGO_PASSWORD: string; //  "user",

	// КОНСТАНТЫ ДЛЯ РАБОТЫ С ФАЙЛАМИ
	DATA_PATH: string; 			//  'data/',
	UPLOAD_PATH: string; 		//  'public/upload'
	USERS_FILE: string; 		//  'users.json',
	HOTELS_FILE: string;		//  'hotels.json',
	HOTELROOMS_FILE: string; 	//	'hotelrooms.json',
	RESERVATIONS_FILE: string;	//  'reservations.json'
	SUPPORTCHAT_FILE: string;	//  'chat.json',
	CHATMESSAGES_FILE: string;	//  'chat_messages.json',

	// КОНСТАНТЫ ДЛЯ ГЕНЕРАЦИИ JWT
	JWT_SECRET: string;
	JWT_EXPIRE: string; // '1h'
}

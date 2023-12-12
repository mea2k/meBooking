import { Module } from '@nestjs/common';
import { HotelRoomsService } from './hotel-rooms.service';
import { HotelRoomsController } from './hotel-rooms.controller';
import { ConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from './storage/hotelroomSchema';
import { HotelRoomStorageDb } from './storage/hotelroomStorageDb';
import { HotelRoomStorageFile } from './storage/hotelroomStorageFile';
import { HOTELROOMS_STORAGE } from './hotel-rooms.interfaces';

@Module({
	imports: [
		// модуль настроек
		ConfigModule,

		// если тип хранилища MONGO
		// подключаем MongooseModule и устанавливаем соединение с базой
		// иначе подключаем StorageFile
		...(process.env.STORAGE_TYPE === 'mongo'
			? [
					MongooseModule.forRoot(
						process.env.MONGO_URL +
							process.env.MONGO_DATABASE +
							'?authSource=admin',
						{
							auth: {
								username: process.env.MONGO_USERNAME,
								password: process.env.MONGO_PASSWORD,
							},
						},
					),
			  ]
			: []),

		// если тип хранилища MONGO
		// подключаем схему данных objSchema с использованием MongooseModule
		...(process.env.STORAGE_TYPE === 'mongo'
			? [
					MongooseModule.forFeature([
						{ name: HotelRoom.name, schema: HotelRoomSchema },
					]),
			  ]
			: []),
	],
	controllers: [HotelRoomsController],
	providers: [
		HotelRoomsService,
		{
			// если тип хранилища MONGO
			// подключаем StorageDb
			// иначе подключаем StorageFile
			useClass:
				process.env.STORAGE_TYPE === 'mongo'
					? HotelRoomStorageDb
					: process.env.STORAGE_TYPE === 'file'
					? HotelRoomStorageFile
					: HotelRoomStorageFile,
			provide: HOTELROOMS_STORAGE,
		},
	],
	exports: [HotelRoomsService],
})
export class HotelRoomsModule {}

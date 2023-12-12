import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { ConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from './storage/hotelSchema';
import { HotelStorageDb } from './storage/hotelStorageDb';
import { HotelStorageFile } from './storage/hotelStorageFile';
import { HOTELS_STORAGE } from './hotels.interfaces';

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
						{ name: Hotel.name, schema: HotelSchema },
					]),
			  ]
			: []),
	],
	controllers: [HotelsController],
	providers: [
		HotelsService,
		{
			// если тип хранилища MONGO
			// подключаем StorageDb
			// иначе подключаем StorageFile
			useClass:
				process.env.STORAGE_TYPE === 'mongo'
					? HotelStorageDb
					: process.env.STORAGE_TYPE === 'file'
					? HotelStorageFile
					: HotelStorageFile,
			provide: HOTELS_STORAGE,
		},
	],
	exports: [HotelsService],
})
export class HotelsModule {}

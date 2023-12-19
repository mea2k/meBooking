import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './storage/ReservationSchema';
import { ReservationStorageDb } from './storage/reservationStorageDb';
import { ReservationStorageFile } from './storage/reservationStorageFile';
import { RESERVATIONS_STORAGE } from './reservations.interfaces';
import { UsersModule } from '../users/users.module';
import { HotelsModule } from '../hotels/hotels.module';
import { HotelRoomsModule } from '../hotel-rooms/hotel-rooms.module';

@Module({
	imports: [
		// модуль настроек
		ConfigModule,
		// для проверки собственников броней
		UsersModule,
		// модуль гостиниц
		HotelsModule,
		// Модуль номеров гостиниц
		HotelRoomsModule,
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
						{ name: Reservation.name, schema: ReservationSchema },
					]),
			  ]
			: []),
	],
	controllers: [ReservationsController],
	providers: [
		ReservationsService,
		{
			// если тип хранилища MONGO
			// подключаем StorageDb
			// иначе подключаем StorageFile
			useClass:
				process.env.STORAGE_TYPE === 'mongo'
					? ReservationStorageDb
					: process.env.STORAGE_TYPE === 'file'
					? ReservationStorageFile
					: ReservationStorageFile,
			provide: RESERVATIONS_STORAGE,
		},
	],
})
export class ReservationsModule {}

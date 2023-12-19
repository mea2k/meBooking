import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '../config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import UserSchema, { User } from './storage/userSchema';
import { UserStorageDb } from './storage/userStorageDb';
import { UserStorageFile } from './storage/userStorageFile';
import { USERS_STORAGE } from './users.interfaces';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [
		// модуль настроек
		ConfigModule,

		// если тип хранилища MONGO
		// подключаем MongooseModule и устанавливаем соединение с базой
		// иначе подключаем BookStorageFile
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
						// MongooseModule.forRootAsync({
						// 	imports: [ConfigModule],
						// 	useFactory: (configService: ConfigService) => ({
						// 		uri:
						// 			configService.get('MONGO_URL') +
						// 			configService.get('MONGO_DATABASE') +
						// 			'?authSource=admin',
						// 		auth: {
						// 			username: configService.get('MONGO_USERNAME'),
						// 			password: configService.get('MONGO_PASSWORD'),
						// 		},
						// 	}),
						// 	inject: [ConfigService],
						// }),
					),
			  ]
			: []),

		// если тип хранилища MONGO
		// подключаем схему данных UserSchema с использованием MongooseModule
		...(process.env.STORAGE_TYPE === 'mongo'
			? [
					MongooseModule.forFeature([
						{ name: User.name, schema: UserSchema },
					]),
			  ]
			: []),
	],
	controllers: [UsersController],
	providers: [
		UsersService,
		AuthService,
		JwtService,
		{
			// если тип хранилища MONGO
			// подключаем UserStorageDb
			// иначе подключаем UserStorageFile
			useClass:
				process.env.STORAGE_TYPE === 'mongo'
					? UserStorageDb
					: process.env.STORAGE_TYPE === 'file'
					? UserStorageFile
					: UserStorageFile,
			provide: USERS_STORAGE,
		},
	],
	exports: [UsersService],
})
export class UsersModule {}

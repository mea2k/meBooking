import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { ConfigModule } from '../config/config.module';
import { SupportChat, SupportChatSchema } from './storage/supportChatSchema';
import { ChatMessages, ChatMessageSchema } from './storage/chatMessageSchema';
import { SupportChatStorageDb } from './storage/supportChatStorageDb';
import { SupportChatStorageFile } from './storage/supportChatStorageFile';
import { ChatMessageStorageDb } from './storage/chatMessageStorageDb';
import { ChatMessageStorageFile } from './storage/chatMessageStorageFile';
// eslint-disable-next-line prettier/prettier
import { CHATMESSAGES_STORAGE, SUPPORTCHAT_STORAGE } from './support.interfaces';

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
						{ name: SupportChat.name, schema: SupportChatSchema },
					]),
					MongooseModule.forFeature([
						{ name: ChatMessages.name, schema: ChatMessageSchema },
					]),
			  ]
			: []),
	],
	controllers: [SupportController],
	providers: [
		SupportService,
		{
			// если тип хранилища MONGO
			// подключаем StorageDb
			// иначе подключаем StorageFile
			useClass:
				process.env.STORAGE_TYPE === 'mongo'
					? SupportChatStorageDb
					: process.env.STORAGE_TYPE === 'file'
					? SupportChatStorageFile
					: SupportChatStorageFile,
			provide: SUPPORTCHAT_STORAGE,
		},
		{
			// если тип хранилища MONGO
			// подключаем StorageDb
			// иначе подключаем StorageFile
			useClass:
				process.env.STORAGE_TYPE === 'mongo'
					? ChatMessageStorageDb
					: process.env.STORAGE_TYPE === 'file'
					? ChatMessageStorageFile
					: ChatMessageStorageFile,
			provide: CHATMESSAGES_STORAGE,
		},
	],
})
export class SupportModule {}

// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Put, Body, Param, Request, ParseIntPipe, Query, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoleType } from 'src/common/interfaces/types';
import { SupportService } from './support.service';
// eslint-disable-next-line prettier/prettier
import { IChatMessage, IMarkChatMessageAsRead, IMarkChatMessageAsReadDto, ISearchChatParams, ISendChatMessageDto, ISupportChat, ISupportChatCreateUpdateDto } from './support.interfaces';
import { SearchSupportChatParamsDto } from './validators/searchSupportChatParamsDtoValidator';

@Controller('api/support')
export class SupportController {
	constructor(private readonly supportService: SupportService) {}

	// СОЗДАНИЕ ЧАТА КЛИЕНТОМ
	// (доступно только клиентам)
	@Roles(UserRoleType.CLIENT)
	@Post('')
	createChat(
		@Body() data: ISupportChatCreateUpdateDto,
		@Request() req,
	): Promise<ISupportChat[]> {
		return this.supportService.create(data, req.user?._id);
	}

	// ИЗМЕНЕНИЕ ПАРАМЕТРОВ ЧАТА (ЗАКРЫТИЕ)
	// (доступно только менеджерам)
	@Roles(UserRoleType.MANAGER)
	@Put(':id')
	updateChat(
		@Param('id') id: string,
		@Body() data: ISupportChatCreateUpdateDto,
	): Promise<ISupportChat | null> {
		// добавляем требуемые данные
		return this.supportService.update(id, data);
	}

	// СПИСОК ВСЕХ ЧАТОВ
	// (доступно только менеджеру)
	@Roles(UserRoleType.MANAGER)
	@Get('')
	getAll(
		@Request() req,
		@Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
		@Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
	): Promise<ISupportChat[]> {
		return this.supportService.getAll(offset, limit);
	}

	// СПИСОК ЧАТОВ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ
	// (доступно только клиенту после авторизации)
	@Roles(UserRoleType.CLIENT)
	@Get('user')
	getChats(
		@Request() req,
		@Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
		@Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
	): Promise<ISupportChat[]> {
		const data: ISearchChatParams = {
			user: req.user._id,
			limit: limit ? limit : undefined,
			offset: offset ? offset : undefined,
		};
		return this.supportService.searchChats(data);
	}

	// СПИСОК ЧАТОВ УКАЗАННОГО ПОЛЬЗОВАТЕЛЯ
	// (доступно только менеджеру)
	@Roles(UserRoleType.MANAGER)
	@Get('user/:id')
	getByUser(
		@Query(new ValidationPipe({ whitelist: true, transform: true }))
		params: SearchSupportChatParamsDto,
		@Param('id') id: string,
	): Promise<ISupportChat[]> {
		// добавляем информацию о польщователе из Query
		params.user = id;
		return this.supportService.searchChats(params);
	}

	// СПИСОК СООБЩЕНИЙ УКАЗАННОГО ЧАТА
	// (доступно только клиенту и менеджеру)
	//  TODO: и собственнику - собственнику пока не сделано
	@Roles(UserRoleType.CLIENT, UserRoleType.MANAGER)
	//@UseGuards(OwnerGuard)
	@Get(':id')
	chatMessages(@Param('id') id: string): Promise<any> {
		return this.supportService.get(id);
	}

	// ЧИСЛО НЕПРОЧИТАННЫХ СООБЩЕНИЙ УКАЗАННОГО ЧАТА
	// (доступно только клиенту и менеджеру)
	//  TODO: и собственнику - собственнику пока не сделано
	@Roles(UserRoleType.CLIENT, UserRoleType.MANAGER)
	//@UseGuards(OwnerGuard)
	@Get(':id/unread')
	unreadChatMessagesCount(
		@Request() req,
		@Param('id') id: string,
	): Promise<any> {
		return this.supportService.getUnreadCount(id, req.user._id);
	}

	// ОТПРАВКА СООБЩЕНИЯ В ЧАТ
	// (доступно только клиенту и менеджеру)
	// TODO: клиенту-собственнику - собственнику пока не сделано
	@Roles(UserRoleType.CLIENT, UserRoleType.MANAGER)
	@Post(':id')
	sendMessage(
		@Param('id') id: string,
		@Body() data: ISendChatMessageDto,
		@Request() req,
	): Promise<IChatMessage | null> {
		if (!data.text) {
			return null;
		}
		if (!data.author) {
			data.author = req.user._id;
		}
		// явно задаем ID чата (из URL)
		data.supportChat = id;
		return this.supportService.createMessage(data);
	}

	// ПОМЕТКА О ПРОЧТЕНИИ СООБЩЕНИЙ УКАЗАННОГО ЧАТА
	// (доступно только клиенту и менеджеру)
	// TODO: клиенту-собственнику - собственнику пока не сделано
	@Roles(UserRoleType.CLIENT, UserRoleType.MANAGER)
	@Post(':id/read')
	readMessage(
		@Param('id') id: string,
		@Body() data: IMarkChatMessageAsReadDto,
		@Request() req,
	): Promise<IChatMessage[] | null> {
		const param: IMarkChatMessageAsRead = {
			author: req.user?._id,
			createdBefore: new Date(data.createdBefore),
			supportChat: id,
		};
		return this.supportService.markMessagesAsRead(param);
	}
}

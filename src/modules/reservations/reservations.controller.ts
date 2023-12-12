// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { IReservation, IReservationCreateUpdateDto, SearchReservationParams } from './Reservations.interfaces';
import { UserRoleType } from 'src/common/interfaces/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReservationDtoValidator } from './validators/reservationDtoValidator';
import { OwnerGuard } from '../users/guards/owner.guard';
import { ReservationOwnerGuard } from './guards/reservationOwner.guard';
import { IUser } from '../users/users.interfaces';

@Controller('api/reservations')
export class ReservationsController {
	constructor(private readonly reservationsService: ReservationsService) {}

	// ПОИСК БРОНЕЙ POST
	// (доступно только менеджерам)
	@Roles(UserRoleType.MANAGER)
	@Post('search')
	searchPost(@Body() data: SearchReservationParams): Promise<IReservation[]> {
		return this.reservationsService.search(data);
	}

	// ПОИСК БРОНЕЙ КОНКРЕТНОГО ПОЛЬЗОВАТЕЛЯ
	// (доступно только менеджеру 
	//  TODO: и собственнику - собственнику пока не сделано (как сделать guards с логикой ИЛИ?))
	@Roles(UserRoleType.MANAGER, UserRoleType.CLIENT)
	//@UseGuards(OwnerGuard)
	@Get('user/:id')
	searchByUser(@Param('id') id: string): Promise<IReservation[]> {
		return this.reservationsService.searchByUser(id);
	}

	// ПОИСК БРОНИ НА КОНКРЕТНЫЙ НОМЕР
	@Get('room/:id')
	searchByRoom(@Param('id') id: string): Promise<IReservation[]> {
		return this.reservationsService.searchByRoom(id);
	}

	// СПИСОК БРОНЕЙ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ
	// (доступно только клиенту после авторизации)
	@Roles(UserRoleType.CLIENT)
	@Get('user')
	getByUser(@Request() req): Promise<IReservation[]> {
		return this.reservationsService.getAll();
	}

	// ИНФОРМАЦИЯ О КОНКРЕТНОЙ БРОНИ
	@Get(':id')
	getOne(@Param('id') id: string): Promise<IReservation | null> {
		return this.reservationsService.get(id);
	}

	// СПИСОК ВСЕХ БРОНЕЙ
	// (доступно только менеджеру)
	@Roles(UserRoleType.MANAGER)
	@Get('')
	getAll(): Promise<IReservation[]> {
		return this.reservationsService.getAll();
	}

	// СОЗДАНИЕ БРОНИ
	// (доступно только клиенту после авторизации)
	@Roles(UserRoleType.CLIENT)
	@Post('')
	create(
		@Body(ReservationDtoValidator) item: IReservationCreateUpdateDto,
		@Request() req,
	): Promise<IReservation | null> {
		return this.reservationsService.create(item, req.user?._id);
	}

	// ИЗМЕНЕНИЕ БРОНИ
	// (доступно только менеджеру пока TODO: дать доступ клиенту-автору брони)
	@Roles(UserRoleType.MANAGER)
	@Put(':id')
	update(
		@Param('id') id: string,
		@Body() item: IReservationCreateUpdateDto,
	): Promise<IReservation | null> {
		return this.reservationsService.update(id, item);
	}

	// ОТМЕНА/УДАЛЕНИЕ БРОНИ
	// (доступно только менеджеру пока TODO: дать доступ клиенту-автору брони)
	@Roles(UserRoleType.CLIENT, UserRoleType.MANAGER)
	//@UseGuards(ReservationOwnerGuard)
	@Delete(':id')
	delete(@Param('id') id: string): Promise<boolean> {
		return this.reservationsService.delete(id);
	}
}

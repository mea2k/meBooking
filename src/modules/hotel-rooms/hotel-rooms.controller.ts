// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, Query } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoleType } from 'src/common/interfaces/types';
import { HotelRoomsService } from './hotel-rooms.service';
import { SearchHotelRoomParamsDto } from './validators/searchHotelRoomParamsValidator';
// eslint-disable-next-line prettier/prettier
import { IHotelRoom, IHotelRoomCreateUpdateDto } from './hotel-rooms.interfaces';
// eslint-disable-next-line prettier/prettier
import { HotelRoomCreateDtoValidator, HotelRoomUpdateDtoValidator } from './validators/hotelRoomDtoValidator';

@Controller('api/hotels')
export class HotelRoomsController {
	constructor(private readonly hotelRoomService: HotelRoomsService) {}

	// ПОЛУЧЕНИЕ ИНФОРМАЦИИ О НОМЕРЕ ID
	@Get(':id/rooms')
	getByHotel(
		@Param('id') hotelId: string,
		@Query('offset') offset?: number,
		@Query('limit') limit?: number,
	): Promise<IHotelRoom[]> {
		return this.hotelRoomService.searchByHotel(hotelId, offset, limit);
	}

	// ПОИСК НОМЕРОВ (SearchHotelRoomParams)
	// POST
	@Post('rooms/search')
	searchPost(
		@Body(new ValidationPipe({ whitelist: true, transform: true }))
		params: SearchHotelRoomParamsDto,
	): Promise<IHotelRoom[]> {
		return this.hotelRoomService.search(params);
	}

	// ПОИСК НОМЕРОВ (SearchHotelRoomParams)
	// GET
	@Get('rooms/search')
	searchGet(
		@Query(new ValidationPipe({ whitelist: true, transform: true }))
		params: SearchHotelRoomParamsDto,
	): Promise<IHotelRoom[]> {
		return this.hotelRoomService.search(params);
	}

	// ПОИСК НОМЕРОВ
	// (только менеджеры)
	@Roles(UserRoleType.MANAGER)
	@Post('rooms')
	create(
		@Body(HotelRoomCreateDtoValidator) item: IHotelRoomCreateUpdateDto,
	): Promise<IHotelRoom | null> {
		return this.hotelRoomService.create(item);
	}

	// ИНФОРМАЦИЯ О ВЫБРАННОМ НОМЕРЕ ID
	@Get('rooms/:id')
	getOne(@Param('id') id: string): Promise<IHotelRoom | null> {
		return this.hotelRoomService.get(id);
	}

	// ОБНОВЛЕНИЕ ИНФОРМАЦИИ О НОМЕРЕ ID
	// (только менеджеры)
	@Roles(UserRoleType.MANAGER)
	@Put('rooms/:id')
	update(
		@Param('id') id: string,
		@Body(HotelRoomUpdateDtoValidator) item: IHotelRoomCreateUpdateDto,
	): Promise<IHotelRoom | null> {
		return this.hotelRoomService.update(id, item);
	}

	// УДАЛЕНИЕ НОМЕРА ID
	// (только менеджеры)
	@Roles(UserRoleType.MANAGER)
	@Delete('rooms/:id')
	delete(@Param('id') id: string): Promise<boolean> {
		return this.hotelRoomService.delete(id);
	}
}

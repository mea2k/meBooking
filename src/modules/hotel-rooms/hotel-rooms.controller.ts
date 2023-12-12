// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, ValidationPipe, Query } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoleType } from 'src/common/interfaces/types';
import { HotelRoomsService } from './hotel-rooms.service';
import { IHotelRoom, IHotelRoomCreateUpdateDto } from './hotel-rooms.interfaces';
import { SearchHotelRoomParamsDto } from './validators/searchHotelRoomParamsValidator';
import { HotelRoomCreateDtoValidator, HotelRoomUpdateDtoValidator } from './validators/hotelRoomDtoValidator';

@Controller('api/hotels')
export class HotelRoomsController {
	constructor(private readonly hotelRoomService: HotelRoomsService) {}

	@Get(':id/rooms')
	getByHotel(
		@Param('id') hotelId: string,
		@Query('offset') offset?: number,
		@Query('limit') limit?: number,
	): Promise<IHotelRoom[]> {
		return this.hotelRoomService.searchByHotel(hotelId, offset, limit);
	}

	@Post('rooms/search')
	searchPost(
		@Body(new ValidationPipe({ whitelist: true, transform: true }))
		params: SearchHotelRoomParamsDto,
	): Promise<IHotelRoom[]> {
		return this.hotelRoomService.search(params);
	}

	@Get('rooms/search')
	searchGet(
		@Query(new ValidationPipe({ whitelist: true, transform: true }))
		params: SearchHotelRoomParamsDto,
	): Promise<IHotelRoom[]> {
		return this.hotelRoomService.search(params);
	}

	@Roles(UserRoleType.MANAGER)
	@Post('rooms')
	create(@Body(HotelRoomCreateDtoValidator) item: IHotelRoomCreateUpdateDto): Promise<IHotelRoom | null> {
		return this.hotelRoomService.create(item);
	}

	@Get('rooms/:id')
	getOne(@Param('id') id: string): Promise<IHotelRoom | null> {
		return this.hotelRoomService.get(id);
	}

	@Roles(UserRoleType.MANAGER)
	@Put('rooms/:id')
	update(
		@Param('id') id: string,
		@Body(HotelRoomUpdateDtoValidator) item: IHotelRoomCreateUpdateDto,
	): Promise<IHotelRoom | null> {
		return this.hotelRoomService.update(id, item);
	}

	@Roles(UserRoleType.MANAGER)
	@Delete('rooms/:id')
	delete(@Param('id') id: string): Promise<boolean> {
		return this.hotelRoomService.delete(id);
	}

}

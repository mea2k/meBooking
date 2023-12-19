// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Put, Delete, Param, Body, Query, ValidationPipe } from '@nestjs/common';
import { UserRoleType } from 'src/common/interfaces/types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { HotelsService } from './hotels.service';
// eslint-disable-next-line prettier/prettier
import { IHotel, IHotelCreateDto, SearchHotelParams } from './hotels.interfaces';
import { SearchHotelParamsDto } from './validators/searchHotelParamsValidator';

@Controller('api/hotels/')
export class HotelsController {
	constructor(private readonly hotelsService: HotelsService) {}

	// ПОИСК ГОСТИНИЦ (SearchHotelParams {title, limit?, offset?})
	// POST
	@Post('search')
	searchPost(
		@Body(new ValidationPipe({ whitelist: true, transform: true }))
		params: SearchHotelParamsDto,
	): Promise<IHotel[]> {
		return this.hotelsService.search(params);
	}

	// ПОИСК ГОСТИНИЦ (SearchHotelParams {title, limit?, offset?})
	// GET
	@Get('search')
	searchGet(
		@Query(new ValidationPipe({ whitelist: true, transform: true }))
		params: SearchHotelParamsDto,
	): Promise<IHotel[]> {
		return this.hotelsService.search(params);
	}

	// ИНФОРМАЦИЯ О ВЫБРАННОЙ ГОСТИНИЦЕ ID (IHotel)
	@Get(':id')
	getOne(@Param('id') id: string): Promise<IHotel | null> {
		return this.hotelsService.get(id);
	}

	// СПИСОК ВСЕХ ГОСТИНИЦ
	@Get('')
	get(): Promise<IHotel[]> {
		const data: SearchHotelParams = {};
		return this.hotelsService.search(data);
	}

	// ДОБАВЛЕНИЕ ГОСТИНИЦЫ (IHotelCreateDto ({title, description? })
	// (только админы)
	@Roles(UserRoleType.ADMIN)
	@Post('register')
	create(@Body() item: IHotelCreateDto): Promise<IHotel | null> {
		return this.hotelsService.create(item);
	}

	// ИЗМЕНЕНИЕ ИНФОРМАЦИИ О ГОСТИНИЦЕ ID (IHotelCreateDto ({title, description? })
	// (только админы)
	@Roles(UserRoleType.ADMIN)
	@Put(':id')
	update(
		@Param('id') id: string,
		@Body() item: IHotelCreateDto,
	): Promise<IHotel | null> {
		return this.hotelsService.update(id, item);
	}

	// УДАЛЕНИЕ ГОСТИНИЦЫ ID
	// (только админы)
	@Roles(UserRoleType.ADMIN)
	@Delete(':id')
	delete(@Param('id') id: string): Promise<boolean> {
		return this.hotelsService.delete(id);
	}
}

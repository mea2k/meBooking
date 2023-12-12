// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query, ValidationPipe } from '@nestjs/common';
import { IHotel, IHotelCreateDto, SearchHotelParams } from './hotels.interfaces';
import { HotelsService } from './hotels.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRoleType } from 'src/common/interfaces/types';
import { SearchHotelParamsDto } from './validators/searchHotelParamsValidator';


@Controller('api/hotels/')
export class HotelsController {
	constructor(private readonly hotelsService: HotelsService) {}

	@Post('search')
	searchPost(
		@Body(new ValidationPipe({ whitelist: true, transform: true })) 
		params: SearchHotelParamsDto): Promise<IHotel[]> {
		return this.hotelsService.search(params);
	}

	@Get('search')
	searchGet(
		@Query(new ValidationPipe({ whitelist: true, transform: true }))
		params: SearchHotelParamsDto,
	): Promise<IHotel[]> {
		return this.hotelsService.search(params);
	}

	@Get(':id')
	getOne(@Param('id') id: string): Promise<IHotel | null> {
		return this.hotelsService.get(id);
	}

	@Get('')
	get(): Promise<IHotel[]> {
		const data: SearchHotelParams = {
			title: '',
		};
		return this.hotelsService.search(data);
	}

	@Roles(UserRoleType.ADMIN)
	@Post('register')
	create(@Body() item: IHotelCreateDto): Promise<IHotel | null> {
		return this.hotelsService.create(item);
	}

	@Roles(UserRoleType.ADMIN)
	@Put(':id')
	update(
		@Param('id') id: string,
		@Body() item: IHotelCreateDto,
	): Promise<IHotel | null> {
		return this.hotelsService.update(id, item);
	}

	@Roles(UserRoleType.ADMIN)
	@Delete(':id')
	delete(@Param('id') id: string): Promise<boolean> {
		return this.hotelsService.delete(id);
	}
}

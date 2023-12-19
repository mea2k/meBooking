// eslint-disable-next-line prettier/prettier
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { toLowerCase, toNumber } from 'src/common/functions/type_converters';
import { SearchHotelRoomParams } from '../hotel-rooms.interfaces';

export class SearchHotelRoomParamsDto implements SearchHotelRoomParams {
	@Transform(({ value }) => toLowerCase(value))
	@IsOptional()
	@IsString()
	public title: string;

	@IsString()
	@IsOptional()
	public hotel: string;

	@IsOptional()
	public services: string[];

	@Transform(({ value }) => toLowerCase(value) == 'true')
	@IsBoolean()
	@IsOptional()
	public isEnabled: boolean;

	@Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
	@IsNumber()
	@IsOptional()
	public limit: number;

	@Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
	@IsNumber()
	@IsOptional()
	public offset: number;
}

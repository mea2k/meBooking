// eslint-disable-next-line prettier/prettier
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { toNumber } from 'src/common/functions/type_converters';
import { SearchHotelRoomByHotelParams } from '../hotel-rooms.interfaces';

export class SearchRoomByHotelParamsDto
	implements SearchHotelRoomByHotelParams
{
	@IsString()
	public hotel: string;

	@Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
	@IsNumber()
	@IsOptional()
	public limit: number;

	@Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
	@IsNumber()
	@IsOptional()
	public offset: number;
}

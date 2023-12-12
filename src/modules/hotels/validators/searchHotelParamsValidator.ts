// eslint-disable-next-line prettier/prettier
import { IsBoolean, IsDate, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { toLowerCase, toNumber } from 'src/common/functions/type_converters';
import { SearchHotelParams } from '../hotels.interfaces';

export class SearchHotelParamsDto implements SearchHotelParams {
	@Transform(({ value }) => toLowerCase(value))
	@IsString()
	@IsOptional()
	public title: string;

	@Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
	@IsNumber()
	@IsOptional()
	public limit: number;

	@Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
	@IsNumber()
	@IsOptional()
	public offset: number;
}

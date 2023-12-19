// eslint-disable-next-line prettier/prettier
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { toLowerCase, toNumber } from 'src/common/functions/type_converters';
import { ISearchChatParams } from '../support.interfaces';

export class SearchSupportChatParamsDto implements ISearchChatParams {
	@IsString()
	@IsOptional()
	public user: string;

	@Transform(({ value }) => toLowerCase(value) == 'true')
	@IsBoolean()
	@IsOptional()
	public isActive: boolean;

	@Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
	@IsNumber()
	@IsOptional()
	public limit: number;

	@Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
	@IsNumber()
	@IsOptional()
	public offset: number;
}

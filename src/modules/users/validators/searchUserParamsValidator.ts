// eslint-disable-next-line prettier/prettier
import { IsBoolean, IsDate, IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { SearchUserParams } from '../users.interfaces';
import { ToNumberOptions, UserRoleType } from 'src/common/interfaces/types';
import { toLowerCase, toNumber } from 'src/common/functions/type_converters';



export class SearchUserParamsDto implements SearchUserParams {
	@Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
	@IsNumber()
	@IsOptional()
	public limit: number;

	@Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
	@IsNumber()
	@IsOptional()
	public offset: number;

	@Transform(({ value }) => toLowerCase(value))
	@IsOptional()
	public email: string;

	@Transform(({ value }) => toLowerCase(value))
	@IsOptional()
	public name: string;

	@IsOptional()
	public contactPhone: string;

	@IsOptional()
	public role: UserRoleType;
}


@Injectable()
export class SearchUserParamsValidator implements PipeTransform {
	transform(data: SearchUserParams | any, metadata: ArgumentMetadata) {

		// копируем все необходимые параметры
		// или заполняем значениями по умолчанию
		const result: SearchUserParams = { ...data };

		if (data.offset && !isNaN(Number(data.offset)))
			result.offset = Number(data.offset);
		if (data.limit && !isNaN(Number(data.limit)))
			result.limit = Number(data.limit);

		return result;
	}
}

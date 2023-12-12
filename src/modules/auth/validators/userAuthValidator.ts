// eslint-disable-next-line prettier/prettier
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { IUSerAuthDto } from '../auth.interfaces';

@Injectable()
export class UserAuthValidator implements PipeTransform {
	transform(data: any, metadata: ArgumentMetadata) {
		// проверка на наличие обязательных полей

		// (login)
		if (!data.login || data.login === undefined || data.login == '') {
			throw new BadRequestException('Login expected!');
		}

		// (password)
		if (
			!data.password ||
			data.password === undefined ||
			data.password == ''
		) {
			throw new BadRequestException('Password expected!');
		}

		// копируем все необходимые параметры
		const result: IUSerAuthDto = {
			login: data.login,
			password: data.password,
		};

		return result;
	}
}

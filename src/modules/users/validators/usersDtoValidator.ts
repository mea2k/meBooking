// eslint-disable-next-line prettier/prettier
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { DEFAULT_USER_ROLE } from 'src/common/interfaces/types';
import { IUserCreateDto, IUserDto } from '../users.interfaces';

// Проверка на шаблон строки:
//  xxx@xxx.xx
const checkEmail = (str: any) => {
	return (
		String(str)
			.toLowerCase()
			.match(/^([a-z0-9_\-.]+)@([a-z0-9_\-]{2,}).([a-z]{2,6})/) == null
	);
};

@Injectable()
export class UsersDtoValidator implements PipeTransform {
	transform(data: IUserCreateDto | any, metadata: ArgumentMetadata) {
		// проверка на наличие обязательных полей
		// (email)
		if (!data.email || data.email === undefined || data.email == '') {
			throw new BadRequestException('Email expected!');
		}
		// формат email *@*.*
		if (checkEmail(data.email)) {
			throw new BadRequestException('Not valid Email!');
		}
		// (login)
		if (!data.login || data.login === undefined || data.login == '') {
			throw new BadRequestException('Login expected!');
		}
		// (password1 && password2)
		if (
			!data.password1 ||
			data.password1 === undefined ||
			data.password1 == '' ||
			!data.password2 ||
			data.password2 === undefined ||
			data.password2 == ''
		) {
			throw new BadRequestException('Both passwords expected!');
		}
		// равеноство password1 == password2
		if (data.password1 !== data.password2) {
			throw new BadRequestException('Passwords are not equal!');
		}

		// копируем все необходимые параметры
		// или заполняем значениями по умолчанию
		const result: IUserDto = {
			login: data.login,
			email: data.email,
			name: data.name || data.login,
			passwordHash: data.password1,
			role: data.role || DEFAULT_USER_ROLE,
		};

		return result;
	}
}

// eslint-disable-next-line prettier/prettier
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { IUSerAuthDto } from '../auth.interfaces';

/** ВАЛИДАТОР - ПРОВЕРКА КОРРЕКТНОСТИ ДАННЫХ АУТЕНТИФИКАЦИИ
 *  			НА ОСНОВЕ ДАННЫХ ИЗ ФОРМЫ
 * @constructor
 * @params {JSON} - параметры нового пользователя ({login, password} или любое)
 * @returns проверенный JSON формата IUSerAuthDto ИЛИ исключение BadRequestException
 */
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

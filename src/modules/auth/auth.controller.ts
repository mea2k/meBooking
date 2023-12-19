// eslint-disable-next-line prettier/prettier
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '../config/config.service';
import { UserAuthValidator } from './validators/userAuthValidator';
import { IUSerAuthDto } from './auth.interfaces';
import { IUser } from '../users/users.interfaces';

@Controller('api/users')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	/** АУТЕНТИФИКАЦИЯ ПОЛЬЗОВАТЕЛЯ НА ОСНОВАНИИ ЗАПРОСА
	 * @constructor
	 * @params {IUSerAuthDto} - параметры нового пользователя ({login, password})
	 * 							(проходят валидацию UserAuthValidator)
	 * @returns Promise<IUser> - информацию о пользователе IUser
	 * 			ИЛИ исключение UnauthorizedException
	 */
	@Post('login')
	async login(
		@Body(UserAuthValidator) item: IUSerAuthDto,
	): Promise<IUser | null> {
		const user = await this.authService.login(item);
		console.log('CONTROLLER:', user)
		if (user) {
			// убираем пароль из выдачи
			delete user.passwordHash;
			return user;
		} else {
			throw new UnauthorizedException();
		}
	}

	/** АУТЕНТИФИКАЦИЯ ПОЛЬЗОВАТЕЛЯ НА ОСНОВАНИИ ЗАПРОСА
	 *  И ПОЛУЧЕНИЕ ТОКЕНА (JWT)
	 * @constructor
	 * @params {IUSerAuthDto} - параметры нового пользователя ({login, password})
	 * 							(проходят валидацию UserAuthValidator)
	 * @returns Promise<string> - JWT в виде строки
	 * 			ИЛИ исключение UnauthorizedException
	 */
	@Post('token')
	async getToken(
		@Body(UserAuthValidator) item: IUSerAuthDto,
	): Promise<string | null> {
		// сперва проходим аутентификацию
		const user = await this.authService.login(item);
		if (user) {
			// убираем пароль из выдачи
			delete user.passwordHash;
			return this.authService.createToken(user);
		} else {
			throw new UnauthorizedException();
		}
	}
}

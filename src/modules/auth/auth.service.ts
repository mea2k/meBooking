import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '../config/config.service';
import { IUSerAuthDto } from './auth.interfaces';
import { IUser } from '../users/users.interfaces';
import { compareHash } from 'src/common/functions/hash';

@Injectable()
export class AuthService {
	constructor(
		// загрузка зависимостей
		private usersService: UsersService,
		private jwtService: JwtService,
		private configService: ConfigService,
	) { }

	/** АУТЕНТИФИКАЦИЯ ПОЛЬЗОВАТЕЛЯ НА ОСНОВАНИИ ЗАПРОСА
	 * @constructor
	 * @params {IUSerAuthDto} - параметры нового пользователя ({login, password})
	 * @returns Promise<IUser> - информацию о пользователе IUser
	 * 			ИЛИ исключение UnauthorizedException
	 */
	async login(userAuth: IUSerAuthDto): Promise<IUser> {
		// поиск пользователя в хранилище
		const user = await this.usersService.getByLogin(userAuth.login);
		// сравнение пароля и хеш-строки из хранилища
		if (
			user &&
			user.passwordHash &&
			(await compareHash(
				user.login,
				userAuth.password,
				user.passwordHash,
			))
		) {
			// убираем пароль из выдачи
			// через полную копию объекта,
			// чтобы не изменить оригинал оператором delete
			const userNoPassword = Object.assign({}, user);
			delete userNoPassword.passwordHash;
			return userNoPassword;
		}
		// если не совпало - формируется исключение
		throw new UnauthorizedException();
	}

	/** ПОЛУЧЕНИЕ ТОКЕНА (JWT) ПОЛЬЗОВАТЕЛЯ
	 * @constructor
	 * @params {IUSer} - объект USER
	 * @returns Promise<string> - JWT в виде строки
	 */
	createToken(user: IUser): string {
		const userNoPassword = Object.assign({}, user);
		// убираем пароль из JWT
		// через полную копию объекта,
		// чтобы не изменить оригинал оператором delete
		delete userNoPassword.passwordHash;
		// берем значения параметров из ConfigModule (ConfigService)
		return this.jwtService.sign(userNoPassword, {
			secret: this.configService.get('JWT_SECRET'),
			expiresIn: this.configService.get('JWT_EXPIRE'),
		});
	}

	/** ПРОВЕРКА НА СУЩЕСТВОАНИЕ ПОЛЬЗОВАТЕЛЯ
	 * @constructor
	 * @params {IUSer} - объект USER
	 * @returns Promise<IUser | null> - Jобъект IUser ИЛИ NULL
	 */
	async validateUser(user: IUser): Promise < any > {
	// поиск пользователя по ID в хранилище
	// используем UsersModule (UsersService)
	const data = await this.usersService.get(user?._id.toString());
	if(data) {
		return user;
	}
		// пользователь не найден
		return null;
}
}

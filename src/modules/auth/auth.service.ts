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

	// аутентификация пользователя
	async login(userAuth: IUSerAuthDto): Promise<IUser> {
		// поиск пользователя в хранилище
		const user = await this.usersService.getByLogin(userAuth.login);
		// сравнение пароля и хеш-строки из хранилища
		if (user && (await compareHash(user.login, userAuth.password, user.passwordHash))) {
			const { passwordHash, ...result } = user;
			// для Mongo надо вернуть ._doc
			return (result as any)._doc ? (result as any)._doc : result;
		}
		// если не совпало - формируется исключение
		throw new UnauthorizedException();
	}

	// получение JWT после аутентификации
	createToken(user: IUser): string {
		// убираем пароль из JWT
		let data = {};
		if (user?.passwordHash) {
			const { passwordHash, ...restData } = user;
			data = restData;
		} else {
			data = user;
		}
		return this.jwtService.sign(data, {
			secret: this.configService.get('JWT_SECRET'),
			expiresIn: this.configService.get('JWT_EXPIRE'),
		});
	}

	// проверка на существование пользователя
	async validateUser(user: IUser): Promise<any> {
		const data = await this.usersService.get(user?._id.toString());
		if (data) {
			return user;
		}
		return null;
	}
}

// eslint-disable-next-line prettier/prettier
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '../../config/config.service';

/** GUARD - ПРОВЕРКА АУТЕНТИФИЦИРОВАННОСТИ ПОЛЬЗОВАТЕЛЯ
 * 						НА ОСНОВЕ JWT ИЗ ЗАГОЛОВКА ЗАПРОСА
 * @constructor
 * @params NONE (информация берется из заголовка Request)
 * @returns TRUE ИЛИ исключение UnauthorizedException
 */
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		// JWT-сервис библиотечный
		private jwtService: JwtService,
		// Мой конфигурационный сервис
		private configService: ConfigService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get('JWT_SECRET'),
			});
			// 💡 We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			request['user'] = payload;
		} catch (e) {
			throw new UnauthorizedException((e as Error).message);
		}

		//console.log('AuthGuard', request.user);

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		//console.log('Header: ', token);
		return type === 'Bearer' ? token : undefined;
	}
}

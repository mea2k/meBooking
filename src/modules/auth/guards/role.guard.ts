// eslint-disable-next-line prettier/prettier
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { UserRoleType } from 'src/common/interfaces/types';
import { AuthGuard } from './auth.guard';
import { ConfigService } from 'src/modules/config/config.service';

/** GUARD - ПРОВЕРКА РОЛИ АУТЕНТИФИЦИРОВАННОГО ПОЛЬЗОВАТЕЛЯ
 * 						НА ОСНОВЕ JWT  ИЗ ЗАГОЛОВКА ЗАПРОСА
 * 						И ОБЪЕКТА IUSER
 * @constructor
 * @params NONE (информация берется из заголовка Request)
 * @returns TRUE, FALSE ИЛИ исключение UnauthorizedException
 */
@Injectable()
export class RolesGuard extends AuthGuard {
	constructor(
		private reflector: Reflector,
		jwtService: JwtService,
		configService: ConfigService,
	) {
		super(jwtService, configService);
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// проверка, что методу роли назначены (в метаданных)
		const requiredRoles = this.reflector.getAllAndOverride<UserRoleType[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		// если ролей у метода нет - всегда успех
		if (!requiredRoles) {
			return true;
		}

		// Вызов AuthGuard для получения Request.user
		const baseGuardResult = await super.canActivate(context);
		if (!baseGuardResult) {
			// если не авторизован - неуспех
			return false;
		}

		//  успешная инъекция пользователя
		const { user } = context.switchToHttp().getRequest();

		//console.log('RolesGuard', requiredRoles, user)

		// проверка, что у пользователя роль из списка метода
		if (user && user.role) {
			return requiredRoles.includes(user.role);
		} else {
			// вместо пользователя что-то еще или у него нет роли
			throw new UnauthorizedException();
		}
	}
}

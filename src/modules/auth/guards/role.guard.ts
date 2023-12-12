import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { UserRoleType } from 'src/common/interfaces/types';
import { AuthGuard } from './auth.guard';
import { ConfigService } from 'src/modules/config/config.service';

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
		// проверка, чтометоду роли назначены (в метаданных)
		const requiredRoles = this.reflector.getAllAndOverride<UserRoleType[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (!requiredRoles) {
			return true;
		}

		// Вызов AuthGuard для получения request.user
		const baseGuardResult = await super.canActivate(context);
		if (!baseGuardResult) {
			// unsuccessful authentication return false
			return false;
		}

		//  успешная инъекция пользователя
		const { user } = context.switchToHttp().getRequest();

		//console.log('RolesGuard', requiredRoles, user)

		//return requiredRoles.some((role) => user.role == role);
		if (user && user.role) {
			return requiredRoles.includes(user.role);
		} else {
			throw new UnauthorizedException();
		}
	}
}

// eslint-disable-next-line prettier/prettier
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class OwnerGuard implements CanActivate {
	constructor(
		// Подключаем сервис пользователей
		private usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const params = request.params;
		const id = params.id; // automatically parsed

		if (!request['user']) {
			throw new UnauthorizedException();
		}
		try {
			const user = request['user'];
			if (!this.usersService.compare(user, id)) {
				throw new HttpException(
					'You are forbidden to access the object',
					HttpStatus.FORBIDDEN,
				);
			}
		} catch (e) {
			//console.log(e);
			throw new HttpException((e as Error).message, HttpStatus.FORBIDDEN);
		}
		return true;
	}
}

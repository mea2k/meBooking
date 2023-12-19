// eslint-disable-next-line prettier/prettier
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import { ReservationsService } from '../reservations.service';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class ReservationOwnerGuard implements CanActivate {
	constructor(
		// Подключаем сервис пользователей
		private reservationService: ReservationsService,
		private userService: UsersService,
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
			const reservation = await this.reservationService.get(id);
			if (!this.userService.compare(user, reservation.userId)) {
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

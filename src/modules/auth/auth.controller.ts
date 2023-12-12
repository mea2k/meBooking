// eslint-disable-next-line prettier/prettier
import { Body, Controller, Get, Post, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
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

	@Post('login')
	async login(
		@Body(UserAuthValidator) item: IUSerAuthDto,
	): Promise<IUser | null> {
		const user = await this.authService.login(item);
		if (user) {
			const { passwordHash, ...data } = user;
			return data;
		} else {
			throw new UnauthorizedException();
		}
	}

	@Post('token')
	async getToken(@Body() item: IUSerAuthDto): Promise<string | null> {
		const user = await this.authService.login(item);
		if (user) {
			const { passwordHash, ...data } = user;
			return this.authService.createToken(data);
		} else {
			throw new UnauthorizedException();
		}
	}
}

// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Body, Delete, Request, Param, Query, ValidationPipe, UseGuards } from '@nestjs/common';
import { IUser, IUserDto } from './users.interfaces';
import { UsersService } from './users.service';
import { UsersDtoValidator } from './validators/usersDtoValidator';
import { IDTypeValidator } from './validators/IDTypeValidator';
import { UserRoleType } from 'src/common/interfaces/types';
import { SearchUserParamsDto, SearchUserParamsValidator } from './validators/searchUserParamsValidator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { OwnerGuard } from './guards/owner.guard';

@Controller('api/users')
export class UsersController {
	constructor(private readonly usersService: UsersService) { }

	// ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
	// (только после аутентификации)
	@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	// РЕГИСТРАЦИЯ ОБЫЧНЫХ ПОЛЬЗОВАТЕЛЕЙ (КЛИЕНТОВ)
	// роль заменяется на UserRoleType.CLIENT
	// (аутентификация не нужна)
	@Post('client/register')
	async createClient(
		@Body(UsersDtoValidator) item: IUserDto,
	): Promise<IUser | null> {
		item.role = UserRoleType.CLIENT;
		return this.usersService.create(item);
	}

	// РЕГИСТРАЦИЯ ЛЮБЫХ ПОЛЬЗОВАТЕЛЕЙ
	// с указанием любой роли в POST-запросе
	// (аутентификация не нужна - чтобы создать первого админа)
	@Post('admin/register')
	async create(
		@Body(UsersDtoValidator) item: IUserDto,
	): Promise<IUser | null> {
		return this.usersService.create(item);
	}

	// ПОИСК ПОЛЬЗОВАТЕЛЕЙ-АДМИНОВ (UserRoleType.ADMIN)
	// с использванием Query-параметров поиска SearchUserParamsDto
	@Roles(UserRoleType.ADMIN)
	@Get('admin')
	getAdminUsers(
		@Query(new ValidationPipe({ whitelist: true, transform: true }))
		params: SearchUserParamsDto,
	) {
		params.role = UserRoleType.ADMIN;
		//console.log(params);
		return this.usersService.search(params);
	}

	// ПОИСК ПОЛЬЗОВАТЕЛЕЙ-МАНАГЕРОВ (UserRoleType.MANAGER)
	// с использванием Query-параметров поиска SearchUserParamsDto
	@Roles(UserRoleType.MANAGER)
	@Get('manager')
	getManagerUsers(
		@Query(new ValidationPipe({ whitelist: true, transform: true }))
		params: SearchUserParamsDto,
	) {
		params.role = UserRoleType.MANAGER;
		console.log(params);
		return this.usersService.search(params);
	}

	// ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ
	@Get(':id')
	async getOne(@Param('id') id: string): Promise<IUser | null> {
		return this.usersService.get(id);
	}

	// УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ
	// (доступно только админам)
	@Delete(':id')
	@UseGuards(AuthGuard, OwnerGuard)
	async delete(@Param('id') id: string): Promise<boolean> {
		return this.usersService.delete(id);
	}
}

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from './modules/config/config.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { HotelRoomsModule } from './modules/hotel-rooms/hotel-rooms.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { SupportModule } from './modules/support/support.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesGuard } from './modules/auth/guards/role.guard';

@Module({
	imports: [
		UsersModule,
		ConfigModule,
		HotelsModule,
		HotelRoomsModule,
		ReservationsModule,
		SupportModule,
		AuthModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_EXPIRE },
		}),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule { }

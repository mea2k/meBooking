import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';

@Global()
@Module({
	imports: [
		NestConfigModule.forRoot({
			envFilePath: process.env.ENV_FILE || '.env',
			isGlobal: true,
		}),
	],
	controllers: [ConfigController],
	providers: [ConfigService],
	exports: [ConfigService],
})
export class ConfigModule {}

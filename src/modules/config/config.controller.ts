import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from './config.service';
import { IConfig } from './config.interfaces';

@Controller('config')
export class ConfigController {
	constructor(private readonly configService: ConfigService) {}

	@Get(':key')
	getOne(@Param('key') key: string): string {
		return this.configService.get(key);
	}

	@Get()
	getAll(): IConfig {
		return this.configService.getAll();
	}
}

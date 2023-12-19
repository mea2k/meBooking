import { Controller, Get, Param } from '@nestjs/common';
import { ConfigService } from './config.service';
import { IConfig } from './config.interfaces';

@Controller('config')
export class ConfigController {
	constructor(private readonly configService: ConfigService) {}

	/** ПОЛУЧЕНИЕ ЗНАЧЕНИЯ ПЕРЕМЕННОЙ KEY
	 * @constructor
	 * @params {string} - KEY - название переменной
	 * @returns string - значение переменной
	 */
	@Get(':key')
	getOne(@Param('key') key: string): string {
		return this.configService.get(key);
	}

	/** ПОЛУЧЕНИЕ ЗНАЧЕНИЯ ВСЕХ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ
	 * @constructor
	 * @params NONE
	 * @returns объект типа IConfig - список переменных в формате key:value
	 */
	@Get()
	getAll(): IConfig {
		return this.configService.getAll();
	}
}

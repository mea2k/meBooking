import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from './common/decorators/mongoError.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// используем глобально перехватчик Mongo-ошибок
	app.useGlobalFilters(new MongoExceptionFilter());

	await app.listen(3000);
}
bootstrap();

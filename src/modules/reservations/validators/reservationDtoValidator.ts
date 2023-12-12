// eslint-disable-next-line prettier/prettier
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { IReservationCreateUpdateDto } from '../Reservations.interfaces';

@Injectable()
export class ReservationDtoValidator implements PipeTransform {
	transform(data: IReservationCreateUpdateDto | any, metadata: ArgumentMetadata) {
		// проверка на наличие обязательных полей
		// (roomId)
		if (!data.roomId || data.roomId === undefined || data.roomId == '') {
			throw new BadRequestException('Hotel room ID expected!');
		}
		// (dateStart)
		if (!data.dateStart || data.dateStart === undefined || String(data.dateStart) == '') {
			throw new BadRequestException('Start date expected!');
		}
		// (dateEnd)
		if (!data.dateEnd || data.dateEnd === undefined || String(data.dateEnd) == '') {
			throw new BadRequestException('End date expected!');
		}


		// проверка на корректность дат
		const dateStart = new Date(data.dateStart);
		const dateEnd = new Date(data.dateEnd);
		if (dateStart.getTime() >= dateEnd.getTime() ) {
			throw new BadRequestException('End date must be after start date!');
		}

		// копируем все необходимые параметры
		// или заполняем значениями по умолчанию
		const result: IReservationCreateUpdateDto = { 
			...data,
			dateStart: dateStart,
			dateEnd: dateEnd,
		};

		return result;
	}
}

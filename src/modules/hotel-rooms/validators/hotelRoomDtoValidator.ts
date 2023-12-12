// eslint-disable-next-line prettier/prettier
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { IHotelRoomCreateUpdateDto } from '../hotel-rooms.interfaces';

@Injectable()
export class HotelRoomCreateDtoValidator implements PipeTransform {
	transform(data: IHotelRoomCreateUpdateDto | any, metadata: ArgumentMetadata) {
		// проверка на наличие обязательных полей
		// (hotel)
		if (!data.hotel || data.hotel === undefined || data.hotel == '') {
			throw new BadRequestException('Hotel ID expected!');
		}
		// (title)
		if (!data.title || data.title === undefined || data.title == '') {
			throw new BadRequestException('Room title expected!');
		}

		// копируем все необходимые параметры
		// или заполняем значениями по умолчанию
		const result: IHotelRoomCreateUpdateDto = { ...data };
		// если есть поле 'isEnabled' и он оне пустое - конвертируем в TRUE
		if (('isEnabled' in data) && data.isEnabled !== undefined)
			result.isEnabled = true;

		return result;
	}
}


@Injectable()
export class HotelRoomUpdateDtoValidator implements PipeTransform {
	transform(data: IHotelRoomCreateUpdateDto | any, metadata: ArgumentMetadata) {
		// копируем все необходимые параметры
		// или заполняем значениями по умолчанию
		const result: IHotelRoomCreateUpdateDto = { ...data };
		// если есть поле 'isEnabled' и он оне пустое - конвертируем в TRUE или FALSE
		if (('isEnabled' in data) && data.isEnabled !== undefined)
			result.isEnabled = String(data.isEnabled).toLowerCase() == 'true';

		return result;
	}
}

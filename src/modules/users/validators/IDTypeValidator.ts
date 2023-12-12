import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class IDTypeValidator implements PipeTransform {
	transform(value: string, metadata: ArgumentMetadata) {
		return !isNaN(Number(value)) ? Number(value) : value;
	}
}

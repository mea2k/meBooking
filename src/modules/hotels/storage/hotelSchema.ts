import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IHotel } from '../hotels.interfaces';

export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel implements IHotel {
	@Prop({
		type: String, // TODO: Сделать универсально!!!
		//unique: true, // не надо, _id и так unique
		required: true,
	})
	_id: IHotel['_id'];

	@Prop({
		type: String,
		unique: true,
		required: true,
	})
	title: IHotel['title'];

	@Prop({
		type: String,
	})
	description: IHotel['description'];

	@Prop({
		type: Date,
		required: true,
		default: Date.now,
	})
	createdAt: IHotel['createdAt'];

	@Prop({
		type: Date,
	})
	updatedAt: IHotel['updatedAt'];
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);

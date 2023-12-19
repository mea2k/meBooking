import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IHotelRoom } from '../hotel-rooms.interfaces';
import { Hotel } from 'src/modules/hotels/storage/hotelSchema';

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom implements IHotelRoom {
	@Prop({
		type: String, // TODO: Сделать универсально (отложим на перспективу)
		//unique: true, // не надо, _id и так unique
		required: true,
	})
	_id: IHotelRoom['_id'];

	@Prop({
		type: String,
		required: true,
		ref: Hotel.name,
	})
	hotel: string;

	@Prop({
		type: String,
		required: true,
	})
	title: IHotelRoom['title'];

	@Prop({
		type: String,
	})
	description: IHotelRoom['description'];

	@Prop({
		type: [String],
	})
	services: IHotelRoom['services'];

	@Prop({
		type: [String],
	})
	images: IHotelRoom['images'];

	@Prop({
		type: Date,
		required: true,
		default: Date.now,
	})
	createdAt: IHotelRoom['createdAt'];

	@Prop({
		type: Date,
	})
	updatedAt: IHotelRoom['updatedAt'];

	@Prop({
		type: Boolean,
		required: true,
		default: true,
	})
	isEnabled: IHotelRoom['isEnabled'];
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);

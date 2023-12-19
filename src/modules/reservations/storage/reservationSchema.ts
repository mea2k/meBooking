import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IReservation } from '../reservations.interfaces';
import { Hotel } from 'src/modules/hotels/storage/hotelSchema';
import { HotelRoom } from 'src/modules/hotel-rooms/storage/hotelroomSchema';
import { User } from 'src/modules/users/storage/userSchema';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation implements IReservation {
	@Prop({
		type: String, // TODO: Сделать универсально (на перспективу - пока не знаю как)
		//unique: true, // не надо, _id и так unique
		required: true,
	})
	_id: IReservation['_id'];

	@Prop({
		type: String, // TODO: Сделать универсально (на перспективу - пока не знаю как)
		required: true,
		ref: User.name,
	})
	userId: IReservation['userId'];

	@Prop({
		type: String, // TODO: Сделать универсально (на перспективу - пока не знаю как)
		required: true,
		ref: Hotel.name,
	})
	hotelId: IReservation['hotelId'];

	@Prop({
		type: String, // TODO: Сделать универсально (на перспективу - пока не знаю как)
		required: true,
		ref: HotelRoom.name,
	})
	roomId: IReservation['roomId'];

	@Prop({
		type: Date,
		required: true,
	})
	dateStart: IReservation['dateStart'];

	@Prop({
		type: Date,
		required: true,
	})
	dateEnd: IReservation['dateEnd'];

	@Prop({
		type: String,
	})
	description: IReservation['description'];
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ISupportChat } from '../support.interfaces';
import { User } from 'src/modules/users/storage/userSchema';

export type SupportChatDocument = SupportChat & Document;

@Schema()
export class SupportChat implements ISupportChat {
	@Prop({
		type: String,
		//unique: true,     // не надо, _id и так unique
		required: true,
	})
	_id: ISupportChat['_id'];

	@Prop({
		type: String,
		required: true,
		ref: User.name,
	})
	user: ISupportChat['user'];

	@Prop({
		type: Date,
		required: true,
		default: Date.now,
	})
	createdAt: ISupportChat['createdAt'];

	@Prop({
		type: Boolean,
		default: true,
	})
	isActive: ISupportChat['isActive'];
}

export const SupportChatSchema = SchemaFactory.createForClass(SupportChat);

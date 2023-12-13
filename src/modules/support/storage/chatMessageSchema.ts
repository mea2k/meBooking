import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IChatMessage } from '../support.interfaces';
import { User } from 'src/modules/users/storage/userSchema';
import { SupportChat } from './supportChatSchema';

export type ChatMessageDocument = ChatMessages & Document;

@Schema()
export class ChatMessages implements IChatMessage {
	@Prop({
		type: String,
		//unique: true,     // не надо, _id и так unique
		required: true,
	})
	_id: IChatMessage['_id'];

	@Prop({
		type: String,
		required: true,
		ref: SupportChat.name,
	})
	chat: IChatMessage['chat'];


	@Prop({
		type: String,
		required: true,
		ref: User.name,
	})
	author: IChatMessage['author'];

	@Prop({
		type: Date,
		required: true,
		default: Date.now
	})
	sentAt: IChatMessage['sentAt'];

	@Prop({
		type: String,
		required: true,
	})
	text: IChatMessage['text'];

	@Prop({
		type: Boolean,
	})
	readAt: IChatMessage['readAt'];
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessages);

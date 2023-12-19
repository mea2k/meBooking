import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser } from '../users.interfaces';
import { compareHash, hashPassword } from 'src/common/functions/hash';

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
	@Prop({
		type: String, // TODO: Сделать универсально!!!
		//unique: true, // не надо, _id и так unique
		required: true,
	})
	_id: IUser['_id'];

	@Prop({
		type: String,
		unique: true,
		required: true,
	})
	email: IUser['email'];

	@Prop({
		type: String,
		unique: true,
		required: true,
	})
	login: IUser['login'];

	@Prop({
		type: String,
		required: true,
	})
	name: IUser['name'];

	@Prop({
		type: String,
		required: true,
	})
	passwordHash: IUser['passwordHash'];

	@Prop({
		type: String,
		required: false,
	})
	contactPhone: IUser['contactPhone'];

	@Prop({
		type: String,
		required: true,
	})
	role: IUser['role'];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
	// here we need to retype 'this' because by default it is
	// of type Document from which the 'IUser' interface is inheriting
	// but the Document does not know about our password property
	const thisObj: IUser = this as IUser;

	if (!this.isModified('passwordHash')) {
		return next();
	}

	try {
		thisObj.passwordHash = await hashPassword(
			thisObj.login,
			thisObj.passwordHash,
		);
		return next();
	} catch (e) {
		return next(e);
	}
});

UserSchema.methods.validatePassword = async function (pass: string) {
	const thisObj: IUser = this as IUser;
	return await compareHash(thisObj.login, pass, thisObj.passwordHash);
};

export default UserSchema;

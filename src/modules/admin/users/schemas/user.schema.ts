import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../utils/enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unqiue: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: 'string', enum: UserRole })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

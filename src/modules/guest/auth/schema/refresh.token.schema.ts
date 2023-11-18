import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/admin/users/schemas/user.schema';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({
  collection: 'refresh_tokens',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class RefreshToken {
  @Prop()
  access_token: string;

  @Prop()
  refresh_token: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: User;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

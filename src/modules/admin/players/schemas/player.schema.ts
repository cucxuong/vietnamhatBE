import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Player {
  @Prop({ requierd: true })
  full_name: string;

  @Prop()
  nick_name: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  year_of_birth: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

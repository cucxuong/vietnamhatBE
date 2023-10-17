import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Team {
  @Prop({ requierd: true })
  name: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

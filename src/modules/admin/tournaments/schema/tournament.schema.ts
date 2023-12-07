import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TournamentDocument = HydratedDocument<Tournament>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Tournament {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  options: string;
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);

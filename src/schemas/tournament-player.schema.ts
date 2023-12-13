import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Tournament } from './tournament.schema';

export type TournamentPlayerDocument = HydratedDocument<TournamentPlayer>;

@Schema({
  collection: 'tournament_players',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class TournamentPlayer {
  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  player_code: string;

  @Prop()
  nickname: string;

  @Prop({ required: true })
  year_of_birth: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  current_country: string;

  @Prop({ required: true })
  selected_options: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: false })
  note: string;

  @Prop({ required: false, default: false })
  send_ticket: boolean;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
  })
  tournament: Tournament;
}

export const TournamentPlayerSchema =
  SchemaFactory.createForClass(TournamentPlayer);

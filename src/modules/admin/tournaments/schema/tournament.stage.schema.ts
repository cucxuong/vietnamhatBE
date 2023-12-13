import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TournamentStageType } from '../utils/enum';
import { Tournament } from './tournament.schema';

export type TournamentStageDocument = HydratedDocument<TournamentStage>;

@Schema({
  collection: 'tournament_stages',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class TournamentStage {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Tournament.name,
  })
  tournament: Tournament;

  @Prop({
    required: true,
    type: 'string',
    enum: TournamentStageType,
  })
  type: TournamentStageType;
}

export const TournamentStageSchema =
  SchemaFactory.createForClass(TournamentStage);

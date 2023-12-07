import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Match } from './match.schema';

export type MatchDirectionDocument = HydratedDocument<MatchDirection>;

@Schema({
  collection: 'match_details',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class MatchDirection {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Match.name,
  })
  win_next_match: Match;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Match.name,
  })
  lose_next_match: Match;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Match.name,
  })
  previous_home_match: Match;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: Match.name,
  })
  previous_away_match: Match;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Match.name,
  })
  match: Match;
}

export const MatchDirectionSchema =
  SchemaFactory.createForClass(MatchDirection);

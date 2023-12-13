import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Team } from '../../team/schema/team.schema';
import { Match } from './match.schema';

export type MatchDetailDocument = MatchDetail & Document;

@Schema({
  collection: 'match_details',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class MatchDetail {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Team.name,
  })
  win_team: Team;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Team.name,
  })
  lose_team: Team;

  @Prop({
    required: true,
  })
  win_score: number;

  @Prop({
    required: true,
  })
  lose_score: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Match.name,
  })
  match: Match;
}

export const MatchDetailSchema = SchemaFactory.createForClass(MatchDetail);

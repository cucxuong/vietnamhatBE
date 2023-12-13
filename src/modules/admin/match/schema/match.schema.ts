import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Team } from '../../team/schema/team.schema';
import { TournamentStage } from '../../tournaments/schema/tournament.stage.schema';
import { MatchStatus } from '../utils/enum';

export type MatchDocument = Match & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Match {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Team.name,
  })
  home_team: Team;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Team.name,
  })
  away_team: Team;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: TournamentStage.name,
  })
  tournament_stage?: TournamentStage;

  @Prop({
    required: true,
  })
  match_date: Date;

  @Prop({
    required: false,
    type: 'string',
    enum: MatchStatus,
    default: MatchStatus.Active,
  })
  status: MatchStatus;
}

export const MatchSchema = SchemaFactory.createForClass(Match);

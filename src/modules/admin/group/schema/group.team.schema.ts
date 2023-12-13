import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Team } from '../../team/schema/team.schema';
import { Group } from './group.schema';

export type GroupTeamDocument = HydratedDocument<GroupTeam>;

@Schema({
  collection: 'group_teams',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class GroupTeam {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Team.name,
  })
  team: Team;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Group.name,
  })
  group: Group;

  @Prop({
    required: false,
    default: 0,
  })
  points: number;

  @Prop({
    required: false,
    default: 0,
  })
  win_match_count: number;

  @Prop({
    required: false,
    default: 0,
  })
  lose_match_count: number;
}

export const GroupTeamSchema = SchemaFactory.createForClass(GroupTeam);

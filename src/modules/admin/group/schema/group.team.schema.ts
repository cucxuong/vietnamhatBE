import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Team } from '../../team/schema/team.schema';

export type GroupDocument = HydratedDocument<Group>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Group {
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

export const GroupSchema = SchemaFactory.createForClass(Group);

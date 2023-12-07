import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TournamentStage } from '../../tournaments/schema/tournament.stage.schema';

export type GroupDocument = HydratedDocument<Group>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Group {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: TournamentStage.name,
  })
  tournament_stage: TournamentStage;

  @Prop({
    required: true,
  })
  name: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

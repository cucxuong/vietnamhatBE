import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamSchema } from '../team/schema/team.schema';
import {
    TournamentStage,
    TournamentStageSchema,
} from '../tournaments/schema/tournament.stage.schema';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group, GroupSchema } from './schema/group.schema';
import { GroupTeam, GroupTeamSchema } from './schema/group.team.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: GroupTeam.name, schema: GroupTeamSchema },
      { name: Team.name, schema: TeamSchema },
      { name: TournamentStage.name, schema: TournamentStageSchema },
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}

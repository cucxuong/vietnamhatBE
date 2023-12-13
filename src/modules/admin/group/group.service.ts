import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from '../team/schema/team.schema';
import { TournamentStage } from '../tournaments/schema/tournament.stage.schema';
import { CreateGroupDto } from './dto/group.dto';
import { Group } from './schema/group.schema';
import { GroupTeam } from './schema/group.team.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)
    private readonly groupModel: Model<Group>,
    @InjectModel(GroupTeam.name)
    private readonly groupTeamModel: Model<GroupTeam>,
    @InjectModel(TournamentStage.name)
    private readonly tournamentStageModel: Model<TournamentStage>,
    @InjectModel(Team.name)
    private readonly teamModel: Model<Team>,
  ) {}

  async getList() {
    return await this.groupModel.find({});
  }

  async store(body: CreateGroupDto) {
    const stage = await this.tournamentStageModel.findById(body.stage);

    if (!stage) {
      throw new BadRequestException('Stage is invalid');
    }

    let teams: TeamDocument[] = [];
    if (body.teams?.length) {
      teams = await this.teamModel.find({
        _id: { $in: body.teams },
      });

      if (teams.length !== body.teams.length) {
        throw new BadRequestException('Teams is invalid');
      }
    }

    let group = await this.groupModel.create({
      ...body,
      tournament_stage: stage,
    });

    group = await group.save();
    if (teams.length) {
      for (const team of teams) {
        const groupTeam = await this.groupTeamModel.create({
          team,
          group,
        });

        await groupTeam.save();
      }
    }

    return group;
  }

  async update(id: string, body: CreateGroupDto) {
    const group = await this.groupModel.findById(id);

    if (!group) {
      throw new BadRequestException('Group Not Found');
    }

    const stage = await this.tournamentStageModel.findById(body.stage);

    if (!stage) {
      throw new BadRequestException('Stage is invalid');
    }

    await this.groupModel.findByIdAndUpdate(id, {
      stage,
    });

    let teams: TeamDocument[] = [];
    if (body.teams?.length) {
      teams = await this.teamModel.find({
        _id: { $in: body.teams },
      });

      if (teams.length !== body.teams.length) {
        throw new BadRequestException('Teams is invalid');
      }

      for (const teamId of body.teams) {
        let dbGroupTeam = await this.groupTeamModel.findOne({
          team: teamId,
          group: id,
        });

        if (!dbGroupTeam) {
          const team = teams.find((team: TeamDocument) => team.id === teamId);
          dbGroupTeam = await this.groupTeamModel.create({
            team,
            group,
          });

          dbGroupTeam.save();
        }
      }
    }

    await this.groupTeamModel.deleteMany({
      team: { $nin: teams.length ? body.teams : [] },
      group,
    });

    return group;
  }

  async findById(id: string) {
    return await this.groupModel.findById(id);
  }

  async delete(id: string) {
    await this.groupTeamModel.deleteMany({ group: id });

    return await this.groupModel.findByIdAndRemove(id);
  }
}

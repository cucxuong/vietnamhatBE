import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTeamDto, UpdateTeamDto } from './dto/team.dto';
import { Team, TeamDocument } from './schema/team.schema';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<TeamDocument>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<TeamDocument> {
    const player = new this.teamModel(createTeamDto);

    return player.save();
  }

  async findAll(): Promise<TeamDocument[]> {
    return this.teamModel.find();
  }

  findOne(id: string) {
    return this.teamModel.findById(id);
  }

  async update(
    id: string,
    updateTeamDto: UpdateTeamDto,
  ): Promise<TeamDocument | null> {
    try {
      await this.teamModel.findByIdAndUpdate(id, updateTeamDto);

      return await this.teamModel.findById(id);
    } catch (e) {
      throw e;
    }
  }

  async remove(id: string) {
    return this.teamModel.findByIdAndRemove(id);
  }
}

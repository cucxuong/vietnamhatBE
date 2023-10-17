import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team, TeamDocument } from './schemas/team.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TeamsService {
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
    return this.teamModel.findByIdAndUpdate(id, updateTeamDto);
  }

  async remove(id: string) {
    return this.teamModel.findByIdAndRemove(id);
  }
}

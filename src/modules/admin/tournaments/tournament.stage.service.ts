import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from 'src/modules/common/config/config.service';
import { CreateTournamentStageDto } from './dto/tournament.stage.dto';
import { Tournament } from './schema/tournament.schema';
import {
    TournamentStage,
    TournamentStageDocument,
} from './schema/tournament.stage.schema';

@Injectable()
export class TournamentStageService {
  constructor(
    @InjectModel(Tournament.name)
    private readonly tournamentModel: Model<Tournament>,
    @InjectModel(TournamentStage.name)
    private readonly tournamentStageModel: Model<TournamentStage>,

    private readonly configService: ConfigService,
  ) {}

  async create(
    body: CreateTournamentStageDto,
  ): Promise<TournamentStageDocument> {
    const tournament = await this.tournamentModel.findById(
      this.configService.get().vnhat2023.tournament_id,
    );
    const tournamentStage = new this.tournamentStageModel({
      ...body,
      tournament,
    });

    return await tournamentStage.save();
  }

  async findAll(): Promise<TournamentStageDocument[]> {
    return this.tournamentStageModel.find();
  }

  findOne(id: string) {
    return this.tournamentStageModel.findById(id);
  }

  async update(
    id: string,
    body: CreateTournamentStageDto,
  ): Promise<TournamentStageDocument | null> {
    await this.tournamentStageModel.findByIdAndUpdate(id, body);

    return this.tournamentStageModel.findById(id);
  }

  async remove(id: string) {
    return this.tournamentStageModel.findByIdAndRemove(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTournamentDto, UpdateTournamentDto } from './dto/tounament.dto';
import { Tournament, TournamentDocument } from './schema/tournament.schema';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectModel(Tournament.name)
    private readonly tournamentModel: Model<TournamentDocument>,
  ) {}

  async create(
    createTournamentDto: CreateTournamentDto,
  ): Promise<TournamentDocument> {
    const tournament = new this.tournamentModel(createTournamentDto);

    return tournament.save();
  }

  async findAll(): Promise<TournamentDocument[]> {
    return await this.tournamentModel.find();
  }

  async findOne(id: string): Promise<TournamentDocument | null> {
    return await this.tournamentModel.findById(id);
  }

  async update(
    id: string,
    updateTournamentDto: UpdateTournamentDto,
  ): Promise<TournamentDocument | null> {
    return this.tournamentModel.findByIdAndUpdate(id, updateTournamentDto);
  }

  async remove(id: string) {
    return this.tournamentModel.findByIdAndRemove(id);
  }
}

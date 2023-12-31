import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tournament, TournamentDocument } from 'src/schemas/tournament.schema';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';

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
    return this.tournamentModel.find();
  }

  findOne(id: string) {
    return this.tournamentModel.findById(id);
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

import { Controller, Get, Param } from '@nestjs/common';
import { TournamentService } from './tournaments.service';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get(':id')
  async find(@Param('id') id: string) {
    return this.tournamentService.getDetailInfo(id);
  }
}

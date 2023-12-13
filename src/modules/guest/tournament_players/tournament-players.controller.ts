import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateTournamentPlayerDto } from './dto/create-tournament-player.dto';
import { TournamentPlayerService } from './tournament-players.service';

@Controller('tournament-players')
export class TournamentPlayerController {
  constructor(
    private readonly tournamentPlayerService: TournamentPlayerService,
  ) {}

  @Post()
  async create(@Body() createTournamentPlayerDto: CreateTournamentPlayerDto) {
    return await this.tournamentPlayerService.create(createTournamentPlayerDto);
  }

  @Post(':code')
  async send(@Param('code') code: string) {
    return await this.tournamentPlayerService.send(code);
  }
}

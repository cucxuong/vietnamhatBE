import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreateTournamentPlayerDto } from './dto/create-tournament-player.dto';
import { TournamentPlayerService } from './tournament-players.service';

@Controller('tournament-players')
@UseInterceptors(ResponseInterceptor)
export class TournamentPlayerController {
  constructor(
    private readonly tournamentPlayerService: TournamentPlayerService,
  ) {}

  @Post()
  @ResponseMessage('Register Tournament Successfully')
  async create(@Body() createTournamentPlayerDto: CreateTournamentPlayerDto) {
    return await this.tournamentPlayerService.create(createTournamentPlayerDto);
  }

  @Post(':code')
  async send(@Param('code') code: string) {
    return await  this.tournamentPlayerService.send(code);
  }
}

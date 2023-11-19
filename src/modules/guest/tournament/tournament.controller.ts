import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { TournamentService } from './tournament.service';

@ApiTags('Tournaments')
@Controller('tournaments')
@UseInterceptors(ResponseInterceptor)
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get('remain-discs')
  async find(): Promise<number> {
    return this.tournamentService.getRemainDiscs();
  }
}

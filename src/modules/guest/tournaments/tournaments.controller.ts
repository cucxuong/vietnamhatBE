import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { TournamentService } from './tournaments.service';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';

@Controller('tournaments')
@UseInterceptors(ResponseInterceptor)
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get(':id')
  @ResponseMessage('Get Tounament Info Successfully')
  async find(@Param('id') id: string) {
    return this.tournamentService.getDetailInfo(id);
  }
}

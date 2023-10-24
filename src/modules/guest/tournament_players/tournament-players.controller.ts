import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
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
  @ResponseMessage('Register Tounament Successfully')
  async find(@Body() createTournamentPlayerDto: CreateTournamentPlayerDto) {
    return await this.tournamentPlayerService.create(createTournamentPlayerDto);
  }
}

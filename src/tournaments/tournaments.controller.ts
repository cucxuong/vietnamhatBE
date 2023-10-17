import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';

@Controller('tournaments')
@UseInterceptors(ResponseInterceptor)
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  @ResponseMessage('Create Tournament Successfully!')
  create(@Body() createTournamentDto: CreateTournamentDto) {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Get()
  @ResponseMessage('Get Tournaments Successfully!')
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Find Tournament Successfully!')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update Tournament Successfully!')
  update(
    @Param('id') id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  @ResponseMessage('Delete Tournament Successfully!')
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(id);
  }
}

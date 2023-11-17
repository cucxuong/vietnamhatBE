import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { JwtGuard } from 'src/modules/guest/auth/guard/jwt.guard';
import { CreateTournamentDto, UpdateTournamentDto } from './dto/tounament.dto';
import { TournamentDocument } from './schema/tournament.schema';
import { TournamentsService } from './tournament.service';

@ApiTags('Admin Tournaments')
@Controller('tournaments')
@UseInterceptors(ResponseInterceptor)
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Post()
  async create(
    @Body() createTournamentDto: CreateTournamentDto,
  ): Promise<TournamentDocument> {
    return this.tournamentsService.create(createTournamentDto);
  }

  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTournamentDto: UpdateTournamentDto,
  ) {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(id);
  }
}

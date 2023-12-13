import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/modules/common/auth/guard/jwt.guard';
import { CreateTournamentStageDto } from './dto/tournament.stage.dto';
import { TournamentStageService } from './tournament.stage.service';

@Controller('tournament-stages')
@ApiTags('[Admin] Tournament Stage')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class TournamentStageController {
  constructor(
    private readonly tournamentStageService: TournamentStageService,
  ) {}

  @Post()
  create(@Body() body: CreateTournamentStageDto) {
    return this.tournamentStageService.create(body);
  }

  @Get()
  findAll() {
    return this.tournamentStageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tournamentStageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: CreateTournamentStageDto) {
    return this.tournamentStageService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tournamentStageService.remove(id);
  }
}

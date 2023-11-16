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
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';

@Controller('teams')
@UseInterceptors(ResponseInterceptor)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ResponseMessage('Create Team Successfully!')
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @ResponseMessage('Get Teams Successfully!')
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Find Team Successfully!')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update Team Successfully!')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @ResponseMessage('Delete Team Successfully!')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}

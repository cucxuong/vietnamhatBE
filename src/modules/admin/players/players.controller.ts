import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';

@Controller('players')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AccessTokenGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @ResponseMessage('Create Player Successfully')
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  @ResponseMessage('Get Players Successfully')
  findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Find Player Successfully')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update Player Successfully')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  @ResponseMessage('Delete Player Successfully')
  remove(@Param('id') id: string) {
    return this.playersService.remove(id);
  }
}

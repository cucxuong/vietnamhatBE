import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlayerDocument } from 'src/modules/admin/player/schema/player.schema';
import { CreatePlayerDto } from './dto/player.dto';
import { PlayerService } from './player.service';

@ApiTags('Player')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('register')
  async register(@Body() body: CreatePlayerDto): Promise<PlayerDocument> {
    console.log(body);
    return this.playerService.store(body);
  }
}

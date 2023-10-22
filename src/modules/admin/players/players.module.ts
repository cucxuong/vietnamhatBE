import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schemas/player.schema';
import { PlayerEmailNotExistsValidator } from './validation-rules/unique-email.rule';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Player.name,
        schema: PlayerSchema,
      },
    ]),
  ],
  controllers: [PlayersController],
  providers: [PlayersService, PlayerEmailNotExistsValidator],
})
export class PlayersModule {}

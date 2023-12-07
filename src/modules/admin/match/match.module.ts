import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { MatchDetail, MatchDetailSchema } from './schema/match.detail.schema';
import { Match, MatchSchema } from './schema/match.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Match.name,
        schema: MatchSchema,
      },
      {
        name: MatchDetail.name,
        schema: MatchDetailSchema,
      },
    ]),
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}

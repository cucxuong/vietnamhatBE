// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigModule } from 'src/modules/common/config/config.module';
// import {
//   TournamentPlayer,
//   TournamentPlayerSchema,
// } from 'src/schemas/tournament-player.schema';
// import { TournamentsModule } from '../tournaments/tournaments.module';
// import { TournamentPlayerController } from './tournament-players.controller';
// import { TournamentPlayerService } from './tournament-players.service';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       {
//         name: TournamentPlayer.name,
//         schema: TournamentPlayerSchema,
//       },
//     ]),
//     TournamentsModule,
//     ConfigModule,
//   ],
//   controllers: [TournamentPlayerController],
//   providers: [TournamentPlayerService],
//   exports: [TournamentPlayerService],
// })
// export class TournamentPlayersModule {}

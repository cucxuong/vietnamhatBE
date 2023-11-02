import {Module, OnModuleDestroy, OnModuleInit} from "@nestjs/common";
import {ScheduleModule} from "@nestjs/schedule";
import {TournamentPlayerTask} from "./tournament-player.task";
import {MongooseModule} from "@nestjs/mongoose";
import {TournamentPlayer, TournamentPlayerSchema} from "../../schemas/tournament-player.schema";
import mongoose from "mongoose";
import {TournamentsModule} from "../guest/tournaments/tournaments.module";
import {TournamentPlayersModule} from "../guest/tournament_players/tournament-players.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TournamentsModule,
    TournamentPlayersModule,
    MongooseModule.forFeature([
        {
          name: TournamentPlayer.name,
          schema: TournamentPlayerSchema,
        }
      ],
    ),
  ],
  providers: [TournamentPlayerTask]
})

export class SchedulerModule implements OnModuleInit {
  async onModuleInit() {
    mongoose.set('debug', true);
  }
}

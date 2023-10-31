import {Module} from '@nestjs/common';
import {VietnamHat2023Controller} from './vietnam-hat-2023.controller';
import {VietnamHat2023Service} from './vietnam-hat-2023.service';
import {MongooseModule} from '@nestjs/mongoose';
import {
    TournamentPlayer,
    TournamentPlayerSchema,
} from '../../../schemas/tournament-player.schema';
import {TournamentsModule} from "../../guest/tournaments/tournaments.module";
import {TournamentPlayersModule} from "../../guest/tournament_players/tournament-players.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: TournamentPlayer.name,
                schema: TournamentPlayerSchema,
            },
        ]),
        TournamentsModule, TournamentPlayersModule,
    ],
    controllers: [VietnamHat2023Controller],
    providers: [VietnamHat2023Service],
})
export class VietnamHat2023Module {
}

import {ConfigService} from '@nestjs/config';
import {InjectModel} from '@nestjs/mongoose';
import {
    TournamentPlayer,
    TournamentPlayerDocument,
} from '../../../schemas/tournament-player.schema';
import {Model} from 'mongoose';
import {TournamentService} from "../../guest/tournaments/tournaments.service";
import {PlayerDocument} from "../players/schemas/player.schema";
import {MailService} from "../../../common/modules/mail/mail.service";
import {TournamentPlayerService} from "../../guest/tournament_players/tournament-players.service";

export class VietnamHat2023Service {
    constructor(
        private readonly config: ConfigService,
        @InjectModel(TournamentPlayer.name)
        private readonly tournamentPlayerModel: Model<TournamentPlayerDocument>,
        private readonly tournamentService: TournamentService,
        private readonly tournamentPlayerService: TournamentPlayerService,
        private mailService: MailService,
    ) {
    }

    async getPlayerList({country}: { country: string | null }) {
        const tournamentId = this.config.get<string>('VIETNAM_HAT_2023_TOURNAMENT_ID');

        let condition: any = {tournament: tournamentId};
        if (country) {
            condition = {...condition, current_country: country,};
        }

        const players = await this.tournamentPlayerModel.find(condition).sort({status: -1}).exec();

        const tournament = await this.tournamentService.getDetailInfo(tournamentId!);

        return players.map((player: any) => {
            const {totalFee} = this.tournamentPlayerService.calculateDetailFee(player, tournament);

            return {
                ...player.toJSON(),
                total_fee: totalFee,
            };
        });
    }

    async updatePaymentStatus({player_code}: { player_code: string }) {
        const player: any = await this.tournamentPlayerModel.findOne({player_code});

        if (player && player.status !== 'paid') {
            await this.tournamentPlayerModel.findByIdAndUpdate(player.id, {status: 'paid'});

            const tournament = await this.tournamentService.getDetailInfo(player.tournament);

            const {
                totalFee,
                totalForeign,
                detailFee,
                currency,
                isVietnam
            } = this.tournamentPlayerService.calculateDetailFee(player, tournament);

            let subject = '';
            if (this.config.get<string>('APP_ENV') !== 'production') {
                subject += `[${this.config.get<string>("APP_ENV")}] `;
            }
            subject += '[VNHat 2023] Payment Received Confirmation'

            this.mailService.sendMail({
                to: player.email,
                subject: subject,
                template: './tournament-players/payment_received',
                context: {
                    is_vietnam: isVietnam,
                    player_name: player.full_name,
                    player_code: player.player_code,
                    total_fee: Intl.NumberFormat().format(totalFee).replaceAll(',', "'"),
                    total_foreign: Intl.NumberFormat().format(totalForeign).replaceAll(',', "'"),
                    detail_fee: detailFee,
                    currency: currency

                }
            });
        }
    }
}

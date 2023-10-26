import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TournamentPlayer,
  TournamentPlayerDocument,
} from 'src/schemas/tournament-player.schema';
import { CreateTournamentPlayerDto } from './dto/create-tournament-player.dto';
import { MailService } from 'src/common/modules/mail/mail.service';
import { TournamentService } from '../tournaments/tournaments.service';

export class TournamentPlayerService {
  constructor(
    @InjectModel(TournamentPlayer.name)
    private readonly tournamentPlayerModel: Model<TournamentPlayerDocument>,
    private readonly tournamentService: TournamentService,
    private mailService: MailService,
  ) {}

  async create(
    createDto: CreateTournamentPlayerDto,
  ): Promise<TournamentPlayerDocument> {
    let playerCode = 0;
    let checkPlayerCode = null;

    do {
      playerCode = Math.floor(1000 + Math.random() * 9000);

      checkPlayerCode = await this.tournamentPlayerModel
        .findOne({
          player_code: playerCode,
        })
        .exec();
    } while (checkPlayerCode);

    const tournamentPlayer = new this.tournamentPlayerModel({
      ...createDto,
      status: 'pending',
      player_code: playerCode,
    });

    const player = await tournamentPlayer.save();

    const tournament = await this.tournamentService.getDetailInfo(
      createDto.tournament,
    );

    const { addition, info } = JSON.parse(player.selected_options);


    const tournamentOptions = JSON.parse(tournament.options!);
    const tournamentAdditions = tournamentOptions.additions;

    let totalFee: number = 700000;

    Object.keys(addition).forEach((key: any) => {
      const tournamentAddition = tournamentAdditions.find(
        (tourAdd: any) => tourAdd.value === key,
        null,
      );

      const tourFee = tournamentAddition
        ? tournamentAddition?.unit_fee ?? tournamentAddition?.fee ?? 0
        : 0;
      const userNum =
        addition[key] === true
          ? 1
          : Array.isArray(addition[key])
          ? addition[key].length
          : addition[key];

      totalFee += tourFee * userNum;
    });

    let currency: string = 'VND';
    let exchangeRate = 1;
    let totalForeign = totalFee;
    let isOtherCountry = false;
    let isVietnam = false;
    let isPhilippines = false;
    let isMalaysia = false;
    let isSingapore = false;
    let isCambodia = false;
    let isStudent = false;
    switch (player.current_country) {
      case 'Vietnam': {
        currency = 'VND';
        exchangeRate = 1;
        isVietnam = true;
        isStudent = info?.is_student ?? false;
        break;
      }
      case 'Philippines': {
        currency = 'PHP';
        exchangeRate = 425;
        isPhilippines = true;
        totalForeign = Math.ceil(totalFee / exchangeRate);
        break;
      }
      case 'Malaysia': {
        currency = 'MYR';
        exchangeRate = 5000;
        isMalaysia = true;
        totalForeign = Math.ceil(totalFee / exchangeRate);
        break;
      }
      case 'Singapore': {
        currency = 'SGD';
        exchangeRate = 17500;
        isSingapore = true;
        totalForeign = Math.ceil(totalFee / exchangeRate);
        break;
      }
      case 'Cambodia': {
        currency = 'USD';
        exchangeRate = 24500;
        isCambodia = true;
        totalForeign = Math.ceil(totalFee / exchangeRate);
        break;
      }
      default: {
        currency = 'USD';
        exchangeRate = 24500;
        isOtherCountry = true;
        break;
      }
    }

    this.mailService.sendMail({
      to: player.email,
      subject: `[Vietnam HAT 2023] Register Info`,
      template: './tournament-players/register',
      context: {
        full_name: player.full_name,
        player_code: player.player_code,
        total_fee: Intl.NumberFormat().format(totalFee).replaceAll(',', "'"),
        currency: currency,
        exchange_rate: Intl.NumberFormat()
          .format(exchangeRate)
          .replaceAll(',', "'"),
        total_foreign: Intl.NumberFormat()
          .format(totalForeign)
          .replaceAll(',', "'"),
        staying_country: player.current_country,
        other_country: isOtherCountry,
        is_vietnam: isVietnam,
        is_philippines: isPhilippines,
        is_malaysia: isMalaysia,
        is_singapore: isSingapore,
        is_cambodia: isCambodia,
        is_student: isStudent,
      },
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/../../../common/modules/mail/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });

    return player;
  }
}

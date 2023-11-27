import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from 'src/modules/common/config/config.service';
import { MailService } from 'src/modules/common/mail/mail.service';
import {
  TournamentPlayer,
  TournamentPlayerDocument,
} from 'src/schemas/tournament-player.schema';
import { TournamentService } from '../tournaments/tournaments.service';
import { CreateTournamentPlayerDto } from './dto/create-tournament-player.dto';

export class TournamentPlayerService {
  constructor(
    @InjectModel(TournamentPlayer.name)
    private readonly tournamentPlayerModel: Model<TournamentPlayerDocument>,
    private readonly tournamentService: TournamentService,
    private mailService: MailService,
    private readonly configService: ConfigService,
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

    const {
      totalFee,
      currency,
      exchangeRate,
      totalForeign,
      isOtherCountry,
      isVietnam,
      isPhilippines,
      isMalaysia,
      isSingapore,
      isCambodia,
      isStudent,
      detailFee,
    } = this.calculateDetailFee(player, tournament);

    let subject = '';
    if (this.configService.get().app.env !== 'production') {
      subject += `[${this.configService.get().app.env}] `;
    }
    subject += '[Vietnam HAT 2023] Register Info';

    this.mailService.sendMail({
      to: player.email,
      subject,
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
        detail_fee: detailFee,
      },
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/../../common/mail/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });

    return player;
  }

  async send(code: string) {
    const player = await this.tournamentPlayerModel.findOne({
      player_code: code,
    });

    if (player === null || player === undefined) {
      return;
    }
    const tournamentId = this.configService.get().vnhat2023.tournament_id;
    const tournament = await this.tournamentService.getDetailInfo(
      tournamentId!,
    );

    const {
      totalFee,
      currency,
      exchangeRate,
      totalForeign,
      isOtherCountry,
      isVietnam,
      isPhilippines,
      isMalaysia,
      isSingapore,
      isCambodia,
      isStudent,
      detailFee,
    } = this.calculateDetailFee(player, tournament);

    let subject = '';
    if (this.configService.get().app.env !== 'production') {
      subject += `[${this.configService.get().app.env}] `;
    }
    subject += '[Vietnam HAT 2023] Register Info';

    this.mailService.sendMail({
      to: player.email,
      subject,
      template: './tournament-players/register_send',
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
        detail_fee: detailFee,
      },
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/../../common/mail/templates/images/logo.png`,
          cid: 'logo',
        },
      ],
    });
  }

  calculateDetailFee(player: any, tournament: any) {
    const { addition, info } = JSON.parse(player.selected_options);

    const tournamentOptions = JSON.parse(tournament.options!);
    const tournamentAdditions = tournamentOptions.additions;

    let totalFee: number = 700000;
    let detailFee = {
      fixed: { fee: 700000 },
    };

    Object.keys(addition).forEach((key: any) => {
      if (key === 'isVegan' || key === 'allergies') {
        return;
      }

      const tournamentAddition = tournamentAdditions.find(
        (tourAdd: any) => tourAdd.value === key,
        null,
      );

      let tourFee = tournamentAddition
        ? tournamentAddition?.unit_fee ?? tournamentAddition?.fee ?? 0
        : 0;
      const userNum =
        addition[key] === true
          ? 1
          : Array.isArray(addition[key])
          ? addition[key].length
          : addition[key];

      if (userNum > 0) {
        if (key === 'jerseys' || key === 'shorts' || key === 'new_jerseys') {
          let blackList = {};
          let blackCount = 0;
          let whiteList = {};
          let whiteCount = 0;

          // calculate for black
          addition[key]
            .filter((item: { color: string }) => item.color === 'black')
            .map((itemMap: { size: string }) => {
              blackCount += 1;
              blackList = {
                ...blackList,
                [itemMap.size]:
                  // @ts-ignore
                  itemMap.size in blackList ? blackList[itemMap.size] + 1 : 1,
              };
            });

          // calculate for white
          addition[key]
            .filter((item: { color: string }) => item.color === 'white')
            .map((itemMap: { size: string }) => {
              whiteCount += 1;
              whiteList = {
                ...whiteList,
                [itemMap.size]:
                  // @ts-ignore
                  itemMap.size in whiteList ? whiteList[itemMap.size] + 1 : 1,
              };
            });

          // @ts-ignore
          const blackStr = Object.keys(blackList).reduce((result, item) => {
            if (result !== '') {
              result += ', ';
            }

            // @ts-ignore
            result += item.toUpperCase() + 'x' + blackList[item];

            return result;
          }, '');

          const whiteStr = Object.keys(whiteList).reduce((result, item) => {
            if (result !== '') {
              result += ', ';
            }

            // @ts-ignore
            result += item.toUpperCase() + 'x' + whiteList[item];

            return result;
          }, '');

          tourFee =
            player.current_country === 'Vietnam' &&
            info?.is_student &&
            key !== 'shorts'
              ? 170000
              : 200000;

          detailFee = {
            ...detailFee,
            [key]: {
              black_str: blackStr,
              black_count: blackCount,
              white_str: whiteStr,
              white_count: whiteCount,
              fee: tourFee * userNum,
            },
          };
        } else if (key === 'new_disc') {
          tourFee =
            player.current_country === 'Vietnam' && info?.is_student
              ? 200000
              : 250000;
          detailFee = {
            ...detailFee,
            [key]: {
              count: userNum,
              fee: tourFee * userNum,
            },
          };
        } else {
          detailFee = {
            ...detailFee,
            [key]: {
              count: userNum,
              fee: tourFee * userNum,
            },
          };
        }
      }

      totalFee += tourFee * userNum;
    });

    let currency: string = 'VND';
    let exchangeRate = 24500;
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
        totalForeign = Math.ceil(totalFee / exchangeRate);
        break;
      }
    }

    return {
      currency,
      exchangeRate,
      totalForeign,
      isOtherCountry,
      isVietnam,
      isPhilippines,
      isMalaysia,
      isSingapore,
      isStudent,
      detailFee,
      totalFee,
      isCambodia,
    };
  }
}

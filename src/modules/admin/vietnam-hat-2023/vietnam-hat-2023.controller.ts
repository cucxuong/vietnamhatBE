import {
  Controller,
  Get,
  Post,
  Req,
  UnprocessableEntityException
} from '@nestjs/common';
import { Request } from 'express';
import { TOURNAMENT_PLAYER_STATUS } from '../../../utils/tournament.player.const';
import { COUNTRY } from '../../../utils/vietnam.hat.2023.const';
import { VietnamHat2023Service } from './vietnam-hat-2023.service';

@Controller('vietnam-hat-2023')
export class VietnamHat2023Controller {
  constructor(private readonly service: VietnamHat2023Service) {}

  @Get('players')
  async getPlayers(@Req() request: Request) {
    const country = request.session?.country_code ?? null;

    if (!country) {
      throw new UnprocessableEntityException('Invalid Request');
    }

    return await this.service.getPlayerList({
      country: country === 'All' || country === 'Admin' ? null : country,
    });
  }

  @Post('authorize')
  async authorizeCountry(@Req() request: Request) {
    const { code } = request.body;

    let country = '';

    switch (code) {
      case 'vnVN8484': {
        country = 'Vietnam';
        break;
      }
      case 'khKH5656': {
        country = 'Cambodia';
        break;
      }
      case 'msMS2323': {
        country = 'Malaysia';
        break;
      }
      case 'phPH1212': {
        country = 'Philippines';
        break;
      }
      case 'sgSG9090': {
        country = 'Singapore';
        break;
      }
      case 'VietNamHat2023': {
        country = 'All';
        break;
      }
      case 'CucXuong': {
        country = 'Admin';
        break;
      }
      default: {
        break;
      }
    }

    if (country === '') {
      throw new UnprocessableEntityException('Invalid code');
    }

    request.session.country_code = country;

    return { country };
  }

  @Post('update-payment')
  async updatePayment(@Req() request: Request) {
    const country = request.session?.country_code ?? null;

    if (!country) {
      throw new UnprocessableEntityException('Invalid Request');
    }

    const body = request.body;
    if (!body.player_code) {
      throw new UnprocessableEntityException('Missing param');
    }

    if (
      body.status === TOURNAMENT_PLAYER_STATUS.HALF_PAID &&
      country !== COUNTRY.VIETNAM
    ) {
      throw new UnprocessableEntityException('Invalid Param');
    }

    await this.service.updatePaymentStatus({
      player_code: body.player_code,
      status: body.status ?? TOURNAMENT_PLAYER_STATUS.PAID,
    });

    return {};
  }

  @Post('update-status')
  async updateStatus(@Req() request: Request) {
    const country = request.session?.country_code ?? null;

    if (country !== 'Admin') {
      throw new UnprocessableEntityException('Invalid Request');
    }

    const body = request.body;
    if (!body.player_code) {
      throw new UnprocessableEntityException('Missing param');
    }

    await this.service.updatePlayerStatus({
      player_code: body.player_code,
      status: body.status,
    });

    return {};
  }

  @Post('update-note')
  async updateNote(@Req() request: Request) {
    const country = request.session?.country_code ?? null;

    if (!country) {
      throw new UnprocessableEntityException('Invalid Request');
    }

    const body = request.body;
    if (!body.player_code) {
      throw new UnprocessableEntityException('Missing param');
    }

    await this.service.updateNote({
      player_code: body.player_code,
      note: body.note,
    });

    return {};
  }

  @Post('send-guide')
  async sendGuide() {
    this.service.run();
  }
}

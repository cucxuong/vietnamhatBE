import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UnprocessableEntityException,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { Country } from '../country/utils/type';
import { UpdatePaymentDto, UpdateStatusDto } from './dto/player.dto';
import { PlayerService } from './player.service';

@Controller('players')
@ApiTags('Admin Player')
@UseInterceptors(ResponseInterceptor)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  async getPlayers(@Req() request: Request) {
    const country: Country | null =
      (request.session?.country_code as Country) ?? null;

    if (!country) {
      throw new UnprocessableEntityException('Invalid Request');
    }

    return await this.playerService.getPlayerList({
      country:
        country === Country.All || country === Country.Admin ? null : country,
    });
  }

  @Post('update-status')
  async updateStatus(
    @Body() body: UpdateStatusDto,
    @Req() request: Request,
  ): Promise<void> {
    const country: Country | null =
      (request.session?.country_code as Country) ?? null;

    if (country !== Country.Admin) {
      throw new UnprocessableEntityException('Invalid Request');
    }

    if (!body.code) {
      throw new UnprocessableEntityException('Missing param');
    }

    await this.playerService.updatePlayerStatus({
      code: body.code,
      status: body.status,
    });
  }

  @Post('update-payment')
  async updatePayment(@Body() body: UpdatePaymentDto, @Req() request: Request) {
    const country = request.session?.country_code ?? null;

    if (!country || country === Country.Admin || country === Country.All) {
      throw new UnprocessableEntityException('Invalid Request');
    }

    await this.playerService.updatePaymentStatus({
      code: body.code,
      status: body.status,
      country: country as Country,
    });

    return {};
  }
}

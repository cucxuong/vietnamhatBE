import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { VietnamHat2023Service } from './vietnam-hat-2023.service';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor';

@Controller('vietnam-hat-2023')
@UseInterceptors(ResponseInterceptor)
export class VietnamHat2023Controller {
  constructor(private readonly service: VietnamHat2023Service) {}

  @Get('players')
  async getPlayers() {
    return await this.service.getPlayerList();
  }
}

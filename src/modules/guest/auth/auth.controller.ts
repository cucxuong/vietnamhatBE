import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CurrentUser } from 'src/modules/guest/auth/decorator/current.user.decorator';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { JwtGuard } from './guard/jwt.guard';
import { LoginData } from './res/login.res';
import { getTokenFromaReqHeaders } from './utils/helpers';
import { AuthedUser } from './utils/type';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<LoginData> {
    return this.authService.login(body);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: AuthedUser,
    @Req() req: Request,
  ): Promise<void> {
    const accessToken = getTokenFromaReqHeaders(req);

    return this.authService.logout(user, accessToken);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenDto): Promise<LoginData> {
    const { refresh_token } = body;

    return this.authService.refreshToken({ token: refresh_token });
  }
}

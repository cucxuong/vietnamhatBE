import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { LoginData } from './res/login.res';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginData> {
    return this.authService.login(body);
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto): Promise<LoginData> {
    const { refresh_token } = body;

    return this.authService.refreshToken({ token: refresh_token });
  }
}

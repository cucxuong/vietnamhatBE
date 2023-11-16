import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { LoginData } from './res/login.res';

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginData> {
    return this.authService.login(body);
  }
}

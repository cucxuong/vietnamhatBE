import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/logged.user.decorator';
import { LoginDto } from './dto/auth.dto';
import { JwtGuard } from './guard/jwt.guard';
import { LoggedUser } from './utils/type';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: LoggedUser) {
    try {
      await this.authService.logout({ user });

      return { message: 'Logout successfully!', data: {} };
    } catch (e) {
      throw e;
    }
  }
}

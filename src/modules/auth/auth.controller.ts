import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreateUserDto } from '../admin/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ResponseMessage('Register account success')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  signin(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  // @Get('logout')
  // logout(@Req() req: Request) {
  //   return this.authService.logout(req.user['sub']);
  // }
}
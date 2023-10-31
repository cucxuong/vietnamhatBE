import { Body, Controller, Post, Res, UseInterceptors } from "@nestjs/common";
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreateUserDto } from '../admin/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from "express";

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
  @ResponseMessage('Login Successfully')
  async signin(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.signIn(authDto);

    response.cookie('access_token', user.accessToken, {
      sameSite: "none",
      secure: true,
      domain: user.domain,
    });
    response.cookie('refresh_token', user.refreshToken, {
      sameSite: "none",
      secure: true,
      domain: user.domain,
    });

    return {};
  }

  // @Get('logout')
  // logout(@Req() req: Request) {
  //   return this.authService.logout(req.user['sub']);
  // }
}

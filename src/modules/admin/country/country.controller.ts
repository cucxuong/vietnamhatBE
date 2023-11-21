import {
    Body,
    Controller,
    Post,
    Req,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CountryService } from './country.service';
import { AuthorizeCountryDto } from './dto/country.dto';

@ApiTags('Admin Country')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post('authorize')
  authorizeCountry(@Body() body: AuthorizeCountryDto, @Req() request: Request) {
    const { code } = body;

    const country = this.countryService.authorizeCountry({ code });

    if (country === '') {
      throw new UnprocessableEntityException('Invalid code');
    }

    request.session.country_code = country;

    return { country };
  }
}

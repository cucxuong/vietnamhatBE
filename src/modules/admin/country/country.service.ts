import { Injectable } from '@nestjs/common';
import { Country, CountryCode } from './utils/type';

@Injectable()
export class CountryService {
  authorizeCountry({ code }: { code: string }): string {
    let country = '';

    switch (code) {
      case CountryCode.Vietnam: {
        country = Country.Vietnam;
        break;
      }
      case CountryCode.Cambodia: {
        country = Country.Cambodia;
        break;
      }
      case CountryCode.Malaysia: {
        country = Country.Malaysia;
        break;
      }
      case CountryCode.Philippines: {
        country = Country.Philippines;
        break;
      }
      case CountryCode.Singapore: {
        country = Country.Singapore;
        break;
      }
      case CountryCode.All: {
        country = Country.All;
        break;
      }
      case CountryCode.Admin: {
        country = Country.Admin;
        break;
      }
      default: {
        break;
      }
    }

    return country;
  }
}

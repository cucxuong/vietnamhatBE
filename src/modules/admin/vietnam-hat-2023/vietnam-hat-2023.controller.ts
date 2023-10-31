import {Body, Controller, Get, Post, Req, UnprocessableEntityException, UseInterceptors} from '@nestjs/common';
import {VietnamHat2023Service} from './vietnam-hat-2023.service';
import {ResponseInterceptor} from '../../../common/interceptors/response.interceptor';
import {Request} from "express";
import {ResponseMessage} from "../../../common/decorators/response_message.decorator";

@Controller('vietnam-hat-2023')
@UseInterceptors(ResponseInterceptor)
export class VietnamHat2023Controller {
    constructor(private readonly service: VietnamHat2023Service) {
    }

    @Get('players')
    async getPlayers(@Req() request: Request) {

        let country = request.session?.country_code ?? null;

        if (!country) {
            throw new UnprocessableEntityException('Invalid Request');
        }

        return await this.service.getPlayerList({country: country === 'all' ? null : country});
    }

    @Post('authorize')
    @ResponseMessage('Authorize Successfully!')
    async authorizeCountry(@Req() request: Request) {
        const {code} = request.body;

        let country = '';

        switch (code) {
            case 'iGn4vlQuwW': {
                country = 'Vietnam';
                break;
            }
            case 'pGsiFKUrVA': {
                country = 'Cambodia';
                break;
            }
            case 'S7yZrwmPd0': {
                country = 'Malaysia';
                break;
            }
            case 'ShQuijeWxG': {
                country = 'Philippines';
                break;
            }
            case 'MOgdbPGHtQ': {
                country = 'Singapore';
                break;
            }
            case 'goohtgPfzs': {
                country = 'All';
                break;
            }
            default: {
                break;
            }
        }

        if (country === '') {
            throw new UnprocessableEntityException('Invalid code');
        }

        request.session.country_code = country;

        return {country}
    }

    @Post('update-payment')
    async updatePayment(@Body() body: { player_code: string }) {
        if (!body.player_code) {
            throw new UnprocessableEntityException('Missing param');
        }

        await this.service.updatePaymentStatus({player_code: body.player_code});

        return {};
    }
}

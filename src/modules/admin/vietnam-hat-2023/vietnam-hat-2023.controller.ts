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

        return await this.service.getPlayerList({country: country === 'All' ? null : country});
    }

    @Post('authorize')
    @ResponseMessage('Authorize Successfully!')
    async authorizeCountry(@Req() request: Request) {
        const {code} = request.body;

        let country = '';

        switch (code) {
            case 'vnVN8484': {
                country = 'Vietnam';
                break;
            }
            case 'khKH5656': {
                country = 'Cambodia';
                break;
            }
            case 'msMS2323': {
                country = 'Malaysia';
                break;
            }
            case 'phPH1212': {
                country = 'Philippines';
                break;
            }
            case 'sgSG9090': {
                country = 'Singapore';
                break;
            }
            case 'VietNamHat2023': {
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
    async updatePayment(@Req() request: Request) {
        let country = request.session?.country_code ?? null;

        if (!country) {
            throw new UnprocessableEntityException('Invalid Request');
        }

        const body = request.body;
        if (!body.player_code) {
            throw new UnprocessableEntityException('Missing param');
        }

        await this.service.updatePaymentStatus({player_code: body.player_code});

        return {};
    }
}

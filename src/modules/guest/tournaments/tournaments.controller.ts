// import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
// import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
// import { TournamentService } from './tournaments.service';

// @Controller('tournaments')
// @UseInterceptors(ResponseInterceptor)
// export class TournamentController {
//   constructor(private readonly tournamentService: TournamentService) {}

//   @Get(':id')
//   async find(@Param('id') id: string) {
//     return this.tournamentService.getDetailInfo(id);
//   }
// }

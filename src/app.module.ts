import { Module, OnModuleInit } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { TournamentsModule } from './modules/admin/tournaments/tournaments.module';
import { VietnamHat2023Module } from './modules/admin/vietnam-hat-2023/vietnam-hat-2023.module';
import { CommonModule } from './modules/common/common.module';
import { ConfigModule } from './modules/common/config/config.module';
import { ConfigService } from './modules/common/config/config.service';
import { GuestModule } from './modules/guest/guest.module';
import { SchedulerModule } from './modules/task-schedule/sheduler.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get().database.uri,
      }),
      inject: [ConfigService],
    }),

    // User Global Define
    SchedulerModule,

    // User define Modules
    CommonModule,
    GuestModule,
    AdminModule,
    RouterModule.register([
      {
        path: '/admin',
        module: AdminModule,
        children: [TournamentsModule, VietnamHat2023Module],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit(): any {
    mongoose.set('debug', true);
  }
}

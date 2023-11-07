import { Module, OnModuleInit } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {RouterModule} from '@nestjs/core';
import {MongooseModule} from '@nestjs/mongoose';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AdminModule} from './modules/admin/admin.module';
import {AuthModule} from './modules/auth/auth.module';
import {GuestModule} from './modules/guest/guest.module';
import {TournamentsModule} from './modules/admin/tournaments/tournaments.module';
import {MailModule} from './common/modules/mail/mail.module';
import {VietnamHat2023Module} from './modules/admin/vietnam-hat-2023/vietnam-hat-2023.module';
import {SchedulerModule} from "./modules/task-schedule/sheduler.module";
import mongoose from "mongoose";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // User Global Define
    SchedulerModule,
    MailModule,

    // User define Modules
    GuestModule,
    AdminModule,
    AuthModule,
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
export class AppModule implements OnModuleInit{
  onModuleInit(): any {
    mongoose.set('debug', true);
  }

}

import { Module, OnModuleInit } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandModule } from './command/command.module';
import { ExceptionFilterHandler } from './common/filters/exception.filter';
import { AdminModule } from './modules/admin/admin.module';
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
    CommandModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilterHandler,
    },
  ],
})
export class AppModule implements OnModuleInit {
  onModuleInit(): any {
    mongoose.set('debug', true);
  }
}
